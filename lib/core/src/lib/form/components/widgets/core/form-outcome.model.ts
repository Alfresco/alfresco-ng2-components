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

 /* eslint-disable @angular-eslint/component-selector */

import { FormWidgetModel } from './form-widget.model';
import { WidgetVisibilityModel } from '../../../models/widget-visibility.model';

export class FormOutcomeModel extends FormWidgetModel {

    static SAVE_ACTION: string = 'SAVE';            // Activiti 'Save' action name
    static COMPLETE_ACTION: string = 'COMPLETE';    // Activiti 'Complete' action name
    static START_PROCESS_ACTION: string = 'START PROCESS';    // Activiti 'Start Process' action name

    isSystem: boolean = false;
    isSelected: boolean = false;
    isVisible: boolean = true;
    visibilityCondition: WidgetVisibilityModel;

    constructor(form: any, json?: any) {
        super(form, json);

        if (json) {
            this.isSystem = json.isSystem ? true : false;
            this.isSelected = form && json.name === form.selectedOutcome ? true : false;
            this.visibilityCondition = new WidgetVisibilityModel(json.visibilityCondition);
        }
    }
}
