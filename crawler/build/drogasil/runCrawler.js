"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const storage_1 = require("rakoon/dist/storage");
const _1 = require(".");
// console.log("STORAGE_URL: ", STORAGE_URL)
const storage = new storage_1.CrawlerStorage(config_1.STORAGE_URL, config_1.STORAGE_DB);
storage.connectToDB().then(async () => {
    const crawler = new _1.DrogasilCrawler(storage); // Create the instance and pass the storage as parameter
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
    // const links = await crawler.runExtractLinks(runOptions.extractLinksOptions)
    // crawler.runExtractDetails(links, runOptions.extractDetailsOptions).then(() => console.log("Done!"))
    // Examples: https://www.drogasil.com.br/catalog/product/view/id/19162 | https://www.drogasil.com.br/oscal-d-400mg-com-60-compimidos.html
    await crawler.extractDetails("https://www.drogasil.com.br/catalog/product/view/id/19162");
    // crawler.run(runOptions)
    console.log("Done!");
    process.exit();
});
