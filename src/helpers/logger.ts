import * as express from 'express';
const winston = require('winston'); // for transports.Console //npm intall winston
const path = require('path');
const fs = require('fs');
const DailyRotateFile = require('winston-daily-rotate-file'); //npm install winston-daily-rotate-file

enum LoggerType {
    RequestLogger, ErrorLogger
}

export class Logger {

    private static logger;
    private static _errorLogger;
    private static logDirectory = path.join(process.cwd(), 'oflowlogs');
    private static defaultConfig = {
        json: false,
        datePattern: "dd-MM-yyyy",
        prepend: false,
        localTime: true,
        zippedArchive: true,
        filename: path.join(Logger.logDirectory, ".oflow.log"),
        prettyPrint: true,
        maxSize: '2m', // 1 MB
        maxFiles: '14d'
    };


    private static CreateLogFolderIfNotExists() {
        // ensure log directory exists
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory);
        }
    }

    private static SetLogger(app: express.Express, _config, loggerType: LoggerType) {
        this.logger = new winston.Logger({
            transports: [
                new DailyRotateFile({
                    filename: path.join(Logger.logDirectory, ".oflow.log"),
                    datePattern: 'yyyy-MM-dd',
                    prepend: true,
                    localTime: true,
                    level: 'verbose'
                }),
                new DailyRotateFile({
                    name: 'oflowerror',
                    filename: path.join(Logger.logDirectory, ".oflow-error.log"),
                    datePattern: 'yyyy-MM-dd',
                    prepend: true,
                    localTime: true,
                    level: 'error'
                })
            ],
            exitOnError: false
        });
        
    }

    public static configureLogger(app: express.Express) {
        this.CreateLogFolderIfNotExists();
        // if (Config.getConfig().getAppConfig().environment.DeploymentMode !== DeploymentMode.production) {
        this.SetLogger(app, this.defaultConfig, LoggerType.RequestLogger);        
    }

    public static configureErrorLogger(app: express.Express) {
        this.defaultConfig.filename = path.join(this.logDirectory, "_errors_");
        this.SetLogger(app, this.defaultConfig, LoggerType.ErrorLogger);
    }

    private static GetValue(value: any) {
        if (typeof value === "string") {
            return value;
        } else {
            return JSON.stringify(value);
        }
    }

    public static debug(value: any) {
        if (this.logger) {
            this.logger.log('debug', this.GetValue(value));
        } else {
            console.log(this.GetValue(value));
        }
    }

    public static error(value: any) {
        if (this.logger) {
            this.logger.log('error', this.GetValue(value));
        } else {
            console.log(this.GetValue(value));
        }
    }

    public static warn(value: any) {
        if (this.logger) {
            this._errorLogger.log('warn', this.GetValue(value));
        } else {
            console.log(this.GetValue(value));
        }
    }

    public static info(value: any) {
        if (this.logger) {
             this.logger.log('info', this.GetValue(value));
        } else {
            console.log(this.GetValue(value));
        }
    }

}
