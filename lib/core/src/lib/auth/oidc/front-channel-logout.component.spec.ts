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
import { AuthService } from './auth.service';
import { FrontChannelLogoutComponent } from './front-channel-logout.component';

describe('FrontChannelLogoutComponent', () => {
    let component: FrontChannelLogoutComponent;
    let fixture: ComponentFixture<FrontChannelLogoutComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
        await TestBed.configureTestingModule({
            imports: [FrontChannelLogoutComponent],
            providers: [{ provide: AuthService, useValue: authServiceSpy }]
        }).compileComponents();
        fixture = TestBed.createComponent(FrontChannelLogoutComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit - logout logic', () => {
        it('should always call logout on init', () => {
            component.ngOnInit();
            expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
        });
    });
});
