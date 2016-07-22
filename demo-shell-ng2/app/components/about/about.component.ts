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

import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import {
    ALFRESCO_DATATABLE_DIRECTIVES,
    ObjectDataTableAdapter /*,
    DataSorting,
    ObjectDataRow,
    ObjectDataColumn*/
} from 'ng2-alfresco-datatable';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'about-page',
    templateUrl: './about.component.html',
    directives: [ALFRESCO_DATATABLE_DIRECTIVES]
})
export class AboutComponent implements OnInit {

    data: ObjectDataTableAdapter;

    constructor(private http: Http) {}

    ngOnInit() {
        // this.data = new ObjectDataTableAdapter();
        this.http.get('/versions').subscribe(response => {
            let data = response.json() || {};
            let packages = data.packages || [];

            this.data = new ObjectDataTableAdapter(packages, [
                { type: 'text', key: 'name', title: 'Name', sortable: true },
                { type: 'text', key: 'version', title: 'Version', sortable: true }
            ]);
        });

    }
}
