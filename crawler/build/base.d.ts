import { IWebProduct } from './models/webProduct.model';
export declare class WebProduct implements IWebProduct {
    name: string;
    url: string;
    currentPrice: number;
    description: string;
    productId: number;
    source: {
        name: string;
        url: string;
    };
    extractedAt?: string | Date;
    oldPrice?: number;
    gtin?: number;
    brand?: string;
    msRecord?: number;
    exported?: boolean;
    constructor(options: IWebProduct);
}
