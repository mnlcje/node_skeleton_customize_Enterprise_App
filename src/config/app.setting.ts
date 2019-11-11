import{ConfigManager} from './config.manager';
import{IConfig} from './IConfig';

/*
*/
export class AppSetting{

    public static Env = process.env.OFLOW_ENV; //OFLOW_ENV defined in nodeman json files.
    
    public static getConfig() : IConfig{
        let configManager = new ConfigManager();
        return configManager.Config;
    }
}
