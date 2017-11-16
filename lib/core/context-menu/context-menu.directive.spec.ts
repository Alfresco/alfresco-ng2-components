/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { ContextMenuDirective } from './context-menu.directive';
import { ContextMenuService } from './context-menu.service';

describe('ContextMenuDirective', () => {

    let contextMenuService;
    let directive;

    beforeEach(() => {
        contextMenuService = new ContextMenuService();
        directive = new ContextMenuDirective(contextMenuService);
        directive.enabled = true;
    });

    it('should show menu via service', (done) => {
        contextMenuService.show.subscribe(() => {
            done();
        });

        directive.links = [{}];
        directive.onShowContextMenu(null);
    });

    it('should prevent default behavior', () => {
        let event = new MouseEvent('click');
        spyOn(event, 'preventDefault').and.callThrough();

        directive.onShowContextMenu(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should forward event to service', () => {
        let event = new MouseEvent('click');

        contextMenuService.show.subscribe(e => {
            expect(e.event).toBeDefined();
            expect(e.event).toBe(event);
        });

        directive.onShowContextMenu(event);
    });

    it('should forward menu items to service', () => {
        let links = [{}, {}];
        directive.links = links;

        contextMenuService.show.subscribe(e => {
            expect(e.obj).toBeDefined();
            expect(e.obj).toBe(links);
        });

        directive.onShowContextMenu(null);
    });

});
