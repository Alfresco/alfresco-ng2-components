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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';

import { AuthenticationService, CoreModule } from 'ng2-alfresco-core';

describe('LogoutDirective', () => {

    @Component({
        selector: 'adf-test-component',
        template: '<button adf-logout></button>'
    })
    class TestComponent {}

    let fixture: ComponentFixture<TestComponent>;
    let router: Router;
    let authService: AuthenticationService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                CoreModule
            ],
            declarations: [
                TestComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        router = TestBed.get(Router);
        authService = TestBed.get(AuthenticationService);
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
    });

    it('should redirect to login on click', () => {
        spyOn(router, 'navigate').and.callThrough();
        spyOn(authService, 'logout').and.returnValue(Observable.of(true));

        const button = fixture.nativeElement.querySelector('button');
        button.click();

        expect(authService.logout).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([ '/login' ]);
    });

    it('should redirect to login even on logout error', () => {
        spyOn(router, 'navigate').and.callThrough();
        spyOn(authService, 'logout').and.returnValue(Observable.throw('err'));

        const button = fixture.nativeElement.querySelector('button');
        button.click();

        expect(authService.logout).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([ '/login' ]);
    });

});
