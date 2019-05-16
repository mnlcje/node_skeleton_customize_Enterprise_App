import {WebApi} from './webApi';
import { IConfig } from './config/IConfig';
import { AppSetting } from './config/app.setting';
import { sequelize } from './helpers/sequelize/sequelize.config';

let api = new WebApi();
let config:IConfig = AppSetting.getConfig();
api.run();
sequelize.setConnection();
let app = new WebApi().app;
export {app};