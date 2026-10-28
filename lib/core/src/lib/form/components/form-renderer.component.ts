/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    computed,
    DestroyRef,
    effect,
    ErrorHandler,
    inject,
    InjectionToken,
    Injector,
    input,
    Input,
    OnDestroy,
    OnInit,
    signal,
    untracked,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, isObservable, Observable, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';
import {
    ByPassFormRuleManager,
    FormInvocationCoordinator,
    FormInvocationResult,
    FormRulesManager,
    formRulesManagerFactory
} from '../models/form-rules.model';
import {
    bindFormState,
    FormWriteContext,
    FormResetResult,
    unbindFormState,
    cancelFormMutation,
    runFormMutation,
    isFormMutating
} from '../models/form-state.model';
import { NotificationService } from '../../notifications/services/notification.service';
import { FormService } from '../services/form.service';
import { WidgetVisibilityService } from '../services/widget-visibility.service';
import { FormFieldComponent } from './form-field/form-field.component';
import { FORM_FIELD_MODEL_RENDER_MIDDLEWARE, FormFieldModelRenderMiddleware } from './middlewares/middleware';
import { ContainerModel, FormFieldModel, FormModel, FormOutcomeModel, TabModel, RepeatWidgetComponent } from './widgets';
import { HeaderWidgetComponent } from './widgets/header/header.widget';
import { FormSectionComponent } from './form-section/form-section.component';
import { DecimalRenderMiddlewareService } from './middlewares/decimal-middleware.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../lib/dialogs/confirm-dialog/confirm.dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconModule } from '../../icon/icon.module';
import { FormLayoutColumn, getFormLayoutColumnWidth } from './helpers/column-width';
import { RepeatableRowLabelPipe } from '../pipes/repeatable-row-label.pipe';

export const ADF_MULTI_TAB_VALIDATION_INDICATORS_ENABLED = new InjectionToken<Observable<boolean> | boolean>(
    'ADF_MULTI_TAB_VALIDATION_INDICATORS_ENABLED'
);

@Component({
    selector: 'adf-form-renderer',
    templateUrl: './form-renderer.component.html',
    styleUrl: './form-renderer.component.scss',
    providers: [
        {
            provide: FormRulesManager,
            useFactory: formRulesManagerFactory,
            deps: [Injector]
        },
        {
            provide: FORM_FIELD_MODEL_RENDER_MIDDLEWARE,
            useClass: DecimalRenderMiddlewareService,
            multi: true
        }
    ],
    imports: [
        MatTabsModule,
        NgTemplateOutlet,
        TranslatePipe,
        MatButtonModule,
        IconModule,
        NgStyle,
        FormFieldComponent,
        FormsModule,
        NgClass,
        HeaderWidgetComponent,
        FormSectionComponent,
        RepeatWidgetComponent,
        MatTooltipModule,
        RepeatableRowLabelPipe
    ],
    encapsulation: ViewEncapsulation.None
})
export class FormRendererComponent<T> implements OnInit, OnDestroy {
    private readonly middlewareServices = inject<FormFieldModelRenderMiddleware[]>(FORM_FIELD_MODEL_RENDER_MIDDLEWARE, { optional: true }) ?? [];

    public readonly formService = inject(FormService);
    private readonly formRulesManager = inject(FormRulesManager<T>);
    private readonly visibilityService = inject(WidgetVisibilityService);
    private readonly dialog = inject(MatDialog);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly destroyRef = inject(DestroyRef);
    private readonly notificationService = inject(NotificationService);
    private readonly errorHandler = inject(ErrorHandler);
    private readonly reportError = (error: unknown): void => this.errorHandler.handleError(error);
    private generation = {};
    private invocationCoordinator?: FormInvocationCoordinator;
    private invocationVersion?: string;
    private destroyed = false;
    private observedDocumentVersion?: string;

    @Input({ required: true })
    set formDefinition(formDefinition: FormModel) {
        if (this._formDefinition !== formDefinition) {
            this.cancelInvocation();
            if (this._formDefinition) {
                unbindFormState(this._formDefinition, this, this.generation);
            }
            this.generation = {};
            if (formDefinition) {
                bindFormState(formDefinition, this, this.generation);
            }
        }
        this._formDefinition = formDefinition;
        this.syncCurrentTabIndex();
    }

    get formDefinition(): FormModel {
        return this._formDefinition;
    }

    /** Revision of the rendered form definition. Falls back to the form definition version when not set. */
    readonly documentVersion = input<string | number | undefined>();

    private readonly explicitDocumentVersion = computed(() => this.parseDocumentVersion(this.documentVersion()));

    private get currentDocumentVersion(): string | undefined {
        return this.explicitDocumentVersion() ?? this.parseDocumentVersion(this.formDefinition?.json?.version);
    }

    cancelInvocation(): void {
        if (this.formDefinition) {
            cancelFormMutation(this.formDefinition, this, this.generation);
        }
        this.invocationCoordinator?.cancel();
        this.invocationCoordinator = undefined;
        this.invocationVersion = undefined;
    }

