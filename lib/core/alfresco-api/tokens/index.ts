import {
    AboutApi,
    ActionsApi,
    ActivitiCommentsApi,
    ActivitiContentApi,
    ActivitiGroupsApi,
    AlfrescoApi,
    AspectsApi,
    AuditApi,
    AuthenticationApi,
    ChecklistsApi,
    ClassesApi,
    CommentsApi,
    ContentApi,
    CustomModelApi,
    DiscoveryApi,
    DownloadsApi,
    FavoritesApi,
    FilesApi,
    FormModelsApi,
    GroupsApi,
    IntegrationAlfrescoOnPremiseApi,
    ModelJsonBpmnApi,
    ModelsApi,
    NodesApi,
    PeopleApi,
    ProcessDefinitionsApi,
    ProcessInstancesApi,
    ProcessInstanceVariablesApi,
    QueriesApi,
    RatingsApi,
    RecordsApi,
    RenditionsApi,
    ReportApi,
    RuntimeAppDefinitionsApi,
    ScriptFilesApi,
    SearchApi,
    SecurityGroupsApi,
    SecurityMarksApi,
    SharedlinksApi,
    SitesApi,
    SystemPropertiesApi,
    TagsApi,
    TaskActionsApi,
    TaskFormsApi,
    TasksApi,
    TrashcanApi,
    TypesApi,
    UploadApi,
    UserFiltersApi,
    UserProfileApi,
    UsersApi,
    VersionsApi,
    WebscriptApi
} from '@alfresco/js-api';
import { InjectionToken } from '@angular/core';
import { ApiFactory } from '../api-factory.interface';

export type AboutApiFactory = ApiFactory<AboutApi>;
export const ABOUT_API_FACTORY_TOKEN = new InjectionToken<AboutApiFactory>('about-api-factory-token');

export type ActionsApiFactory = ApiFactory<ActionsApi>;
export const ACTIONS_API_FACTORY_TOKEN = new InjectionToken<ActionsApiFactory>('actions-api-factory-token');

export type ActivitiCommentsApiFactory = ApiFactory<ActivitiCommentsApi>;
export const ACTIVITI_COMMENTS_API_FACTORY_TOKEN = new InjectionToken<ActivitiCommentsApiFactory>('activiti-comments-api-factory-token');

export type ActivitiContentApiFactory = ApiFactory<ActivitiContentApi>;
export const ACTIVITI_CONTENT_API_FACTORY_TOKEN = new InjectionToken<ActivitiContentApiFactory>('activiti-content-api-factory-token');

export type ActivitiGroupsApiFactory = ApiFactory<ActivitiGroupsApi>;
export const ACTIVITI_GROUPS_API_FACTORY_TOKEN = new InjectionToken<ActivitiGroupsApiFactory>('activiti-groups-api-factory-token');

export type AlfrescoApiFactory = ApiFactory<AlfrescoApi>;
export const ALFRESCO_API_FACTORY_TOKEN = new InjectionToken<AlfrescoApiFactory>('alfresco-api-factory-token');

export type AspectsApiFactory = ApiFactory<AspectsApi>;
export const ASPECTS_API_FACTORY_TOKEN = new InjectionToken<AspectsApiFactory>('aspects-api-factory-token');

export type AuditApiFactory = ApiFactory<AuditApi>;
export const AUDIT_API_FACTORY_TOKEN = new InjectionToken<AuditApiFactory>('audit-api-factory-token');

export type AuthenticationApiFactory = ApiFactory<AuthenticationApi>;
export const AUTHENTICATION_API_FACTORY_TOKEN = new InjectionToken<AuthenticationApiFactory>('authentication-api-factory-token');

export type ChecklistsApiFactory = ApiFactory<ChecklistsApi>;
export const CHECKLISTS_API_FACTORY_TOKEN = new InjectionToken<ChecklistsApiFactory>('checklists-api-factory-token');

export type ClassesApiFactory = ApiFactory<ClassesApi>;
export const CLASSES_API_FACTORY_TOKEN = new InjectionToken<ClassesApiFactory>('classes-api-factory-token');

export type CommentsApiFactory = ApiFactory<CommentsApi>;
export const COMMENTS_API_FACTORY_TOKEN = new InjectionToken<CommentsApiFactory>('comments-api-factory-token');

export type ContentApiFactory = ApiFactory<ContentApi>;
export const CONTENT_API_FACTORY_TOKEN = new InjectionToken<ContentApiFactory>('content-api-factory-token');

