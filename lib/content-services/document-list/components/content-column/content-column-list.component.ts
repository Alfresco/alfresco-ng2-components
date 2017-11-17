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

 /* tslint:disable:component-selector  */

import { DataColumn } from '@alfresco/adf-core';
import { LogService } from '@alfresco/adf-core';
import { Component } from '@angular/core';

import { DocumentListComponent } from './../document-list.component';

@Component({
    selector: 'content-columns',
    template: ''
})
export class ContentColumnListComponent {

    constructor(private documentList: DocumentListComponent, private logService: LogService ) {
        this.logService.log('ContentColumnListComponent is deprecated starting with 1.7.0 and may be removed in future versions. Use DataColumnListComponent instead.');
    }

    /**
     * Registers column model within the parent document list component.
     * @param column Column definition model to register.
     */
    registerColumn(column: DataColumn): boolean {
        if (this.documentList && column) {
            let columns = this.documentList.data.getColumns();
            columns.push(column);
            return true;
        }
        return false;
    }
}
