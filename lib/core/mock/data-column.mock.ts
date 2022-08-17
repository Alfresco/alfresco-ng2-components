import { ObjectDataTableAdapter } from '@alfresco/adf-core';
import { DataColumn } from '../datatable/data/data-column.model';

export const getDataColumnMock = <T = unknown>(
    column: Partial<DataColumn<T>> = {}
): DataColumn<T> => ({
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

export const dataText = new ObjectDataTableAdapter(
    [{ id: '1 first' }, { id: '2 second' }, { id: '3 third' }],
    []
);

export const dateRows = [
    { createdOn: new Date(2016, 6, 1, 11, 8, 4) },
    { createdOn: new Date(2018, 4, 3, 12, 8, 4) },
    { createdOn: new Date(2021, 2, 3, 9, 8, 4) }
];

export const dateColumns = {
    type: 'date',
    key: 'createdOn',
    title: 'Created On'
};

export const locationRows = [
    {
        path: {
            elements: [
                { id: '1', name: 'path' },
                { id: '2', name: 'to' },
                { id: '3', name: 'location' }
            ],
            name: '/path/to/location-link'
        }
    }
];

export const locationColumns = [
    { format: '/somewhere', type: 'location', key: 'path', title: 'Location' }
];

export const dataIcon = new ObjectDataTableAdapter(
    [{ icon: 'alarm' }, { icon: 'folder_open' }, { icon: 'accessibility' }],
    []
);

export const dataSizeInBytes = new ObjectDataTableAdapter(
    [{ size: 12313 }, { size: 23 }, { size: 42421412421 }],
    []
);
