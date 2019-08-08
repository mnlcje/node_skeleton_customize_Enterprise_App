import * as express from 'express';
import {UserController} from './controller/user.controller'
import { MaterialController } from './controller/material.controller';
import { FinishedGoodsController } from './controller/finishedgoods.controller';
import { QualityControlController } from './controller/qualitycontrol.controller';


export class ApiRouting{

    public  static configureRouters(app: express.Router){
        
        app.use(UserController.route,new UserController().router);
        app.use(MaterialController.route,new MaterialController().router);
        app.use(FinishedGoodsController.route, new FinishedGoodsController().router);
        app.use(QualityControlController.route, new QualityControlController().router);
    }
}
