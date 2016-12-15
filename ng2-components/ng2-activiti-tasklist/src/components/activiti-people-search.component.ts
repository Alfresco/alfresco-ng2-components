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

import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from '../models/user.model';
import { Observable } from 'rxjs/Observable';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';

declare let componentHandler: any;

@Component({
    selector: 'activiti-people-search',
    moduleId: module.id,
    templateUrl: './activiti-people-search.component.html',
    styleUrls: ['./activiti-people-search.component.css']
})

export class ActivitiPeopleSearch implements OnInit, AfterViewInit {

    @Input()
    results: Observable<User[]>;

    @Output()
    onSearch: EventEmitter<any> = new EventEmitter();

    @Output()
    onRowClicked: EventEmitter<any> = new EventEmitter();

    searchUser: FormControl = new FormControl();

    userList: User[] = [];

    constructor(private translate: AlfrescoTranslationService) {
        if (translate) {
            translate.addTranslationFolder('ng2-activiti-tasklist', 'node_modules/ng2-activiti-tasklist/src');
        }

        this.searchUser
            .valueChanges
            .debounceTime(200)
            .subscribe((event) => {
                this.onSearch.emit(event);
            });
    }

    ngOnInit() {
        this.results.subscribe((list) => {
            this.userList = list;
        });
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

    onRowClick(userClicked: User) {
        this.onRowClicked.emit(userClicked);
        this.userList = this.userList.filter((user) => {
            return user.id !== userClicked.id;
        });
    }

    getDisplayUser(user: User): string {
        let firstName = user.firstName && user.firstName !== 'null' ? user.firstName : 'N/A';
        let lastName =  user.lastName && user.lastName !== 'null' ? user.lastName : 'N/A';
        return firstName + ' - ' + lastName;
    }
}
