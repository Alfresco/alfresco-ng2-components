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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

declare var componentHandler;

@Component({
    selector: 'form-viewer',
    templateUrl: './form-viewer.component.html',
    styleUrls: ['./form-viewer.component.css']
})
export class FormViewerComponent implements OnInit, OnDestroy {

    taskId: string;

    private sub: Subscription;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.taskId = params['id'];
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
