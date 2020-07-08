import { STORAGE_DB, STORAGE_URL } from '../config'
import { CrawlerRunOptions } from 'rakoon/dist/models'
import { CrawlerStorage } from 'rakoon/dist/storage'
import { DrogasilCrawler } from '.'

// console.log("STORAGE_URL: ", STORAGE_URL)
const storage = new CrawlerStorage(STORAGE_URL, STORAGE_DB)
storage.connectToDB().then(async () => {
    const crawler = new DrogasilCrawler(storage) // Create the instance and pass the storage as parameter
    /* Ignore the understanding of this runOptions object for now, but assume it controls some variables 
    of the robot execution. 
    */
    const runOptions: CrawlerRunOptions = {
        extractDetailsOptions: { // config object for the extractDetails step.
            concurrency: 10, // how many requests are made in parallel
            waitFor: 1000 * 3 // how much time the robot has to wait until another cycle of requests is made
        },
        extractLinksOptions: { // config object for the extractLinks step
            linksFromDB: false,
            concurrency: 5, // how many requests are made in parallel
            waitFor: 1000 * 3, // how much time the robot has to wait until another cycle of requests is made
            dbLinksFilter: null
        }
    }
    // const links = await crawler.runExtractLinks(runOptions.extractLinksOptions)
    // crawler.runExtractDetails(links, runOptions.extractDetailsOptions).then(() => console.log("Done!"))

    // Examples: https://www.drogasil.com.br/catalog/product/view/id/19162 | https://www.drogasil.com.br/oscal-d-400mg-com-60-compimidos.html
    await crawler.extractDetails("https://www.drogasil.com.br/catalog/product/view/id/19162")

    // crawler.run(runOptions)
    console.log("Done!")
    process.exit()
})