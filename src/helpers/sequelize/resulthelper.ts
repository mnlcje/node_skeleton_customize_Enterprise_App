export class ResultHelper {
    public static GetFormattedSQLWithInput(sqlQuery, input) {
        return {
            query: sqlQuery ? sqlQuery.replace(/\s\s+/g, ' ') : '', // Replace multiple spaces, newline, tabs with space
            input: input
        };
    };
    public static SplitEmailsToArray(results) {
        for (let item of results) {
            item.email = item.email ? item.email.split(",") : null;
        }
        return results;
    }
}
