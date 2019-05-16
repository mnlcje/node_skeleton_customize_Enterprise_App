import{IUser} from '../entities'
import{IComments} from '../entities';
import { IConfig } from '../config/IConfig';
import { AppSetting } from '../config/app.setting';
import { SqlManager } from '../helpers/sequelize/sql.manager';
import { SelectQuery } from '../queries/select.query';
import { InsertQuery } from '../queries/insert.query';

export class UserServiceManager{
    
    public getUserHardCoded()
    {           
        let user:IUser = {};
        user.DOB = new Date();
        user.Name = "Mainak";    
        user.Role="Node"      
        return user;
    }
   
    public getUserFromDB()
    {        
      //For testing purpose , getting Plant Details from DB
      let db = new SqlManager();
      return db.Get(SelectQuery.getPlants,{})   
    }
    
    public getUserById(IdParam)
    {
        //For testing purpose , getting Plant Details for the given ID
        let db = new SqlManager();
        let input = {
        //Input variable name should match with input parameter name as mentioned in getPlant Select Query
        plantId : IdParam
      };
      console.log(input);
      return db.Get(SelectQuery.getPlant,input);
    }

    public getUserFromConfig()
    {
        let config : IConfig = AppSetting.getConfig();

        let user = {
            DOB: config.User.DOB,
            Name:config.User.Name,
            Role:config.User.Role
        };

        return user;
    }

    //Time Consuming Method
    public async getMasterData(PlantID : string, MaterialNo:string)
    {
        const db = new SqlManager();
        const refMaterial = await db.Get(SelectQuery.getRefMaterial,{PlantID: PlantID, MaterialNo: MaterialNo});
        const refMaterialValuation = await db.Get(SelectQuery.getRefMaterialValuation, { PlantID: PlantID, MaterialNo: MaterialNo });

        return {Material:refMaterial, Valuation : refMaterialValuation};    
    }

    public async createComment(comments:IComments)
    {    
        const db = new SqlManager();
        await db.InsertAsync(InsertQuery.insertComments,comments);
        return true;
    }

    
    
}