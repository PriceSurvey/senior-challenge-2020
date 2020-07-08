import { BaseCrawler } from 'rakoon/dist/crawlers';
import { ExtractLinksOptions } from 'rakoon/dist/models';
import { CrawlerStorage } from 'rakoon/dist/storage';
import { WebProduct } from '../base';
export declare class DrogasilCrawler extends BaseCrawler {
    storage: CrawlerStorage;
    VERSION: number;
    private PAGE_LIMIT;
    private categories;
    private SELECTORS;
    constructor(storage: CrawlerStorage);
    private extractLinksFromCategory;
    extractLinks(options: ExtractLinksOptions): Promise<any[]>;
    extractDetails(url: string): Promise<WebProduct>;
}
