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

import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

@Component({
    selector: 'activiti-show-diagram',
    templateUrl: './activiti-show-diagram.component.html',
    styleUrls: ['./activiti-show-diagram.component.css']
})
export class ActivitiShowDiagramComponent {

    sub: Subscription;
    processDefinitionId: string;

    constructor(private route: ActivatedRoute,
                private location: Location) {
        this.sub = this.route.params.subscribe(params => {
            this.processDefinitionId = params['processDefinitionId'];
        });

    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onClickBack() {
        this.location.back();
    }

}
