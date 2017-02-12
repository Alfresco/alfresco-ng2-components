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

import { ContextMenuService } from './context-menu.service';
import { ContextMenuHolderComponent } from './context-menu-holder.component';

describe('ContextMenuHolderComponent', () => {

    let contextMenuService;
    let menuHolder;

    beforeEach(() => {
        contextMenuService = new ContextMenuService();
        menuHolder = new ContextMenuHolderComponent(contextMenuService);
    });

    it('should show menu on service event', () => {
        spyOn(menuHolder, 'showMenu').and.callThrough();
        contextMenuService.show.next({});

        expect(menuHolder.showMenu).toHaveBeenCalled();
    });

    it('should have fixed position', () => {
        expect(menuHolder.locationCss).toEqual(
            jasmine.objectContaining({
                position: 'fixed'
            })
        );
    });

    it('should setup empty location by default', () => {
        expect(menuHolder.locationCss).toEqual(
            jasmine.objectContaining({
                left: '0px',
                top: '0px'
            })
        );
    });

    it('should be hidden by default', () => {
        expect(menuHolder.isShown).toBeFalsy();
        expect(menuHolder.locationCss).toEqual(
            jasmine.objectContaining({
                display: 'none'
            })
        );
    });

    it('should show on service event', () => {
        expect(menuHolder.isShown).toBeFalsy();
        contextMenuService.show.next({});
        expect(menuHolder.isShown).toBeTruthy();
    });

    xit('should update position from service event', () => {

        expect(menuHolder.locationCss).toEqual(
            jasmine.objectContaining({
                left: '0px',
                top: '0px'
            })
        );

        let event = new MouseEvent('click', {
            clientX: 10,
            clientY: 20
        });

        contextMenuService.show.next({ event: event });

        expect(menuHolder.locationCss).toEqual(
            jasmine.objectContaining({
                left: '10px',
                top: '20px'
            })
        );
    });

    it('should take links from service event', () => {
        let links = [{}, {}];
        contextMenuService.show.next({ obj: links });
        expect(menuHolder.links).toBe(links);
    });

    it('should hide on outside click', () => {
        contextMenuService.show.next({});
        expect(menuHolder.isShown).toBeTruthy();

        menuHolder.clickedOutside();
        expect(menuHolder.isShown).toBeFalsy();
        expect(menuHolder.locationCss).toEqual(
            jasmine.objectContaining({
                display: 'none'
            })
        );
    });

});
