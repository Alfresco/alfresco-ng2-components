/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
    selector: 'app-show-diagram',
    templateUrl: './show-diagram.component.html',
    styleUrls: ['./show-diagram.component.css']
})
export class ShowDiagramComponent {

    processDefinitionId: string;
    appId: string;

    constructor(private route: ActivatedRoute,
                private router: Router) {
        this.route.params.subscribe((params: Params) => {
            this.processDefinitionId = params['processDefinitionId'];
            this.appId = params['appId'];
        });
    }

    onClickBack() {
        this.router.navigate(['/activiti/apps/' + this.appId + '/processes']);
    }

}
