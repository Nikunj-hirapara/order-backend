import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import commonUtils from "../../utils/commonUtils";
import { AdminRole, Device, Gender, ProviderType, UserData, UserType } from "../../utils/enum";
import { AppStrings } from "../../utils/appStrings";
import { AppConstants } from "../../utils/appConstants";
import mongoose from "mongoose";
const User = require('./userModel');

async function seekerIntroValidation(req: Request, res: Response, next: NextFunction) {
    const validationRule = {
        "seeker_intro": "required|string",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

const seekerProfileValidation = async (req: Request, res: Response, next: NextFunction) => {
    const LANG = req.headers.lang as string ?? 'en';

    const userId = req.headers?.userid as string;
    const userType = req.headers.usertype as string;

    if (parseInt(userType) !== UserType.SEEKER)
        return commonUtils.sendError(req, res, { message: AppStrings[LANG].USER_NOT_SEEKER }, 409);

    const genders = [Gender.MALE, Gender.FEMALE]

    console.log(555656);

    const ValidationRule = {
        "name": "required|string|min:3|max:255",
        "gender": "required|in:" + genders.join(","),
        "email": "string|email|max:255|exist_value_with_type:User,email," + userId + "," + UserType.SEEKER,
        "mobile": "numeric|min:10|exist_value_with_type:User,mobile," + userId + "," + UserType.SEEKER,
        "dob": "required|valid_date|date_before:15,year",
        "esic_no": "string|exist_value:User,seeker.esic_no," + userId,
        // "work_category": `required|validObjectId|must_from:${AppConstants.MODEL_JOBS_CATEGORY},_id`,
        "address": "required|string",
        "location": {
            "longitude": "required|numeric|min:-180|max:180",
            "latitude": "required|numeric|min:-90|max:90",
        },
        "aboutPerson": "string",
    }

    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}

const providerProfileValidation = async (req: Request, res: Response, next: NextFunction) => {
    const LANG = req.headers.lang as string ?? 'en';

    const userId = req.headers.userid;
    const userType = req.headers.usertype as string;

    if (parseInt(userType) !== UserType.PROVIDER)
        return commonUtils.sendError(req, res, { message: AppStrings[LANG].USER_NOT_PROVIDER }, 409);

    const providerType = parseInt(req.body.provider_type);
    const providers = [ProviderType.COMPANY, ProviderType.INDIVIDUAL];

    if (providers.indexOf(providerType) === -1)
        return commonUtils.sendError(req, res, { message: AppStrings[LANG].PROVIDER_TYPE_MISSING_OR_INVALID }, 409);

    const genders = [Gender.MALE, Gender.FEMALE]

    const companyValidationRule = {
        "companyName": "required|string|min:3|max:255",
        "companyAddress": "required|string|min:3|max:255",
        "employeeCount": "required|integer",
        "industryType": "required|string",
        "compnayPfDetails": "string",
        "companyRegistrationNo": "string",
        "aboutCompany": "string",
    }

    const individualValidationRule = {
        "name": "required|string|min:3|max:255",
        "dob": "required|valid_date|date_before:15,year",
        "panNo": "required|string",
        "gender": "required|in:" + genders.join(","),
        "address": "required|string",
        // "work_category": `validObjectId|must_from:${AppConstants.MODEL_JOBS_CATEGORY},_id`,
        "aboutPerson": "string"
    }

    const commonfield = {
        "email": "string|email|max:255|exist_value_with_type:User,email," + userId + "," + UserType.PROVIDER,
        "mobile": "numeric|min:10|exist_value_with_type:User,mobile," + userId + "," + UserType.PROVIDER,
        // "location": {
        //     "longitude": "required|numeric|min:-180|max:180",
        //     "latitude": "required|numeric|min:-90|max:90",
        // },
    }

    if (providerType === ProviderType.COMPANY) {
        validator.validatorUtilWithCallback({ ...companyValidationRule, ...commonfield }, {}, req, res, next);
    } else {
        validator.validatorUtilWithCallback({ ...individualValidationRule, ...commonfield }, {}, req, res, next);
    }
}

const hasUserValidation = async (req: Request, res: Response, next: NextFunction) => {
    const LANG = req.headers.lang as string ?? 'en';

    const userId = req.headers.userid as string;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId))
        return commonUtils.sendError(req, res, { message: AppStrings[LANG].USERID_MISSING }, 404);

    const user = await User.findById(userId);
    if (!user) return commonUtils.sendError(req, res, { message: AppStrings[LANG].USER_NOT_FOUND }, 409);

    next();
}

const locationValidation = async (req: Request, res: Response, next: NextFunction) => {
    const ValidationRule = {
        "location": {
            "longitude": "required|numeric|min:-180|max:180",
            "latitude": "required|numeric|min:-90|max:90",
        },
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}


export default {
    seekerProfileValidation,
    providerProfileValidation,
    seekerIntroValidation,
    hasUserValidation,
    locationValidation,
}