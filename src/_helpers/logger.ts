import findRemoveSync from "find-remove";
import path from "path";
import fs from "fs";
import winston from "winston";

import { LogItem } from "../_models/LogItem";
import { Logs } from '../_globals/logs';

function getLogFilePath(): string {

	var today = new Date().toISOString().replace('T', ' ').replace(/\..+/, '').replace(/:/g, "-");

	const logFolder = path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences/' : process.env.HOME + "/.local/share/"), "centralized-alarm-clock/logs");

	findRemoveSync(logFolder, {age: {seconds: 604800}, extensions: '.log', limit: 100});

	if (!fs.existsSync(logFolder)) {
		fs.mkdirSync(logFolder, { recursive: true });
	}
	var logName = today + ".log"
	return path.join(logFolder, logName);
}

//Setup logger
const { combine, printf } = winston.format;

export const logFilePath = getLogFilePath();

let serverLoggerFormat = printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
});
var serverLoggerOptions = {
    console: {
        level: 'debug',
        format: combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.colorize(), serverLoggerFormat)
    },
    file: {
        filename: logFilePath,
		maxsize: 3e+7, //3MB
		maxFiles: 3,
        level: 'debug',
        format: combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), serverLoggerFormat)
    },
}
winston.loggers.add('server', {
	transports: [
	  new winston.transports.Console(serverLoggerOptions.console),
	  new winston.transports.File(serverLoggerOptions.file)
	]
});

export const serverLogger = winston.loggers.get('server');

export function logger(log, type: LogItem["type"]) { //logs the item to winston and to the log array
	serverLogger.log({
		level: type,
		message: log
	});

	const logObj: LogItem = {} as LogItem;
	logObj.datetime = new Date().toISOString();
	logObj.log = log;
	logObj.type = type;
	Logs.push(logObj);
}
