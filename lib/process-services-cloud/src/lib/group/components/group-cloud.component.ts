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

import {
    Component,
    ElementRef,
    OnInit,
    Output,
    EventEmitter,
    ViewChild,
    ViewEncapsulation,
    Input,
    SimpleChanges,
    OnChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { GroupModel, GroupSearchParam } from '../models/group.model';
import { GroupCloudService } from '../services/group-cloud.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged, switchMap, mergeMap, filter, tap, map } from 'rxjs/operators';

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
export class GroupCloudComponent implements OnInit, OnChanges {

    static MODE_SINGLE = 'single';
    static MODE_MULTIPLE = 'multiple';

    /** Name of the application. If specified this shows the users who have access to the app. */
    @Input()
    appName: string;

    /** Title of the field */
    @Input()
    title: string;

    /** User selection mode (single/multiple). */
    @Input()
    mode: string = GroupCloudComponent.MODE_SINGLE;

    /** Array of users to be pre-selected. This pre-selects all users in multi selection mode and only the first user of the array in single selection mode. */
    @Input()
    preSelectGroups: GroupModel[] = [];

    /** FormControl to search the group */
    @Input()
    searchGroupsControl: FormControl = new FormControl();

    /** Role names of the groups to be listed. */
    @Input()
    roles: string[] = [];

    /** Emitted when a group is selected. */
    @Output()
    selectGroup: EventEmitter<GroupModel> = new EventEmitter<GroupModel>();

    /** Emitted when a group is removed. */
    @Output()
    removeGroup: EventEmitter<GroupModel> = new EventEmitter<GroupModel>();

    @ViewChild('groupInput')
    private groupInput: ElementRef<HTMLInputElement>;

    private selectedGroups: GroupModel[] = [];

    private searchGroups: GroupModel[] = [];

    private searchGroupsSubject: BehaviorSubject<GroupModel[]>;

    private selectedGroupsSubject: BehaviorSubject<GroupModel[]>;

    searchGroups$: Observable<GroupModel[]>;

    selectedGroups$: Observable<GroupModel[]>;

    _subscriptAnimationState = 'enter';

    clientId: string;

    searchedValue = '';

    isFocused: boolean;

    isDisabled: boolean;

    constructor(private groupService: GroupCloudService) {
        this.selectedGroupsSubject = new BehaviorSubject<GroupModel[]>(this.selectedGroups);
        this.searchGroupsSubject = new BehaviorSubject<GroupModel[]>(this.searchGroups);
        this.selectedGroups$ = this.selectedGroupsSubject.asObservable();
        this.searchGroups$ = this.searchGroupsSubject.asObservable();
    }

    ngOnInit() {
        this.initSearch();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.preSelectGroups && this.hasPreSelectGroups()) {
            this.loadPreSelectGroups();
        }

        if (changes.appName && this.isAppNameChanged(changes.appName)) {
            this.disableSearch();
            this.loadClientId();
        } else {
            this.enableSearch();
        }
    }

    private isAppNameChanged(change) {
        return change.previousValue !== change.currentValue && this.appName && this.appName.length > 0;
    }

    private async loadClientId() {
        this.clientId = await this.groupService.getClientIdByApplicationName(this.appName).toPromise();
        if (this.clientId) {
            this.enableSearch();
        }
    }

    initSearch() {
        this.searchGroupsControl.valueChanges.pipe(
            filter((value) => {
                return typeof value === 'string';
            }),
            tap((value) => {
                this.searchedValue = value;
                if (value) {
                    this.setError();
                }
            }),
            debounceTime(500),
            distinctUntilChanged(),
            tap(() => {
                this.resetSearchGroups();
            }),
            switchMap((inputValue) => {
                const queryParams = this.createSearchParam(inputValue);
                return this.groupService.findGroupsByName(queryParams);
            }),
            mergeMap((groups) => {
                return groups;
            }),
            filter((group: any) => {
                return !this.isGroupAlreadySelected(group);
            }),
            mergeMap((group: any) => {
                if (this.appName) {
                    return this.checkGroupHasAccess(group.id).pipe(
                        mergeMap((hasRole) => {
                            return hasRole ? of(group) : of();
                        })
                    );
                } else if (this.hasRoles()) {
                    return this.filterGroupsByRoles(group);
                } else {
                    return of(group);
                }
            })
        ).subscribe((searchedGroup) => {
            this.searchGroups.push(searchedGroup);
            this.searchGroupsSubject.next(this.searchGroups);
        });
    }

    checkGroupHasAccess(groupId: string): Observable<boolean> {
        if (this.hasRoles()) {
            return this.groupService.checkGroupHasAnyClientAppRole(groupId, this.clientId, this.roles);
        } else {
            return this.groupService.checkGroupHasClientApp(groupId, this.clientId);
        }
    }

    isGroupAlreadySelected(group: GroupModel): boolean {
        const result = this.selectedGroups.find((selectedGroup: GroupModel) => {
            return selectedGroup.id === group.id;
        });

        return !!result;
    }

    private loadPreSelectGroups() {
        if (this.isMultipleMode()) {
            this.selectedGroups = [];
            this.preSelectGroups.forEach((group: GroupModel) => {
                this.selectedGroups.push(group);
            });
            this.selectedGroupsSubject.next(this.selectedGroups);
        } else {
            this.searchGroupsControl.setValue(this.preSelectGroups[0]);
            this.onSelect(this.preSelectGroups[0]);
        }
    }

    filterGroupsByRoles(group: GroupModel): Observable<GroupModel> {
        return this.groupService.checkGroupHasRole(group.id, this.roles).pipe(
            map((hasRole: boolean) => ({ hasRole: hasRole, group: group })),
            filter((filteredGroup: { hasRole: boolean, group: GroupModel }) => filteredGroup.hasRole),
            map((filteredGroup: { hasRole: boolean, group: GroupModel }) => filteredGroup.group));
    }

    onSelect(selectedGroup: GroupModel) {
        if (this.isMultipleMode()) {
            if (!this.isGroupAlreadySelected(selectedGroup)) {
                this.selectedGroups.push(selectedGroup);
                this.selectedGroupsSubject.next(this.selectedGroups);
                this.selectGroup.emit(selectedGroup);
                this.searchGroupsSubject.next([]);
            }
            this.groupInput.nativeElement.value = '';
            this.searchGroupsControl.setValue('');
        } else {
            this.selectGroup.emit(selectedGroup);
        }

        this.clearError();
        this.resetSearchGroups();
    }

    onRemove(selectedGroup: GroupModel) {
        this.removeGroup.emit(selectedGroup);
        const indexToRemove = this.selectedGroups.findIndex((group: GroupModel) => {
            return group.id === selectedGroup.id;
        });
        this.selectedGroups.splice(indexToRemove, 1);
        this.selectedGroupsSubject.next(this.selectedGroups);
    }

    private resetSearchGroups() {
        this.searchGroups = [];
        this.searchGroupsSubject.next([]);
    }

    isMultipleMode(): boolean {
        return this.mode === GroupCloudComponent.MODE_MULTIPLE;
    }

    getDisplayName(group: GroupModel): string {
        return group ? group.name : '';
    }

    private hasPreSelectGroups(): boolean {
        return this.preSelectGroups && this.preSelectGroups.length > 0;
    }

    private createSearchParam(value: string): GroupSearchParam {
        const queryParams: GroupSearchParam = { name: value };
        return queryParams;
    }

    private hasRoles(): boolean {
        return this.roles && this.roles.length > 0;
    }

    private disableSearch() {
        this.searchGroupsControl.disable();
        this.isDisabled = true;
    }

    private enableSearch() {
        this.searchGroupsControl.enable();
        this.isDisabled = false;
    }

    private setError() {
        this.searchGroupsControl.setErrors({ invalid: true });
    }

    private clearError() {
        this.searchGroupsControl.setErrors(null);
    }

    hasError(): boolean {
        return this.searchGroupsControl && this.searchGroupsControl.errors && (this.searchGroupsControl.errors.invalid || this.searchGroupsControl.errors.required);
    }

    setFocus(isFocused: boolean) {
        this.isFocused = isFocused;
    }

    hasErrorMessage(): boolean {
        return !this.isFocused && this.hasError();
    }
}
