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

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialog } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppsProcessService, setupTestBed } from '@alfresco/adf-core';
import { deployedApps } from '../mock/apps-list.mock';
import { of } from 'rxjs';

import { SelectAppsDialogComponent } from './select-apps-dialog-component';
import { ProcessTestingModule } from '../testing/process.testing.module';

@Component({
    selector: 'adf-dialog-test',
    template: ''
})
export class DialogSelectAppTestComponent {
    processId: any;
    dialogRef: any;

    constructor(private dialog: MatDialog) {}

    startProcessAction() {
        this.dialogRef = this.dialog.open(SelectAppsDialogComponent, {
            width: '630px'
        });

        this.dialogRef.afterClosed().subscribe(selectedProcess => {
            this.processId = selectedProcess.id;
        });
    }
}

describe('Select app dialog', () => {
    let fixture: ComponentFixture<DialogSelectAppTestComponent>;
    let component: DialogSelectAppTestComponent;
    let dialogRef = {
        close: jasmine.createSpy('close')
    };
    let overlayContainerElement: HTMLElement;
    let service: AppsProcessService;

    setupTestBed({
        imports: [ProcessTestingModule],
        declarations: [DialogSelectAppTestComponent],
        providers: [
            AppsProcessService,
            {
                provide: OverlayContainer,
                useFactory: () => {
                    overlayContainerElement = document.createElement('div');
                    return {
                        getContainerElement: () => overlayContainerElement
                    };
                }
            },
            {
                provide: MatDialogRef,
                useValue: dialogRef
            },
            {
                provide: MAT_DIALOG_DATA,
                useValue: {}
            }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogSelectAppTestComponent);
        component = fixture.componentInstance;

        service = TestBed.get(AppsProcessService);

        spyOn(service, 'getDeployedApplications').and.returnValue(
            of(deployedApps)
        );
    });

    describe('Dialog', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should init title and dropdown', () => {
            component.startProcessAction();

            expect(
                overlayContainerElement.querySelector(
                    '.adf-selet-app-dialog-title'
                )
            ).toBeDefined();
            expect(
                overlayContainerElement.querySelector(
                    '.adf-selet-app-dialog-dropdown'
                )
            ).toBeDefined();
        });
    });
});
