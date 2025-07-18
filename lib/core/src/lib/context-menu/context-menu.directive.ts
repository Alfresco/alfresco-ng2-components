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

/* eslint-disable @angular-eslint/no-input-rename */

import { Directive, HostListener, Input } from '@angular/core';
import { ContextMenuOverlayService } from './context-menu-overlay.service';

@Directive({
    selector: '[adf-context-menu]'
})
export class ContextMenuDirective {
    /** Items for the menu. */
    @Input('adf-context-menu')
    links: any[] | (() => any[]);

    /** Is the menu enabled? */
    @Input('adf-context-menu-enabled')
    enabled: boolean = false;

    constructor(private contextMenuService: ContextMenuOverlayService) {}

    @HostListener('contextmenu', ['$event'])
    onShowContextMenu(event?: MouseEvent) {
        if (this.enabled) {
            if (event) {
                event.preventDefault();
            }

            if (this.links) {
                const actions = typeof this.links === 'function' ? this.links() : this.links;
                if (actions.length > 0) {
                    this.contextMenuService.open({
                        source: event,
                        data: actions
                    });
                }
            }
        }
    }
}
