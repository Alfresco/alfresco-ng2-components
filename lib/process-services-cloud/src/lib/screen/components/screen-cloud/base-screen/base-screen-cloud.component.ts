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

import { Component, ComponentRef, inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ScreenRenderingService } from '../../../services/screen-rendering.service';

@Component({
    template: ''
})
export abstract class BaseScreenCloudComponent<TScreenComponent = unknown> implements OnInit {
    @Input()
    screenId: string = '';

    @ViewChild('container', { read: ViewContainerRef, static: true })
    container: ViewContainerRef;

    protected componentRef: ComponentRef<TScreenComponent>;
    protected readonly screenRenderingService = inject(ScreenRenderingService);

    ngOnInit() {
        this.createDynamicComponent();
    }

    private createDynamicComponent(): void {
        if (this.screenId) {
            const componentType = this.screenRenderingService.resolveComponentType({ type: this.screenId });
            this.componentRef = this.container.createComponent(componentType);
            this.setInputsForDynamicComponent();
            this.subscribeToOutputs();
        }
    }

    protected abstract setInputsForDynamicComponent(): void;

    protected abstract subscribeToOutputs(): void;
}
