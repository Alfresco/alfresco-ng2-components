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

import { async, TestBed } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { MaterialModule } from '../material.module';

import { LoginComponent } from '../components/login.component';
import { LoginFooterDirective } from './login-footer.directive';

describe('LoginFooterDirective', () => {
    let component: LoginComponent;
    let directive: LoginFooterDirective;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                MaterialModule
            ],
            declarations: [
                LoginFooterDirective,
                LoginComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        let fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        directive = new LoginFooterDirective(component);
    });

    it('applies tempalate to Login component', () => {
        const template = {};
        directive.template = template;
        directive.ngAfterContentInit();
        expect(component.footerTemplate).toBe(template);
    });
});