    dispatchRulesOnlyOutcome(
        outcome: FormOutcomeModel,
        notify: (result: FormInvocationResult) => void,
        isHostCurrent: () => boolean = () => true,
        resetCapability?: (context: FormWriteContext) => Promise<FormResetResult>
    ): boolean {
        const form = this.formDefinition;
        const documentVersion = this.currentDocumentVersion;
        if (this.destroyed || this.readOnly() || !form || form.readOnly || outcome.form !== form || !isHostCurrent()) {
            return false;
        }
        if (documentVersion === undefined) {
            this.notifyOutcomeFailure();
            return false;
        }
        const generation = this.generation;
        this.observedDocumentVersion = this.explicitDocumentVersion();
        if (this.invocationVersion !== documentVersion) {
            this.cancelInvocation();
            this.invocationVersion = documentVersion;
        }
        const isLive = () =>
            !this.destroyed &&
            !this.readOnly() &&
            !form.readOnly &&
            this.formDefinition === form &&
            this.generation === generation &&
            this.currentDocumentVersion === documentVersion &&
            isHostCurrent();
        this.invocationCoordinator ??= new FormInvocationCoordinator(form, this, generation, documentVersion, isLive, this.reportError);
        const provider = this.formRulesManager instanceof ByPassFormRuleManager ? undefined : this.formRulesManager.rulesOnlyProvider;
        const reset =
            typeof form.resetToDefaults === 'function'
                ? (resetCapability ??
                  ((context: FormWriteContext) =>
                      runFormMutation(
                          context,
                          () => form.resetToDefaults(context, { editableFields: form.captureResetEditability() }),
                          this.reportError
                      )))
                : undefined;
        void this.invocationCoordinator.dispatch(outcome.id, provider, reset, (result) => {
            if (result.status !== 'complete') {
                this.notifyOutcomeFailure();
            }
            notify(result);
        });
        return true;
    }

    private notifyOutcomeFailure(): void {
        try {
            this.notificationService.showError('FORM.OUTCOME_EXECUTION_FAILED');
        } catch (error) {
            this.reportError(error);
        }
    }

    private cancelForReadOnly(): void {
        const resetInterrupted = !!this.formDefinition && isFormMutating(this.formDefinition);
        this.cancelInvocation();
        if (resetInterrupted) {
            this.notifyOutcomeFailure();
        }
    }

    private parseDocumentVersion(value: unknown): string | undefined {
        if (typeof value === 'string' && value.trim().length > 0) {
            return value;
        }
        return typeof value === 'number' && Number.isFinite(value) ? String(value) : undefined;
    }

    readonly readOnly = input(false);

    @ViewChild(MatTabGroup)
    set tabGroup(tabGroup: MatTabGroup | undefined) {
        this.tabGroupSelectionSubscription?.unsubscribe();
        this._tabGroup = tabGroup;

        if (tabGroup) {
            this.syncCurrentTabIndex(tabGroup.selectedIndex);
            this.tabGroupSelectionSubscription = tabGroup.selectedIndexChange.subscribe((index) => this.syncCurrentTabIndex(index));
        }
    }

    get tabGroup(): MatTabGroup {
        return this._tabGroup as MatTabGroup;
    }

    readonly tabValidationIndicatorsEnabled = signal(false);

    private readonly currentTabIndex = signal(0);
    private _formDefinition: FormModel;
    private _tabGroup?: MatTabGroup;
    private tabGroupSelectionSubscription?: Subscription;

    get canNavigateNext(): boolean {
        return this.currentTabIndex() < this.visibleTabCount - 1;
    }

    get canNavigatePrevious(): boolean {
        return this.currentTabIndex() > 0;
    }

    get visibleTabCount(): number {
        return this.visibleTabs().length;
    }

    get selectedTabIndex(): number {
        return this.currentTabIndex();
    }

    debugMode: boolean;

    fields: FormFieldModel[];

    constructor() {
        const tabValidationIndicatorsToken = inject(ADF_MULTI_TAB_VALIDATION_INDICATORS_ENABLED, { optional: true });

        if (tabValidationIndicatorsToken != null) {
            if (isObservable(tabValidationIndicatorsToken)) {
                tabValidationIndicatorsToken.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((enabled) => {
                    this.tabValidationIndicatorsEnabled.set(enabled ?? false);
                });
            } else {
                this.tabValidationIndicatorsEnabled.set(tabValidationIndicatorsToken);
            }
        }

        effect(() => {
            if (this.readOnly()) {
                untracked(() => this.cancelForReadOnly());
            }
        });

        effect(() => {
            const version = this.explicitDocumentVersion();
            untracked(() => {
                if (version !== this.observedDocumentVersion) {
                    this.observedDocumentVersion = version;
                    this.cancelInvocation();
                }
            });
        });
    }