export type CustomModelApiFactory = ApiFactory<CustomModelApi>;
export const CUSTOM_MODEL_API_FACTORY_TOKEN = new InjectionToken<CustomModelApiFactory>('custom-model-api-factory-token');

export type DiscoveryApiFactory = ApiFactory<DiscoveryApi>;
export const DISCOVERY_API_FACTORY_TOKEN = new InjectionToken<DiscoveryApiFactory>('discovery-api-factory-token');

export type DownloadsApiFactory = ApiFactory<DownloadsApi>;
export const DOWNLOADS_API_FACTORY_TOKEN = new InjectionToken<DownloadsApiFactory>('downloads-api-factory-token');

export type FavoritesApiFactory = ApiFactory<FavoritesApi>;
export const FAVORITES_API_FACTORY_TOKEN = new InjectionToken<FavoritesApiFactory>('favorites-api-factory-token');

export type FilesApiFactory = ApiFactory<FilesApi>;
export const FILES_API_FACTORY_TOKEN = new InjectionToken<FilesApiFactory>('files-api-factory-token');

export type FormModelsApiFactory = ApiFactory<FormModelsApi>;
export const FORM_MODELS_API_FACTORY_TOKEN = new InjectionToken<FormModelsApiFactory>('form-models-api-factory-token');

export type GroupsApiFactory = ApiFactory<GroupsApi>;
export const GROUPS_API_FACTORY_TOKEN = new InjectionToken<GroupsApiFactory>('groups-api-factory-token');

export type IntegrationAlfrescoOnPremiseApiFactory = ApiFactory<IntegrationAlfrescoOnPremiseApi>;
export const INTEGRATION_ALFRESCO_ON_PREMISE_API_FACTORY_TOKEN = new InjectionToken<IntegrationAlfrescoOnPremiseApiFactory> ('integration-alfresco-on-premise-api-factory-token');

export type ModelJsonBpmnApiFactory = ApiFactory<ModelJsonBpmnApi>;
export const MODEL_JSON_BPMN_API_FACTORY_TOKEN = new InjectionToken<ModelJsonBpmnApiFactory>('model-json-bpmn-api-factory-token');

export type ModelsApiFactory = ApiFactory<ModelsApi>;
export const MODELS_API_FACTORY_TOKEN = new InjectionToken<ModelsApiFactory>('models-api-factory-token');

export type NodesApiFactory = ApiFactory<NodesApi>;
export const NODES_API_FACTORY_TOKEN = new InjectionToken<NodesApiFactory>('nodes-api-factory-token');

export type PeopleApiFactory = ApiFactory<PeopleApi>;
export const PEOPLE_API_FACTORY_TOKEN = new InjectionToken<PeopleApiFactory>('people-api-factory-token');

export type ProcessDefinitionsApiFactory = ApiFactory<ProcessDefinitionsApi>;
export const PROCESS_DEFINITIONS_API_FACTORY_TOKEN = new InjectionToken<ProcessDefinitionsApiFactory>('process-definitions-api-factory-token');

export type ProcessInstancesApiFactory = ApiFactory<ProcessInstancesApi>;
export const PROCESS_INSTANCES_API_FACTORY_TOKEN = new InjectionToken<ProcessInstancesApiFactory>('process-instances-api-factory-token');

export type ProcessInstanceVariablesApiFactory = ApiFactory<ProcessInstanceVariablesApi>;
export const PROCESS_INSTANCE_VARIABLES_API_FACTORY_TOKEN = new InjectionToken<ProcessInstanceVariablesApiFactory>('process-instance-variables-api-factory-token');

export type QueriesApiFactory = ApiFactory<QueriesApi>;
export const QUERIES_API_FACTORY_TOKEN = new InjectionToken<QueriesApiFactory>('queries-api-factory-token');

export type RatingsApiFactory = ApiFactory<RatingsApi>;
export const RATINGS_API_FACTORY_TOKEN = new InjectionToken<RatingsApiFactory>('ratings-api-factory-token');

export type RecordsApiFactory = ApiFactory<RecordsApi>;
export const RECORDS_API_FACTORY_TOKEN = new InjectionToken<RecordsApiFactory>('records-api-factory-token');

export type RenditionsApiFactory = ApiFactory<RenditionsApi>;
export const RENDITIONS_API_FACTORY_TOKEN = new InjectionToken<RenditionsApiFactory>('renditions-api-factory-token');

export type ReportApiFactory = ApiFactory<ReportApi>;
export const REPORT_API_FACTORY_TOKEN = new InjectionToken<ReportApiFactory>('report-api-factory-token');

