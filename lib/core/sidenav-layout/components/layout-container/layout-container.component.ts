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

import { Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { sidenavAnimation, contentAnimation } from '../../helpers/animations';

@Component({
    selector: 'adf-layout-container',
    templateUrl: './layout-container.component.html',
    styleUrls: ['./layout-container.component.scss'],
    animations: [ sidenavAnimation, contentAnimation ]
})
export class LayoutContainerComponent implements OnInit, OnDestroy {
    @Input() sidenavMin: number;
    @Input() sidenavMax: number;
    @Input() mediaQueryList: MediaQueryList;
    @Input() hideSidenav = false;

    @ViewChild(MatSidenav) sidenav: MatSidenav;

    sidenavAnimationState: any;
    contentAnimationState: any;

    SIDENAV_STATES = { EXPANDED: {}, COMPACT: {} };
    CONTENT_STATES = { MOBILE: {}, EXPANDED: {}, COMPACT: {} };

    constructor() {
        this.onMediaQueryChange = this.onMediaQueryChange.bind(this);
    }

    ngOnInit() {
        this.SIDENAV_STATES.EXPANDED = { value: 'expanded', params: { width: this.sidenavMax } };
        this.SIDENAV_STATES.COMPACT = { value: 'compact', params: {width: this.sidenavMin } };
        this.CONTENT_STATES.MOBILE = { value: 'expanded', params: { marginLeft: 0 } };
        this.CONTENT_STATES.EXPANDED = { value: 'expanded', params: { marginLeft: this.sidenavMin } };
        this.CONTENT_STATES.COMPACT = { value: 'compact', params: { marginLeft: this.sidenavMax } };

        this.mediaQueryList.addListener(this.onMediaQueryChange);

        this.sidenavAnimationState = this.SIDENAV_STATES.EXPANDED;
        this.contentAnimationState = this.isMobileScreenSize ? this.CONTENT_STATES.MOBILE : this.CONTENT_STATES.COMPACT;
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

    private get isMobileScreenSize(): boolean {
        return this.mediaQueryList.matches;
    }

    private onMediaQueryChange() {
        this.sidenavAnimationState = this.SIDENAV_STATES.EXPANDED;
        this.contentAnimationState = this.toggledContentAnimation;
    }
}
