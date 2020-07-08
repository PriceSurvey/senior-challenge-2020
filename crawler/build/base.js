"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Schema to extract
class WebProduct {
    constructor(options) {
        this.extractedAt = new Date();
        this.oldPrice = null;
        this.gtin = null;
        this.brand = null;
        this.msRecord = null;
        this.exported = false;
        for (let key in options) {
            if (key == "extractedAt" && options[key]) {
                // The timezone will automagically be set based on the current machine timezone
                // this can be good or bad, based on the client's need
                this.extractedAt = new Date(options[key]);
            }
            else {
                this[key] = options[key] || null;
            }
        }
    }
}
exports.WebProduct = WebProduct;
