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

import { Component, Input, ViewChild } from '@angular/core';
import { Observer, Observable } from 'rxjs/Rx';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { User } from '../models/user.model';
import { ActivitiPeopleService } from '../services/activiti-people.service';

declare let dialogPolyfill: any;

@Component({
    selector: 'activiti-people',
    moduleId: module.id,
    templateUrl: './activiti-people.component.html',
    styleUrls: ['./activiti-people.component.css']
})
export class ActivitiPeople {

    baseComponentPath = module.id.replace('/activiti-people.component.js', '');

    @Input()
    iconImageUrl: string;

    @Input()
    people: User [] = [];

    @Input()
    taskId: string = '';

    @Input()
    readOnly: boolean = false;

    @ViewChild('dialog')
    dialog: any;

    @ViewChild('activitipeoplesearch')
    activitipeoplesearch: any;

    private peopleSearchObserver: Observer<User[]>;
    peopleSearch$: Observable<User[]>;

    /**
     * Constructor
     * @param translate
     * @param people service
     */
    constructor(private translateService: AlfrescoTranslationService,
                private peopleService: ActivitiPeopleService,
                private logService: LogService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'node_modules/ng2-activiti-tasklist/src');
        }
        this.peopleSearch$ = new Observable<User[]>(observer => this.peopleSearchObserver = observer).share();
    }

    public showDialog() {
        if (!this.dialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(this.dialog.nativeElement);
        }
        if (this.dialog) {
            this.dialog.nativeElement.showModal();
        }
    }

    public closeDialog() {
        if (this.dialog) {
            this.dialog.nativeElement.close();
            this.peopleSearchObserver.next([]);
            this.activitipeoplesearch.searchUser.reset();
        }
    }

    searchUser(searchedWord: string) {
        this.peopleService.getWorkflowUsers(this.taskId, searchedWord)
            .subscribe((users) => {
                this.peopleSearchObserver.next(users);
            }, error => this.logService.error('Could not load users'));
    }

    involveUser(user: User) {
        this.peopleService.involveUserWithTask(this.taskId, user.id.toString())
            .subscribe(() => {
                this.people.push(user);
            }, error => this.logService.error('Impossible to involve user with task'));
    }

    removeInvolvedUser(user: User) {
        this.peopleService.removeInvolvedUser(this.taskId, user.id.toString())
            .subscribe(() => {
                this.people = this.people.filter((involvedUser) => {
                    return involvedUser.id !== user.id;
                });
            }, error => this.logService.error('Impossible to remove involved user from task'));
    }

    getDisplayUser(user: User): string {
        let firstName = user.firstName && user.firstName !== 'null' ? user.firstName : 'N/A';
        let lastName =  user.lastName && user.lastName !== 'null' ? user.lastName : 'N/A';
        return firstName + ' ' + lastName;
    }

}
