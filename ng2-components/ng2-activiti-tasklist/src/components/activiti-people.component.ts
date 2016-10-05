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

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlfrescoTranslationService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { User } from '../models/user.model';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

declare let componentHandler: any;

@Component({
    selector: 'activiti-people',
    moduleId: module.id,
    templateUrl: './activiti-people.component.html',
    styleUrls: ['./activiti-people.component.css']
})
export class ActivitiPeople implements OnInit {

    @Input()
    people: User [] = [];

    @ViewChild('dialog')
    dialog: any;

    private peopleObserver: Observer<User>;
    people$: Observable<User>;

    /**
     * Constructor
     * @param auth
     * @param translate
     */
    constructor(private auth: AlfrescoAuthenticationService,
                private translate: AlfrescoTranslationService) {

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-tasklist/src');
        }
        this.people$ = new Observable<User>(observer =>  this.peopleObserver = observer).share();
    }

    ngOnInit() {
        this.people$.subscribe((user: User) => {
            this.people.push(user);
        });
    }

    public showDialog() {
        if (this.dialog) {
            this.dialog.nativeElement.showModal();
        }
    }

    public add() {
        alert('add people');

        this.cancel();
    }

    public cancel() {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
    }

}
