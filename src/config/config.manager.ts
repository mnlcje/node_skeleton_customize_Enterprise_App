import { IConfig } from './IConfig';
import { AppSetting } from './app.setting';
import { Environment } from '.';
import { dirname } from 'path';
import { Logger } from '../helpers';
const nconf = require('nconf');
const path = require('path');

export class ConfigManager {
    public Config: IConfig;
    constructor(pth?: string) {
        let filename;

        switch (AppSetting.Env) {
            case Environment.DEV:
                filename = 'config.dev.json';
                break;
            case Environment.QAS:
                filename = 'config.qas.json';
                break;
            case Environment.PROD:
                filename = 'config.prod.json';
                break;
            default:
                filename = 'config.qas.json';
        }
        nconf.use('memory');
        if (!nconf.get('Config')) {
            this.getFile(filename);
        }
        this.Config = nconf.get('Config');
        if (!this.Config) {
            Logger.error('Unable to read the config file');

            process.exit();
        }

    }
    public getFile(filename) {
        nconf.file('Config', {
            file: filename,
            dir: './config/',
            search: true
        });
        if (!nconf.get('Config')) {
            nconf.file('Config', {
                file: 'config/' + filename,
                dir: __dirname,
                search: true
            });
        }
    }
    public reset() {
        nconf.reset();
        nconf.clear();
    }
}
