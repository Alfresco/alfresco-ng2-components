/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { $, $$ } from 'protractor';
import { BrowserActions, TestElement } from '@alfresco/adf-testing';

export class CreateLibraryDialogPage {
    libraryDialog = TestElement.byCss('[role="dialog"]');
    libraryTitle = TestElement.byCss('.adf-library-dialog>h2');
    libraryNameField = TestElement.byCss('input[formcontrolname="title"]');
    libraryIdField = TestElement.byCss('input[formcontrolname="id"]');
    libraryDescriptionField = TestElement.byCss('textarea[formcontrolname="description"]');
    publicRadioButton = TestElement.byCss('[data-automation-id="PUBLIC"]>label');
    privateRadioButton = TestElement.byCss('[data-automation-id="PRIVATE"]>label');
    moderatedRadioButton = TestElement.byCss('[data-automation-id="MODERATED"]>label');
    cancelButton = TestElement.byCss('button[data-automation-id="cancel-library-id"]');
    createButton = TestElement.byCss('button[data-automation-id="create-library-id"]');
    errorMessage = TestElement.byCss('.mat-dialog-content .mat-error');
    errorMessages = $$('.mat-dialog-content .mat-error');
    libraryNameHint = TestElement.byCss('adf-library-dialog .mat-hint');

    async getSelectedRadio(): Promise<string> {
        const radio = $('.mat-radio-button[class*="checked"]');
        return BrowserActions.getText(radio);
    }

    async getErrorMessages(position: number): Promise<string> {
        return BrowserActions.getText(this.errorMessages.get(position));
    }
}
