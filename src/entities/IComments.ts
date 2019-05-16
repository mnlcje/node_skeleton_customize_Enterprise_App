export interface IComments {
    CommentID: string;
    PlantID: string;
    MaterialNo: string;
    Comment: string;
    CreatedBy: string;
    CreatedOn: Date;
    UpdatedBy?: string;
    UpdatedOn?: Date;
}
