/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MinimalNodeEntryEntity, Version, NodeChildAssociation, Node } from '@alfresco/js-api';
import { NodeEntityEvent } from '../../document-list';

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
    newVersion: NodeEntityEvent;
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
