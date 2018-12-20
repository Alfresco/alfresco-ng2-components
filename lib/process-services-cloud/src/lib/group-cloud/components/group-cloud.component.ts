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
import { GroupModel } from '../models/group.model';
import { GroupService } from '../services/group.service';
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

    @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;

    /** Mode of the group selection (single/multiple) */
    @Input()
    applicationName: string;

    /** Mode of the group selection (single/multiple) */
    @Input()
    mode: string = GroupCloudComponent.MODE_SINGLE;

    @Input()
    preSelectGroups: GroupModel[];

    /** Emitted when a group is selected. */
    @Output()
    selectGroup: EventEmitter<GroupModel> = new EventEmitter<GroupModel>();

    /** Emitted when a group is removed. */
    @Output()
    removeGroup: EventEmitter<GroupModel> = new EventEmitter<GroupModel>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    groups$: Observable<GroupModel[]>;

    private _selectedGroups: GroupModel[] = [];
    private selectedGroups: BehaviorSubject<GroupModel[]>;
    private searchGroups: BehaviorSubject<GroupModel[]>;
    private applicationId: string;
    selectedGroups$: Observable<GroupModel[]>;

    searchGroup: FormControl = new FormControl();

    _subscriptAnimationState = 'enter';
    dataError = false;
    filtered = [];

    constructor(private groupService: GroupService) {
        this.selectedGroups = new BehaviorSubject<GroupModel[]>(this._selectedGroups);
        this.searchGroups = new BehaviorSubject<GroupModel[]>(this._selectedGroups);
        this.selectedGroups$ = this.selectedGroups.asObservable();
        this.groups$ = this.searchGroups.asObservable();
    }

    ngOnInit() {
        this.getClientId();
        this.loadPreSelectGroups();
        this.initSearch();
    }

    initSearch() {
        this.searchGroup.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap( () => {
                this.filtered = [];
                this.searchGroups.next(this.filtered);
            }),
            switchMap( (search) => this.groupService.findGroupsByName(search)),
            flatMap((group) => {
                return group;
            }),
            mergeMap((group: any) => {
                if (this.isGroupAlreadySelected(group)) {
                    return of();
                }
                return this.groupService.checkGroupHasClientRoleMapping(group.id, this.applicationId).pipe(
                    mergeMap((hasRole) => {
                        return of({group, hasRole});
                     })
                );
            }),
            filter((group: any) => group.hasRole)).subscribe((user) => {
                this.filtered.push(user.group);
                this.searchGroups.next(this.filtered);
            });
    }

    isGroupAlreadySelected(group: any): boolean {
        if (this._selectedGroups && this._selectedGroups.length > 0) {
            const result = this._selectedGroups.filter((selectedGroup) => {
                return selectedGroup.id === group.id;
            });
            if (result && result.length > 0) {
                return true;
            }
        }
        return false;
    }

    getClientId() {
        this.groupService.getClientIdByApplicationName(this.applicationName)
        .subscribe((clientId) => {
            this.applicationId = clientId;
        });
    }

    private loadPreSelectGroups() {
        if (this.preSelectGroups && this.preSelectGroups.length > 0) {
            if (this.isMultipleMode()) {
                this.preSelectGroups.forEach((group) => {
                    this.onSelect(group);
                });
            } else {
                this.searchGroup.setValue(this.preSelectGroups[0]);
                this.onSelect(this.preSelectGroups[0]);
            }
        }
    }

    onSelect(selectedGroup: GroupModel) {
        this.dataError = false;
        this.error.emit(this.dataError);

        if (this.isMultipleMode()) {
            const isExistingGroup = this._selectedGroups.find((group: GroupModel) => { return group.id === selectedGroup.id; });
            if (!isExistingGroup) {
                this._selectedGroups.push(selectedGroup);
                this.selectedGroups.next(this._selectedGroups);
                this.selectGroup.emit(selectedGroup);
                this.searchGroups.next([]);
            }
            this.searchGroup.setValue('');
        } else {
            this.selectGroup.emit(selectedGroup);
        }
    }

    onRemove(selectedGroup: GroupModel) {
        this.removeGroup.emit(selectedGroup);
        const indexToRemove = this._selectedGroups.findIndex((group: GroupModel) => { return group.id === selectedGroup.id; });
        this._selectedGroups.splice(indexToRemove, 1);
        this.selectedGroups.next(this._selectedGroups);
    }

    getGroupShortName(group: GroupModel): string {
        let shortName = '';
        if (group) {
            shortName = this.getInitialGroupName(group.name).toUpperCase();
        }
        return shortName;
    }

    getInitialGroupName(name: string): string {
        return (name = name ? name[0] : '');
    }

    isMultipleMode(): boolean {
        return this.mode === GroupCloudComponent.MODE_MULTIPLE;
    }

    getDisplayName(group): string {
        return group ? group.name : '';
    }
}
