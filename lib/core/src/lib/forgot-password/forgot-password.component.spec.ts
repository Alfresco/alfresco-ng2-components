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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CoreTestingModule } from '../testing/core.testing.module';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ResetPasswordComponent', () => {
    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule],
            declarations: [ForgotPasswordComponent]
        });

        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('send instructions button should be disabled by default', async () => {
        expect(component.isButtonDisabled).toBeTruthy();
    });

    it('send instructions button should be disabled if username field is empty', async () => {
        component.forgotPasswordForm.controls['userName'].setValue('');

        expect(component.isButtonDisabled).toBeTruthy();
    });

    it('send instructions button should be enabled when username field is not empty', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        component.forgotPasswordForm.controls['userName'].setValue('userABC');
        spyOn(component, 'isButtonDisabled').and.callThrough();
        const sendInstructionsBtn = fixture.debugElement.nativeElement.querySelector('.adf-send-instructions-button');

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.isButtonDisabled).toHaveBeenCalled();
        expect(sendInstructionsBtn.disabled).toBeFalsy();
    });

    it('should send instructions to the email id corresponding to the username when the send instructions button is clicked', async () => {
        component.forgotPasswordForm.controls['userName'].setValue('userABC');
        spyOn(component, 'sendInstructions').and.callThrough();

        fixture.detectChanges();
        await fixture.whenStable();

        const sendInstructionsBtn = fixture.debugElement.nativeElement.querySelector('.adf-send-instructions-button');
        sendInstructionsBtn.dispatchEvent(new Event('click'));

        expect(component.sendInstructions).toHaveBeenCalled();
    });

    it('should route user back to login page when the close button is clicked', async () => {
        spyOn(component, 'close').and.callThrough();
        spyOn(router, 'navigate');

        fixture.detectChanges();
        await fixture.whenStable();

        const closeBtn = fixture.debugElement.nativeElement.querySelector('.adf-close-button');
        closeBtn.dispatchEvent(new Event('click'));

        expect(component.close).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['./login']);
    });
});
