import { IActions } from './../entities/IActions';
import { Router, Request, Response, NextFunction } from 'express';
import { Api, Utilities } from './../helpers';
import { QualityControlManager } from '../data-manager/qualitycontrol.manager';
import { IBlockStock } from '../entities/IBlockStock';

export class QualityControlController {

    public static route = '/qualitycontrol';
    public router: Router = Router();

    constructor() {
        this.router.get('/batchtextgeneratorconfig/:filterParent?', this.getBatchTextGeneratorConfig);
        this.router.post('/blockstock/batchtext', this.addBlockStock);
        this.router.get('/blockstock/overview/:plantId', this.getBlockStockOverview);
        this.router.get('/blockstock/batch/:plantId/:action/:period', this.getBlockStockBatches);
    }

    public getBatchTextGeneratorConfig(req: Request, res: Response, next: NextFunction) {
        const FilterParent = req.params['filterParent'] ? req.params : { filterParent: '' };
        new QualityControlManager().getBatchTextGeneratorConfig(FilterParent).then((result) => {
            return Api.ok(req, res, result);
        }, (error) => {
            next(error);
        });
    }

    public async addBlockStock(req: Request, res: Response, next: NextFunction) {
        const blockstock: IBlockStock = {
            PlantID: req.body.PlantID,
            MaterialNo: req.body.MaterialNo,
            BatchNo: req.body.BatchNo,
            RootCause: req.body.RootCause,
            Action: req.body.Action,
            BlendPercentage: req.body['BlendPercentage'] ? req.body.BlendPercentage : null,
            BlendRestriction: req.body['BlendRestriction'] ? req.body.BlendRestriction : null,
            BatchText: req.body.BatchText,
            CreatedBy: Utilities.getCurrentUser(req, res)
        }
        try {
            const result = await new QualityControlManager().addBlockStock(blockstock);
            return Api.ok(req, res, result);
        } catch (error) {
            next(error.original);
        }
    }

    public getBlockStockOverview(req: Request, res: Response, next: NextFunction) {
        new QualityControlManager().getBlockStockOverviewDetails(req.params).then((result) => {
            return Api.ok(req, res, result);
        }, (error) => {
            next(error);
        });
    }

    public getBlockStockBatches(req: Request, res: Response, next: NextFunction) {
        new QualityControlManager().getBlockStockBatches(req.params).then((result) => {
            return Api.ok(req, res, result);
        }, (error) => {
            next(error);
        });
    }

}
