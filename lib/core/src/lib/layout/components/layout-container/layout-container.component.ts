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

import { Component, Input, ViewChild, OnInit, OnDestroy, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Direction } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'adf-layout-container',
    imports: [CommonModule, MatSidenavModule],
    templateUrl: './layout-container.component.html',
    styleUrls: ['./layout-container.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('sidenavAnimation', [
            state('expanded', style({ width: '{{ width }}px' }), { params: { width: 0 } }),
            state('compact', style({ width: '{{ width }}px' }), { params: { width: 0 } }),
            transition('compact <=> expanded', animate('0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'))
        ]),
        trigger('contentAnimationLeft', [
            state(
                'expanded',
                style({
                    'margin-left': '{{ margin-left }}px',
                    'margin-right': '{{ margin-right }}px'
                }),
                { params: { 'margin-left': 0, 'margin-right': 0 } }
            ),
            state(
                'compact',
                style({
                    'margin-left': '{{ margin-left }}px',
                    'margin-right': '{{ margin-right }}px'
                }),
                { params: { 'margin-left': 0, 'margin-right': 0 } }
            ),
            transition('expanded <=> compact', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
        ])
    ]
})
export class LayoutContainerComponent implements OnInit, OnDestroy, OnChanges {
    @Input() sidenavMin: number;
    @Input() sidenavMax: number;

    // " | any", because Safari throws an error otherwise...
    @Input() mediaQueryList: MediaQueryList | any;

    @Input() hideSidenav = false;
    @Input() expandedSidenav = true;

    /** The side that the drawer is attached to 'start' | 'end' page */
    @Input() position: 'start' | 'end' = 'start';

    /** Layout text orientation 'ltr' | 'rtl' */
    @Input() direction: Direction = 'ltr';

    @ViewChild(MatSidenav, { static: true }) sidenav: MatSidenav;

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

        this.CONTENT_STATES.MOBILE = { value: 'expanded' };

        this.mediaQueryList?.addListener(this.onMediaQueryChange);

        this.updateSidenavState();
    }

    ngOnDestroy(): void {
        this.mediaQueryList?.removeListener(this.onMediaQueryChange);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.direction) {
            this.contentAnimationState = this.toggledContentAnimation;
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

    get isMobileScreenSize(): boolean {
        return !!this.mediaQueryList?.matches;
    }

    getContentAnimationState(): any {
        return this.contentAnimationState;
    }

    private get toggledSidenavAnimation(): any {
        return this.sidenavAnimationState === this.SIDENAV_STATES.EXPANDED ? this.SIDENAV_STATES.COMPACT : this.SIDENAV_STATES.EXPANDED;
    }

    private get toggledContentAnimation(): any {
        if (this.isMobileScreenSize) {
            return this.CONTENT_STATES.MOBILE;
        }

        if (this.sidenavAnimationState === this.SIDENAV_STATES.EXPANDED) {
            if (this.position === 'start' && this.direction === 'ltr') {
                return { value: 'compact', params: { 'margin-left': this.sidenavMax } };
            }

            if (this.position === 'start' && this.direction === 'rtl') {
                return { value: 'compact', params: { 'margin-right': this.sidenavMax } };
            }

            if (this.position === 'end' && this.direction === 'ltr') {
                return { value: 'compact', params: { 'margin-right': this.sidenavMax } };
            }

            if (this.position === 'end' && this.direction === 'rtl') {
                return { value: 'compact', params: { 'margin-left': this.sidenavMax } };
            }
        } else {
            if (this.position === 'start' && this.direction === 'ltr') {
                return { value: 'expanded', params: { 'margin-left': this.sidenavMin } };
            }

            if (this.position === 'start' && this.direction === 'rtl') {
                return { value: 'expanded', params: { 'margin-right': this.sidenavMin } };
            }

            if (this.position === 'end' && this.direction === 'ltr') {
                return { value: 'expanded', params: { 'margin-right': this.sidenavMin } };
            }

            if (this.position === 'end' && this.direction === 'rtl') {
                return { value: 'expanded', params: { 'margin-left': this.sidenavMin } };
            }
        }
    }

    private onMediaQueryChange(): void {
        this.updateSidenavState();
    }

    private updateSidenavState(): void {
        if (this.isMobileScreenSize) {
            this.sidenavAnimationState = this.SIDENAV_STATES.MOBILE;
            this.contentAnimationState = this.CONTENT_STATES.MOBILE;
        } else {
            if (this.expandedSidenav && !this.hideSidenav) {
                this.sidenavAnimationState = this.SIDENAV_STATES.EXPANDED;
                this.contentAnimationState = this.toggledContentAnimation;
                this.sidenav.open();
            } else {
                this.sidenavAnimationState = this.SIDENAV_STATES.COMPACT;
                this.contentAnimationState = this.toggledContentAnimation;
            }
        }
    }
}
