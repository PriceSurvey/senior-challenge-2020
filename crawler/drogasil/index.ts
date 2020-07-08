import * as cheerio from 'cheerio'
import { BaseCrawler } from 'rakoon/dist/crawlers'
import { ExtractLinksOptions } from 'rakoon/dist/models'
import * as Helper from 'rakoon/dist/helpers'
import { CrawlerStorage } from 'rakoon/dist/storage'
import { Inspection } from 'bluebird'

import { WebProduct } from '../base';
import { IWebProduct } from '../models'

export class DrogasilCrawler extends BaseCrawler {
    public VERSION = 1.0
    private categories = [ // Uncomment if you need to fetch more categories from the website
        "medicamentos.html",
        // "saude.html",
        // "vitaminas-e-suplementos.html",
        // "beleza.html",
        // "luxo.html",
        // "cosmeticos.html",
        // "mamae-e-bebe.html",
        // "cuidados-diarios.html",
        // "ortopedia-e-acessorios.html",
        // "drogasil-marcas-exclusivas.html",
        // "promocoes-do-mes.html"
    ]

    private SELECTORS = {
        productNameFn: ($: CheerioStatic) => $(".product-name span").eq(0).text(),
        productBrandFn: ($: CheerioStatic) => $(".marca.hide-hover").eq(0).text()?.trim(),
        oldPriceFn: ($: CheerioStatic) => $(".product-shop .price-box .old-price .price").eq(0).text()?.trim(), // get the text
        currentPriceFn: ($: CheerioStatic) => $(".product-shop .special-price .price").length
            ? $(".product-shop .special-price .price").eq(0).text()?.trim()
            : $(".product-shop").attr("data-price"), //get the content attribute
        activePage: ".pages .current.inline",
        productLink: ".products-card-v2__item-card a.product-image",
        productInfoRow: "#product-attribute-specs-table tr",
        productInfoTitle: "th.label",
        productInfoData: "td.data",
        boxLabel: "h3",
        boxOfDetails: ".description_contents"
    }

    constructor(public storage: CrawlerStorage) {
        super(storage) // collection name defaults to products
        this.BASE_URL = "https://www.drogasil.com.br"
        this.SOURCE = { name: "Drogasil", url: this.BASE_URL }
    }

    private async extractLinksFromCategory(category: string, waitFor: number = 500): Promise<string[]> {
        let links = []
        let hasProducts = true
        let pageCounter = 1
        console.log("Starting url: ", category)
        let activePage: any = 1
        while (true) {
            let urlsCount = 0
            console.log("Going to page: ", pageCounter)
            const response = await this.makeRequest(`${this.BASE_URL}/${category}?limit=48&p=${pageCounter}`)
            let $ = cheerio.load(response)
            let prods = $(this.SELECTORS.productLink)
            activePage = Helper.extractNumberFromString($(this.SELECTORS.activePage).eq(0).text())
            // console.log("Active Page: ", activePage)
            // console.log("Page Counter: ", pageCounter)
            if (activePage != pageCounter) {
                console.log("Wow! We've reached the bottom of the ocean, let's go out!")
                break;
            }
            if (prods.length) {
                // Let's find those product links:
                prods.map((i, el) => {
                    const link = $(el).attr("href")
                    // console.log("Link: ", link)
                    if (!link.includes(this.BASE_URL)) {
                        links.push(`${this.BASE_URL}${link}`)
                    } else {
                        links.push(link)
                    }
                    urlsCount++
                })
                pageCounter++
                // lastPage = currentPage
            } else {
                console.log("Wow! We've reached the bottom of the ocean, let's go out!")
                break
            }
            await Helper.timeoutPromise(waitFor)
            console.log(`Total links found on page ${pageCounter - 1}: ${urlsCount}`)
        }
        console.log(`Total links found on this category: ${links.length}`)
        return links
    }

    async extractLinks(options: ExtractLinksOptions) {
        let links = []
        await Promise.map(this.categories, (category) => {
            const newURLs = this.extractLinksFromCategory(category)
            const rest = Helper.timeoutPromise(options.waitFor)
            return this.join(newURLs, rest, (newURLs, rest) => {
                return newURLs
            }).reflect()
        }, { concurrency: options.concurrency }).each((promise: Inspection<any>) => {
            if (promise.isFulfilled()) {
                links.push(...promise.value())
            } else {
                console.error("ExtractLinks didn't work: ", promise.reason())
            }
        })
        return links
    }

    async extractDetails(url: string) {
        const notNumber = new RegExp("[^0-9]", "gi")

        try {
            const response = await this.makeRequest(url)
            let $ = cheerio.load(response)

            const name = this.SELECTORS.productNameFn($)
            const oldPrice = Helper.extractPriceFromString(this.SELECTORS.oldPriceFn($) || "0")
            const currentPrice = Helper.extractPriceFromString(this.SELECTORS.currentPriceFn($) || "0")


            let prod: Partial<IWebProduct> = { name, oldPrice, currentPrice, url, source: this.SOURCE }
            $(this.SELECTORS.productInfoRow).each((index, element) => {
                const title = $(element).find(this.SELECTORS.productInfoTitle).text()?.trim()
                const data = $(element).find(this.SELECTORS.productInfoData).text()?.trim()
                switch (title) {
                    case "EAN":
                        prod.gtin = +data
                        break
                    case "Registro MS":
                        prod.msRecord = +data
                        break
                    case "Código do Produto":
                        prod.productId = +data
                        break
                    case "Marca":
                        prod.brand = data
                        break
                }
            })
            const detail = new WebProduct(<IWebProduct>prod)
            console.log("Detail: ", detail)
            return detail
        } catch (error) {
            console.log("Error on extractDetails in DrogasilCrawler: ", error)
            // return null
            throw error
        }
    }
}