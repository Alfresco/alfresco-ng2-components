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

import { ViewerComponent } from './src/componets/viewer.component';
import { RenderingQueueServices } from './src/services/rendering-queue.services';

/**
 * ng2-alfresco-viewer, provide components to view files.
 *
 * Components provided:
 *           <alfresco-viewer [urlFile]="'localTestFile.pdf'">
 *              <div class="mdl-spinner mdl-js-spinner is-active"></div>
 *          </alfresco-viewer>
 */

export * from './src/componets/viewer.component';
export * from './src/services/rendering-queue.services';

export default {
    components: [ViewerComponent],
    directives: [RenderingQueueServices]
};

export const VIEWERCOMPONENT: [any] = [
    ViewerComponent
];

export const ALFRESCO_VIEWER_SERVICES: [any] = [
    RenderingQueueServices
];
