import { Router, Request, Response, NextFunction } from 'express';
import { MaterialServiceManager } from '../data-manager/materialservice.manager';
import { Api } from '../helpers/api';

export class MaterialController
{
    public static route = '/materials';
    public router: Router = Router();
    
    
    constructor(){
        this.router.get('/technology/:plantid/:materialno',this.getTechnology)
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

    public getTechnology(req: Request, res: Response, next: NextFunction)
    {
        const plantId = req.params['plantid'];
        const materialNo = req.params['materialno'];

        //Below code is for the response that returns a promise
       /* new MaterialServiceManager().getTechnology(plantId,materialNo).then((result)=>{
            return Api.ok(req,res,result);
        },(error)=>{

            next(error);
        });
        */

        let result =  new MaterialServiceManager().getTechnology(plantId,materialNo);
        return Api.ok(req,res,result);   
    }

}