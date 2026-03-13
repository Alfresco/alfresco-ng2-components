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

import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { BaseScreenCloudComponent } from '../base-screen/base-screen-cloud.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { StartProcessScreenCloud } from './start-process-screen.model';
import { TaskVariableCloud } from '../../../../form/models/task-variable-cloud.model';

@Component({
    selector: 'adf-cloud-start-process-screen-cloud',
    imports: [CommonModule, MatCardModule],
    templateUrl: './start-process-screen-cloud.component.html',
    host: { class: 'adf-cloud-start-process-screen-cloud' },
    styleUrls: ['./start-process-screen-cloud.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartProcessScreenCloudComponent extends BaseScreenCloudComponent<StartProcessScreenCloud> {
    readonly appName = input.required<string>();
    processDefinitionId = input('');
    readonly resolvedValues = input<TaskVariableCloud[]>();
    screenStartProcessPayloadChange = output<unknown>();
    disableStartProcessButton = output<boolean>();

    showStartProcessButtons = signal(false);

    constructor() {
        super();
        effect(() => {
            const componentRef = this.componentRefChanged();
            if (componentRef.instance && 'appName' in componentRef.instance) {
                componentRef.setInput('appName', this.appName());
            }
        });
        effect(() => this.componentRefChanged()?.setInput('processDefinitionId', this.processDefinitionId()));
        effect(() => {
            const componentRef = this.componentRefChanged();
            if (componentRef?.instance && 'resolvedValues' in componentRef.instance) {
                componentRef.setInput('resolvedValues', this.resolvedValues());
            }
        });
    }

    protected subscribeToOutputs(): void {
        this.componentRef.instance.startProcessPayloadChanged.subscribe((payload) => this.screenStartProcessPayloadChange.emit(payload));
        this.componentRef.instance.defaultStartProcessButtonsConfigurationChange.subscribe((config) => {
            this.showStartProcessButtons.set(config.show);
            this.disableStartProcessButton.emit(config.disable);
        });
    }
}
