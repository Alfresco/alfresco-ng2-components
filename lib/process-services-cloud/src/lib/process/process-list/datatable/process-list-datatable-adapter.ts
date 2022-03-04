import { DataColumn, DataRow, ObjectDataTableAdapter } from '@alfresco/adf-core';
import { ProcessListDataColumnCustomData, PROCESS_LIST_CUSTOM_VARIABLE_COLUMN } from '../../../models/data-column-custom-data';
import { ProcessInstanceCloudListViewModel } from '../models/perocess-instance-cloud-view.model';

export class ProcessListDatatableAdapter extends ObjectDataTableAdapter {
    constructor(
        data: ProcessInstanceCloudListViewModel[],
        schema: DataColumn<ProcessListDataColumnCustomData>[]
    ) {
        super(data, schema);
    }

    getColumnType(row: DataRow, col: DataColumn<ProcessListDataColumnCustomData>): string {
        if (col.customData?.columnType === PROCESS_LIST_CUSTOM_VARIABLE_COLUMN) {
            const variableDisplayName = col.title;
            const columnType = row.obj.variablesMap?.[variableDisplayName]?.type;
            return columnType ?? 'text';
        }

        return super.getColumnType(row, col);
    }
}
