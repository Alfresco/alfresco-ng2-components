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

import { NoTaskDetailsTemplateDirective } from './no-task-detail-template.directive';
import { TaskDetailsComponent } from './task-details.component';
import { FormRenderingService, AuthenticationService } from '@alfresco/adf-core';
import { of } from 'rxjs';

describe('NoTaskDetailsTemplateDirective', () => {

    let component: NoTaskDetailsTemplateDirective;
    let detailsComponent: TaskDetailsComponent;
    let authService: AuthenticationService;

    beforeEach(() => {
        authService = new AuthenticationService(null, null, null, null);
        spyOn(authService, 'getBpmLoggedUser').and.returnValue(of({ email: 'fake-email'}));
        detailsComponent = new TaskDetailsComponent(null, authService, null, new FormRenderingService(), null, null, null);
        component = new NoTaskDetailsTemplateDirective(detailsComponent);
    });

    it('should set "no task details" template on task details component', () => {
        let testTemplate: any = 'test template';
        component.template = testTemplate;
        component.ngAfterContentInit();
        expect(detailsComponent.noTaskDetailsTemplateComponent).toBe(testTemplate);
    });

});
