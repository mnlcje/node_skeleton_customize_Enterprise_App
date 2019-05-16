import {IConfig} from './IConfig';

const nconf = require('nconf');

export class ConfigManager{

    public Config: IConfig;

    constructor(){        
        let fileName = 'config.json';
        nconf.use('memory');   
        if (!nconf.get('Config')) {
            this.getFile(fileName);
        }     
        
        this.Config = nconf.get('Config');
        
        if (!this.Config) {
            console.log('Unable to read the config file');
            process.exit();
        }
    }

    public getFile(fileName)
    {
        //Key should match with JSON root element name
        nconf.file('Config',{
            file : 'config/' + fileName,
            dir: __dirname,
            search:true
        });
        
    }
    public reset(){
        nconf.reset();
        nconf.clear();
    }
}