import {WebApi} from './webApi';
import { IConfig } from './config/IConfig';
import { AppSetting } from './config/app.setting';
import { sequelize } from './helpers/sequelize/sequelize.config';

const api = new WebApi();
const config:IConfig = AppSetting.getConfig();
console.log(`Server listening on port : ${config.Port}`);
console.log(`Server root url : http://localhost:${config.Port}`);

api.run();
sequelize.setConnection();
