import { Router, Request, Response, NextFunction } from 'express';
import { UserServiceManager } from "../data-manager/userservice.manager";
import {Api} from '../helpers/api';
import { IComments } from '../entities';
import{SapManager} from '../data-manager/sap.manager'
import {SapConstants} from '../constants/sap.constants';

export class UserController 
{
    public static route = '/users';
    public router : Router = Router();

    constructor()
    {
        this.router.get('/',this.getUserHardCoded);
        this.router.get('/fromDB',this.getUserFromDB);
        this.router.get('/fromConfig',this.getUserFromConfig);
        this.router.get('/searchUserById/:id',this.getUserById);
        this.router.get('/masterdata/:plantid/:materialno', this.getMasterData);        
        this.router.post('/createComment', this.createComment);   
        this.router.put('/updatepr/:plantId', this.updatePR);
             
    }

    public getUserHardCoded(req:Request, res:Response,next:NextFunction){

        let result = new UserServiceManager().getUserHardCoded();
        return Api.ok(req,res,result);

    }

    public getUserFromDB(req:Request, res:Response,next:NextFunction){

        new UserServiceManager().getUserFromDB().then((result)=>{
            return Api.ok(req,res,result);
        },(error) => {
                next(error);
            });          

    }

    public getUserFromConfig(req:Request, res:Response,next:NextFunction){
        
        let result = new UserServiceManager().getUserFromConfig();
        return Api.ok(req,res,result);
    }

    public getUserById(req:Request, res:Response,next:NextFunction){

        const plantId = req.params['id'];
        console.log(plantId);

        new UserServiceManager().getUserById(plantId).then((result)=>{
            return Api.ok(req,res,result);
        },(error)=>{
            next (error);
        });
        
    }
    public async getMasterData(req:Request, res:Response,next:NextFunction){
        const plantId = req.params['plantid'];
        const materialNo = req.params['materialno'];
        try
        {
            const result = await new UserServiceManager().getMasterData(plantId,materialNo);
            return Api.ok(req,res,result);
        }catch(error){
            next(error);
        }
    }

    //Follow createComment method in Material.Controller
    public async createComment(req:Request, res:Response,next:NextFunction)
    {
        let comment : IComments = req.body;
        try{
            comment.CreatedBy = 'UserId';
            const result= await new UserServiceManager().createComment(comment);
            return Api.ok(req,res,result);
        }
        catch(error)
        {
            next(error.original);

        };

    }

    public async updatePR(req: Request, res: Response, next: NextFunction) {
        const data: any = req.body;
       //TBD :  data.UserID = Utilities.getCurrentUser(req, res);
        let sapResult: any;
        try {
            sapResult = await SapManager.UpdateSAPData(SapConstants.PRUpdateURL, data);
            const response: any = {
                status: sapResult.Status,
                message: sapResult.Status === 'Success' ? 'PR Updated' : 'Not Updated'
            }
            return Api.ok(req, res, response);
        } catch (error) {
             next(error);
        }
    }
}