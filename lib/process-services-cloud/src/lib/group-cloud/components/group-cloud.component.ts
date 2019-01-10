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

import { Component, ElementRef, OnInit, Output, EventEmitter, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { GroupModel, GroupSearchParam } from '../models/group.model';
import { GroupCloudService } from '../services/group-cloud.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged, switchMap, flatMap, mergeMap, filter, tap } from 'rxjs/operators';

@Component({
    selector: 'adf-cloud-group',
    templateUrl: './group-cloud.component.html',
    styleUrls: ['./group-cloud.component.scss'],
    animations: [
        trigger('transitionMessages', [
            state('enter', style({ opacity: 1, transform: 'translateY(0%)' })),
            transition('void => enter', [
                style({ opacity: 0, transform: 'translateY(-100%)' }),
                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')
            ])
        ])
    ],
    encapsulation: ViewEncapsulation.None
})
export class GroupCloudComponent implements OnInit {

    static MODE_SINGLE = 'single';
    static MODE_MULTIPLE = 'multiple';
    static NO_MATCH_FOUND = 'match';
    static NO_ROLE_MAPPING = 'rolemapping';

    @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;

    /** (required) Name of the app. */
    @Input()
    applicationName: string;

    /** Mode of the group selection (single/multiple) */
    @Input()
    mode: string = GroupCloudComponent.MODE_SINGLE;

    @Input()
    preSelectGroups: GroupModel[] = [];

    /** Emitted when a group is selected. */
    @Output()
    selectGroup: EventEmitter<GroupModel> = new EventEmitter<GroupModel>();

    /** Emitted when a group is removed. */
    @Output()
    removeGroup: EventEmitter<GroupModel> = new EventEmitter<GroupModel>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<boolean> = new EventEmitter<boolean>();

    private selectedGroups: GroupModel[] = [];

    private searchGroupsSubject: BehaviorSubject<GroupModel[]>;

    private selectedGroupsSubject: BehaviorSubject<GroupModel[]>;

    searchGroups$: Observable<GroupModel[]>;

    selectedGroups$: Observable<GroupModel[]>;

    searchGroupsControl: FormControl = new FormControl();

    _subscriptAnimationState = 'enter';

    applicationId: string;

    showHint = false;

    searchedValue = '';

    filtered = [];

    constructor(private groupService: GroupCloudService) {
        this.selectedGroupsSubject = new BehaviorSubject<GroupModel[]>(this.selectedGroups);
        this.searchGroupsSubject = new BehaviorSubject<GroupModel[]>(this.selectedGroups);
        this.selectedGroups$ = this.selectedGroupsSubject.asObservable();
        this.searchGroups$ = this.searchGroupsSubject.asObservable();
    }

    ngOnInit() {
        this.loadPreSelectGroups();
        this.initSearch();
    }

   private async initSearch() {
        this.applicationId = await this.groupService.getClientId(this.applicationName);
        this.search();
    }

    search() {
        this.searchGroupsControl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap(() => {
                this.filtered = [];
                this.searchGroupsSubject.next([]);
            }),
            switchMap((inputValue) => {
                const queryParams = this.createSearchParam(inputValue);
                return this.findGroupsByName(queryParams);
            }),
            mergeMap((group: any) => {
                return this.checkGroupHasClientRoleMapping(group);
            }),
            filter((filteredGroup) => filteredGroup.hasRole)
        ).subscribe((filteredGroup) => {
            this.filtered.push(filteredGroup.group);
            this.searchGroupsSubject.next(this.filtered);
        });
    }

    findGroupsByName(searchParam: GroupSearchParam): Observable<GroupModel> {
        return this.groupService.findGroupsByName(searchParam).pipe(
            flatMap((groups: GroupModel[]) => {
                this.searchedValue = searchParam.name;
                this.showHint = searchParam.name ? !this.hasGroups(groups) : false;
                return groups;
            })
        );
    }

    checkGroupHasClientRoleMapping(group: GroupModel): Observable<any> {
        if (this.isGroupAlreadySelected(group)) {
            return of();
        }
        return this.groupService.checkGroupHasClientRoleMapping(group.id, this.applicationId).pipe(
            mergeMap((hasRole: boolean) => {
                return of({ group, hasRole });
            })
        );
    }

    isGroupAlreadySelected(group: GroupModel): boolean {
        if (this.hasGroups(this.selectedGroups)) {
            const result = this.selectedGroups.filter((selectedGroup: GroupModel) => {
                return selectedGroup.id === group.id;
            });
            if (this.hasGroups(result)) {
                return true;
            }
        }
        return false;
    }

    private loadPreSelectGroups() {
        if (this.hasGroups(this.preSelectGroups)) {
            if (this.isMultipleMode()) {
                this.preSelectGroups.forEach((group: GroupModel) => {
                    this.selectedGroups.push(group);
                });
            } else {
                this.searchGroupsControl.setValue(this.preSelectGroups[0]);
                this.onSelect(this.preSelectGroups[0]);
            }
        }
    }

    onSelect(selectedGroup: GroupModel) {
        this.showHint = false;
        this.error.emit(this.showHint);
        if (this.isMultipleMode()) {
            if (!this.isGroupAlreadySelected(selectedGroup)) {
                this.selectedGroups.push(selectedGroup);
                this.selectedGroupsSubject.next(this.selectedGroups);
                this.selectGroup.emit(selectedGroup);
                this.searchGroupsSubject.next([]);
            }
            this.searchGroupsControl.setValue('');
        } else {
            this.selectGroup.emit(selectedGroup);
        }
    }

    onRemove(selectedGroup: GroupModel) {
        this.removeGroup.emit(selectedGroup);
        const indexToRemove = this.selectedGroups.findIndex((group: GroupModel) => { return group.id === selectedGroup.id; });
        this.selectedGroups.splice(indexToRemove, 1);
        this.selectedGroupsSubject.next(this.selectedGroups);
    }

    isMultipleMode(): boolean {
        return this.mode === GroupCloudComponent.MODE_MULTIPLE;
    }

    getDisplayName(group: GroupModel): string {
        return group ? group.name : '';
    }

    private hasGroups(groups: GroupModel[]): boolean {
        return groups && groups.length > 0;
    }

    createSearchParam(value: any): GroupSearchParam {
        let queryParams: GroupSearchParam = { name: '' };
        queryParams.name = this.isString(value) ? value.trim() : value.name.trim();
        return queryParams;
    }

    isString(value: any): boolean {
        return typeof value === 'string';
    }
}
