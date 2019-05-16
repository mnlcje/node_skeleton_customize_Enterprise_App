import {json,urlencoded} from 'body-parser';

import * as http from 'http';
import * as compression from 'compression'; //npm install @types/compression
import * as express from 'express'; //npm install @types/express
import { Logger } from './helpers/logger';
import { Api } from './helpers';
import {IConfig,AppSetting} from './config';
import { ApiRouting } from './api.routing';

export class WebApi
{
    public app : express.Express;
    private router : express.Router;
    private config:IConfig;

    constructor(){
        this.app = express();
        this.router = express.Router();
        this.config = AppSetting.getConfig();
        this.configure();
    }

    public run()
    {
        let server = http.createServer(this.app);
        server.listen(this.config.Port);
        server.on('error',this.onError)        
    }

    private configure(){
        this.configureMiddleWare();
        //TBD
        //AuthenticationModule.authenticate(this.app);
        this.configureBaseRoute();
        this.configureRoutes();
        this.errorHandler();
        }

    private configureMiddleWare(){

        this.app.use(json({limit:'50mb'}));
        this.app.use(urlencoded({limit:'50mb',extended:true}));
        //Not Working
        //this.app.use(compression());
        Logger.configureLogger(this.app);
        Logger.configureErrorLogger(this.app);
    }

    private configureBaseRoute(){
        this.app.use('/',this.router);
    }

    private configureRoutes()
    {
        ApiRouting.configureRouters(this.app);
    }

    private errorHandler(){
        this.app.use(function (err, req, res, next) {
            if (req.body) {
                Logger.error(req.body);
            }
            Logger.error(err);
            Api.serverError(req, res, err);
        });

        // catch 404 and forward to error handler
        this.app.use(function (req, res, next) {
            Api.notFound(req, res);
        });
    }

    private onError(error) {
        let port = this.config.Port;
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    
}