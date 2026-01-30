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

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AspectListDialogComponent } from './aspect-list-dialog.component';
import { of, Subject } from 'rxjs';
import { AspectListDialogComponentData } from './aspect-list-dialog-data.interface';
import { AspectListService } from './services/aspect-list.service';
import { delay } from 'rxjs/operators';
import { AspectEntry, Node } from '@alfresco/js-api';
import { NodesApiService } from '../common/services/nodes-api.service';
import { By } from '@angular/platform-browser';
import { AspectListComponent } from './aspect-list.component';
import { provideApiTesting } from '../testing/providers';
import { UnitTestingUtils } from '@alfresco/adf-core';
import { DebugElement } from '@angular/core';

const aspectListMock: AspectEntry[] = [
    {
        entry: {
            parentId: 'frs:aspectZero',
            id: 'frs:AspectOne',
            description: 'First Aspect with random description',
            title: 'FirstAspect',
            properties: [
                {
                    id: 'channelPassword',
                    title: 'The authenticated channel password',
                    dataType: 'd:encrypted'
                },
                {
                    id: 'channelUsername',
                    title: 'The authenticated channel username',
                    dataType: 'd:encrypted'
                }
            ]
        }
    },
    {
        entry: {
            parentId: 'frs:AspectZer',
            id: 'frs:SecondAspect',
            description: 'Second Aspect description',
            title: 'SecondAspect',
            properties: [
                {
                    id: 'assetId',
                    title: 'Published Asset Id',
                    dataType: 'd:text'
                },
                {
                    id: 'assetUrl',
                    title: 'Published Asset URL',
                    dataType: 'd:text'
                }
            ]
        }
    }
];

const customAspectListMock: AspectEntry[] = [
    {
        entry: {
            parentId: 'cst:customAspect',
            id: 'cst:customAspect',
            description: 'Custom Aspect with random description',
            title: 'CustomAspect',
            properties: [
                {
                    id: 'channelPassword',
                    title: 'The authenticated channel password',
                    dataType: 'd:propA'
                },
                {
                    id: 'channelUsername',
                    title: 'The authenticated channel username',
                    dataType: 'd:propB'
                }
            ]
        }
    }
];

