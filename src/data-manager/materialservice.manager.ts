const fs = require('fs');
const path = require('path');

export class MaterialServiceManager
{
    public getData(fileName:string)
    {
        let filePath = path.join(process.cwd(),'/src/data-manager/data/',fileName);
        let data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
}
    