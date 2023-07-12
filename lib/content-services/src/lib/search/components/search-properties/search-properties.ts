import { FileSizeCondition } from './file-size-condition';

export interface SearchProperties {
    fileSizeCondition: FileSizeCondition;
    fileExtensions: string[];
}
