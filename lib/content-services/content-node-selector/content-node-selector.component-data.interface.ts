/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

export interface ContentNodeSelectorComponentData {
    title: string;
    actionName?: string;
    currentFolderId: string;
    dropdownHideMyFiles?: boolean;
    dropdownSiteList?: SitePaging;
    rowFilter?: any;
    imageResolver?: any;
    isSelectionValid?: (entry: Node) => boolean;
    breadcrumbTransform?: (node) => any;
    excludeSiteContent?: string[];
    select: Subject<Node[]>;
    modifier?: string;
}
