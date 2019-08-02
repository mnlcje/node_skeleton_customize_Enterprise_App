export const InsertQuery={
    insertComments:`INSERT INTO InternalComments (PlantID, MaterialNo, Comment, CreatedBy, CreatedOn) VALUES ( :PlantID, :MaterialNo, :Comment, :CreatedBy,  NOW());`
     insertBlockStock: `INSERT INTO QC_BlockStock (PlantID, MaterialNo, BatchNo, RootCause, Action, BlendPercentage, BlendRestriction, BatchText, CreatedBy, CreatedOn ) VALUES (:PlantID, :MaterialNo, :BatchNo, :RootCause, :Action, :BlendPercentage, :BlendRestriction, :BatchText, :CreatedBy, now());`,
    insertBlockStockMaterialDetails: `INSERT INTO QC_BlockStockSpecificMaterial (PlantID,BatchNo,HeaderMaterialNo, MaterialNo, Type, CreatedBy, CreatedOn ) VALUES (:PlantID,:BatchNo,:HeaderMaterialNo, :MaterialNo, :Type, :CreatedBy, now());`

}
