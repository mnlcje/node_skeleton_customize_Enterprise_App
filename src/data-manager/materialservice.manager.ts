const fs = require('fs');
const path = require('path');

export class MaterialServiceManager
{
    public getData()
    {
        const fileName = "variability.no.json";
        
        console.log(process.cwd());
        let filePath = path.join(process.cwd(),'/src/data-manager/data/',fileName);
        let data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
}
    