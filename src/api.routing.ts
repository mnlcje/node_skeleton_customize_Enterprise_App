import * as express from 'express';
import {UserController} from './controller/user.controller'

export class ApiRouting{

    public static configureRouters(app: express.Router){
        
        app.use(UserController.route,new UserController().router);
    }
}