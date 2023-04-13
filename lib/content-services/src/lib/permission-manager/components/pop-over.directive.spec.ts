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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopOverDirective } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
    template: `
        <div [adf-pop-over]="popOver" [autofocusedElementSelector]="'#test'" [target]="target" #target tabindex="0" [panelClass]="'adf-popover-test'">
        </div>
        <ng-template #popOver>
            <div id="test" tabindex="0"></div>
        </ng-template>
    `
})
class PopOverTestComponent {}

describe('PopOverDirective', () => {
    let fixture: ComponentFixture<PopOverTestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [OverlayModule],
            declarations: [
                PopOverDirective,
                PopOverTestComponent
            ]
        });
        fixture = TestBed.createComponent(PopOverTestComponent);
    });

    it('should focus element indicated by autofocusedElementSelector on pop over trigger click', () => {
        const popOverTrigger = fixture.debugElement.query(By.directive(PopOverDirective)).nativeElement;
        fixture.detectChanges();
        popOverTrigger.click();
        expect(fixture.debugElement.query(By.css('#test')).nativeElement).toBe(document.activeElement);
    });

    it('should focus element indicated by autofocusedElementSelector on pop over trigger enter keyup', () => {
        const popOverTrigger = fixture.debugElement.query(By.directive(PopOverDirective)).nativeElement;
        fixture.detectChanges();
        popOverTrigger.dispatchEvent(new KeyboardEvent('keyup', {
            key: 'Enter'
        }));
        expect(fixture.debugElement.query(By.css('#test')).nativeElement).toBe(document.activeElement);
    });

    it('should focus pop over trigger on document esc keyup if pop over is open', () => {
        const popOverTrigger = fixture.debugElement.query(By.directive(PopOverDirective)).nativeElement;
        fixture.detectChanges();
        popOverTrigger.click();
        document.dispatchEvent(new KeyboardEvent('keyup', {
            key: 'Escape'
        }));
        expect(popOverTrigger).toBe(document.activeElement);
    });

    it('should not focus pop over trigger on document esc keyup if pop over is not open', () => {
        const popOverTrigger = fixture.debugElement.query(By.directive(PopOverDirective)).nativeElement;
        fixture.detectChanges();
        document.dispatchEvent(new KeyboardEvent('keyup', {
            key: 'Escape'
        }));
        expect(popOverTrigger).not.toEqual(document.activeElement);
    });

    it('should open pop over on enter key press if pop over is not open', () => {
        const popOverTrigger = fixture.debugElement.query(By.directive(PopOverDirective)).nativeElement;
        fixture.detectChanges();
        popOverTrigger.dispatchEvent(new KeyboardEvent('keyup', {
            key: 'Enter'
        }));
        fixture.detectChanges();
        const popOverPanel = document.querySelector('.adf-popover-test');
        expect(popOverPanel).toBeDefined();
    });

    it('should close pop over on enter key press if pop over is open', () => {
        const popOverTrigger = fixture.debugElement.query(By.directive(PopOverDirective)).nativeElement;
        fixture.detectChanges();
        popOverTrigger.click();
        fixture.detectChanges();
        popOverTrigger.dispatchEvent(new KeyboardEvent('keyup', {
            key: 'Enter'
        }));
        fixture.detectChanges();
        const popOverPanel = document.querySelector('.adf-popover-test');
        expect(popOverPanel).toBeNull();
    });
});
