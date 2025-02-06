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

import { FormCloudDisplayMode, FormCloudDisplayModeConfiguration } from '../../services/form-fields.interfaces';
import { DisplayModeService } from './display-mode.service';

describe('DisplayModeService', () => {
    let service: DisplayModeService;
    let displayModeOnSpy: jasmine.Spy;
    let displayModeOffSpy: jasmine.Spy;
    let completeTaskSpy: jasmine.Spy;
    let saveTaskSpy: jasmine.Spy;
    let changeDisplayModeSpy: jasmine.Spy;
    const formId = 'id';

    beforeEach(() => {
        service = new DisplayModeService();

        spyOn(service, 'getDefaultDisplayModeConfigurations').and.callFake(() => DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS);
        displayModeOnSpy = spyOn(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[1].options, 'onDisplayModeOn');
        displayModeOffSpy = spyOn(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[1].options, 'onDisplayModeOff');
        completeTaskSpy = spyOn(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[1].options, 'onCompleteTask');
        saveTaskSpy = spyOn(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[1].options, 'onSaveTask');
        changeDisplayModeSpy = spyOn(DisplayModeService, 'changeDisplayMode');
    });

    it('should return the default display mode configurations when no available configurations are provided', () => {
        expect(service.getDisplayModeConfigurations()).toBe(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS);
        expect(service.getDisplayModeConfigurations(null)).toBe(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS);
        expect(service.getDisplayModeConfigurations([])).toBe(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS);
    });

    it('should return the provided display mode configurations when available configurations are provided', () => {
        const availableConfigurations: FormCloudDisplayModeConfiguration[] = [
            {
                displayMode: FormCloudDisplayMode.fullScreen
            }
        ];

        expect(service.getDisplayModeConfigurations(availableConfigurations)).toBe(availableConfigurations);
    });

    it('should return the default display mode when no display mode is provided', () => {
        expect(service.getDisplayMode()).toBe(DisplayModeService.DEFAULT_DISPLAY_MODE);
        expect(service.getDisplayMode(null)).toBe(DisplayModeService.DEFAULT_DISPLAY_MODE);
    });

    it('should return the default display mode when no display mode does not exist in the configuration', () => {
        expect(service.getDisplayMode('notExisting')).toBe(DisplayModeService.DEFAULT_DISPLAY_MODE);
        expect(service.getDisplayMode('notExisting', [])).toBe(DisplayModeService.DEFAULT_DISPLAY_MODE);
        expect(service.getDisplayMode('notExisting', [{ displayMode: FormCloudDisplayMode.fullScreen }])).toBe(FormCloudDisplayMode.fullScreen);
        expect(
            service.getDisplayMode('notExisting', [{ displayMode: FormCloudDisplayMode.fullScreen }, { displayMode: FormCloudDisplayMode.inline }])
        ).toBe(FormCloudDisplayMode.fullScreen);
        expect(
            service.getDisplayMode('notExisting', [
                { displayMode: FormCloudDisplayMode.fullScreen, default: true },
                { displayMode: FormCloudDisplayMode.inline }
            ])
        ).toBe(FormCloudDisplayMode.fullScreen);
    });

    it('should return the provided display mode when display mode is provided', () => {
        expect(service.getDisplayMode(FormCloudDisplayMode.fullScreen)).toBe(FormCloudDisplayMode.fullScreen);
    });

    it('should find the display configuration', () => {
        expect(service.findConfiguration()).toBeUndefined();
        expect(service.findConfiguration(FormCloudDisplayMode.fullScreen)).toBe(DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS[1]);
        expect(service.findConfiguration('notExisting')).toBeUndefined();
        expect(service.findConfiguration(FormCloudDisplayMode.fullScreen, [{ displayMode: FormCloudDisplayMode.fullScreen }])).toEqual({
            displayMode: FormCloudDisplayMode.fullScreen
        });
        expect(service.findConfiguration(FormCloudDisplayMode.fullScreen, [{ displayMode: FormCloudDisplayMode.inline }])).toBeUndefined();
    });

    it('should call the display mode on function in the configuration when it is found', () => {
        service.onDisplayModeOn(formId, FormCloudDisplayMode.fullScreen);

        expect(displayModeOnSpy).toHaveBeenCalledWith(formId);
    });

    it('should not call the on display mode on function in the configuration when it is not found', () => {
        service.onDisplayModeOff(formId, FormCloudDisplayMode.inline);

        expect(displayModeOnSpy).not.toHaveBeenCalled();
    });

    it('should call the display mode off function in the configuration when it is found', () => {
        service.onDisplayModeOff(formId, FormCloudDisplayMode.fullScreen);

        expect(displayModeOffSpy).toHaveBeenCalledWith(formId);
    });

    it('should not call the on display mode off function in the configuration when it is not found', () => {
        service.onDisplayModeOff(formId, FormCloudDisplayMode.inline);

        expect(displayModeOffSpy).not.toHaveBeenCalled();
    });

    it('should call the complete task function in the configuration when it is found', () => {
        service.onCompleteTask(formId, FormCloudDisplayMode.fullScreen);

        expect(completeTaskSpy).toHaveBeenCalledWith(formId);
    });

    it('should not call the complete task function in the configuration when it is not found', () => {
        service.onCompleteTask(formId, FormCloudDisplayMode.inline);

        expect(completeTaskSpy).not.toHaveBeenCalled();
    });

    it('should call the save task function in the configuration when it is found', () => {
        service.onSaveTask(formId, FormCloudDisplayMode.fullScreen);

        expect(saveTaskSpy).toHaveBeenCalledWith(formId);
    });

    it('should not call the save task function in the configuration when it is not found', () => {
        service.onSaveTask(formId, FormCloudDisplayMode.inline);

        expect(saveTaskSpy).not.toHaveBeenCalled();
    });

    it('should return the provided display mode when calling the switchToDisplayMode and display exists in configuration', () => {
        expect(service.switchToDisplayMode(formId, FormCloudDisplayMode.fullScreen)).toBe(FormCloudDisplayMode.fullScreen);
        expect(changeDisplayModeSpy).toHaveBeenCalledWith({ id: formId, displayMode: FormCloudDisplayMode.fullScreen });
    });

    it('should return the default display mode when calling the switchToDisplayMode and display does not exist in configuration', () => {
        expect(service.switchToDisplayMode(formId, 'notExisting')).toBe(DisplayModeService.DEFAULT_DISPLAY_MODE);
    });

    it('should not call the change display mode method when switchToDisplayMode and the mode to switch is the same as the old one', () => {
        expect(service.switchToDisplayMode(formId, FormCloudDisplayMode.fullScreen, FormCloudDisplayMode.fullScreen)).toBe(
            FormCloudDisplayMode.fullScreen
        );
        expect(changeDisplayModeSpy).not.toHaveBeenCalledWith();
    });

    it('should not call the change display mode method when switchToDisplayMode and the mode to switch does not exist and the previous mode was the default one', () => {
        expect(service.switchToDisplayMode(formId, 'notExisting', DisplayModeService.DEFAULT_DISPLAY_MODE)).toBe(
            DisplayModeService.DEFAULT_DISPLAY_MODE
        );
        expect(changeDisplayModeSpy).not.toHaveBeenCalledWith();
    });

    it('should not call the change display mode method when switchToDisplayMode and the mode to switch does not exist and the previous mode was not provided', () => {
        expect(service.switchToDisplayMode(formId, 'notExisting', DisplayModeService.DEFAULT_DISPLAY_MODE)).toBe(
            DisplayModeService.DEFAULT_DISPLAY_MODE
        );
        expect(changeDisplayModeSpy).not.toHaveBeenCalledWith();
    });

    it('should call the display mode off when switching the display mode and the old display mode is provided and it provides the off method', () => {
        expect(service.switchToDisplayMode(formId, FormCloudDisplayMode.inline, FormCloudDisplayMode.fullScreen)).toBe(FormCloudDisplayMode.inline);
        expect(displayModeOffSpy).toHaveBeenCalled();
    });

    it('should call the display mode on when switching the display mode and the new display mode provides the on method', () => {
        expect(service.switchToDisplayMode(formId, FormCloudDisplayMode.fullScreen)).toBe(FormCloudDisplayMode.fullScreen);
        expect(displayModeOnSpy).toHaveBeenCalled();
    });
});
