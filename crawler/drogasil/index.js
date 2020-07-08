"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const cheerio = __importStar(require("cheerio"));
const crawlers_1 = require("rakoon/dist/crawlers");
const Helper = __importStar(require("rakoon/dist/helpers"));
const storage_1 = require("rakoon/dist/storage");
const base_1 = require("../base");
class DrogasilCrawler extends crawlers_1.BaseCrawler {
    constructor(storage) {
        super(storage); // collection name defaults to products
        this.storage = storage;
        this.VERSION = 1.0;
        this.PAGE_LIMIT = 60;
        this.categories = [
            "medicamentos.html",
            "saude.html",
            "vitaminas-e-suplementos.html",
            "beleza.html",
            "luxo.html",
            "cosmeticos.html",
            "mamae-e-bebe.html",
            "cuidados-diarios.html",
            "ortopedia-e-acessorios.html",
            "drogasil-marcas-exclusivas.html",
            "promocoes-do-mes.html"
        ];
        this.SELECTORS = {
            productNameFn: ($) => $(".product-name span[property='name']").eq(0).text(),
            productBrandFn: ($) => { var _a; return (_a = $(".marca.hide-hover").eq(0).text()) === null || _a === void 0 ? void 0 : _a.trim(); },
            oldPriceFn: ($) => { var _a; return (_a = $("div[typeof='Product'] .limit.columns .old-price .price").eq(0).text()) === null || _a === void 0 ? void 0 : _a.trim(); },
            currentPriceFn: ($) => $("div[typeof='Product'] .limit.columns meta[property='price']").attr("content"),
            activePage: ".pages .current.inline",
            productLink: ".products-card-v2__item-card a.product-image",
            productInfoRow: "#product-attribute-specs-table tr",
            productInfoTitle: "th.label",
            productInfoData: "td.data",
            boxLabel: "h3",
            boxOfDetails: ".description_contents"
        };
        this.BASE_URL = "https://www.drogasil.com.br";
        this.SOURCE = { name: "Drogasil", url: this.BASE_URL };
    }
    async extractLinksFromCategory(category, waitFor = 500) {
        let links = [];
        let hasProducts = true;
        let pageCounter = 1;
        console.log("Starting url: ", category);
        let activePage = 1;
        while (true) {
            let urlsCount = 0;
            console.log("Going to page: ", pageCounter);
            const response = await this.makeRequest(`${this.BASE_URL}/${category}?limit=48&p=${pageCounter}`);
            let $ = cheerio.load(response);
            let prods = $(this.SELECTORS.productLink);
            activePage = Helper.extractNumberFromString($(this.SELECTORS.activePage).eq(0).text());
            // console.log("Active Page: ", activePage)
            // console.log("Page Counter: ", pageCounter)
            if (activePage != pageCounter) {
                console.log("Wow! We've reached the bottom of the ocean, let's go out!");
                break;
            }
            if (prods.length) {
                // Let's find those product links:
                prods.map((i, el) => {
                    const link = $(el).attr("href");
                    // console.log("Link: ", link)
                    if (!link.includes(this.BASE_URL)) {
                        links.push(`${this.BASE_URL}${link}`);
                    }
                    else {
                        links.push(link);
                    }
                    urlsCount++;
                });
                pageCounter++;
                // lastPage = currentPage
            }
            else {
                console.log("Wow! We've reached the bottom of the ocean, let's go out!");
                break;
            }
            await Helper.timeoutPromise(waitFor);
            console.log(`Total links found on page ${pageCounter - 1}: ${urlsCount}`);
        }
        console.log(`Total links found on this category: ${links.length}`);
        return links;
    }
    async extractLinks(options) {
        let links = [];
        await Promise.map(this.categories, (category) => {
            const newURLs = this.extractLinksFromCategory(category);
            const rest = Helper.timeoutPromise(options.waitFor);
            return this.join(newURLs, rest, (newURLs, rest) => {
                return newURLs;
            }).reflect();
        }, { concurrency: options.concurrency }).each((promise) => {
            if (promise.isFulfilled()) {
                links.push(...promise.value());
            }
            else {
                console.error("ExtractLinks didn't work: ", promise.reason());
            }
        });
        return links;
    }
    async extractDetails(url) {
        const notNumber = new RegExp("[^0-9]", "gi");
        try {
            const response = await this.makeRequest(url);
            let $ = cheerio.load(response);
            const name = this.SELECTORS.productNameFn($);
            const oldPrice = Helper.extractPriceFromString(this.SELECTORS.oldPriceFn($) || "0");
            const currentPrice = Helper.extractPriceFromString(this.SELECTORS.currentPriceFn($) || "0");
            let prod = { name, oldPrice, currentPrice, url, source: this.SOURCE };
            $(this.SELECTORS.productInfoRow).each((index, element) => {
                var _a, _b;
                const title = (_a = $(element).find(this.SELECTORS.productInfoTitle).text()) === null || _a === void 0 ? void 0 : _a.trim();
                const data = (_b = $(element).find(this.SELECTORS.productInfoData).text()) === null || _b === void 0 ? void 0 : _b.trim();
                switch (title) {
                    case "EAN":
                        prod.gtin = +data;
                        break;
                    case "Registro MS":
                        prod.msRecord = +data;
                        break;
                    case "Código do Produto":
                        prod.productId = +data;
                        break;
                    case "Marca":
                        prod.brand = data;
                        break;
                }
            });
            const detail = new base_1.WebProduct(prod);
            console.log("Detail: ", detail);
            return detail;
        }
        catch (error) {
            console.log("Error on extractDetails in DrogasilCrawler: ", error);
            // return null
            throw error;
        }
    }
}
exports.DrogasilCrawler = DrogasilCrawler;
console.log("STORAGE_URL: ", config_1.STORAGE_URL);
const storage = new storage_1.CrawlerStorage(config_1.STORAGE_URL, config_1.STORAGE_DB);
storage.connectToDB().then(() => {
    const crawler = new DrogasilCrawler(storage); // Create the instance and pass the storage as parameter
    /* Ignore the understanding of this runOptions object for now, but assume it controls some variables
    of the robot execution.
    */
    const runOptions = {
        extractDetailsOptions: {
            concurrency: 10,
            waitFor: 1000 * 3 // how much time the robot has to wait until another cycle of requests is made
        },
        extractLinksOptions: {
            linksFromDB: false,
            concurrency: 5,
            waitFor: 1000 * 3,
            dbLinksFilter: null
        }
    };
    // crawler.extractLinks(runOptions.extractLinksOptions)
    // crawler.extractDetails("https://www.drogasil.com.br/catalog/product/view/id/19162").then(() => console.log("Done!"))
    crawler.run(runOptions).then(() => console.log("FINISHED!"));
});
