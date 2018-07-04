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

import { Component, Input, ViewChild, OnInit, OnDestroy, OnChanges, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { sidenavAnimation, contentAnimation } from '../../helpers/animations';

@Component({
    selector: 'adf-layout-container',
    templateUrl: './layout-container.component.html',
    styleUrls: ['./layout-container.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [ sidenavAnimation, contentAnimation ]
})
export class LayoutContainerComponent implements OnInit, OnDestroy, OnChanges {
    @Input() sidenavMin: number;
    @Input() sidenavMax: number;

    // " | any", because Safari throws an error otherwise...
    @Input() mediaQueryList: MediaQueryList | any;

    @Input() hideSidenav = false;
    @Input() expandedSidenav = true;

    @ViewChild(MatSidenav) sidenav: MatSidenav;

    sidenavAnimationState: any;
    contentAnimationState: any;

    SIDENAV_STATES = { MOBILE: {}, EXPANDED: {}, COMPACT: {} };
    CONTENT_STATES = { MOBILE: {}, EXPANDED: {}, COMPACT: {} };

    constructor() {
        this.onMediaQueryChange = this.onMediaQueryChange.bind(this);
    }

    ngOnInit() {
        this.CONTENT_STATES.MOBILE = { value: 'expanded', params: { marginLeft: 0 } };
        this.configureSidenavMax(this.sidenavMax);
        this.configureSidenavMin(this.sidenavMin);
        this.mediaQueryList.addListener(this.onMediaQueryChange);
        this.updateSideNavAnimationState();
    }

    ngOnChanges(changes: SimpleChanges) {
        if ( changes.sidenavMax.currentValue !== changes.sidenavMax.previousValue) {
            this.configureSidenavMax(changes.sidenavMax.currentValue);
            this.updateSideNavAnimationState();
        }
        if ( changes.sidenavMin.currentValue !== changes.sidenavMin.previousValue) {
            this.configureSidenavMax(changes.sidenavMin.currentValue);
            this.updateSideNavAnimationState();
        }
    }

    ngOnDestroy(): void {
        this.mediaQueryList.removeListener(this.onMediaQueryChange);
    }

    private configureSidenavMax(sidenavMax: number) {
        this.SIDENAV_STATES.MOBILE = { value: 'expanded', params: { width: sidenavMax } };
        this.SIDENAV_STATES.EXPANDED = { value: 'expanded', params: { width: sidenavMax } };
        this.CONTENT_STATES.COMPACT = { value: 'compact', params: { marginLeft: sidenavMax } };
    }

    private configureSidenavMin(sidenavMin: number) {
        this.SIDENAV_STATES.COMPACT = { value: 'compact', params: {width: sidenavMin } };
        this.CONTENT_STATES.EXPANDED = { value: 'expanded', params: { marginLeft: sidenavMin } };
    }

    private updateSideNavAnimationState() {
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
}
