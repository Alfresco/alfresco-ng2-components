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
    Component, EventEmitter, Input, Output, ViewEncapsulation
} from '@angular/core';
import { AttachFileWidgetComponent, AttachFolderWidgetComponent } from '../content-widget';
import { EcmModelService, NodeService, WidgetVisibilityService, FormService, FormRenderingService, FormBaseComponent } from '@alfresco/adf-core';
import {
    FormFieldModel,
    FormFieldValidator,
    FormModel,
    FormOutcomeEvent,
    FormValues
}  from '@alfresco/adf-core';
import { ContentLinkModel }  from '@alfresco/adf-core';

@Component({
    selector: 'adf-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormComponent extends FormBaseComponent {

    /** Underlying form model instance. */
    @Input()
    form: FormModel;

    /** Task id to fetch corresponding form and values. */
    @Input()
    taskId: string;

    /** Content Services node ID for the form metadata. */
    @Input()
    nodeId: string;

    /** The id of the form definition to load and display with custom values. */
    @Input()
    formId: number;

    /** Name of the form definition to load and display with custom values. */
    @Input()
    formName: string;

    /** Toggle saving of form metadata. */
    @Input()
    saveMetadata: boolean = false;

    /** Custom form values map to be used with the rendered form. */
    @Input()
    data: FormValues;

    /** Path of the folder where the metadata will be stored. */
    @Input()
    path: string;

    /** Name to assign to the new node where the metadata are stored. */
    @Input()
    nameNode: string;

    /** Toggle rendering of the form title. */
    @Input()
    showTitle: boolean = true;

    /** Toggle rendering of the `Complete` outcome button. */
    @Input()
    showCompleteButton: boolean = true;

    /** If true then the `Complete` outcome button is shown but it will be disabled. */
    @Input()
    disableCompleteButton: boolean = false;

    /** If true then the `Start Process` outcome button is shown but it will be disabled. */
    @Input()
    disableStartProcessButton: boolean = false;

    /** Toggle rendering of the `Save` outcome button. */
    @Input()
    showSaveButton: boolean = true;

    /** Toggle debug options. */
    @Input()
    showDebugButton: boolean = false;

    /** Toggle readonly state of the form. Forces all form widgets to render as readonly if enabled. */
    @Input()
    readOnly: boolean = false;

    /** Toggle rendering of the `Refresh` button. */
    @Input()
    showRefreshButton: boolean = true;

    /** Toggle rendering of the validation icon next to the form title. */
    @Input()
    showValidationIcon: boolean = true;

    /** Contains a list of form field validator instances. */
    @Input()
    fieldValidators: FormFieldValidator[] = [];

    /** Emitted when the form is submitted with the `Save` or custom outcomes. */
    @Output()
    formSaved: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    /** Emitted when the form is submitted with the `Complete` outcome. */
    @Output()
    formCompleted: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    /** Emitted when form content is clicked. */
    @Output()
    formContentClicked: EventEmitter<ContentLinkModel> = new EventEmitter<ContentLinkModel>();

    /** Emitted when the form is loaded or reloaded. */
    @Output()
    formLoaded: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    /** Emitted when form values are refreshed due to a data property change. */
    @Output()
    formDataRefreshed: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    /** Emitted when the supplied form values have a validation error.*/
    @Output()
    formError: EventEmitter<FormFieldModel[]> = new EventEmitter<FormFieldModel[]>();

    /** Emitted when any outcome is executed. Default behaviour can be prevented
     * via `event.preventDefault()`.
     */
    @Output()
    executeOutcome: EventEmitter<FormOutcomeEvent> = new EventEmitter<FormOutcomeEvent>();

    /**
     * Emitted when any error occurs.
     */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    constructor(public formService: FormService,
                public visibilityService: WidgetVisibilityService,
                public ecmModelService: EcmModelService,
                public nodeService: NodeService,
                public formRenderingService: FormRenderingService) {
        super(formService, visibilityService, ecmModelService, nodeService);
        this.formRenderingService.setComponentTypeResolver('upload', () => AttachFileWidgetComponent, true);
        this.formRenderingService.setComponentTypeResolver('select-folder', () => AttachFolderWidgetComponent, true);
    }

}
