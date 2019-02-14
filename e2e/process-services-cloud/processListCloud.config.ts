export class ProcessListCloudConfiguration {

    constructor() {
    }

    getConfiguration() {
        return {
    "presets": {
    "default": [
        {
            "key": "entry.id",
            "type": "text",
            "title": "ADF_CLOUD_PROCESS_LIST.PROPERTIES.ID",
            "sortable": true
        },
        {
            "key": "entry.name",
            "type": "text",
            "title": "ADF_CLOUD_PROCESS_LIST.PROPERTIES.NAME",
            "sortable": true
        },
        {
            "key": "entry.status",
            "type": "text",
            "title": "ADF_CLOUD_PROCESS_LIST.PROPERTIES.STATUS",
            "sortable": true
        },
        {
            "key": "entry.startDate",
            "type": "date",
            "title": "ADF_CLOUD_PROCESS_LIST.PROPERTIES.START_DATE",
            "sortable": true,
            "format": "timeAgo"
        },
        {
            "key": "entry.appName",
            "type": "text",
            "title": "ADF_CLOUD_PROCESS_LIST.PROPERTIES.APP_NAME",
            "sortable": true
        },
        {
            "key": "entry.businessKey",
            "type": "text",
            "title": "ADF_CLOUD_PROCESS_LIST.PROPERTIES.BUSINESS_KEY",
            "sortable": true
        },
        {
            "key": "entry.description",
            "type": "text",
            "title": "ADF_CLOUD_PROCESS_LIST.PROPERTIES.DESCRIPTION",
            "sortable": true
        },
        {
            "key": "entry.initiator",
            "type": "text",
            "title": "ADF_CLOUD_PROCESS_LIST.PROPERTIES.INITIATOR",
            "sortable": true
        },
        {
            "key": "entry.lastModified",
            "type": "date",
            "title": "ADF_CLOUD_PROCESS_LIST.PROPERTIES.LAST_MODIFIED",
            "sortable": true
        },
        {
            "key": "entry.processName",
            "type": "text",
            "title": "ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_NAME",
            "sortable": true
        },
        {
            "key": "entry.processId",
            "type": "text",
            "title": "ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_ID",
            "sortable": true
        },
        {
            "key": "entry.processDefinitionId",
            "type": "text",
            "title": "ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_DEFINITION_ID",
            "sortable": true
        },
        {
            "key": "entry.processDefinitionKey",
            "type": "text",
            "title": "ADF_CLOUD_PROCESS_LIST.PROPERTIES.PROCESS_DEFINITION_KEY",
            "sortable": true
        }
    ]
    }
};
    }
}
