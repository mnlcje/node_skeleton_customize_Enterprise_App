import { Logger } from './../helpers/logger';
import { AppSetting } from '../config';
import { each } from 'lodash';
import { HttpStatusCode } from '../enums';
let soap = require('soap'); //npm install soap
const httpRequest = require("request");

class SAPManager {
    private sap;
    private _url;
    constructor() {
        const config = AppSetting.getConfig();
        this.sap = config.SAP;
        this._url = this.sap.url;
    }

    private GetData = (url: string) => {
        // let auth = 'Basic ' + Buffer.from(this.sap.userId + ':' + this.sap.password).toString('base64');
        let getheaders = {
            'Content-Type': this.sap.contentType,
            'accept': this.sap.accept
        };
        return new Promise((resolve, reject) => {
            httpRequest.get({
                url: this._url + url,
                // Authorization: auth,
                headers: getheaders
            }, (err, result) => {
                if (result) {
                    let stagedData = JSON.parse(result["body"]);
                    if (result.statusCode === HttpStatusCode.OK) {
                        const cleanedData = this.CleanUpData(stagedData.d.results);
                        resolve(cleanedData);
                    } if (stagedData && stagedData.error) {
                        Logger.error(stagedData.error);
                        resolve(stagedData.error.message);
                    }
                } else {
                    reject(err);
                }
            });
        });
    }

    private updateSoapEndpoint = (url, payload) => {
        return new Promise((resolve, reject) => {
            soap.createClient(this._url + url, (err, client) => {
                if (err) {
                    reject(err);
                }
                client.setSecurity(new soap.BasicAuthSecurity('OFLOWSYS', 'sapiff123', { rejectUnauthorized: false, strictSSL: false }));
                client.SIPurchaseReq(payload, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                })
            });
        })
    };

    private toLowerCaseProperties = (input) => {
        let key, keys = Object.keys(input);
        let n = keys.length;
        let newobj = {};
        while (n--) {
            key = keys[n];
            newobj[key.toLowerCase()] = input[key];
        }
        return newobj;
    }

    private CleanUpData = (data) => {
        each(data, (item: any, index) => {
            delete item.__metadata;
            data[index] = this.toLowerCaseProperties(item);
        });
        return data;
    }

    public GetSAPData = (url: string) => {
        return this.GetData(url);
    }

    public UpdateSAPData = (url: string, payload: any) => {
        return this.updateSoapEndpoint(url, payload)
    }
}
export const SapManager = new SAPManager();
