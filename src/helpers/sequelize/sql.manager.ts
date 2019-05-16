import{Logger} from '../../helpers/logger';
import {ResultHelper} from './resulthelper';
import {sequelize} from './sequelize.config';
import * as SqlConnection from 'sequelize'; //npm install sequelize
import { clone } from 'lodash'; //npm install @types/lodash

export class SqlManager {

    private _sequelize: SqlConnection.Sequelize;

    constructor() {
        this._sequelize = sequelize.getSequelize();
    }

    public ExecuteQuery(qry: string) {
        return this._sequelize.query(qry, { type: this._sequelize.QueryTypes.SELECT });
    }

    public ExecuteSPQuery(qry: string) {
        return this._sequelize.query(qry);
    }

    public async Get(qry: string, vals: any) {    
        
        Logger.info(ResultHelper.GetFormattedSQLWithInput(qry, vals));
    
        let splitRule = qry.split('{');
        if (splitRule.length === 1) {
            return await this._sequelize.query({
                query: qry,
                values: vals
            }, { type: this._sequelize.QueryTypes.SELECT });
        } else {
            let regexPattern = /\{(.*?)\}/gi;
            let finalResult = clone(qry);
            for (let m = regexPattern.exec(qry); m; m = regexPattern.exec(qry)) {
                let applyRules = await this._sequelize.query({
                    query: `select Rule from Rules where RuleNo = :RuleNo`,
                    values: { 'RuleNo': m[1] }
                }, { type: this._sequelize.QueryTypes.SELECT });
                finalResult = finalResult.replace(m[0], applyRules.length > 0 ? applyRules[0].Rule : '');
            }
            vals = {};
            return await this._sequelize.query({
                query: finalResult,
                values: vals
            }, { type: this._sequelize.QueryTypes.SELECT });
        }
    }

    public async GetAsync(qry: string, vals: any) {
        
        return await this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.SELECT });
    }

    public Insert(qry: string, vals: any) {
        return this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.INSERT });
    }

    public async InsertAsync(qry: string, vals: any) {
        return await this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.INSERT });
    }

    public Update(qry: string, vals: any) {
        return this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.UPDATE });
    }

    public async UpdateAsync(qry: string, vals: any) {
        return await this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.UPDATE });
    }

    public Delete(qry: string, vals: any) {
        return this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.DELETE });
    }

    public BulkDelete(qry: string, vals: any) {
        return this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.BULKDELETE });
    }

    public Ping() {
        return this._sequelize.authenticate();
    }

    public InitiateTransaction() {
        return this._sequelize.transaction();
    }

    public async InitiateTransactionAsync() {
        return await this._sequelize.transaction();
    }

    public UpdateWithTransaction(qry: string, vals: any, _transaction) {
        return this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.UPDATE, transaction: _transaction });
    }

    public async UpdateWithTransactionAsync(qry: string, vals: any, _transaction) {
        return await this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.UPDATE, transaction: _transaction });
    }

    public ExecuteQueryWithTransaction(qry: string, vals: any, _transaction) {
        return this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.SELECT, transaction: _transaction });
    }

    public InsertWithTransaction(qry: string, vals: any, _transaction) {
        return this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.INSERT, transaction: _transaction });
    }

    public async InsertWithTransactionAsync(qry: string, vals: any, _transaction) {
        return await this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.INSERT, transaction: _transaction });
    }

    public DeleteWithTransaction(qry: string, vals: any, _transaction) {
        return this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.DELETE, transaction: _transaction });
    }

    public async DeleteWithTransactionAsync(qry: string, vals: any, _transaction) {
        return await this._sequelize.query({
            query: qry,
            values: vals
        }, { type: this._sequelize.QueryTypes.DELETE, transaction: _transaction });
    }

    public BulkInsertWithTransaction(tableName: string, vals: any, _transaction) {
        return this._sequelize.getQueryInterface().bulkInsert(tableName, vals,
            { type: this._sequelize.QueryTypes.INSERT, transaction: _transaction });
    }

    public BulkInsert(tableName: string, vals: any) {
        return this._sequelize.getQueryInterface().bulkInsert(tableName, vals,
            { type: this._sequelize.QueryTypes.INSERT });
    }

    public BulkUpdate(tableName: string, vals: any) {
        return this._sequelize.getQueryInterface().bulkUpdate(tableName, vals,
            { type: this._sequelize.QueryTypes.UPDATE });
    }

    public BulkUpdateWithTransaction(tableName: string, vals: any, _transaction) {
        return this._sequelize.getQueryInterface().bulkUpdate(tableName, vals,
            { type: this._sequelize.QueryTypes.UPDATE, transaction: _transaction });
    }
}
