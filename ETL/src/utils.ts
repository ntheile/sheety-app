const XLSX = require('xlsx');
import { Config } from './config';

export class Utils {

    config: any;

    constructor() {
        this.config = new Config();
    }

    public get_header_row(sheet: any) {
        let headers = [];
        let range = XLSX.utils.decode_range(sheet['!ref']);
        let C, R = range.s.r; /* start in the first row */
        /* walk every column in the range */
        for (C = range.s.c; C <= range.e.c; ++C) {
            let cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]; /* find the cell in the first row */

            let hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
            if (cell && cell.t) {
                hdr = XLSX.utils.format_cell(cell);
            }

            headers.push(hdr);
        }
        return headers;
    }

    public is_empty_field(data: any) {
        if (data.startsWith('__EMPTY')) {
            return true;
        }
    }

    public should_show_column(col: any) {
        let shouldShow = true;

        if (this.config.ignoreProps.includes(col) || this.is_empty_field(col)) {
            shouldShow = false;
        }

        return shouldShow;
    }
}
