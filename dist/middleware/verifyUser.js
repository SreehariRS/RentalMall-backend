"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customErrors_1 = require("../errors/customErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyUser = async (req, res, next) => {
    try {
        let token = req.cookies.jwt;
        const data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!data) {
            throw new customErrors_1.CustomError("Authorization required", 401);
        }
        req.user = data;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = verifyUser;
