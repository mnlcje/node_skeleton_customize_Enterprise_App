export const InsertQuery={
    insertComments:`INSERT INTO InternalComments (PlantID, MaterialNo, Comment, CreatedBy, CreatedOn) VALUES ( :PlantID, :MaterialNo, :Comment, :CreatedBy,  NOW());`
    
}