    ngOnInit(): void {
        this.runMiddlewareServices();
        if (!this.readOnly()) {
            this.formRulesManager.initialize(this.formDefinition);
            this.formDefinition?.validateForm();
        }

        this.formService.formRulesEvent
            .pipe(
                filter((event) => !!event?.type && event.form?.id === this.formDefinition?.id),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((event) => {
                if (event.type === 'fieldValueChanged') {
                    this.visibilityService.refreshVisibility(this.formDefinition);
                }
                this.formDefinition?.validateForm();
            });

        this.formService.formState.commits
            .pipe(
                filter(({ field }) => field.form === this.formDefinition),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.cdr.markForCheck());
    }

    ngOnDestroy() {
        this.destroyed = true;
        this.cancelInvocation();
        if (this.formDefinition) {
            unbindFormState(this.formDefinition, this, this.generation);
        }
        this.tabGroupSelectionSubscription?.unsubscribe();
        this.formRulesManager.destroy();
    }

    hasTabs(): boolean {
        return this.formDefinition?.tabs && this.formDefinition.tabs.length > 0;
    }

    visibleTabs(): TabModel[] {
        return this.formDefinition?.tabs?.filter((tab) => tab.isVisible) ?? [];
    }

    navigateToNextTab(): void {
        if (this.tabGroup && this.canNavigateNext) {
            this.tabGroup.selectedIndex = (this.tabGroup.selectedIndex ?? 0) + 1;
            this.syncCurrentTabIndex(this.tabGroup.selectedIndex);
        }
    }

    navigateToPreviousTab(): void {
        if (this.tabGroup && this.canNavigatePrevious) {
            this.tabGroup.selectedIndex = (this.tabGroup.selectedIndex ?? 0) - 1;
            this.syncCurrentTabIndex(this.tabGroup.selectedIndex);
        }
    }

    private syncCurrentTabIndex(index = this.tabGroup?.selectedIndex): void {
        const maxTabIndex = Math.max(this.visibleTabCount - 1, 0);
        const currentIndex = index ?? 0;

        this.currentTabIndex.set(Math.min(Math.max(currentIndex, 0), maxTabIndex));
    }

    getNumberOfColumns(content: ContainerModel): number {
        return (content.json?.numberOfColumns || 1) > (content.columns?.length || 1)
            ? content.json?.numberOfColumns || 1
            : content.columns?.length || 1;
    }

    /**
     * Serializes column fields
     *
     * @param content container model
     * @returns a list of form field models
     */
    getContainerFields(content: ContainerModel): FormFieldModel[] {
        const serialisedFormFields: FormFieldModel[] = [];
        const maxColumnFieldsSize = this.getMaxColumnFieldSize(content);
        for (let rowIndex = 0; rowIndex < maxColumnFieldsSize; rowIndex++) {
            content?.columns.flatMap((currentColumn) => {
                if (currentColumn?.fields[rowIndex]) {
                    serialisedFormFields.push(currentColumn?.fields[rowIndex]);
                } else {
                    const firstRowElementColSpan = currentColumn?.fields[0]?.colspan;
                    if (!!firstRowElementColSpan && rowIndex > 0) {
                        for (let i = 0; i < firstRowElementColSpan; i++) {
                            serialisedFormFields.push(null);
                        }
                    }
                }
            });
        }

        return serialisedFormFields;
    }

    private getMaxColumnFieldSize(content: ContainerModel): number {
        let maxFieldSize = 0;
        if (content?.columns?.length > 0) {
            maxFieldSize = content?.columns?.reduce((prevColumn, currentColumn) =>
                currentColumn.fields.length > prevColumn?.fields?.length ? currentColumn : prevColumn
            )?.fields?.length;
        }
        return maxFieldSize;
    }

    displayDialogToRemoveRow(field: FormFieldModel, rowIndex: number) {
        this.dialog
            .open(ConfirmDialogComponent, {
                data: {
                    title: 'FORM.FORM_RENDERER.REMOVE_ROW_DIALOG.TITLE',
                    message: 'FORM.FORM_RENDERER.REMOVE_ROW_DIALOG.MESSAGE',
                    yesLabel: 'FORM.FORM_RENDERER.REMOVE_ROW_DIALOG.YES_LABEL',
                    noLabel: 'FORM.FORM_RENDERER.REMOVE_ROW_DIALOG.NO_LABEL'
                },
                minWidth: '500px',
                closeOnNavigation: true
            })
            .beforeClosed()
            .subscribe((shouldRemove) => {
                if (shouldRemove) {
                    field.removeRow(rowIndex);
                    this.cdr.detectChanges();
                }
            });
    }

    getColumnWidth(container: ContainerModel, columns: FormLayoutColumn[], columnIndex: number): string {
        return getFormLayoutColumnWidth(container.field?.numberOfColumns, columns, columnIndex);
    }

    private runMiddlewareServices(): void {
        if (this.middlewareServices && this.middlewareServices.length > 0) {
            const formFields = this.formDefinition.getFormFields();

            formFields.forEach((field) => {
                this.middlewareServices.forEach((middlewareService) => {
                    if (middlewareService.type === field.type) {
                        field = middlewareService.getParsedField(field);
                    }
                });
            });
        }
    }
}
