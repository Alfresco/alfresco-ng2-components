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
import { OidcAuthenticationService } from '../../auth/oidc/oidc-authentication.service';
import { LoginComponent } from '../components/login/login.component';
import { LoginHeaderDirective } from './login-header.directive';
import { provideCoreAuthTesting } from '../../testing';

describe('LoginHeaderDirective', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;
    let directive: LoginHeaderDirective;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [provideCoreAuthTesting(), { provide: OidcAuthenticationService, useValue: {} }]
        });
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        directive = new LoginHeaderDirective(component);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('applies template to Login component', () => {
        const template: any = 'test template';
        directive.template = template;
        directive.ngAfterContentInit();
        expect(component.headerTemplate).toBe(template);
    });
});
