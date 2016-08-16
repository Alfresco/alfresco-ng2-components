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

import { it, describe, expect } from '@angular/core/testing';
import { ActivitiForm } from './activiti-form.component';
import { FormModel, FormOutcomeModel } from './widgets/index';

describe('ActivitiForm', () => {

    let componentHandler: any;

    beforeEach(() => {
        componentHandler =  jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);

        window['componentHandler'] = componentHandler;
    });

    it('should upgrade MDL content on view checked', () => {
        let formComponent = new ActivitiForm(null);
        formComponent.ngAfterViewChecked();
        expect(componentHandler.upgradeAllRegistered).toHaveBeenCalled();
    });

    it('should setup MDL content only if component handler available', () => {
        let formComponent = new ActivitiForm(null);
        expect(formComponent.setupMaterialComponents()).toBeTruthy();

        window['componentHandler'] = null;
        expect(formComponent.setupMaterialComponents()).toBeFalsy();
    });

    it('should start loading form on init', () => {
        let formComponent = new ActivitiForm(null);
        spyOn(formComponent, 'loadForm').and.stub();
        formComponent.ngOnInit();
        expect(formComponent.loadForm).toHaveBeenCalled();
    });

    it('should check form', () => {
        let formComponent = new ActivitiForm(null);
        expect(formComponent.hasForm()).toBeFalsy();
        formComponent.form = new FormModel();
        expect(formComponent.hasForm()).toBeTruthy();
    });

    it('should allow title if task name available', () => {
        let formComponent = new ActivitiForm(null);
        let formModel = new FormModel();
        formComponent.form = formModel;

        expect(formComponent.showTitle).toBeTruthy();
        expect(formModel.taskName).toBe(FormModel.UNSET_TASK_NAME);
        expect(formComponent.isTitleEnabled()).toBeTruthy();

        // override property as it's the readonly one
        Object.defineProperty(formModel, 'taskName', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: null
        });

        expect(formComponent.isTitleEnabled()).toBeFalsy();
    });

    it('should not allow title', () => {
        let formComponent = new ActivitiForm(null);
        let formModel = new FormModel();

        formComponent.form = formModel;
        formComponent.showTitle = false;

        expect(formModel.taskName).toBe(FormModel.UNSET_TASK_NAME);
        expect(formComponent.isTitleEnabled()).toBeFalsy();
    });

    it('should not enable outcome button when model missing', () => {
        let formComponent = new ActivitiForm(null);
        expect(formComponent.isOutcomeButtonEnabled(null)).toBeFalsy();
    });

    it('should enable custom outcome buttons', () => {
        let formComponent = new ActivitiForm(null);
        let formModel = new FormModel();
        let outcome = new FormOutcomeModel(formModel, { id: 'action1', name: 'Action 1' });
        expect(formComponent.isOutcomeButtonEnabled(outcome)).toBeTruthy();
    });


    it('should allow controlling [complete] button visibility', () => {
        let formComponent = new ActivitiForm(null);

        let formModel = new FormModel();
        let outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.SAVE_ACTION });

        formComponent.showSaveButton = true;
        expect(formComponent.isOutcomeButtonEnabled(outcome)).toBeTruthy();

        formComponent.showSaveButton = false;
        expect(formComponent.isOutcomeButtonEnabled(outcome)).toBeFalsy();
    });

    it('should allow controlling [save] button visibility', () => {
        let formComponent = new ActivitiForm(null);

        let formModel = new FormModel();
        let outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.COMPLETE_ACTION });

        formComponent.showCompleteButton = true;
        expect(formComponent.isOutcomeButtonEnabled(outcome)).toBeTruthy();

        formComponent.showCompleteButton = false;
        expect(formComponent.isOutcomeButtonEnabled(outcome)).toBeFalsy();
    });

});
