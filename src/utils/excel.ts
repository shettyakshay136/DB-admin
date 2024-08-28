import { WorkSheet, utils, writeFile } from "xlsx";

/**
 * This function is responsible for exporting the data to excel sheet
 * @param json - JSON data to be exported
 * @param fileName - Name of the file to be exported
 */
export const exportToExcel = (json: Record<string, unknown>[], fileName: string, headers: string[]) => {
    // Prepare the worksheet from the json data
    const ws = utils.json_to_sheet(json);
    // Run autoFitColumns function to adjust the width of the columns
    autoFitColumns(json, ws, headers);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, fileName);

    // This will download the file in the browser
    writeFile(wb, `${fileName}.xlsx`);
};

/**
 * This function is responsible for changing widht of the columns in excel sheet
 * It will adjust the width of the columns based on the length of the data in the column
 * @param json - JSON data to be exported
 * @param worksheet - Worksheet object
 * @param header - Header of the excel sheet
 */
export function autoFitColumns(json: Record<string, unknown>[], worksheet: WorkSheet, header?: string[]) {
    const jsonKeys = header ? header : Object.keys(json[0]);

    const objectMaxLength: number[] = [];
    for (let i = 0; i < json.length; i++) {
        const value = json[i];
        for (let j = 0; j < jsonKeys.length; j++) {
            const val = value[jsonKeys[j]];

            // Define the default value for the column width in case of number
            if (typeof val === "number") {
                objectMaxLength[j] = 10;
            } else if (typeof val === "string") {
                // When we have string value, we need to check the length of the string
                // Length of the string is the width of the column
                const l = val.length;

                objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j] : l;
            }
        }

        const key = jsonKeys;

        // Based on the max data, set the width of the column for all the columns
        for (let j = 0; j < key.length; j++) {
            objectMaxLength[j] = objectMaxLength[j] >= key[j].length ? objectMaxLength[j] : key[j].length;
        }
    }

    // Add an extra space to the width of the column
    const wscols = objectMaxLength.map((w) => {
        return { width: w + 2 };
    });

    worksheet["!cols"] = wscols;
}
