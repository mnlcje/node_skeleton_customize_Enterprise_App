import{ConfigManager} from './config.manager';
import{IConfig} from './IConfig';

export class AppSetting{

    public static getConfig() : IConfig{
        let configManager = new ConfigManager();
        return configManager.Config;
    }
}