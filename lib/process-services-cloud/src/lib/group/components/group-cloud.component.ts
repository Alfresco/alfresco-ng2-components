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
    OnChanges,
    OnDestroy,
    ChangeDetectionStrategy,
    SimpleChange
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged, switchMap, mergeMap, filter, tap, map, takeUntil } from 'rxjs/operators';
import { IdentityGroupModel, IdentityGroupSearchParam, IdentityGroupService, LogService } from '@alfresco/adf-core';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class GroupCloudComponent implements OnInit, OnChanges, OnDestroy {

    static MODE_SINGLE = 'single';
    static MODE_MULTIPLE = 'multiple';

    /** Name of the application. If specified this shows the groups who have access to the app. */
    @Input()
    appName: string;

    /** Title of the field */
    @Input()
    title: string;

    /** Group selection mode (single/multiple). */
    @Input()
    mode: string = GroupCloudComponent.MODE_SINGLE;

    /** Array of groups to be pre-selected. This pre-selects all groups in multi selection mode and only the first group of the array in single selection mode. */
    @Input()
    preSelectGroups: IdentityGroupModel[] = [];

    /** This flag enables the validation on the preSelectGroups passed as input.
     * In case the flag is true the components call the identity service to verify the validity of the information passed as input.
     * Otherwise, no check will be done.
     */
    @Input()
    validate: Boolean = false;

    /** Show the info in readonly mode
     */
    @Input()
    readOnly: boolean = false;

    /** FormControl to search the group */
    @Input()
    searchGroupsControl: FormControl = new FormControl();

    /** Role names of the groups to be listed. */
    @Input()
    roles: string[] = [];

    /** Emitted when a group is selected. */
    @Output()
    selectGroup = new EventEmitter<IdentityGroupModel>();

    /** Emitted when a group is removed. */
    @Output()
    removeGroup = new EventEmitter<IdentityGroupModel>();

    /** Emitted when a group selection change. */
    @Output()
    changedGroups = new EventEmitter<IdentityGroupModel[]>();

    /** Emitted when an warning occurs. */
    @Output()
    warning = new EventEmitter<any>();

    @ViewChild('groupInput')
    private groupInput: ElementRef<HTMLInputElement>;

    private selectedGroups: IdentityGroupModel[] = [];

    private searchGroups: IdentityGroupModel[] = [];

    searchGroups$ = new BehaviorSubject<IdentityGroupModel[]>([]);

    selectedGroups$ = new BehaviorSubject<IdentityGroupModel[]>([]);

    _subscriptAnimationState = 'enter';

    clientId: string;

    searchedValue = '';

    isFocused: boolean;

    isDisabled: boolean;

    private onDestroy$ = new Subject<boolean>();
    currentTimeout: any;
    invalidGroups: IdentityGroupModel[] = [];

    constructor(
        private identityGroupService: IdentityGroupService,
        private logService: LogService
        ) { }

    ngOnInit() {
        this.initSearch();
    }

    ngOnChanges(changes: SimpleChanges) {

        if (this.isPreselectedGroupsChanged(changes)) {
            if (this.isValidationEnabled()) {
                this.loadPreSelectGroups();
            } else {
                this.loadNoValidationPreselectGroups();
            }
        }

        if (this.isAppNameChanged(changes.appName)) {
            this.disableSearch();
            this.loadClientId();
        } else {
            this.enableSearch();
        }
    }

    private isPreselectedGroupsChanged(changes: SimpleChanges): boolean {
        return changes.preSelectGroups
            && changes.preSelectGroups.previousValue !== changes.preSelectGroups.currentValue
            && this.hasPreSelectGroups();
    }

    private isAppNameChanged(change: SimpleChange): boolean {
        return change && change.previousValue !== change.currentValue && this.appName && this.appName.length > 0;
    }

    private async loadClientId() {
        this.clientId = await this.identityGroupService.getClientIdByApplicationName(this.appName).toPromise();
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
                return this.identityGroupService.findGroupsByName(queryParams);
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
            }),
            takeUntil(this.onDestroy$)
        ).subscribe((searchedGroup: any) => {
            this.searchGroups.push(searchedGroup);
            this.searchGroups$.next(this.searchGroups);
        });
    }

    checkGroupHasAccess(groupId: string): Observable<boolean> {
        if (this.hasRoles()) {
            return this.identityGroupService.checkGroupHasAnyClientAppRole(groupId, this.clientId, this.roles);
        } else {
            return this.identityGroupService.checkGroupHasClientApp(groupId, this.clientId);
        }
    }

    private isGroupAlreadySelected(group: IdentityGroupModel): boolean {
        if (this.selectedGroups && this.selectedGroups.length > 0 && this.isMultipleMode()) {
            const result = this.selectedGroups.find((selectedGroup: IdentityGroupModel) => {
                return selectedGroup.id === group.id;
            });

            return !!result;
        }
        return false;
    }

    async searchGroup(groupName: any): Promise<IdentityGroupModel> {
        return (await this.identityGroupService.findGroupsByName(this.createSearchParam(groupName)).toPromise())[0];
    }

    async filterPreselectGroups() {
        const promiseBatch = this.preSelectGroups.map(async (group: IdentityGroupModel) => {
            let result: any;
            try {
                result = await this.searchGroup(group.name);
            } catch (error) {
                result = [];
                this.logService.error(error);
            }
            const isGroupValid: boolean = this.groupExists(result);
            return isGroupValid ? result : null;
        });
        return Promise.all(promiseBatch);
    }

    public groupExists(result: IdentityGroupModel): boolean {
        return result
            && (result.id !== undefined
            || result.name !== undefined);
    }

    private isValidGroup(filteredGroups: IdentityGroupModel[], group: IdentityGroupModel): IdentityGroupModel {
        return filteredGroups.find((filteredGroup: IdentityGroupModel) => {
            return  filteredGroup &&
                    (filteredGroup.id === group.id ||
                    filteredGroup.name === group.name);
        });
    }

    async validatePreselectGroups(): Promise<IdentityGroupModel[]> {
        let filteredPreselectGroups: IdentityGroupModel[];
        let validGroups: IdentityGroupModel[] = [];

        try {
            filteredPreselectGroups = await this.filterPreselectGroups();
        } catch (error) {
            validGroups = [];
            this.logService.error(error);
        }

        await this.preSelectGroups.map((group: IdentityGroupModel) => {
            const validGroup = this.isValidGroup(filteredPreselectGroups, group);

            if (validGroup) {
                validGroups.push(validGroup);
            } else {
                this.invalidGroups.push(group);
            }
        });
        validGroups =  this.removeDuplicatedGroups(validGroups);
        return validGroups;
    }

    public async loadSinglePreselectGroup() {
        const groups = await this.validatePreselectGroups();
        if (groups && groups.length > 0) {
            this.checkPreselectValidationErrors();
            this.searchGroupsControl.setValue(groups[0]);
        } else {
            this.checkPreselectValidationErrors();
        }
    }

    public async loadMultiplePreselectGroups() {
        const groups = await this.validatePreselectGroups();
        if (groups && groups.length > 0) {
            this.checkPreselectValidationErrors();
            this.selectedGroups = [...groups];
            this.selectedGroups$.next(this.selectedGroups);
        } else {
            this.checkPreselectValidationErrors();
        }
    }

    public checkPreselectValidationErrors() {
        if (this.invalidGroups.length > 0) {
            this.warning.emit({
                message: 'INVALID_PRESELECTED_GROUPS',
                groups: this.invalidGroups
            });
        }
    }

    private loadPreSelectGroups() {
        if (!this.isMultipleMode()) {
            this.loadSinglePreselectGroup();
        } else {
            this.loadMultiplePreselectGroups();
        }
    }

    loadNoValidationPreselectGroups() {
        this.selectedGroups = [...this.removeDuplicatedGroups([...this.preSelectGroups])];
        if (this.isMultipleMode()) {
            this.selectedGroups$.next(this.selectedGroups);
        } else {

            if (this.currentTimeout) {
                clearTimeout(this.currentTimeout);
            }

            this.currentTimeout = setTimeout(() => {
                this.searchGroupsControl.setValue(this.selectedGroups[0]);
                this.onSelect(this.selectedGroups[0]);
            }, 0);
        }
    }

    filterGroupsByRoles(group: IdentityGroupModel): Observable<IdentityGroupModel> {
        return this.identityGroupService.checkGroupHasRole(group.id, this.roles).pipe(
            map((hasRole: boolean) => ({ hasRole: hasRole, group: group })),
            filter((filteredGroup: { hasRole: boolean, group: IdentityGroupModel }) => filteredGroup.hasRole),
            map((filteredGroup: { hasRole: boolean, group: IdentityGroupModel }) => filteredGroup.group));
    }

    onSelect(group: IdentityGroupModel) {
        this.selectGroup.emit(group);
        if (this.isMultipleMode()) {
            if (!this.isGroupAlreadySelected(group)) {
                this.selectedGroups.push(group);
                this.selectedGroups$.next(this.selectedGroups);
                this.searchGroups$.next([]);
            }
            this.groupInput.nativeElement.value = '';
            this.searchGroupsControl.setValue('');
        } else {
            this.selectedGroups = [group];
        }
        this.changedGroups.emit(this.selectedGroups);

        this.clearError();
        this.resetSearchGroups();
    }

    onRemove(removedGroup: IdentityGroupModel) {
        if (!this.readOnly) {
            this.removeGroup.emit(removedGroup);
            const indexToRemove = this.selectedGroups.findIndex((group: IdentityGroupModel) => {
                return group.id === removedGroup.id;
            });
            this.selectedGroups.splice(indexToRemove, 1);
            this.selectedGroups$.next(this.selectedGroups);
            this.changedGroups.emit(this.selectedGroups);
        }
    }

    private resetSearchGroups() {
        this.searchGroups = [];
        this.searchGroups$.next([]);
    }

    isMultipleMode(): boolean {
        return this.mode === GroupCloudComponent.MODE_MULTIPLE;
    }

    getDisplayName(group: IdentityGroupModel): string {
        return group ? group.name : '';
    }

    private removeDuplicatedGroups(groups: IdentityGroupModel[]): IdentityGroupModel[] {
        return groups.filter((group, index, self) =>
                    index === self.findIndex((auxGroup) => {
                        return group.id === auxGroup.id && group.name === auxGroup.name;
                    }));
    }

    private hasPreSelectGroups(): boolean {
        return this.preSelectGroups && this.preSelectGroups.length > 0;
    }

    private createSearchParam(value: string): IdentityGroupSearchParam {
        const queryParams: IdentityGroupSearchParam = { name: value };
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

    isValidationEnabled() {
        return this.validate === true;
    }

    hasErrorMessage(): boolean {
        return !this.isFocused && this.hasError();
    }

    ngOnDestroy() {
        clearTimeout(this.currentTimeout);
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
