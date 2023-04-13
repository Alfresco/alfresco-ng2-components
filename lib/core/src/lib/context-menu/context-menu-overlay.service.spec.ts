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

import { Overlay } from '@angular/cdk/overlay';
import { CoreTestingModule } from '../testing/core.testing.module';
import { ContextMenuOverlayService } from './context-menu-overlay.service';
import { Injector } from '@angular/core';
import { setupTestBed } from '../testing/setup-test-bed';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ContextMenuOverlayService', () => {
    let contextMenuOverlayService: ContextMenuOverlayService;
    let overlay: Overlay;
    let injector: Injector;
    const overlayConfig = {
        panelClass: 'test-panel',
        source: {
            clientY: 1,
            clientX: 1
        } as MouseEvent
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        providers: [ Overlay ]
    });

    beforeEach(() => {
        overlay = TestBed.inject(Overlay);
        injector = TestBed.inject(Injector);
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
