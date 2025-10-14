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

import { Component, input, output } from '@angular/core';
import {
    StartProcessScreenCloud,
    StartProcessScreenDefaultButtons
} from '../screen/components/screen-cloud/start-process-event-screen/start-process-screen.model';

@Component({
    selector: 'adf-cloud-mock-screen-component',
    template: `<div>Mock Screen Component</div>`
})
export class MockedTaskScreenCloudComponent implements StartProcessScreenCloud {
    processDefinitionId = input('');
    defaultStartProcessButtonsConfigurationChange = output<StartProcessScreenDefaultButtons>();
    startProcessPayloadChanged = output<unknown>();
}
