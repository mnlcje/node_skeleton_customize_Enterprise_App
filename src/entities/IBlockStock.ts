
import { BlockStockSpecificMaterial } from "./IBlockStockSpecificMaterial";
export interface IBlockStock {
    PlantID: string;
    MaterialNo: string;
    BatchNo: string;
    RootCause: string;
    Action: string;
    BlendPercentage?: number;
    BlendRestriction?: string;
    MaterialList?: [BlockStockSpecificMaterial];
    BatchText: string;
    CreatedBy?: string;
    CreatedOn?: Date;
}
