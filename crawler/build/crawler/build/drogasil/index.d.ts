export var __esModule: boolean;
export var DrogasilCrawler: typeof DrogasilCrawler;
declare const DrogasilCrawler_base: typeof import("rakoon/dist/crawlers").BaseCrawler;
declare class DrogasilCrawler extends DrogasilCrawler_base {
    constructor(storage: any);
    storage: any;
    VERSION: number;
    PAGE_LIMIT: number;
    categories: string[];
    SELECTORS: {
        productNameFn: ($: any) => any;
        productBrandFn: ($: any) => any;
        oldPriceFn: ($: any) => any;
        currentPriceFn: ($: any) => any;
        activePage: string;
        productLink: string;
        productInfoRow: string;
        productInfoTitle: string;
        productInfoData: string;
        boxLabel: string;
        boxOfDetails: string;
    };
    extractLinksFromCategory(category: any, waitFor?: number): Promise<any[]>;
    extractLinks(options: any): Promise<any[]>;
    extractDetails(url: any): Promise<any>;
}
export {};
