import { SqlManager } from '../helpers/sequelize';
import { SelectQuery, InsertQuery, UpdateQuery, DeleteQuery } from '../queries';
import { IBlockStock } from '../entities';
import { BlockStockSpecificMaterial } from '../entities/IBlockStockSpecificMaterial';

export class QualityControlManager {

    public getBatchTextGeneratorConfig(filterParent: string) {
        const db = new SqlManager();
        return db.Get(SelectQuery.getBatchTextGeneratorConfig, filterParent);
    }

    public async addBlockStock(blockStock: IBlockStock) {

        const db = new SqlManager();
        const transaction = await db.InitiateTransactionAsync();

        try {
            await db.DeleteWithTransaction(DeleteQuery.deleteBlockStock, blockStock, transaction);
            await db.InsertWithTransaction(InsertQuery.insertBlockStock, blockStock, transaction);
            if (blockStock.BlendRestriction && blockStock.BlendRestriction === 'SPEC-IPC') {
                for (const blockStockIPCInfo of blockStock.MaterialList) {
                    const blockStockIPC: BlockStockSpecificMaterial = {
                        PlantID: blockStock.PlantID,
                        BatchNo: blockStock.BatchNo,
                        HeaderMaterialNo: blockStock.MaterialNo,
                        MaterialNo: blockStockIPCInfo.MaterialNo,
                        Type: blockStockIPCInfo.Type ? 'Y' : 'N',
                        CreatedBy: blockStock.CreatedBy
                    };
                    await db.InsertWithTransaction(InsertQuery.insertBlockStockMaterialDetails, blockStockIPC, transaction);
                }
            }
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public deleteBlockStock(DuplicatePlantID: string, DuplicateMaterialNo: string, DuplicateBatchNo: string) {
        const db = new SqlManager();
        return db.Delete(DeleteQuery.deleteBlockStock, { PlantID: DuplicatePlantID, MaterialNo: DuplicateMaterialNo, BatchNo: DuplicateBatchNo });
    }

    public getBlockStockOverviewDetails(filterParent: any) {
        const db = new SqlManager();
        return db.Get(SelectQuery.getBlockStockOverview, filterParent);
    }

    public async getBlockStockBatches(paramsInfo: any) {
        const db = new SqlManager();
        let WhereBlock: string;
        if (paramsInfo.period === 'OneYearUsage') {
            WhereBlock = ` AND HalfYearUsage <> 0 AND OneYearUsage <> 0 `
        } else if (paramsInfo.period === 'HalfYearUsage') {
            WhereBlock = ` AND OneYearUsage <> 0 AND HalfYearUsage <> 0 `
        } else if (paramsInfo.period === 'OneQuarterUsage') {
            WhereBlock = ` AND OneMonthUsage <> 0 AND  OneQuarterUsage <> 0 `
        } else if (paramsInfo.period === 'OneMonthUsage') {
            WhereBlock = ` AND  OneMonthUsage <> 0 `
        } else if (paramsInfo.period === 'Destroy') {
            WhereBlock = ` AND OverYearUsage <> 0   `
        }

        if (paramsInfo.period !== 'BlockedVal' && paramsInfo.action === 'TOTAL') {
            WhereBlock = `'${WhereBlock}' AND PreAction in ('Destroy','Des-POCO','InvDisc','Undecided')`
        } else if (paramsInfo.period === 'BlockedVal' && paramsInfo.action === 'TOTAL') {
            WhereBlock = ''
        } else if (paramsInfo.period === 'BlockedVal' && paramsInfo.action !== 'TOTAL') {
            WhereBlock = `'${WhereBlock}' AND PreAction = '${paramsInfo.action}'`
        }
        let batchListQuery = SelectQuery.getBlockStockBatches;
        batchListQuery = batchListQuery.replace('WhereBlock', WhereBlock);
        return await db.Get(batchListQuery, paramsInfo);
    }
}
