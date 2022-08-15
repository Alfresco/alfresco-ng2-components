import { DataColumn } from '../datatable/data/data-column.model';

export const getDataColumnMock = <T = unknown>(column: Partial<DataColumn<T>> = {}): DataColumn<T> => ({
    id: 'columnId',
    key: 'key',
    type: 'text',
    format: 'format',
    sortable: false,
    title: 'title',
    srTitle: 'srTitle',
    cssClass: 'cssClass',
    template: undefined,
    copyContent: false,
    editable: false,
    focus: false,
    sortingKey: 'sortingKey',
    header: undefined,
    draggable: false,
    isHidden: false,
    customData: undefined,
    ...column
});
