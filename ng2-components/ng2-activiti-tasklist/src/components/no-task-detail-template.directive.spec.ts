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

describe('NoTaskDetailsTemplateDirective', () => {

    let component: NoTaskDetailsTemplateDirective;
    let detailsComponent: TaskDetailsComponent;

    beforeEach(() => {
        detailsComponent = new TaskDetailsComponent(null, null, null, null);
        component = new NoTaskDetailsTemplateDirective(detailsComponent);
    });

    it('should set "no task details" template on task details component', () => {
        let testTemplate = 'blah blah';
        component.template = testTemplate;
        component.ngAfterContentInit();
        expect(detailsComponent.noTaskDetailsTemplateComponent).toBe(testTemplate);
    });

});
