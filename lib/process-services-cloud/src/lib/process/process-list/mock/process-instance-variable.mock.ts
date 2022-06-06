import { ProcessInstanceVariable } from '../../../models/process-instance-variable.model';

export const getProcessInstanceVariableMock = (variable: Partial<ProcessInstanceVariable> = {}): ProcessInstanceVariable => ({
    id: 1,
    variableDefinitionId: 'variableDefinitionId',
    value: 'value',
    appName: 'appName',
    createTime: 'createTime',
    lastUpdatedTime: 'lastUpdatedTime',
    markedAsDeleted: false,
    name: 'name',
    processInstanceId: 'processInstanceId',
    serviceFullName: 'serviceFullName',
    serviceName: 'serviceName',
    serviceVersion: 'serviceVersion',
    taskVariable: false,
    type: 'text',
    ...variable
});
