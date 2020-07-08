"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log(require("dotenv").config());
// console.log("env vars: ", process.env)
exports.STORAGE_URL = process.env.PROD_DB;
exports.STORAGE_DB = process.env.PROD_DB_NAME;
