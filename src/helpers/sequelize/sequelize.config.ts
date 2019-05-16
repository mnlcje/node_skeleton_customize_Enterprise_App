import {AppSetting} from '../../config/app.setting';
import * as SqlConnection from 'sequelize'; // npm install sequelize Since sequelize will be using MySQL in this procject so install MySQl as well (npm install MySql2)
import{IConfig} from '../../config/IConfig';

export class SequelizeConfig {
    
    private sequelize: SqlConnection.sequelize;

    // This method is called from main.ts
      public setConnection() {
        const config: IConfig = AppSetting.getConfig();
        const dbInfo = config.DBConnections['default'];
        this.sequelize = new SqlConnection(dbInfo.database, dbInfo.user, dbInfo.password, {
            host: dbInfo.server,
            maxConcurrentQueries: dbInfo.maxConcurrent,
            dialect: dbInfo.dbType,
            logging: true,
            dialectOptions: dbInfo.dialectOptions
        });
    }
    private ping(dbInfo) {
        this.sequelize
            .authenticate()
            .then(function (err) {
                console.log(`Connection has been established to the database: ${dbInfo.server} - ${dbInfo.database} successfully.`);
            })
            .catch(function (err) {
                console.log(`Unable to connect to the database: : ${dbInfo.server} - ${dbInfo.database}`, err);
            });
    }
    public getSequelize() {
        return this.sequelize;
    }
}

export const sequelize = new SequelizeConfig();
