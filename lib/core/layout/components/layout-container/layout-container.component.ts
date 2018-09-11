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

import { Component, Input, ViewChild, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { sidenavAnimation, contentAnimationLeft, contentAnimationRight } from '../../helpers/animations';

@Component({
    selector: 'adf-layout-container',
    templateUrl: './layout-container.component.html',
    styleUrls: ['./layout-container.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [sidenavAnimation, contentAnimationLeft, contentAnimationRight]
})
export class LayoutContainerComponent implements OnInit, OnDestroy {
    @Input() sidenavMin: number;
    @Input() sidenavMax: number;

    // " | any", because Safari throws an error otherwise...
    @Input() mediaQueryList: MediaQueryList | any;

    @Input() hideSidenav = false;
    @Input() expandedSidenav = true;

    /** The side that the drawer is attached to 'start' | 'end' page */
    @Input() position = 'start';

    @ViewChild(MatSidenav) sidenav: MatSidenav;

    sidenavAnimationState: any;
    contentAnimationState: any;

    SIDENAV_STATES = { MOBILE: {}, EXPANDED: {}, COMPACT: {} };
    CONTENT_STATES = { MOBILE: {}, EXPANDED: {}, COMPACT: {} };

    constructor() {
        this.onMediaQueryChange = this.onMediaQueryChange.bind(this);
    }

    ngOnInit() {
        this.SIDENAV_STATES.MOBILE = { value: 'expanded', params: { width: this.sidenavMax } };
        this.SIDENAV_STATES.EXPANDED = { value: 'expanded', params: { width: this.sidenavMax } };
        this.SIDENAV_STATES.COMPACT = { value: 'compact', params: { width: this.sidenavMin } };

        this.CONTENT_STATES.MOBILE = { value: 'expanded', params: { margin: 0 } };
        this.CONTENT_STATES.EXPANDED = { value: 'expanded', params: { margin: this.sidenavMin } };
        this.CONTENT_STATES.COMPACT = { value: 'compact', params: { margin: this.sidenavMax } };

        this.mediaQueryList.addListener(this.onMediaQueryChange);

        if (this.isMobileScreenSize) {
            this.sidenavAnimationState = this.SIDENAV_STATES.MOBILE;
            this.contentAnimationState = this.CONTENT_STATES.MOBILE;
        } else if (this.expandedSidenav) {
            this.sidenavAnimationState = this.SIDENAV_STATES.EXPANDED;
            this.contentAnimationState = this.CONTENT_STATES.COMPACT;
        } else {
            this.sidenavAnimationState = this.SIDENAV_STATES.COMPACT;
            this.contentAnimationState = this.CONTENT_STATES.EXPANDED;
        }
    }

    ngOnDestroy(): void {
        this.mediaQueryList.removeListener(this.onMediaQueryChange);
    }

    toggleMenu(): void {
        if (this.isMobileScreenSize) {
            this.sidenav.toggle();
        } else {
            this.sidenavAnimationState = this.toggledSidenavAnimation;
            this.contentAnimationState = this.toggledContentAnimation;
        }
    }

    private get toggledSidenavAnimation() {
        return this.sidenavAnimationState === this.SIDENAV_STATES.EXPANDED
            ? this.SIDENAV_STATES.COMPACT
            : this.SIDENAV_STATES.EXPANDED;
    }

    private get toggledContentAnimation() {
        if (this.isMobileScreenSize) {
            return this.CONTENT_STATES.MOBILE;
        }

        if (this.sidenavAnimationState === this.SIDENAV_STATES.EXPANDED) {
            return this.CONTENT_STATES.COMPACT;
        } else {
            return this.CONTENT_STATES.EXPANDED;
        }
    }

    get isMobileScreenSize(): boolean {
        return this.mediaQueryList.matches;
    }

    private onMediaQueryChange() {
        this.sidenavAnimationState = this.SIDENAV_STATES.EXPANDED;
        this.contentAnimationState = this.toggledContentAnimation;
    }

    getContentAnimationStateLeft() {
        if (this.position === 'start') {
            return this.contentAnimationState;
        } else {
            return { value: 'compact', params: { width: this.sidenavMin } };
        }
    }

    getContentAnimationStateRight() {
        if (this.position === 'end') {
            return this.contentAnimationState;

        } else {
            return { value: 'compact', params: { width: this.sidenavMin } };
        }
    }
}
