# What you need before running the Crawler:
- Install the dependencies listed in package.json
- Start mongodb server in your machine and change the data from the [.env](./.env) file with the corresponding information on your setup.

# How to run the Crawler:
This crawler uses a library that's being developed internally in Price Survey called [Rakoon](https://github.com/shaolinjr/rakoon), for this challenge the only prior knowledge you'll need is how to operate the robot.

In a high-level explanation you need to setup the storage(MongoDB), connect to the DB and create an instance of the crawler. On the piece of code below this can be seen:
```javascript
import { BaseCrawler } from 'rakoon/dist/crawlers'
import { CrawlerRunOptions } from 'rakoon/dist/models'
import { CrawlerStorage } from 'rakoon/dist/storage'
import { DrogasilCrawler } from 'some_path_where_the_index_is'

const storage = new CrawlerStorage("mongodb://<rest-of-the-url-here>", "<database-name-here>")
storage.connectToDB().then(() => {
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
    // ---- Execute the two steps separately ----
    // const links = await crawler.runExtractLinks(runOptions.extractLinksOptions)
    // const results = crawler.runExtractDetails(links, runOptions.extractDetailsOptions).then(() => console.log("Done!"))
    // -------------------------------------------
    
    // ---- Execute one detailExtraction (Generally used for testing) ----
    // crawler.extractDetails("https://www.drogasil.com.br/catalog/product/view/id/19162").then(() => console.log("Done!"))
    // -------------------------------------------------------------------

    // ---- Execute all the steps in one call ----
    // crawler.run(runOptions).then(() => console.log("FINISHED!"))
    // -------------------------------------------
})
```
As seen above on the last lines of the sample code, there are 4 commented calls on `crawler`, those are the possible ways to make the crawler run. The crawler has the execution split into 2 main steps:
1. Extract the urls of the items we want to fetch the details from (ex: link that redirects to a product details page);
2. Extract the details (the information we need) about the item (generally products in a website) we are looking for.

When `crawler.run()` is called, the `runExtractLinks` and `runExtractDetails` methods are called and the robot executes all the steps sequentially.

If you want to use events, the library is currently capable of emitting these events:

- `extractLinks:finished`: Whenever the link extraction step is finished, this will be triggered;
- `extractDetails:finished`: Whenever the details extraction step is finished, this will be triggered;
- `finishedRun`: Whenever the crawler finishes running, this will be triggered.