export type RuntimeAppDefinitionsApiFactory = ApiFactory<RuntimeAppDefinitionsApi>;
export const RUNTIME_APP_DEFINITIONS_API_FACTORY_TOKEN = new InjectionToken<RuntimeAppDefinitionsApiFactory>('runtime-app-definitions-api-factory-token');

export type ScriptFilesApiFactory = ApiFactory<ScriptFilesApi>;
export const SCRIPT_FILES_API_FACTORY_TOKEN = new InjectionToken<ScriptFilesApiFactory>('script-files-api-factory-token');

export type SearchApiFactory = ApiFactory<SearchApi>;
export const SEARCH_API_FACTORY_TOKEN = new InjectionToken<SearchApiFactory>('search-api-factory-token');

export type SecurityGroupsApiFactory = ApiFactory<SecurityGroupsApi>;
export const SECURITY_GROUPS_API_FACTORY_TOKEN = new InjectionToken<SecurityGroupsApiFactory>('security-groups-api-factory-token');

export type SecurityMarksApiFactory = ApiFactory<SecurityMarksApi>;
export const SECURITY_MARKS_API_FACTORY_TOKEN = new InjectionToken<SecurityMarksApiFactory>('security-marks-api-factory-token');

export type SharedlinksApiFactory = ApiFactory<SharedlinksApi>;
export const SHARED_LINKS_API_FACTORY_TOKEN = new InjectionToken<SharedlinksApiFactory>('shared-links-api-factory-token');

export type SitesApiFactory = ApiFactory<SitesApi>;
export const SITES_API_FACTORY_TOKEN = new InjectionToken<SitesApiFactory>('sites-api-factory-token');

export type SystemPropertiesApiFactory = ApiFactory<SystemPropertiesApi>;
export const SYSTEM_PROPERTIES_API_FACTORY_TOKEN = new InjectionToken<SystemPropertiesApiFactory>('system-properties-api-factory-token');

export type TagsApiFactory = ApiFactory<TagsApi>;
export const TAGS_API_FACTORY_TOKEN = new InjectionToken<TagsApiFactory>('tags-api-factory-token');

export type TaskActionsApiFactory = ApiFactory<TaskActionsApi>;
export const TASK_ACTIONS_API_FACTORY_TOKEN = new InjectionToken<TaskActionsApiFactory>('task-actions-api-factory-token');

export type TaskFormsApiFactory = ApiFactory<TaskFormsApi>;
export const TASK_FORMS_API_FACTORY_TOKEN = new InjectionToken<TaskFormsApiFactory>('task-forms-api-factory-token');

export type TasksApiFactory = ApiFactory<TasksApi>;
export const TASKS_API_FACTORY_TOKEN = new InjectionToken<TasksApiFactory>('tasks-api-factory-token');

export type TrashcanApiFactory = ApiFactory<TrashcanApi>;
export const TRASHCAN_API_FACTORY_TOKEN = new InjectionToken<TrashcanApiFactory>('trashcan-api-factory-token');

export type TypesApiFactory = ApiFactory<TypesApi>;
export const TYPES_API_FACTORY_TOKEN = new InjectionToken<TypesApiFactory>('types-api-factory-token');

export type UploadApiFactory = ApiFactory<UploadApi>;
export const UPLOAD_API_FACTORY_TOKEN = new InjectionToken<UploadApiFactory>('upload-api-factory-token');

export type UserFiltersApiFactory = ApiFactory<UserFiltersApi>;
export const USER_FILTERS_API_FACTORY_TOKEN = new InjectionToken<UserFiltersApiFactory>('user-filters-api-factory-token');

export type UserProfileApiFactory = ApiFactory<UserProfileApi>;
export const USER_PROFILE_API_FACTORY_TOKEN = new InjectionToken<UserProfileApiFactory>('user-profile-api-factory-token');

export type UsersApiFactory = ApiFactory<UsersApi>;
export const USERS_API_FACTORY_TOKEN = new InjectionToken<UsersApiFactory>('users-api-factory-token');

export type VersionsApiFactory = ApiFactory<VersionsApi>;
export const VERSIONS_API_FACTORY_TOKEN = new InjectionToken<VersionsApiFactory>('versions-api-factory-token');

export type WebscriptApiFactory = ApiFactory<WebscriptApi>;
export const WEBSCRIPT_API_FACTORY_TOKEN = new InjectionToken<WebscriptApiFactory>('webscript-api-factory-token');
