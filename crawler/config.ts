console.log(require("dotenv").config())
// console.log("env vars: ", process.env)
export const STORAGE_URL = process.env.PROD_DB
export const STORAGE_DB = process.env.PROD_DB_NAME