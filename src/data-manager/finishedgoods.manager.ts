import { SqlManager } from '../helpers/sequelize';
import { SelectQuery } from '../queries';
import { PROStatus } from '../constants/proStatus'
import { groupBy, uniqBy, filter, forEach } from 'lodash';
import { raw } from 'body-parser';

export class FinishedGoodsServiceManager {

    public async getOverviewTableData(plantID: string, equipType: string) {
        const db = new SqlManager();
        const overviewData = await db.Get(SelectQuery.getFGPOverviewTableData, { plantID: plantID, equipmentType: equipType });
        const prvDates = filter(overviewData, function (date) {
            return ((new Date(date['finDate']).setHours(0, 0, 0, 0)) < (new Date().setHours(0, 0, 0, 0)));
        });
        const aheadDates = filter(overviewData, function (date) {
            return ((new Date(date['finDate']).setHours(0, 0, 0, 0)) >= (new Date().setHours(0, 0, 0, 0)));
        });
        return { backlog: groupBy(prvDates, 'TechnologyType'), aheadDate: groupBy(aheadDates, 'TechnologyType') };
    }

    public async getProDetails(plantId: string, technology: string, postat: string, breakDown: string, finishedDate?: string) {
        const db = new SqlManager();
        const startValue = 1;
        const endValue = 5;
        let finalQuery = '';
        let breakdownQuery = 'SELECT * FROM (';
        if (PROStatus[postat].in) {
            let query = '';
            query = SelectQuery.getPRODetails + `AND PO.BasicFinishDate = CONVERT("'${finishedDate}'", date)
             HAVING Class BETWEEN "'${PROStatus[postat].start}'" AND "'${PROStatus[postat].end}'"`;
            breakdownQuery += query + ') AS proList ';
            if (postat === 'MTA') {
                breakdownQuery += `WHERE ( proList.Class = 4 or (proList.Class = 3 AND
                     (proList.MTBAStat in (7, 9, 10) OR proList.MTBAStat is null )))`;
            } else {
                breakdownQuery += 'WHERE proList.MTBAStat IN (' + PROStatus[postat].in + ');';
            }
            finalQuery = breakdownQuery;
        } else {
            let query = '';
            if (breakDown === 'backlog' || finishedDate === 'backlog') {
                finishedDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
                query = SelectQuery.getPRODetails + 'AND PO.BasicFinishDate < CONVERT("' + finishedDate + '", date)';
            } else {
                query = SelectQuery.getPRODetails + 'AND PO.BasicFinishDate = CONVERT("' + finishedDate + '", date)';
            }
            if (breakDown !== postat && breakDown !== 'backlog') {
                query += ' AND VPO.Breakdown ="' + breakDown.split('_')[1] + '"'
            }
            query += ' HAVING Class BETWEEN "' + PROStatus[postat].start + '" AND "' + PROStatus[postat].end + '"';
            finalQuery = query;
        }
        const overviewData = await db.Get(finalQuery,
            { plantId: plantId, equipmentType: technology, startStatus: startValue, endStatus: endValue }
        );
        return overviewData;
    }

    public async getCapacityBuffer(plantId, technology) {
        const db = new SqlManager();
        const query = 'SELECT Technology, BufferSize from FGP_CapacityBuffer WHERE PlantId = "' + plantId + '" AND EquipmentType = "' + technology + '";';
        return db.Get(query, {});
    }

    public async getNewOrederData(params: any) {
        const db = new SqlManager();
        return db.Get(SelectQuery.getNewOrderDetails, params);
    }

    public async getDashboardDetails(plantId, technology, select?) {
        const db = new SqlManager();
        const querylist = {
            'New Orders': SelectQuery.getNewOrderDetails,
            'Subs to Reschedule': SelectQuery.getSubReschedule
        };
        const query = select ? querylist[select] : querylist['Subs to Reschedule'];
        return await db.Get(query, { plantId: plantId, equipmentType: technology });
    }

    public async getPhaseData(params: any) {
        const db = new SqlManager();
        const condition = (params.backlog === 'true') ? `where RequirementsDate < '${params.reqDate}' AND PlantID='${params.plantId}'` : `where RequirementsDate = '${params.reqDate}' AND PlantID='${params.plantId}'`;
        let PhaseDetailsQuery = SelectQuery.getPhaseDetails;
        PhaseDetailsQuery = PhaseDetailsQuery.replace('whereCondition', condition);
        return db.Get(PhaseDetailsQuery, params);
    }

}
