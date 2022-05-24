import { MinimalNodeEntryEntity, Version, NodeChildAssociation } from '@alfresco/js-api';

export interface NewVersionUploaderDialogData {
    title?: string;
    node: MinimalNodeEntryEntity;
    file?: File;
    currentVersion?: Version;
    showVersionsOnly?: boolean;
}

export type NewVersionUploaderData = VersionManagerUploadData | ViewVersion | RefreshData;

// eslint-disable-next-line no-shadow
export enum NewVersionUploaderDataAction {
    refresh = 'refresh',
    upload = 'upload',
    view = 'view'
}

interface BaseData {
    action: NewVersionUploaderDataAction;
}

export interface VersionManagerUploadData extends BaseData {
    action: NewVersionUploaderDataAction.upload;
    newVersion: Node;
    currentVersion: NodeChildAssociation;
}

export interface ViewVersion extends BaseData {
    action: NewVersionUploaderDataAction.view;
    versionId: string;
}

export interface RefreshData extends BaseData {
    action: NewVersionUploaderDataAction.refresh;
    node: Node;
}
