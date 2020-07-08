import { IWebProduct } from './models/webProduct.model'

// Schema to extract
export class WebProduct implements IWebProduct {
    name: string
    url: string
    currentPrice: number
    description: string
    productId: number
    source: { name: string, url: string }
    extractedAt?: string | Date = new Date()
    oldPrice?: number = null
    gtin?: number = null
    brand?: string = null
    msRecord?: number = null
    exported?: boolean = false
    constructor(options: IWebProduct) {
        for (let key in options) {
            if (key == "extractedAt" && options[key]) {
                // The timezone will automagically be set based on the current machine timezone
                // this can be good or bad, based on the client's need
                this.extractedAt = new Date(options[key])
            } else {
                this[key] = options[key] || null
            }

        }
    }
}

