import { Router, Request, Response, NextFunction } from 'express';
import { Api, Utilities } from './../helpers';
import { FinishedGoodsServiceManager } from '../data-manager/finishedgoods.manager';

export class FinishedGoodsController {

    public static route = '/fgp';
    public router: Router = Router();

    constructor() {
        this.router.get('/overview/:plantid/:technology', this.getOverviewTableData);
        this.router.get('/overview/capacitybuff/:plantid/:technology', this.getCapacityBuffer);
        this.router.post('/overview/process-orders', this.getProDetails);
        this.router.get('/neworderdetails/:plantId/:equipmentType', this.getNewOrderDetails);
        this.router.post('/dashboard', this.getFGDashboard);
        this.router.get('/phasedetails/:plantId/:reqDate/:backlog', this.getPhaseDetails);
    }

    public async getOverviewTableData(req: Request, res: Response, next: NextFunction) {
        const plantId = req.params['plantid'];
        const technology = req.params['technology'];
        try {
            const result = await new FinishedGoodsServiceManager().getOverviewTableData(plantId, technology);
            return Api.ok(req, res, result);
        } catch (error) {
            next(error);
        }
    }

    public async getCapacityBuffer(req: Request, res: Response, next: NextFunction) {
        const plantId = req.params['plantid'];
        const technology = req.params['technology'];
        try {
            const result = await new FinishedGoodsServiceManager().getCapacityBuffer(plantId, technology);
            return Api.ok(req, res, result);
        } catch (error) {
            next(error);
        }
    }

    public async getProDetails(req: Request, res: Response, next: NextFunction) {
        const param = req.body;
        const plantId = param['plantId'];
        const technology = param['equipType'];
        const poStat = param['postat'];
        const breakDown = param['breakdown'];
        const finishedDate = param['findate'];
        try {
            const result = await new FinishedGoodsServiceManager().getProDetails(plantId, technology, poStat, breakDown, finishedDate);
            return Api.ok(req, res, result);
        } catch (error) {
            next(error);
        }
    }

    public async getNewOrderDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await new FinishedGoodsServiceManager().getNewOrederData(req.params);
            return Api.ok(req, res, result);
        } catch (error) {
            next(error);
        }
    }

    public async getFGDashboard(req: Request, res: Response, next: NextFunction) {
        const params = req.body;
        const plantId = params['plantId'];
        const technology = params['equipType'];
        const select = params['select'];
        try {
            const result = await new FinishedGoodsServiceManager().getDashboardDetails(plantId, technology, select);
            return Api.ok(req, res, result);
        } catch (error) {
            next(error);
        }
    }

    public async getPhaseDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await new FinishedGoodsServiceManager().getPhaseData(req.params);
            return Api.ok(req, res, result);
        } catch (error) {
            next(error);
        }
    }

}
