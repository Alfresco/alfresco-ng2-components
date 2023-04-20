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

import { Node, SitePaging } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { NodeAction } from '../document-list/models/node-action.enum';

export interface ContentNodeSelectorComponentData {
    title: string;
    actionName?: NodeAction;
    currentFolderId: string;
    dropdownHideMyFiles?: boolean;
    restrictRootToCurrentFolderId?: boolean;
    dropdownSiteList?: SitePaging;
    rowFilter?: any;
    where?: string;
    imageResolver?: any;
    selectionMode?: 'multiple' | 'single';
    isSelectionValid?: (entry: Node) => boolean;
    breadcrumbTransform?: (node) => any;
    excludeSiteContent?: string[];
    select: Subject<Node[]>;
    showSearch?: boolean;
    showFilesInResult?: boolean;
    showDropdownSiteList?: boolean;
    showLocalUploadButton?: boolean;
    multipleUpload?: boolean;
}
