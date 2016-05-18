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

import {Component} from 'angular2/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import {
    ALFRESCO_DATATABLE_DIRECTIVES,
    ALFRESCO_DATATABLE_PROVIDERS
} from 'ng2-alfresco-datatable/ng2-alfresco-datatable';

declare let __moduleName:string;

@Component({
    moduleId: __moduleName,
    selector: 'datatable-demo',
    templateUrl: './datatable-demo.component.html',
    directives: [ALFRESCO_DATATABLE_DIRECTIVES],
    providers: [ALFRESCO_DATATABLE_PROVIDERS],
    pipes: [TranslatePipe]
})
export class DataTableDemoComponent {
    
}
