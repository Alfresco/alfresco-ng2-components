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
    FormCloudComponentPage,
    FormPage,
    LoginSSOPage,
    ProcessCloudWidgetPage
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import {
    peopleSingleModeFormMock,
    peopleMultipleModeFormMock,
    peopleRequiredFormMock,
    groupSingleModeFormMock,
    groupMultipleModeFormMock,
    groupRequiredFormMock,
    peopleReadOnlyFormMock,
    groupReadOnlyFormMock
} from '../../resources/forms/people-group-formwidget-mocks';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';

describe('People and Group of people Widgets', () => {
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const formCloudComponentPage = new FormCloudComponentPage();
    const widget = new ProcessCloudWidgetPage();
    const peopleCloudWidget = widget.peopleCloudWidget();
    const groupCloudWidget = widget.groupCloudWidget();
    const formPage = new FormPage();

    const widgets = {
        peopleCloudWidgetSingleModeId: 'PeopleSingleMode',
        peopleCloudWidgetMultipleModeId: 'PeopleMultipleMode',
        peopleCloudWidgetReadOnlyId: 'PeopleReadOnly',
        peopleCloudWidgetRequiredId: 'PeopleRequired',
        groupCloudWidgetSingleModeId: 'GroupSingleMode',
        groupCloudWidgetMultipleModeId: 'GroupMultipleMode',
        groupCloudWidgetReadOnlyId: 'GroupReadOnly',
        groupCloudWidgetRequiredId: 'GroupRequired'
    };

    const peopleValueString = {
        peopleCloudWidgetSingleModeField: 'PeopleSingleMode',
        peopleCloudWidgetMultipleModeField: 'PeopleMultipleMode',
        peopleCloudWidgetReadOnlyField: 'PeopleReadOnly',
        peopleCloudWidgetRequiredField: 'PeopleRequired'
    };

    const groupValueString = {
        groupCloudWidgetSingleModeField: 'GroupSingleMode',
        groupCloudWidgetMultipleModeField: 'GroupMultipleMode',
        groupCloudWidgetReadOnlyField: 'GroupReadOnly',
        groupCloudWidgetRequiredField: 'GroupRequired'
    };

    beforeAll(async () => {
        await loginSSOPage.login(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
        await navigationBarPage.navigateToFormCloudPage();
    });

    it('[C325002] Should be able to add a user in People field when Single mode is chosen', async () => {
        await formCloudComponentPage.setConfigToEditor(peopleSingleModeFormMock);

        await peopleCloudWidget.clickPeopleInput(widgets.peopleCloudWidgetSingleModeId);
        await peopleCloudWidget.isPeopleWidgetVisible(peopleValueString.peopleCloudWidgetSingleModeField);
        const peopleSingleMode = await peopleCloudWidget.getFieldValue(widgets.peopleCloudWidgetSingleModeId);
        await expect(peopleSingleMode).toEqual('');

        await peopleCloudWidget.searchAssigneeAndSelect('HR User');
        await peopleCloudWidget.checkSelectedPeople('HR User');
    });

    it('[C325122] Should be able to add multiple users in People field when Multiple mode is chosen', async () => {
        await formCloudComponentPage.setConfigToEditor(peopleMultipleModeFormMock);

        await peopleCloudWidget.clickPeopleInput(widgets.peopleCloudWidgetMultipleModeId);
        await peopleCloudWidget.isPeopleWidgetVisible(peopleValueString.peopleCloudWidgetMultipleModeField);
        const peopleMultipleMode = await peopleCloudWidget.getFieldValue(widgets.peopleCloudWidgetMultipleModeId);
        await expect(peopleMultipleMode).toEqual('');

        await peopleCloudWidget.searchAssigneeAndSelect('HR User');
        await peopleCloudWidget.searchAssigneeAndSelect('Sales User');
        await peopleCloudWidget.checkSelectedPeople('HR User');
        await peopleCloudWidget.checkSelectedPeople('Sales User');
    });

    it('[C325182] Should not be able to type in the People field if the readOnly option is checked', async () => {
        await formCloudComponentPage.setConfigToEditor(peopleReadOnlyFormMock);

        const readOnlyAttribute = await peopleCloudWidget.checkPeopleWidgetIsReadOnly();
        const activePeopleField = await peopleCloudWidget.checkPeopleActiveField('HR User');

        await expect (readOnlyAttribute).toBe(true);
        await expect (activePeopleField).toBe(false);
    });

    it('[C325004] Should be able to save only for valid input in the People  field if the Required option is selected ', async () => {
        await formCloudComponentPage.setConfigToEditor(peopleRequiredFormMock);

        await peopleCloudWidget.isPeopleWidgetVisible(peopleValueString.peopleCloudWidgetRequiredField);
        await expect(await formPage.isSaveButtonDisabled()).toBe(true);
        await expect(await formPage.isValidationIconRed()).toBe(true);

        const requiredPeople = await peopleCloudWidget.getFieldValue(widgets.peopleCloudWidgetRequiredId);
        await expect(requiredPeople).toEqual('');
        await peopleCloudWidget.searchAssigneeAndSelect('HR User');

        await peopleCloudWidget.checkSelectedPeople('HR User');
        await expect(await formPage.isSaveButtonDisabled()).toBe(false);
        await expect(await formPage.isValidationIconBlue()).toBe(true);
    });

    it('[C325003] Should be able to add a user in Group of people field when Single mode is chosen', async () => {
        await formCloudComponentPage.setConfigToEditor(groupSingleModeFormMock);

        await groupCloudWidget.isGroupWidgetVisible(groupValueString.groupCloudWidgetSingleModeField);
        const groupSingleMode = await groupCloudWidget.getGroupsFieldContent();
        await expect(groupSingleMode).toEqual('');

        await groupCloudWidget.searchGroups('hr');
        await groupCloudWidget.selectGroupFromList('hr');
        await groupCloudWidget.checkSelectedGroup('hr');
    });

    it('[C325123] Should be able to add multiple users in Group of people field when Multiple mode is chosen', async () => {
        await formCloudComponentPage.setConfigToEditor(groupMultipleModeFormMock);

        await groupCloudWidget.isGroupWidgetVisible(groupValueString.groupCloudWidgetMultipleModeField);
        const groupSingleMode = await groupCloudWidget.getGroupsFieldContent();
        await expect(groupSingleMode).toEqual('');

        await groupCloudWidget.searchGroups('hr');
        await groupCloudWidget.selectGroupFromList('hr');
        await groupCloudWidget.searchGroups('sales');
        await groupCloudWidget.selectGroupFromList('sales');
        await groupCloudWidget.checkSelectedGroup('hr');
        await groupCloudWidget.checkSelectedGroup('sales');
    });

    it('[C325183] Should not be able to type in the Group field if the readOnly option is checked', async () => {
        await formCloudComponentPage.setConfigToEditor(groupReadOnlyFormMock);

        const readOnlyGroupAttribute = await groupCloudWidget.checkGroupWidgetIsReadOnly();
        const activeGroupField = await groupCloudWidget.checkGroupActiveField('hr');

        await expect (readOnlyGroupAttribute).toBe(true);
        await expect (activeGroupField).toBe(false);
    });

    it('[C325005] Should be able to save only for valid input in the Group of people field if the Required option is selected', async () => {
        await formCloudComponentPage.setConfigToEditor(groupRequiredFormMock);

        await groupCloudWidget.isGroupWidgetVisible(groupValueString.groupCloudWidgetRequiredField);
        await expect(await formPage.isSaveButtonDisabled()).toBe(true);
        await expect(await formPage.isValidationIconRed()).toBe(true);

        const groupRequired = await groupCloudWidget.getGroupsFieldContent();
        await expect(groupRequired).toEqual('');
        await groupCloudWidget.searchGroups('hr');
        await groupCloudWidget.selectGroupFromList('hr');

        await groupCloudWidget.checkSelectedGroup('hr');
        await expect(await formPage.isSaveButtonDisabled()).toBe(false);
        await expect(await formPage.isValidationIconBlue()).toBe(true);
    });
});
