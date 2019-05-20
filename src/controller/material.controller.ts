import { Router, Request, Response, NextFunction } from 'express';
import { MaterialServiceManager } from '../data-manager/materialservice.manager';
import { Api } from '../helpers/api';

export class MaterialController
{
    public static route = '/materials';
    public router: Router = Router();
    
    
    constructor(){
        this.router.get('/',this.getVariabilityNo);
        this.router.get('/variabilityno',this.getVariabilityNo);
        this.router.get('/realdemand', this.getRealDemand); 
        }

    public getVariabilityNo(req:Request,res:Response,next:NextFunction)
    {
        let result =  new MaterialServiceManager().getData('variability.no.json');
        return Api.ok(req,res,result);
    }

    public getRealDemand()
    {
        
    }
}