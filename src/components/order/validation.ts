import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import commonUtils from "../../utils/commonUtils";
import mongoose from "mongoose";

const orderFieldValidation = async (req: Request, res: Response, next: NextFunction) => {
    const LANG = req.headers.lang as string ?? 'en';
    const userId = req.headers?.userid as string;

    const ValidationRule = {
        product : {
            name: "required|string",
            sku: "required",
            description: "required|string",
            category: "required|string",
            quantity: "required|numeric",
            price:"required|numeric",
            discount:"required|numeric",
            tax:"required|numeric",
            netPrice:"required|numeric",
        },
        shipping: {
            type: "required|string",
            charge: "required|numeric",
            estimatedDate: "required|valid_date",
        },
        customer : {
            name: "required|string",
            DOB: "required|valid_date|date_before:15,year",
            phone: "required|string",
        },
        signatureRequired:"required",
        receiveStausUpdate:"required",
        termsAgree:"required",
    }

    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}

export default {
    orderFieldValidation,
}