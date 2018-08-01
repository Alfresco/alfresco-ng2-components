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

import { Component, DebugElement } from '@angular/core';
import { fakeAsync, async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NodeSharedDirective } from './node-share.directive';
import { DialogModule } from '../dialogs/dialog.module';
import { MatDialog } from '@angular/material';

@Component({
    template: `
        <div [adf-share]="node">
        </div>`
})
class TestComponent {
    node = null;

    done = jasmine.createSpy('done');
}

describe('NodeSharedDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let component: TestComponent;
    let dialog: MatDialog;
    let dialogSpy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                DialogModule
            ],
            declarations: [
                TestComponent,
                NodeSharedDirective
            ]
        }).compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TestComponent);
                component = fixture.componentInstance;
                dialog = TestBed.get(MatDialog);
                element = fixture.debugElement.query(By.directive(NodeSharedDirective));
                dialogSpy = spyOn(dialog, 'open');
            });
    }));

    describe('Share', () => {

        it('should not share when selection has no nodes', () => {
            component.node = null;

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(dialogSpy).not.toHaveBeenCalled();
        });

        it('should not share when the selection node is a folder', () => {
            component.node = {
                entry: {
                    isFolder: true
                }
            };

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(dialogSpy).not.toHaveBeenCalled();
        });

        it('should share when the selection node is a file', () => {
            component.node = {
                entry: {
                    isFolder: false,
                    isFile: true
                }
            };

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(dialogSpy).toHaveBeenCalled();
        });

        it('should disable the button if no node is selected', fakeAsync(() => {
            component.node = null;

            fixture.detectChanges();

            expect(element.nativeElement.disabled).toEqual(true);
        }));

        it('should enable the button if nodes is selected and is a file', fakeAsync(() => {
            component.node = { entry: { id: '1', name: 'name1', isFolder: false, isFile: true } };

            fixture.detectChanges();

            expect(element.nativeElement.disabled).toEqual(false);
        }));

    });
});
