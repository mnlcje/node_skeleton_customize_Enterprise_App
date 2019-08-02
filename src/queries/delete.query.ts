export const DeleteQuery = {
    deleteBlockStock: `DELETE FROM QC_BlockStock WHERE PlantID = :PlantID AND MaterialNo = :MaterialNo AND BatchNo = :BatchNo;
                       DELETE FROM QC_BlockStockSpecificMaterial WHERE PlantID = :PlantID AND HeaderMaterialNo = :MaterialNo AND BatchNo = :BatchNo;`
};
