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
import { ObjectDataTableAdapter } from 'ng2-alfresco-datatable';

@Component({
    selector: 'about-page',
    templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {

    data: ObjectDataTableAdapter;

    constructor(private http: Http) {
    }

    ngOnInit() {
        this.http.get('/versions.json').subscribe(response => {
            var regexp = new RegExp("^(ng2-activiti|ng2-alfresco|alfresco-)", 'g');

            var alfrescoPackages = Object.keys(response.json().dependencies).filter(function (val) {
                console.log(val);
                return regexp.test(val);
            });

            let  alfrescoPackagesTableRappresentation = [];
            alfrescoPackages.forEach((val)=> {
                console.log(response.json().dependencies[val]);
                alfrescoPackagesTableRappresentation.push({name:val,version:response.json().dependencies[val].version});
            });

            console.log(alfrescoPackagesTableRappresentation);

            this.data = new ObjectDataTableAdapter(alfrescoPackagesTableRappresentation, [
                {type: 'text', key: 'name', title: 'Name', sortable: true},
                {type: 'text', key: 'version', title: 'Version', sortable: true}
            ]);
        });

    }
}
