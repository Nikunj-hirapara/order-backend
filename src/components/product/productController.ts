import { AppStrings } from "../../utils/appStrings";

import { NextFunction, Request, Response } from "express";
import commonUtils from "../../utils/commonUtils";
import moment from "moment";
import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

async function getProducts(req: Request, res: Response) {
  try {  
    return commonUtils.sendSuccess(req, res, commonUtils.productData());
  } catch (error) {
    console.log(error);
    return commonUtils.sendError(req, res, { error }, 500);
  }
}
export default {
  getProducts
}