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

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AspectListDialogComponent } from './aspect-list-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { AspectListDialogComponentData } from './aspect-list-dialog-data.interface';
import { AspectListService } from './services/aspect-list.service';
import { delay } from 'rxjs/operators';
import { AspectEntry, MinimalNode } from '@alfresco/js-api';
import { NodesApiService } from '../common/services/nodes-api.service';

const aspectListMock: AspectEntry[] = [{
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
}];

const customAspectListMock: AspectEntry[] = [{
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
}];

describe('AspectListDialogComponent', () => {
    let fixture: ComponentFixture<AspectListDialogComponent>;
    let aspectListService: AspectListService;
    let nodeService: NodesApiService;
    let data: AspectListDialogComponentData;
    const event = new KeyboardEvent('keydown', {
        bubbles: true,
        keyCode: 27
    } as KeyboardEventInit );

    describe('Without passing node id', () => {

        beforeEach(async () => {
            data = {
                title: 'Title',
                description: 'Description that can be longer or shorter',
                overTableMessage: 'Over here',
                select: new Subject<string[]>()
            };

            TestBed.configureTestingModule({
                imports: [
                    TranslateModule.forRoot(),
                    ContentTestingModule,
                    MatDialogModule
                ],
                providers: [
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
            }).compileComponents();
        });

        beforeEach(() => {
            aspectListService = TestBed.inject(AspectListService);
            spyOn(aspectListService, 'getAspects').and.returnValue(of(aspectListMock));
            fixture = TestBed.createComponent(AspectListDialogComponent);
            fixture.detectChanges();
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should show 4 actions : CLEAR, RESET, CANCEL and APPLY', () => {
            expect(fixture.nativeElement.querySelector('#aspect-list-dialog-actions-reset')).not.toBeNull();
            expect(fixture.nativeElement.querySelector('#aspect-list-dialog-actions-reset')).toBeDefined();
            expect(fixture.nativeElement.querySelector('#aspect-list-dialog-actions-clear')).not.toBeNull();
            expect(fixture.nativeElement.querySelector('#aspect-list-dialog-actions-clear')).toBeDefined();
            expect(fixture.nativeElement.querySelector('#aspect-list-dialog-actions-cancel')).not.toBeNull();
            expect(fixture.nativeElement.querySelector('#aspect-list-dialog-actions-cancel')).toBeDefined();
            expect(fixture.nativeElement.querySelector('#aspect-list-dialog-actions-apply')).not.toBeNull();
            expect(fixture.nativeElement.querySelector('#aspect-list-dialog-actions-apply')).toBeDefined();
        });

        it('should show basic information for the dialog', () => {
            const dialogTitle = fixture.nativeElement.querySelector('[data-automation-id="aspect-list-dialog-title"] .adf-aspect-list-dialog-title');
            expect(dialogTitle).not.toBeNull();
            expect(dialogTitle.innerText).toBe(data.title);

            const dialogDescription = fixture.nativeElement.querySelector('[data-automation-id="aspect-list-dialog-title"] .adf-aspect-list-dialog-description');
            expect(dialogDescription).not.toBeNull();
            expect(dialogDescription.innerText).toBe(data.description);

            const overTableMessage = fixture.nativeElement.querySelector('#aspect-list-dialog-over-table-message');
            expect(overTableMessage).not.toBeNull();
            expect(overTableMessage.innerText).toBe(data.overTableMessage);

            const selectionCounter = fixture.nativeElement.querySelector('#aspect-list-dialog-counter');
            expect(selectionCounter).not.toBeNull();
            expect(selectionCounter.innerText).toBe('0 ADF-ASPECT-LIST.DIALOG.SELECTED');
        });

        it('should update the counter when an option is selcted and unselected', async () => {
            const firstAspectCheckbox: HTMLInputElement = fixture.nativeElement.querySelector('#aspect-list-0-check-input');
            expect(firstAspectCheckbox).toBeDefined();
            expect(firstAspectCheckbox).not.toBeNull();
            let selectionCounter = fixture.nativeElement.querySelector('#aspect-list-dialog-counter');
            expect(selectionCounter).not.toBeNull();
            expect(selectionCounter.innerText).toBe('0 ADF-ASPECT-LIST.DIALOG.SELECTED');
            firstAspectCheckbox.click();
            fixture.detectChanges();
            await fixture.whenStable();

            selectionCounter = fixture.nativeElement.querySelector('#aspect-list-dialog-counter');
            expect(selectionCounter).not.toBeNull();
            expect(selectionCounter.innerText).toBe('1 ADF-ASPECT-LIST.DIALOG.SELECTED');

            firstAspectCheckbox.click();
            fixture.detectChanges();
            await fixture.whenStable();

            selectionCounter = fixture.nativeElement.querySelector('#aspect-list-dialog-counter');
            expect(selectionCounter).not.toBeNull();
            expect(selectionCounter.innerText).toBe('0 ADF-ASPECT-LIST.DIALOG.SELECTED');
        });

        it('should reset to the node values when Reset button is clicked', async () => {
            let firstAspectCheckbox: HTMLInputElement = fixture.nativeElement.querySelector('#aspect-list-0-check-input');
            expect(firstAspectCheckbox).toBeDefined();
            expect(firstAspectCheckbox).not.toBeNull();
            firstAspectCheckbox.click();
            fixture.detectChanges();
            await fixture.whenStable();
            const resetButton: HTMLButtonElement = fixture.nativeElement.querySelector('#aspect-list-dialog-actions-reset');
            expect(resetButton).toBeDefined();
            expect(firstAspectCheckbox.checked).toBeTruthy();
            resetButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            firstAspectCheckbox = fixture.nativeElement.querySelector('#aspect-list-0-check-input');
            expect(firstAspectCheckbox.checked).toBeFalsy();
        });

        it('should clear all the value when Clear button is clicked', async () => {
            let firstAspectCheckbox: HTMLInputElement = fixture.nativeElement.querySelector('#aspect-list-0-check-input');
            expect(firstAspectCheckbox).toBeDefined();
            expect(firstAspectCheckbox).not.toBeNull();
            firstAspectCheckbox.click();
            fixture.detectChanges();
            await fixture.whenStable();
            const clearButton: HTMLButtonElement = fixture.nativeElement.querySelector('#aspect-list-dialog-actions-clear');
            expect(clearButton).toBeDefined();
            expect(firstAspectCheckbox.checked).toBeTruthy();
            clearButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            firstAspectCheckbox = fixture.nativeElement.querySelector('#aspect-list-0-check-input');
            expect(firstAspectCheckbox.checked).toBeFalsy();
        });

        it('should complete the select stream Cancel button is clicked', (done) => {
            data.select.subscribe(() => { }, () => { }, () => done());
            const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('#aspect-list-dialog-actions-cancel');
            expect(cancelButton).toBeDefined();
            cancelButton.click();
            fixture.detectChanges();
        });
    });

    describe('Passing the node id', () => {

        beforeEach(async () => {
            data = {
                title: 'Title',
                description: 'Description that can be longer or shorter',
                overTableMessage: 'Over here',
                select: new Subject<string[]>(),
                nodeId: 'fake-node-id'
            };

            TestBed.configureTestingModule({
                imports: [
                    TranslateModule.forRoot(),
                    ContentTestingModule,
                    MatDialogModule
                ],
                providers: [
                    { provide: MAT_DIALOG_DATA, useValue: data },
                    {
                        provide: MatDialogRef,
                        useValue: {
                            close: jasmine.createSpy('close'),
                            keydownEvents: () => of(event),
                            backdropClick: () => of(null)
                        }
                    }
                ]
            });
            await TestBed.compileComponents();
        });

        beforeEach(async () => {
            aspectListService = TestBed.inject(AspectListService);
            nodeService = TestBed.inject(NodesApiService);
            spyOn(aspectListService, 'getAspects').and.returnValue(of([...aspectListMock, ...customAspectListMock]));
            spyOn(aspectListService, 'getVisibleAspects').and.returnValue(['frs:AspectOne']);
            spyOn(aspectListService, 'getCustomAspects').and.returnValue(of(customAspectListMock));
            spyOn(nodeService, 'getNode').and.returnValue(of(new MinimalNode({ id: 'fake-node-id', aspectNames: ['frs:AspectOne', 'cst:customAspect'] })).pipe(delay(0)));
            fixture = TestBed.createComponent(AspectListDialogComponent);
            fixture.componentInstance.data.select = new Subject<string[]>();
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
            expect(firstAspectCheckbox).not.toBeNull();
            expect(firstAspectCheckbox.checked).toBeTruthy();

            const notCheckedAspect: HTMLInputElement = fixture.nativeElement.querySelector('#aspect-list-1-check-input');
            expect(notCheckedAspect).toBeDefined();
            expect(notCheckedAspect).not.toBeNull();
            expect(notCheckedAspect.checked).toBeFalsy();

            const customAspectCheckbox: HTMLInputElement = fixture.nativeElement.querySelector('#aspect-list-2-check-input');
            expect(customAspectCheckbox).toBeDefined();
            expect(customAspectCheckbox).not.toBeNull();
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

            const applyButton = fixture.nativeElement.querySelector('#aspect-list-dialog-actions-apply');

            fixture.nativeElement.querySelector('#aspect-list-dialog-actions-clear').click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(applyButton.disabled).toBe(false);
        });
    });

});
