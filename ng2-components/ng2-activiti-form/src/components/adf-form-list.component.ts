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

import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { LogService } from 'ng2-alfresco-core';
import { FormService } from './../services/form.service';

@Component({
    selector: 'adf-form-list',
    templateUrl: './adf-form-list.component.html',
    styleUrls: ['./adf-form-list.component.css']
})
export class ADFFormList implements OnInit, OnChanges {

    @Input()
    forms: any [] = [];

    @Output()
    formClick = new EventEmitter();

    constructor(protected formService: FormService,
                private logService: LogService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.getForms();
    }

    ngOnInit() {
        this.getForms();
    }

    isEmpty(): boolean {
        return this.forms && this.forms.length === 0;
    }

    getForms(){
        this.formService.getForms().subscribe((forms)=> {
            this.forms = [...this.forms, ...forms];
        });
    }

    addForm(form) {
        this.forms = [...this.forms, ...form];
    }

}
