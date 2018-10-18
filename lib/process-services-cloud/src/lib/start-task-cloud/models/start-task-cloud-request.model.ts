export class StartTaskCloudRequestModel {

    name: string;
    description: string;
    formKey: string;
    assignee: string;
    priority: string;
    dueDate: Date;
    payloadType: string;

    constructor(obj?: any) {
        if (obj) {
            this.name = obj.name || null;
            this.description = obj.description || null;
            this.formKey = obj.formKey || null;
            this.assignee = obj.assignee || null;
            this.priority = obj.priority || null;
            this.dueDate = obj.dueDate || null;
            this.payloadType = 'CreateTaskPayload';
        }
    }
}
