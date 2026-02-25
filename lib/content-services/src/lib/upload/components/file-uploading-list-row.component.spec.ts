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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadingListRowComponent } from './file-uploading-list-row.component';
import { By } from '@angular/platform-browser';
import { FileModel, FileUploadStatus } from '../../common/models/file.model';

describe('FileUploadingListRowComponent', () => {
    let fixture: ComponentFixture<FileUploadingListRowComponent>;
    let component: FileUploadingListRowComponent;
    const file = new FileModel({ name: 'fake-name' } as File);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FileUploadingListRowComponent]
        });
        fixture = TestBed.createComponent(FileUploadingListRowComponent);
        component = fixture.componentInstance;
    });

    const getCancelButton = () =>
        fixture.debugElement.query(By.css('[data-automation-id="cancel-upload-progress"]'))?.nativeElement as HTMLButtonElement;

    describe('events', () => {
        beforeEach(() => {
            component.file = file;
        });

        it('should emit cancel event', () => {
            spyOn(component.cancel, 'emit');
            component.onCancel(component.file);

            expect(component.cancel.emit).toHaveBeenCalledWith(file);
        });
    });

    it('should render node version when upload a version file', () => {
        component.file = new FileModel({ name: 'fake-name' } as File);
        component.file.options = { newVersion: true };
        component.file.data = { entry: { properties: { 'cm:versionLabel': '1' } } };

        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.adf-file-uploading-row__version').textContent).toContain('1');
    });

    it('should show cancel button when upload is in progress', async () => {
        component.file = new FileModel({ name: 'fake-name' } as File);
        component.file.data = { entry: { properties: { 'cm:versionLabel': '1' } } };
        component.file.status = FileUploadStatus.Progress;

        fixture.detectChanges();
        await fixture.whenStable();

        const cancelButton = getCancelButton();
        expect(cancelButton).not.toBeNull();
    });

    it('should show cancel button when upload is starting', async () => {
        component.file = new FileModel({ name: 'fake-name' } as File);
        component.file.data = { entry: { properties: { 'cm:versionLabel': '1' } } };
        component.file.status = FileUploadStatus.Starting;

        fixture.detectChanges();
        await fixture.whenStable();

        const cancelButton = getCancelButton();
        expect(cancelButton).not.toBeNull();
    });

    it('should hide cancel button when upload is complete', async () => {
        component.file = new FileModel({ name: 'fake-name' } as File);
        component.file.data = { entry: { properties: { 'cm:versionLabel': '1' } } };
        component.file.status = FileUploadStatus.Complete;

        fixture.detectChanges();
        await fixture.whenStable();

        const cancelButton = getCancelButton();
        expect(cancelButton).toBeUndefined();
    });

    it('should provide tooltip for the cancel button', async () => {
        component.file = new FileModel({ name: 'fake-name' } as File);
        component.file.data = { entry: { properties: { 'cm:versionLabel': '1' } } };
        component.file.status = FileUploadStatus.Progress;

        fixture.detectChanges();
        await fixture.whenStable();

        const cancelButton = getCancelButton();
        expect(cancelButton.title).toBe('ADF_FILE_UPLOAD.BUTTON.STOP_FILE');
    });

    describe('Toggle Icon State', () => {
        describe('onToggleMouseEnter', () => {
            it('should set isToggled to true when not focused', () => {
                component.toggleIconState = { isFocused: false, isToggled: false };

                component.onToggleMouseEnter(component.toggleIconState);

                expect(component.toggleIconState.isToggled).toBe(true);
            });

            it('should not change isToggled when already focused', () => {
                component.toggleIconState = { isFocused: true, isToggled: false };

                component.onToggleMouseEnter(component.toggleIconState);

                expect(component.toggleIconState.isToggled).toBe(false);
            });
        });

        describe('onToggleMouseLeave', () => {
            it('should set isToggled to false when not focused', () => {
                component.toggleIconState = { isFocused: false, isToggled: true };

                component.onToggleMouseLeave(component.toggleIconState);

                expect(component.toggleIconState.isToggled).toBe(false);
            });

            it('should not change state when focused but not toggled', () => {
                component.toggleIconState = { isFocused: true, isToggled: false };

                component.onToggleMouseLeave(component.toggleIconState);

                expect(component.toggleIconState.isFocused).toBe(true);
                expect(component.toggleIconState.isToggled).toBe(false);
            });

            it('should reset both isFocused and isToggled when both are true', () => {
                component.toggleIconState = { isFocused: true, isToggled: true };

                component.onToggleMouseLeave(component.toggleIconState);

                expect(component.toggleIconState.isFocused).toBe(false);
                expect(component.toggleIconState.isToggled).toBe(false);
            });
        });

        describe('onToggleFocus', () => {
            it('should set both isFocused and isToggled to true', () => {
                component.toggleIconState = { isFocused: false, isToggled: false };

                component.onToggleFocus(component.toggleIconState);

                expect(component.toggleIconState.isFocused).toBe(true);
                expect(component.toggleIconState.isToggled).toBe(true);
            });
        });

        describe('onToggleBlur', () => {
            it('should set both isFocused and isToggled to false', () => {
                component.toggleIconState = { isFocused: true, isToggled: true };

                component.onToggleBlur(component.toggleIconState);

                expect(component.toggleIconState.isFocused).toBe(false);
                expect(component.toggleIconState.isToggled).toBe(false);
            });
        });

        describe('Multiple toggle states', () => {
            it('should maintain independent state for toggleIconState and toggleIconCancelState', () => {
                component.onToggleFocus(component.toggleIconState);
                component.onToggleMouseEnter(component.toggleIconCancelState);

                expect(component.toggleIconState.isFocused).toBe(true);
                expect(component.toggleIconState.isToggled).toBe(true);
                expect(component.toggleIconCancelState.isFocused).toBe(false);
                expect(component.toggleIconCancelState.isToggled).toBe(true);
            });
        });
    });
});
