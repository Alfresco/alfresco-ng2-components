import {
    AppDefinitionRepresentation,
    LightUserRepresentation,
    ProcessInstanceRepresentation,
    UserRepresentation,
    UserTaskFilterRepresentation
} from '@alfresco/js-api';

/** @deprecated use js-api/ProcessInstanceRepresentation instead */
export type ProcessInstance = ProcessInstanceRepresentation;

/** @deprecated use js-api/UserTaskFilterRepresentation instead */
export type FilterRepresentationModel = UserTaskFilterRepresentation;

/** @deprecated use js-api/UserTaskFilterRepresentation instead */
export type FilterParamsModel = UserTaskFilterRepresentation;

/** @deprecated use js-api/UserRepresentation instead */
export type BpmUserModel = UserRepresentation;

/** @deprecated use js-api/AppDefinitionRepresentation instead */
export type AppDefinitionRepresentationModel = AppDefinitionRepresentation;

/** @deprecated use js-api/LightUserRepresentation instead */
export type UserProcessModel = LightUserRepresentation;
