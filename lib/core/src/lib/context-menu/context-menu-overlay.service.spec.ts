/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Overlay } from '@angular/cdk/overlay';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CoreTestingModule } from '../testing/core.testing.module';
import { ContextMenuOverlayService } from './context-menu-overlay.service';
import { Injector } from '@angular/core';
import { setupTestBed } from '../testing/setupTestBed';
import { TestBed } from '@angular/core/testing';

describe('ContextMenuService', () => {
    let contextMenuOverlayService: ContextMenuOverlayService;
    let overlay: Overlay;
    let injector: Injector;
    const overlayConfig = {
        panelClass: 'test-panel',
        source: <MouseEvent> {
            clientY: 1,
            clientX: 1
        }
    };

    setupTestBed({
        imports: [NoopAnimationsModule, CoreTestingModule],
        providers: [ Overlay ]
    });

    beforeEach(() => {
        overlay = TestBed.get(Overlay);
        injector = TestBed.get(Injector);
    });

    describe('Overlay', () => {
        beforeEach(() => {
            contextMenuOverlayService = new ContextMenuOverlayService(
                injector,
                overlay
            );
        });

        it('should create a custom overlay', () => {
            contextMenuOverlayService.open(overlayConfig);

            expect(document.querySelector('.test-panel')).not.toBe(null);
        });

        it('should render component', () => {
            contextMenuOverlayService.open(overlayConfig);

            expect(document.querySelector('adf-context-menu')).not.toBe(null);
        });
    });
});
