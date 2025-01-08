"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const path_1 = __importDefault(require("path"));
const logDirectory = path_1.default.join(__dirname, '../logs');
// Create a Daily Rotate File Transport
const dailyRotateFileTransport = new winston_1.transports.DailyRotateFile({
    filename: 'application-%DATE%.log', // Log file format with date
    dirname: logDirectory, // Directory for storing logs
    datePattern: 'YYYY-MM-DD', // Date pattern for rotation
    maxFiles: '7d', // Keep logs for 7 days
    zippedArchive: true, // Compress logs after rotation
});
// Create the Winston logger
const logger = (0, winston_1.createLogger)({
    level: 'info', // Log only info-level messages and above
    format: winston_1.format.combine(winston_1.format.timestamp(), // Add timestamp to logs
    winston_1.format.json() // Log format as JSON
    ),
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), // Colorize console logs
            winston_1.format.simple() // Simple format for console
            ),
        }),
        dailyRotateFileTransport, // Log file with daily rotation
    ],
});
exports.default = logger;
