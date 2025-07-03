/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import {
    AppConfigService,
    CardViewBaseItemModel,
    CardViewComponent,
    CardViewDateItemModel,
    CardViewIntItemModel,
    CardViewItemLengthValidator,
    CardViewMapItemModel,
    CardViewSelectItemModel,
    CardViewSelectItemOption,
    CardViewTextItemModel,
    CardViewUpdateService,
    TranslationService
} from '@alfresco/adf-core';
import { PeopleProcessService } from '../../../services/people-process.service';
import { TaskDescriptionValidator } from '../../validators/task-description.validator';
import { TaskRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UnclaimTaskDirective } from '../task-form/unclaim-task.directive';
import { ClaimTaskDirective } from '../task-form/claim-task.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-task-header',
    imports: [CommonModule, MatCardModule, MatButtonModule, UnclaimTaskDirective, ClaimTaskDirective, TranslatePipe, CardViewComponent],
    templateUrl: './task-header.component.html',
    styleUrls: ['./task-header.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskHeaderComponent implements OnChanges, OnInit {
    /** The name of the form. */
    @Input()
    formName: string = null;

    /** (required) Details related to the task. */
    @Input({ required: true })
    taskDetails: TaskRepresentation;

    /** Toggles display of the claim/release button. */
    @Input()
    showClaimRelease = true;

    /**
     * (optional) This flag sets read-only mode, preventing changes.
     */
    @Input()
    readOnly = false;

    /**
     *  Refreshes the card data when an event emitted.
     */
    @Input()
    resetChanges = new Subject<void>();

    /** Emitted when the task is claimed. */
    @Output()
    claim: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the task is unclaimed (ie, requeue). */
    @Output()
    unclaim: EventEmitter<any> = new EventEmitter<any>();

    properties: any[] = [];
    displayDateClearAction = false;
    dateFormat: string;
    dateLocale: string;

    private currentUserId: number;
    private readonly usersSubject$ = new BehaviorSubject<CardViewSelectItemOption<number>[]>([]);
    users$ = this.usersSubject$.asObservable();

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private peopleProcessService: PeopleProcessService,
        private translationService: TranslationService,
        private readonly appConfig: AppConfigService,
        private readonly cardViewUpdateService: CardViewUpdateService
    ) {
        this.dateFormat = this.appConfig.get('dateValues.defaultDateFormat');
        this.dateLocale = this.appConfig.get('dateValues.defaultDateLocale');
    }

    ngOnInit() {
        this.peopleProcessService
            .getCurrentUserInfo()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
                this.currentUserId = res ? +res.id : null;
                this.initData();
            });

        this.cardViewUpdateService.autocompleteInputValue$
            .pipe(
                filter((res) => res.length > 0),
                debounceTime(300),
                switchMap((res) => this.getUsers(res)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((users) => {
                this.usersSubject$.next(users);
            });

        this.resetChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.initData();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        const taskDetailsChange = changes['taskDetails'];
        if (
            taskDetailsChange?.currentValue?.id !== taskDetailsChange?.previousValue?.id ||
            taskDetailsChange?.currentValue?.assignee?.id !== taskDetailsChange?.previousValue?.assignee?.id
        ) {
            this.initData();
        } else {
            this.refreshData();
        }
    }

    /**
     * Refresh the card data
     */
    initData() {
        if (this.taskDetails) {
            const parentInfoMap = this.getParentInfo();
            const defaultProperties = this.initDefaultProperties(parentInfoMap);
            const filteredProperties: string[] = this.appConfig.get('adf-task-header.presets.properties');
            this.properties = defaultProperties.filter((cardItem) => this.isValidSelection(filteredProperties, cardItem));
        }
    }

    /**
     * Refresh the card data
     */
    refreshData() {
        this.properties = this.properties.map((cardItem) => {
            if (cardItem.key === 'formName' && cardItem.value !== this.formName) {
                return new CardViewTextItemModel({
                    label: 'ADF_TASK_LIST.PROPERTIES.FORM_NAME',
                    value: this.formName,
                    key: 'formName',
                    default: this.translationService.instant('ADF_TASK_LIST.PROPERTIES.FORM_NAME_DEFAULT'),
                    clickable: this.isFormClickable(),
                    icon: 'create'
                });
            } else {
                return cardItem;
            }
        });
    }

    /**
     * Get the process parent information
     *
     * @returns a map of process instance and definition
     */
    private getParentInfo(): Map<string, string> {
        if (this.taskDetails.processInstanceId && this.taskDetails.processDefinitionName) {
            return new Map([[this.taskDetails.processInstanceId, this.taskDetails.processDefinitionName]]);
        }
        return new Map();
    }

    /**
     * Check if the task has an assignee
     *
     * @returns `true` if the task has an assignee, otherwise `false`
     */
    hasAssignee(): boolean {
        return !!this.taskDetails.assignee;
    }

    /**
     * Check if the task is assigned to a user
     *
     * @param userId the id of the user to check
     * @returns `true` if the task assigned to a user, otherwise `false`
     */
    isAssignedTo(userId: number): boolean {
        return this.hasAssignee() ? this.taskDetails.assignee.id === userId : false;
    }

    /**
     * Check if the task is assigned to the current user
     *
     * @returns `true` if the task assigned to current user, otherwise `false`
     */
    isAssignedToCurrentUser(): boolean {
        return this.hasAssignee() && this.isAssignedTo(this.currentUserId);
    }

    /**
     * Check if the user is a candidate member
     *
     * @returns `true` if user is a candidate member, otherwise false
     */
    isCandidateMember(): boolean {
        return this.taskDetails.managerOfCandidateGroup || this.taskDetails.memberOfCandidateGroup || this.taskDetails.memberOfCandidateUsers;
    }

    /**
     * Check if the task is claimable
     *
     * @returns `true` if task can be claimed, otherwise `false`
     */
    isTaskClaimable(): boolean {
        return !this.hasAssignee() && this.isCandidateMember();
    }

    /**
     * Return true if the task claimed by candidate member.
     *
     * @returns `true` if the task is claimed, otherwise `false`
     */
    isTaskClaimedByCandidateMember(): boolean {
        return this.isCandidateMember() && this.isAssignedToCurrentUser() && !this.isCompleted();
    }

    /**
     * Get the status of the task
     *
     * @returns `Completed` or `Running`
     */
    getTaskStatus(): 'Completed' | 'Running' {
        return this.taskDetails?.isCompleted() ? 'Completed' : 'Running';
    }

    /**
     * Emit the claim event
     *
     * @param taskId the id of the task to claim
     */
    onClaimTask(taskId: string) {
        this.claim.emit(taskId);
    }

    /**
     * Emit the unclaim event
     *
     * @param taskId the id of the task to unclaim
     */
    onUnclaimTask(taskId: string) {
        this.unclaim.emit(taskId);
    }

    /**
     * Returns the task completion state
     *
     * @returns `true` if the task is completed, otherwise `false`
     */
    isCompleted(): boolean {
        return !!this.taskDetails?.endDate;
    }

    /**
     * Check if the form is clickable
     *
     * @returns `true` if the form is clickable, otherwise `false`
     */
    isFormClickable(): boolean {
        return !!this.formName && !this.isCompleted();
    }

    /**
     * Get the task duration
     *
     * @returns the task duration in milliseconds
     */
    getTaskDuration(): string {
        return this.taskDetails.duration ? `${this.taskDetails.duration} ms` : '';
    }

    private getUsers(searchQuery: string): Observable<CardViewSelectItemOption<number>[]> {
        return this.peopleProcessService.getWorkflowUsers(undefined, searchQuery).pipe(
            map((users) =>
                users
                    .filter((user) => user.id !== this.currentUserId)
                    .map(({ id, firstName = '', lastName = '' }) => ({
                        key: id,
                        label: `${firstName} ${lastName}`.trim()
                    }))
            )
        );
    }

    private initDefaultProperties(parentInfoMap: Map<string, string>): any[] {
        return [
            new CardViewSelectItemModel({
                label: 'ADF_TASK_LIST.PROPERTIES.ASSIGNEE',
                value: this.taskDetails.getFullName()
                    ? this.taskDetails.getFullName()
                    : this.translationService.instant('ADF_TASK_LIST.PROPERTIES.ASSIGNEE_DEFAULT'),
                key: 'assignee',
                editable: this.isAssignedToCurrentUser(),
                autocompleteBased: true,
                icon: 'create',
                options$: this.users$
            }),
            new CardViewTextItemModel({
                label: 'ADF_TASK_LIST.PROPERTIES.STATUS',
                value: this.getTaskStatus(),
                key: 'status'
            }),
            new CardViewIntItemModel({
                label: 'ADF_TASK_LIST.PROPERTIES.PRIORITY',
                value: this.taskDetails.priority,
                key: 'priority',
                editable: true,
                validators: [new CardViewItemLengthValidator(1, 10)]
            }),
            new CardViewDateItemModel({
                label: 'ADF_TASK_LIST.PROPERTIES.DUE_DATE',
                value: this.taskDetails.dueDate,
                key: 'dueDate',
                default: this.translationService.instant('ADF_TASK_LIST.PROPERTIES.DUE_DATE_DEFAULT'),
                editable: true,
                format: this.dateFormat,
                locale: this.dateLocale
            }),
            new CardViewTextItemModel({
                label: 'ADF_TASK_LIST.PROPERTIES.CATEGORY',
                value: this.taskDetails.category,
                key: 'category',
                default: this.translationService.instant('ADF_TASK_LIST.PROPERTIES.CATEGORY_DEFAULT')
            }),
            new CardViewMapItemModel({
                label: 'ADF_TASK_LIST.PROPERTIES.PARENT_NAME',
                value: parentInfoMap,
                key: 'parentName',
                default: this.translationService.instant('ADF_TASK_LIST.PROPERTIES.PARENT_NAME_DEFAULT'),
                clickable: true
            }),
            new CardViewDateItemModel({
                label: 'ADF_TASK_LIST.PROPERTIES.CREATED',
                value: this.taskDetails.created,
                key: 'created',
                format: this.dateFormat,
                locale: this.dateLocale
            }),
            new CardViewTextItemModel({
                label: 'ADF_TASK_LIST.PROPERTIES.DURATION',
                value: this.getTaskDuration(),
                key: 'duration'
            }),
            new CardViewTextItemModel({
                label: 'ADF_TASK_LIST.PROPERTIES.PARENT_TASK_ID',
                value: this.taskDetails.parentTaskId,
                key: 'parentTaskId'
            }),
            new CardViewDateItemModel({
                label: 'ADF_TASK_LIST.PROPERTIES.END_DATE',
                value: this.taskDetails.endDate,
                key: 'endDate',
                format: this.dateFormat,
                locale: this.dateLocale
            }),
            new CardViewTextItemModel({
                label: 'ADF_TASK_LIST.PROPERTIES.ID',
                value: this.taskDetails.id,
                key: 'id'
            }),
            new CardViewTextItemModel({
                label: 'ADF_TASK_LIST.PROPERTIES.DESCRIPTION',
                value: this.taskDetails.description,
                key: 'description',
                default: this.translationService.instant('ADF_TASK_LIST.PROPERTIES.DESCRIPTION_DEFAULT'),
                multiline: true,
                editable: true,
                validators: [new TaskDescriptionValidator()]
            }),
            new CardViewTextItemModel({
                label: 'ADF_TASK_LIST.PROPERTIES.FORM_NAME',
                value: this.formName,
                key: 'formName',
                default: this.translationService.instant('ADF_TASK_LIST.PROPERTIES.FORM_NAME_DEFAULT'),
                clickable: this.isFormClickable(),
                icon: 'create'
            })
        ];
    }

    private isValidSelection(filteredProperties: string[], cardItem: CardViewBaseItemModel): boolean {
        return filteredProperties ? filteredProperties.indexOf(cardItem.key) >= 0 : true;
    }
}
