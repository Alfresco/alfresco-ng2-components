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
import {
    IdentityGroupModel,
    IdentityGroupSearchParam,
    IdentityGroupService,
    LogService
} from '@alfresco/adf-core';

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
    searchGroupsControl: FormControl = new FormControl({ value: '', disabled: false });

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

    private searchGroups: IdentityGroupModel[] = [];
    private searchGroupsSubject: BehaviorSubject<IdentityGroupModel[]>;
    private onDestroy$ = new Subject<boolean>();

    selectedGroups: IdentityGroupModel[] = [];
    invalidGroups: IdentityGroupModel[] = [];

    searchGroups$: Observable<IdentityGroupModel[]>;
    _subscriptAnimationState = 'enter';
    clientId: string;
    isFocused: boolean;

    currentTimeout: any;
    validateGroupsMessage: string;
    searchedValue = '';

    constructor(
        private identityGroupService: IdentityGroupService,
        private logService: LogService) {}

    ngOnInit() {
        if (this.searchGroupsSubject === undefined) {
            this.searchGroupsSubject = new BehaviorSubject<IdentityGroupModel[]>(this.searchGroups);
            this.searchGroups$ = this.searchGroupsSubject.asObservable();
        }

        this.loadClientId();
        this.initSearch();
    }

    ngOnChanges(changes: SimpleChanges) {

        if (this.hasPreSelectGroups()) {
            this.loadPreSelectGroups();
        } else if (this.isPreselectedGroupsCleared(changes)) {
            this.selectedGroups = [];
            this.invalidGroups = [];
        }

        if (!this.isValidationEnabled()) {
            this.invalidGroups = [];
        }

        if (changes.appName && this.isAppNameChanged(changes.appName)) {
            this.loadClientId();
            this.initSearch();
        }
    }

    private isAppNameChanged(change: SimpleChange): boolean {
        return change && change.previousValue !== change.currentValue && this.appName && this.appName.length > 0;
    }

    private async loadClientId() {
        this.clientId = await this.identityGroupService.getClientIdByApplicationName(this.appName).toPromise();
        if (this.clientId) {
            this.searchGroupsControl.enable();
        }
    }

    initSearch() {
        this.searchGroupsControl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            filter((value) => {
                return typeof value === 'string';
            }),
            tap((value) => {
                this.searchedValue = value;
                if (value) {
                    this.setTypingError();
                }
            }),
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
            this.searchGroupsSubject.next(this.searchGroups);
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
                return selectedGroup.name === group.name;
            });

            return !!result;
        }
        return false;
    }

    async searchGroup(groupName: string): Promise<IdentityGroupModel> {
        return (await this.identityGroupService.findGroupsByName({ name: groupName }).toPromise())[0];
    }

    async validatePreselectGroups(): Promise<any> {
        this.invalidGroups = [];

        let preselectedGroupsToValidate: IdentityGroupModel[] = [];

        if (this.isSingleMode()) {
            preselectedGroupsToValidate = [this.preSelectGroups[0]];
        } else {
            preselectedGroupsToValidate = this.preSelectGroups;
        }

        await Promise.all(preselectedGroupsToValidate.map(async (group: IdentityGroupModel) => {
            try {
                const validationResult = await this.searchGroup(group.name);
                if (!this.hasGroupIdOrName(validationResult)) {
                    this.invalidGroups.push(group);
                }
            } catch (error) {
                this.invalidGroups.push(group);
                this.logService.error(error);
            }
        }));
        this.checkPreselectValidationErrors();
    }

    public checkPreselectValidationErrors() {

        if (this.invalidGroups.length > 0) {
            this.generateInvalidGroupsMessage();
        }

        this.warning.emit({
            message: 'INVALID_PRESELECTED_GROUPS',
            groups: this.invalidGroups
        });
    }

    generateInvalidGroupsMessage() {
        this.validateGroupsMessage = '';

        this.invalidGroups.forEach((invalidGroup: IdentityGroupModel, index) => {
            if (index === this.invalidGroups.length - 1) {
                this.validateGroupsMessage += `${invalidGroup.name} `;
            } else {
                this.validateGroupsMessage += `${invalidGroup.name}, `;
            }
        });
    }

    private async loadPreSelectGroups() {
        this.selectedGroups = [];

        if (this.isValidationEnabled()) {
            await this.validatePreselectGroups();
        }

        if (this.isSingleMode()) {
            this.selectedGroups = [this.preSelectGroups[0]];
        } else {
            this.selectedGroups = this.removeDuplicatedGroups(this.preSelectGroups);
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
            }
        } else {
            this.invalidGroups = [];
            this.selectedGroups = [group];
        }

        this.groupInput.nativeElement.value = '';
        this.searchGroupsControl.setValue('');

        this.changedGroups.emit(this.selectedGroups);
        this.resetSearchGroups();
    }

    onRemove(groupToRemove: IdentityGroupModel) {
        this.removeGroup.emit(groupToRemove);
        const indexToRemove = this.selectedGroups.findIndex((group: IdentityGroupModel) => {
            return group.id === groupToRemove.id;
        });
        this.selectedGroups.splice(indexToRemove, 1);
        this.changedGroups.emit(this.selectedGroups);
        this.searchGroupsControl.markAsDirty();

        if (this.isValidationEnabled()) {
            this.removeGroupFromValidation(groupToRemove.name);
            this.checkPreselectValidationErrors();
        }
    }

    removeGroupFromValidation(groupName: string) {
        const indexToRemove = this.invalidGroups.findIndex((invalidGroup) => {
           return invalidGroup.name === groupName;
        });

        if (indexToRemove !== -1) {
            this.invalidGroups.splice(indexToRemove, 1);
        }
    }

    private resetSearchGroups() {
        this.searchGroups = [];
        this.searchGroupsSubject.next(this.searchGroups);
    }

    hasGroupIdOrName(group: IdentityGroupModel): boolean {
        return group && (group.id.length > 0 || group.name.length > 0);
    }

    isSingleMode(): boolean {
        return this.mode === GroupCloudComponent.MODE_SINGLE;
    }

    private isSingleSelectionReadonly(): boolean {
        return this.isSingleMode() && this.selectedGroups.length === 1 && this.selectedGroups[0].readonly === true;
    }

    hasPreselectError(): boolean {
        return this.invalidGroups && this.invalidGroups.length > 0;
    }

    isReadonly(): boolean {
        return this.readOnly || this.isSingleSelectionReadonly();
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

    private isPreselectedGroupsCleared(changes): boolean {
        return changes && changes.preSelectGroups && changes.preSelectGroups.currentValue.length === 0;
    }

    private hasPreSelectGroups(): boolean {
        return this.preSelectGroups && this.preSelectGroups.length > 0;
    }

    private createSearchParam(value: string): IdentityGroupSearchParam {
        const queryParams: IdentityGroupSearchParam = { name: value };
        return queryParams;
    }

    getSelectedGroups(): IdentityGroupModel[] {
        return this.selectedGroups;
    }

    private hasRoles(): boolean {
        return this.roles && this.roles.length > 0;
    }

    private setTypingError() {
        this.searchGroupsControl.setErrors({ searchTypingError: true , ...this.searchGroupsControl.errors });
    }

    hasError(): boolean {
        return !!this.searchGroupsControl.errors;
    }

    setFocus(isFocused: boolean) {
        this.isFocused = isFocused;
    }

    isValidationEnabled(): boolean {
        return this.validate === true;
    }

    getValidationPattern(): string {
        return this.searchGroupsControl.errors.pattern.requiredPattern;
    }

    getValidationMaxLength(): string {
        return this.searchGroupsControl.errors.maxlength.requiredLength;
    }

    getValidationMinLength(): string {
        return this.searchGroupsControl.errors.minlength.requiredLength;
    }

    ngOnDestroy() {
        clearTimeout(this.currentTimeout);
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
