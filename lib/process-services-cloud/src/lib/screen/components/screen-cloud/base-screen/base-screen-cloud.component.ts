/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ComponentRef, inject, Input, OnDestroy, OnInit, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ScreenRenderingService } from '../../../services/screen-rendering.service';

@Component({
    template: ''
})
export abstract class BaseScreenCloudComponent<TScreenComponent = unknown> implements OnInit, OnDestroy {
    @Input()
    screenId: string = '';

    @ViewChild('container', { read: ViewContainerRef, static: true })
    container: ViewContainerRef | undefined;

    protected componentRef: ComponentRef<TScreenComponent> | undefined;
    private readonly _componentRefChanged = signal<ComponentRef<TScreenComponent> | undefined>(undefined);
    protected readonly componentRefChanged = this._componentRefChanged.asReadonly();
    protected readonly screenRenderingService = inject(ScreenRenderingService);

    ngOnInit() {
        this.createDynamicComponent();
    }

    ngOnDestroy(): void {
        this.componentRef?.destroy();
        this.componentRef = undefined;
        this._componentRefChanged.set(undefined);
    }

    private createDynamicComponent(): void {
        if (!this.screenId || !this.container) {
            return;
        }

        const componentType = this.screenRenderingService.resolveComponentType({ type: this.screenId });
        const componentRef: ComponentRef<TScreenComponent> = this.container.createComponent(componentType);

        this.componentRef = componentRef;
        this._componentRefChanged.set(componentRef);
        this.setInputsForDynamicComponent(componentRef);
        this.subscribeToOutputs(componentRef);
    }

    protected setInputsForDynamicComponent(_componentRef: ComponentRef<TScreenComponent>): void {}

    protected abstract subscribeToOutputs(componentRef: ComponentRef<TScreenComponent>): void;
}
