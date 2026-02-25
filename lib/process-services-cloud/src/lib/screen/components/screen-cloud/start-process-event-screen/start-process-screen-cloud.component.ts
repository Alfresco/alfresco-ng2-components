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

import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { BaseScreenCloudComponent } from '../base-screen/base-screen-cloud.component';
import { MatCardModule } from '@angular/material/card';

import { StartProcessScreenCloud } from './start-process-screen.model';

@Component({
    selector: 'adf-cloud-start-process-screen-cloud',
    imports: [MatCardModule],
    templateUrl: './start-process-screen-cloud.component.html',
    host: { class: 'adf-cloud-start-process-screen-cloud' },
    styleUrls: ['./start-process-screen-cloud.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartProcessScreenCloudComponent extends BaseScreenCloudComponent<StartProcessScreenCloud> {
    processDefinitionId = input('');
    screenStartProcessPayloadChange = output<unknown>();
    disableStartProcessButton = output<boolean>();

    showStartProcessButtons = signal(false);

    protected setInputsForDynamicComponent(): void {
        if (this.processDefinitionId()) {
            this.componentRef.setInput('processDefinitionId', this.processDefinitionId());
        }
    }

    protected subscribeToOutputs(): void {
        this.componentRef.instance.startProcessPayloadChanged.subscribe((payload) => this.screenStartProcessPayloadChange.emit(payload));
        this.componentRef.instance.defaultStartProcessButtonsConfigurationChange.subscribe((config) => {
            this.showStartProcessButtons.set(config.show);
            this.disableStartProcessButton.emit(config.disable);
        });
    }
}
