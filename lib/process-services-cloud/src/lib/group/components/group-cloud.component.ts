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
import { IdentityGroupModel, IdentityGroupService, LogService } from '@alfresco/adf-core';
import { ComponentSelectionMode } from '../../types';

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

    /** Name of the application. If specified this shows the groups who have access to the app. */
    @Input()
    appName: string;

    /** Title of the field */
    @Input()
    title: string;

    /** Group selection mode (single/multiple). */
    @Input()
    mode: ComponentSelectionMode = 'single';

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

    /** FormControl to list of group */
    @Input()
    groupChipsCtrl: FormControl = new FormControl({ value: '', disabled: false });

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
    private onDestroy$ = new Subject<boolean>();

    selectedGroups: IdentityGroupModel[] = [];
    invalidGroups: IdentityGroupModel[] = [];

    searchGroups$ = new BehaviorSubject<IdentityGroupModel[]>(this.searchGroups);
    _subscriptAnimationState = 'enter';
    clientId: string;
    isFocused: boolean;

    validateGroupsMessage: string;
    searchedValue = '';

    validationLoading = false;
    searchLoading = false;

    constructor(
        private identityGroupService: IdentityGroupService,
        private logService: LogService) {}

    ngOnInit(): void {
        this.loadClientId();
        this.initSearch();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.hasPreselectedGroupsChanged(changes) || this.hasModeChanged(changes) || this.isValidationChanged(changes)) {
            if (this.hasPreSelectGroups()) {
                this.loadPreSelectGroups();
            } else if (this.hasPreselectedGroupsCleared(changes)) {
                this.selectedGroups = [];
                this.invalidGroups = [];
            }

            if (!this.isValidationEnabled()) {
                this.invalidGroups = [];
            }
        }

        if (changes.appName && this.isAppNameChanged(changes.appName)) {
            this.loadClientId();
        }
    }

    private isAppNameChanged(change: SimpleChange): boolean {
        return change
            && change.previousValue !== change.currentValue
            && this.appName
            && this.appName.length > 0;
    }

    private async loadClientId(): Promise<void> {
        this.clientId = await this.identityGroupService.getClientIdByApplicationName(this.appName).toPromise();

        if (this.clientId) {
            this.searchGroupsControl.enable();
        }
    }

    initSearch(): void {
        this.searchGroupsControl.valueChanges.pipe(
            filter((value) => {
                this.searchLoading = true;
                return typeof value === 'string';
            }),
            tap((value: string) => {
                if (value) {
                    this.setTypingError();
                }
            }),
            debounceTime(500),
            distinctUntilChanged(),
            tap((value) => {
                if (value.trim()) {
                    this.searchedValue = value;
                } else {
                    this.searchGroupsControl.markAsPristine();
                    this.searchGroupsControl.markAsUntouched();
                }
            }),
            tap(() => this.resetSearchGroups()),
            switchMap((name: string) =>
                this.identityGroupService.findGroupsByName({ name: name.trim() })
            ),
            mergeMap((groups) => {
                this.resetSearchGroups();
                this.searchLoading = false;
                return groups;
            }),
            filter(group => !this.isGroupAlreadySelected(group)),
            mergeMap(group => {
                if (this.appName) {
                    return this.checkGroupHasAccess(group.id).pipe(
                        mergeMap(
                            hasRole => hasRole ? of(group) : of()
                        )
                    );
                } else if (this.hasRoles()) {
                    return this.filterGroupsByRoles(group);
                } else {
                    return of(group);
                }
            }),
            takeUntil(this.onDestroy$)
        ).subscribe(searchedGroup => {
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
        if (this.selectedGroups && this.selectedGroups.length > 0) {
            const result = this.selectedGroups.find((selectedGroup: IdentityGroupModel) => {
                return selectedGroup.name === group.name;
            });

            return !!result;
        }
        return false;
    }

    async searchGroup(name: string): Promise<IdentityGroupModel> {
        return (await this.identityGroupService.findGroupsByName({ name }).toPromise())[0];
    }

    private getPreselectedGroups(): IdentityGroupModel[] {
        if (this.isSingleMode()) {
           return [this.preSelectGroups[0]];
        } else {
            return this.removeDuplicatedGroups(this.preSelectGroups);
        }
    }

    async validatePreselectGroups(): Promise<any> {
        this.invalidGroups = [];

        for (const group of this.getPreselectedGroups()) {
            try {
                const validationResult = await this.searchGroup(group.name);
                if (this.isPreselectedGroupInvalid(group, validationResult)) {
                    this.invalidGroups.push(group);
                }
            } catch (error) {
                this.invalidGroups.push(group);
                this.logService.error(error);
            }
        }

        this.checkPreselectValidationErrors();
    }

    checkPreselectValidationErrors(): void {
        this.invalidGroups = this.removeDuplicatedGroups(this.invalidGroups);

        if (this.invalidGroups.length > 0) {
            this.generateInvalidGroupsMessage();
        }

        this.warning.emit({
            message: 'INVALID_PRESELECTED_GROUPS',
            groups: this.invalidGroups
        });
    }

    generateInvalidGroupsMessage(): void {
        this.validateGroupsMessage = '';

        this.invalidGroups.forEach((invalidGroup: IdentityGroupModel, index) => {
            if (index === this.invalidGroups.length - 1) {
                this.validateGroupsMessage += `${invalidGroup.name} `;
            } else {
                this.validateGroupsMessage += `${invalidGroup.name}, `;
            }
        });
    }

    private async loadPreSelectGroups(): Promise<void> {
        this.selectedGroups = [];

        if (this.isSingleMode()) {
            this.selectedGroups = [this.preSelectGroups[0]];
        } else {
            this.selectedGroups = this.removeDuplicatedGroups(this.preSelectGroups);
        }
        this.groupChipsCtrl.setValue(this.selectedGroups[0].name);
        if (this.isValidationEnabled()) {
            this.validationLoading = true;
            await this.validatePreselectGroups();
            this.validationLoading = false;
        }
    }

    filterGroupsByRoles(group: IdentityGroupModel): Observable<IdentityGroupModel> {
        return this.identityGroupService.checkGroupHasRole(group.id, this.roles).pipe(
            map((hasRole: boolean) => ({ hasRole: hasRole, group: group })),
            filter((filteredGroup: { hasRole: boolean, group: IdentityGroupModel }) => filteredGroup.hasRole),
            map((filteredGroup: { hasRole: boolean, group: IdentityGroupModel }) => filteredGroup.group));
    }

    onSelect(group: IdentityGroupModel): void {
        if (group) {
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
            this.groupChipsCtrlValue(this.selectedGroups[0].name);

            this.changedGroups.emit(this.selectedGroups);
            this.resetSearchGroups();
        }
    }

    onRemove(groupToRemove: IdentityGroupModel): void {
        this.removeGroup.emit(groupToRemove);
        this.removeGroupFromSelected(groupToRemove);
        this.changedGroups.emit(this.selectedGroups);
        if (this.selectedGroups.length === 0) {
            this.groupChipsCtrlValue('');

        } else {
            this.groupChipsCtrlValue(this.selectedGroups[0].name);
        }
        this.searchGroupsControl.markAsDirty();
        this.searchGroupsControl.markAsTouched();

        if (this.isValidationEnabled()) {
            this.removeGroupFromValidation(groupToRemove);
            this.checkPreselectValidationErrors();
        }
    }

    private groupChipsCtrlValue(value: string) {
        this.groupChipsCtrl.setValue(value);
        this.groupChipsCtrl.markAsDirty();
        this.groupChipsCtrl.markAsTouched();
    }

    private removeGroupFromSelected({ id, name }: IdentityGroupModel): void {
        const indexToRemove = this.selectedGroups.findIndex(group => {
            return group.id === id && group.name === name;
        });

        if (indexToRemove !== -1) {
            this.selectedGroups.splice(indexToRemove, 1);
        }
    }

    private removeGroupFromValidation({ id, name }: IdentityGroupModel): void {
        const indexToRemove = this.invalidGroups.findIndex(group => {
            return group.id === id && group.name === name;
        });

        if (indexToRemove !== -1) {
            this.invalidGroups.splice(indexToRemove, 1);
        }
    }

    private resetSearchGroups(): void {
        this.searchGroups = [];
        this.searchGroups$.next(this.searchGroups);
    }

    isPreselectedGroupInvalid(preselectedGroup: IdentityGroupModel, validatedGroup: IdentityGroupModel): boolean {
        if (validatedGroup && validatedGroup.name !== undefined) {
            return preselectedGroup.name !== validatedGroup.name;
        } else {
            return true;
        }
    }

    isSingleMode(): boolean {
        return this.mode === 'single';
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
        return this.mode === 'multiple';
    }

    getDisplayName(group: IdentityGroupModel): string {
        return group ? group.name : '';
    }

    removeDuplicatedGroups(groups: IdentityGroupModel[]): IdentityGroupModel[] {
        return groups.filter((group, index, self) =>
            index === self.findIndex((auxGroup) => {
                return group.id === auxGroup.id && group.name === auxGroup.name;
            }));
    }

    private hasPreSelectGroups(): boolean {
        return this.preSelectGroups && this.preSelectGroups.length > 0;
    }

    private hasModeChanged(changes: SimpleChanges): boolean {
        return changes
            && changes.mode
            && changes.mode.currentValue !== changes.mode.previousValue;
    }

    private isValidationChanged(changes: SimpleChanges): boolean {
        return changes
            && changes.validate
            && changes.validate.currentValue !== changes.validate.previousValue;
    }

    private hasPreselectedGroupsChanged(changes: SimpleChanges): boolean {
        return changes
            && changes.preSelectGroups
            && changes.preSelectGroups.currentValue !== changes.preSelectGroups.previousValue;
    }

    private hasPreselectedGroupsCleared(changes: SimpleChanges): boolean {
        return changes
            && changes.preSelectGroups
            && changes.preSelectGroups.currentValue.length === 0;
    }

    private hasRoles(): boolean {
        return this.roles && this.roles.length > 0;
    }

    private setTypingError(): void {
        this.searchGroupsControl.setErrors({
            searchTypingError: true,
            ...this.searchGroupsControl.errors
        });
    }

    hasError(): boolean {
        return !!this.searchGroupsControl.errors;
    }

    isValidationLoading(): boolean {
        return this.isValidationEnabled() && this.validationLoading;
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

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
