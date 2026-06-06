import fs from 'fs';
import path from 'path';
import {parse} from 'csv-parse/sync';

export function readCSVFile<T>(file_path: string): T[] {
    const csvContent = fs.readFileSync(path.resolve(__dirname, file_path), 'utf-8');

    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    })

    return records as T[];
}