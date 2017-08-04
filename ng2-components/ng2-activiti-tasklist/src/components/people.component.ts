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

import { AfterViewInit, Component, Input } from '@angular/core';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { Observable, Observer } from 'rxjs/Rx';
import { UserEventModel } from '../models/user-event.model';
import { User } from '../models/user.model';

import { PeopleService } from '../services/people.service';

declare let componentHandler: any;
declare var require: any;

@Component({
    selector: 'adf-people, activiti-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.css']
})
export class PeopleComponent implements AfterViewInit {

    @Input()
    iconImageUrl: string = require('../assets/images/user.jpg');

    @Input()
    people: User [] = [];

    @Input()
    taskId: string = '';

    @Input()
    readOnly: boolean = false;

    showAssignment: boolean = false;

    private peopleSearchObserver: Observer<User[]>;
    peopleSearch$: Observable<User[]>;

    /**
     * Constructor
     * @param translate
     * @param people service
     */
    constructor(translateService: AlfrescoTranslationService,
                private peopleService: PeopleService,
                private logService: LogService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'assets/ng2-activiti-tasklist');
        }
        this.peopleSearch$ = new Observable<User[]>(observer => this.peopleSearchObserver = observer).share();
    }

    ngAfterViewInit() {
        this.setupMaterialComponents(componentHandler);
    }

    setupMaterialComponents(handler?: any): boolean {
        // workaround for MDL issues with dynamic components
        let isUpgraded: boolean = false;
        if (handler) {
            handler.upgradeAllRegistered();
            isUpgraded = true;
        }
        return isUpgraded;
    }

    searchUser(searchedWord: string) {
        this.peopleService.getWorkflowUsers(this.taskId, searchedWord)
            .subscribe((users) => {
                this.peopleSearchObserver.next(users);
            },         error => this.logService.error('Could not load users'));
    }

    involveUser(user: User) {
        this.showAssignment = false;
        this.peopleService.involveUserWithTask(this.taskId, user.id.toString())
            .subscribe(() => {
                this.people = [...this.people, user];
            },         error => this.logService.error('Impossible to involve user with task'));
    }

    removeInvolvedUser(user: User) {
        this.peopleService.removeInvolvedUser(this.taskId, user.id.toString())
            .subscribe(() => {
                this.people = this.people.filter((involvedUser) => {
                    return involvedUser.id !== user.id;
                });
            },         error => this.logService.error('Impossible to remove involved user from task'));
    }

    getDisplayUser(firstName: string, lastName: string, delimiter: string = '-'): string {
        firstName = (firstName !== null ? firstName : '');
        lastName = (lastName !== null ? lastName : '');
        return firstName + delimiter + lastName;
    }

    getInitialUserName(firstName: string, lastName: string) {
        firstName = (firstName !== null && firstName !== '' ? firstName[0] : '');
        lastName = (lastName !== null && lastName !== '' ? lastName[0] : '');
        return this.getDisplayUser(firstName, lastName, '');
    }

    onAddAssignement() {
        this.showAssignment = true;
    }

    onClickAction(event: UserEventModel) {
        if (event.type === 'remove') {
            this.removeInvolvedUser(event.value);
        }
    }

    hasPeople() {
        return this.people && this.people.length > 0;
    }

    isEditMode() {
        return !this.readOnly;
    }

    onCloseSearch() {
        this.showAssignment = false;
    }

}
