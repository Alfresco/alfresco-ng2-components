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

import { Injectable, Injector, ElementRef, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { PortalInjector, ComponentPortal } from '@angular/cdk/portal';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContextMenuOverlayConfig } from './interfaces';
import { CONTEXT_MENU_DATA } from './context-menu.tokens';
import { ContextMenuListComponent } from './context-menu-list.component';

const DEFAULT_CONFIG: ContextMenuOverlayConfig = {
    panelClass: 'cdk-overlay-pane',
    backdropClass: 'cdk-overlay-transparent-backdrop',
    hasBackdrop: true
};

@Injectable({
    providedIn: 'root'
})
export class ContextMenuOverlayService {

    constructor(
        private injector: Injector,
        private overlay: Overlay
    ) {}

    open(config: ContextMenuOverlayConfig): ContextMenuOverlayRef {
        const overlayConfig = { ...DEFAULT_CONFIG, ...config };

        const overlay = this.createOverlay(overlayConfig);

        const overlayRef = new ContextMenuOverlayRef(overlay);

        this.attachDialogContainer(overlay, config, overlayRef);

        overlay.backdropClick().subscribe(() => overlayRef.close());

        // prevent native contextmenu on overlay element if config.hasBackdrop is true
        if (overlayConfig.hasBackdrop) {
            // eslint-disable-next-line no-underscore-dangle
            (overlay as any)._backdropElement
                .addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    // eslint-disable-next-line no-underscore-dangle
                    (overlay as any)._backdropClick.next(null);
                }, true);
        }

        return overlayRef;
    }

    private createOverlay(config: ContextMenuOverlayConfig): OverlayRef {
        const overlayConfig = this.getOverlayConfig(config);
        return this.overlay.create(overlayConfig);
    }

    private attachDialogContainer(overlay: OverlayRef, config: ContextMenuOverlayConfig, contextMenuOverlayRef: ContextMenuOverlayRef) {
        const injector = this.createInjector(config, contextMenuOverlayRef);

        const containerPortal = new ComponentPortal(ContextMenuListComponent, null, injector);
        const containerRef: ComponentRef<ContextMenuListComponent> = overlay.attach(containerPortal);

        return containerRef.instance;
    }

    private createInjector(config: ContextMenuOverlayConfig, contextMenuOverlayRef: ContextMenuOverlayRef): PortalInjector {
        const injectionTokens = new WeakMap();

        injectionTokens.set(ContextMenuOverlayRef, contextMenuOverlayRef);
        injectionTokens.set(CONTEXT_MENU_DATA, config.data);

        return new PortalInjector(this.injector, injectionTokens);
    }

    private getOverlayConfig(config: ContextMenuOverlayConfig): OverlayConfig {
        const { clientY, clientX  } = config.source;

        const fakeElement: any = {
            getBoundingClientRect: (): ClientRect => ({
                bottom: clientY,
                height: 0,
                left: clientX,
                right: clientX,
                top: clientY,
                width: 0
            } as any)
        };

        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(new ElementRef(fakeElement))
            .withPositions([{
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top'
            }]);

        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            panelClass: config.panelClass,
            scrollStrategy: this.overlay.scrollStrategies.close(),
            positionStrategy
        });

        return overlayConfig;
    }
}
