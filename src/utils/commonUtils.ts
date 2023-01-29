import { AppConstants } from "./appConstants";
import moment from "moment";
import express, { NextFunction, Request, Response } from "express";
type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void
const path = require('path')
const os = require('os')
const md5 = require("md5");

const getRootDir = () => path.parse(process.cwd()).root
const getHomeDir = () => os.homedir()
const getPubDir = () => "./public"


function formatDate(date: any) {
    return moment(date).format(AppConstants.DATE_FORMAT)
}

async function sendSuccess(req: Request, res: Response, data: any, statusCode = 200) {
    return res.status(statusCode).send(data)
}

async function sendAdminSuccess(req: Request, res: Response, data: any, statusCode = 200) {
    return res.status(statusCode).send(data)
}
async function sendAdminError(req: Request, res: Response, data: any, statusCode = 422) {
    return res.status(statusCode).send(data)
}

async function sendError(req: Request, res: Response, data: any, statusCode = 422) {
    return res.status(statusCode).send(data)
}

function getCurrentUTC(format = AppConstants.DATE_FORMAT, addMonth: any = null, addSeconds: number = 0) {
    // console.log(moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    if (addMonth != null) {
        return moment.utc(new Date()).add(addMonth, 'M').format(format);
    } else if (addSeconds > 0) {
        return moment.utc(new Date()).add(addSeconds, 'seconds').format(format);
    } else {
        return moment.utc(new Date()).add().format(format);
    }
}

function formattedErrors(err: any) {
    let transformed: any = {};
    Object.keys(err).forEach(function (key, val) {
        transformed[key] = err[key][0];
    })
    return transformed
}
const routeArray = (array_: any, prefix: any, isAdmin: Boolean = false) => {
    // path: "", method: "post", controller: "",validation: ""(can be array of validation), 
    // isEncrypt: boolean (default true), isPublic: boolean (default false)

    array_.forEach((route: any) => {
        const method = route.method as "get" | "post" | "put" | "delete" | "patch";
        const path = route.path;
        const controller = route.controller;
        const validation = route.validation;
        let middlewares = [];
        const isEncrypt = route.isEncrypt === undefined ? true : route.isEncrypt;
        const isPublic = route.isPublic === undefined ? false : route.isPublic;
        if (validation) {
            if (Array.isArray(validation)) {
                middlewares.push(...validation);
            } else {
                middlewares.push(validation);
            }
        }
        middlewares.push(controller);
        prefix[method](path, ...middlewares);
    })

    return prefix;
}

const productData = () => [
    {
      "Category": "Electronics",
      "Product Name": "Washing Machine",
      "SKU": 452,
      "Description": "Washing Machine description here",
      "Price": 1500,
      "Discount": 10
    },
    {
      "Category": "Electronics",
      "Product Name": "Air Conditioner",
      "SKU": 455,
      "Description": "Air Conditioner description here",
      "Price": 3500,
      "Discount": 10
    },
    {
      "Category": "Electronics",
      "Product Name": "Refrigerator",
      "SKU": 459,
      "Description": "Refrigerator description here",
      "Price": 4000,
      "Discount": 10
    },
    {
      "Category": "Cosmetics",
      "Product Name": "Shaving Cream",
      "SKU": 659,
      "Description": "Shaving Cream description here",
      "Price": 40,
      "Discount": 7
    },
    {
      "Category": "Cosmetics",
      "Product Name": "Razor",
      "SKU": 658,
      "Description": "Razor description here",
      "Price": 45,
      "Discount": 10
    },
    {
      "Category": "Clothing",
      "Product Name": "Trouser",
      "SKU": 789,
      "Description": "Trouser description here",
      "Price": 26,
      "Discount": 5
    },
    {
      "Category": "Clothing",
      "Product Name": "Woven Shirt",
      "SKU": 1236,
      "Description": "Woven Shirt description here",
      "Price": 12,
      "Discount": 10
    },
    {
      "Category": "Medicines",
      "Product Name": "Aspirin 15mg",
      "SKU": 990,
      "Description": "Aspirin 15mg description here",
      "Price": 5.5,
      "Discount": 5
    },
    {
      "Category": "Medicines",
      "Product Name": "VCure 30 mg",
      "SKU": 991,
      "Description": "VCure 30 mg description here",
      "Price": 7.4,
      "Discount": 5
    }
   ]

const generateUniqueId = () => {
    // generate random string
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}

export default {
    getCurrentUTC,
    sendSuccess,
    sendError,
    formattedErrors,
    getRootDir,
    getHomeDir,
    getPubDir,
    formatDate,
    routeArray,
    sendAdminSuccess,
    sendAdminError,
    generateUniqueId,
    uuidv4,
    productData
}