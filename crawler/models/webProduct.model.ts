export interface IWebProduct {
    /** Product name/title */
    name: string,
    /** Source information */
    source: { name: string, url: string },
    /** Product URL */
    url: string,
    /** Flag to determine wether a result was exported or not */
    exported?: boolean,
    /** Old Price before offer */
    oldPrice?: number,
    /** Current offer price */
    currentPrice: number,
    /** Datetime of extraction */
    extractedAt?: Date | string,
    /** Product detailed description */
    description?: string,
    /** Web site source product identifier */
    productId: number | null,
    /** 13-Code identifier */
    gtin?: number,
    /** Product brand or manufacturer */
    brand?: string,
    /** Brazillian government legal drugs identifier */
    msRecord?: number,
    /** Online store for marketplaces */
    onlineStore?: string
}