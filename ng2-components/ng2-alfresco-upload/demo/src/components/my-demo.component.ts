///<reference path="../../node_modules/angular2/typings/browser.d.ts"/>

/**
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

import { Component } from 'angular2/core';
import { ALFRESCO_ULPOAD_COMPONENT } from 'ng2-alfresco-upload/dist/ng2-alfresco-upload';

@Component({
    selector: 'my-demo',
    template: `<alfresco-upload-button [showDialogUpload]="true"
                                       [showUdoNotificationBar]="true"
                                       [uploadFolders]="false"
                                       [multipleFiles]="false">
               </alfresco-upload-button>`,
    directives: [ALFRESCO_ULPOAD_COMPONENT]
})
export class MyDemoComponent {

}