describe('AspectListDialogComponent', () => {
    let fixture: ComponentFixture<AspectListDialogComponent>;
    let aspectListService: AspectListService;
    let nodeService: NodesApiService;
    let data: AspectListDialogComponentData;
    let testingUtils: UnitTestingUtils;
    const event = new KeyboardEvent('keydown', {
        bubbles: true,
        keyCode: 27
    } as KeyboardEventInit);

    const getResetButton = (): DebugElement => testingUtils.getByCSS('#aspect-list-dialog-actions-reset');
    const getClearButton = (): DebugElement => testingUtils.getByCSS('#aspect-list-dialog-actions-clear');
    const getCancelButton = (): DebugElement => testingUtils.getByCSS('#aspect-list-dialog-actions-cancel');
    const getApplyButton = (): DebugElement => testingUtils.getByCSS('#aspect-list-dialog-actions-apply');
    const getAspectCounter = (): string => testingUtils.getInnerTextByCSS('#aspect-list-dialog-counter');
    const getAspectCheckbox = (index: number): HTMLInputElement => testingUtils.getByCSS(`#aspect-list-${index}-check-input`).nativeElement;

    beforeEach(() => {
        data = {
            title: 'Title',
            description: 'Description that can be longer or shorter',
            overTableMessage: 'Over here',
            select: new Subject<string[]>(),
            excludedAspects: []
        };
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                provideApiTesting(),
                { provide: MAT_DIALOG_DATA, useValue: data },
                {
                    provide: MatDialogRef,
                    useValue: {
                        keydownEvents: () => of(event),
                        backdropClick: () => of(null),
                        close: jasmine.createSpy('close')
                    }
                }
            ]
        });
        fixture = TestBed.createComponent(AspectListDialogComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    describe('Without passing node id', () => {
        beforeEach(() => {
            aspectListService = TestBed.inject(AspectListService);
            spyOn(aspectListService, 'getAllAspects').and.returnValue(
                of({ standardAspectPaging: { list: { entries: aspectListMock } }, customAspectPaging: { list: { entries: customAspectListMock } } })
            );
            fixture.detectChanges();
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should show 4 actions : CLEAR, RESET, CANCEL and APPLY', () => {
            expect(getResetButton()).toBeDefined();
            expect(getClearButton()).toBeDefined();
            expect(getCancelButton()).toBeDefined();
            expect(getApplyButton()).toBeDefined();
        });

        it('should show basic information for the dialog', () => {
            const dialogTitleText = testingUtils.getInnerTextByCSS('[data-automation-id="aspect-list-dialog-title"] .adf-aspect-list-dialog-title');
            expect(dialogTitleText).toBe(data.title);

            const dialogDescription = testingUtils.getInnerTextByCSS(
                '[data-automation-id="aspect-list-dialog-title"] .adf-aspect-list-dialog-description'
            );
            expect(dialogDescription).toBe(data.description);

            expect(testingUtils.getInnerTextByCSS('#aspect-list-dialog-over-table-message')).toBe(data.overTableMessage);
            expect(getAspectCounter()).toBe('0 ADF-ASPECT-LIST.DIALOG.SELECTED');
        });

        it('should update the counter when an option is selected and unselected', async () => {
            const firstAspectCheckbox = getAspectCheckbox(0);
            expect(firstAspectCheckbox).toBeDefined();
            expect(getAspectCounter()).toBe('0 ADF-ASPECT-LIST.DIALOG.SELECTED');

            firstAspectCheckbox.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(getAspectCounter()).toBe('1 ADF-ASPECT-LIST.DIALOG.SELECTED');

            firstAspectCheckbox.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(getAspectCounter()).toBe('0 ADF-ASPECT-LIST.DIALOG.SELECTED');
        });

        it('should reset to the node values when Reset button is clicked', async () => {
            let firstAspectCheckbox = getAspectCheckbox(0);
            expect(firstAspectCheckbox).toBeDefined();

            firstAspectCheckbox.click();
            fixture.detectChanges();
            await fixture.whenStable();

            const resetButton: HTMLButtonElement = getResetButton().nativeElement;
            expect(resetButton).toBeDefined();
            expect(firstAspectCheckbox.checked).toBeTruthy();

            resetButton.click();
            fixture.detectChanges();
            await fixture.whenStable();

            firstAspectCheckbox = getAspectCheckbox(0);
            expect(firstAspectCheckbox.checked).toBeFalsy();
        });

        it('should clear all the value when Clear button is clicked', async () => {
            let firstAspectCheckbox = getAspectCheckbox(0);
            expect(firstAspectCheckbox).toBeDefined();
            expect(firstAspectCheckbox).not.toBeNull();

            firstAspectCheckbox.click();
            fixture.detectChanges();
            await fixture.whenStable();

            const clearButton: HTMLButtonElement = getClearButton().nativeElement;
            expect(clearButton).toBeDefined();
            expect(firstAspectCheckbox.checked).toBeTruthy();

            clearButton.click();
            fixture.detectChanges();
            await fixture.whenStable();

            firstAspectCheckbox = getAspectCheckbox(0);
            expect(firstAspectCheckbox.checked).toBeFalsy();
        });

        it('should complete the select stream Cancel button is clicked', (done) => {
            data.select.subscribe(
                () => {},
                () => {},
                () => done()
            );
            const cancelButton: HTMLButtonElement = getCancelButton().nativeElement;
            expect(cancelButton).toBeDefined();
            cancelButton.click();
            fixture.detectChanges();
        });
    });

    describe('Passing the node id', () => {
        beforeEach(async () => {
            data.nodeId = 'fake-node-id';
            aspectListService = TestBed.inject(AspectListService);
            nodeService = TestBed.inject(NodesApiService);
            spyOn(aspectListService, 'getAllAspects').and.returnValue(
                of({ standardAspectPaging: { list: { entries: aspectListMock } }, customAspectPaging: { list: { entries: customAspectListMock } } })
            );
            spyOn(aspectListService, 'getVisibleAspects').and.returnValue(['frs:AspectOne']);
            spyOn(aspectListService, 'getAspects').and.returnValue(of({ list: { entries: customAspectListMock } }));
            spyOn(nodeService, 'getNode').and.returnValue(
                of(new Node({ id: 'fake-node-id', aspectNames: ['frs:AspectOne', 'cst:customAspect'] })).pipe(delay(0))
            );
            fixture = TestBed.createComponent(AspectListDialogComponent);
            fixture.detectChanges();
            await fixture.whenStable();
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should show checked the current aspects of the node', async () => {
            fixture.detectChanges();
            await fixture.whenRenderingDone();
            const firstAspectCheckbox: HTMLInputElement = fixture.nativeElement.querySelector('#aspect-list-0-check-input');
            expect(firstAspectCheckbox).toBeDefined();
            expect(firstAspectCheckbox.checked).toBeTruthy();

            const notCheckedAspect: HTMLInputElement = fixture.nativeElement.querySelector('#aspect-list-1-check-input');
            expect(notCheckedAspect).toBeDefined();
            expect(notCheckedAspect.checked).toBeFalsy();

            const customAspectCheckbox: HTMLInputElement = fixture.nativeElement.querySelector('#aspect-list-2-check-input');
            expect(customAspectCheckbox).toBeDefined();
            expect(customAspectCheckbox.checked).toBeTruthy();
        });

        it('Should apply button be disabled by default', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const applyButton = fixture.nativeElement.querySelector('#aspect-list-dialog-actions-apply');
            expect(applyButton.disabled).toBe(true);
        });

        it('Should apply button get enabled when the aspect list gets updated', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            getClearButton().nativeElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(getApplyButton().nativeElement.disabled).toBe(false);
        });

        it('should announce the amount of selected aspects', () => {
            expect(testingUtils.getByCSS('#aspect-list-dialog-counter').nativeElement.getAttribute('aria-live')).toBe('polite');
        });
    });

    describe('AspectListComponent', () => {
        it('should have set excludedAspects from dialog data', () => {
            data.excludedAspects = ['some aspect 1', 'some aspect 2'];

            fixture.detectChanges();
            expect(fixture.debugElement.query(By.directive(AspectListComponent)).componentInstance.excludedAspects).toBe(data.excludedAspects);
        });
    });
});
