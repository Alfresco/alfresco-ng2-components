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

import { Component, ContentChild, Input, OnInit, AfterViewInit, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SidenavLayoutContentDirective } from '../../directives/sidenav-layout-content.directive';
import { SidenavLayoutHeaderDirective } from '../../directives/sidenav-layout-header.directive';
import { SidenavLayoutNavigationDirective } from '../../directives/sidenav-layout-navigation.directive';

@Component({
    selector: 'adf-sidenav-layout',
    templateUrl: './sidenav-layout.component.html',
    styleUrls: ['./sidenav-layout.component.scss']
})
export class SidenavLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

    static STEP_OVER = 600;

    @Input() sidenavMin: number;
    @Input() sidenavMax: number;
    @Input() stepOver: number;
    @Input() hideSidenav = false;
    @Input() expandedSidenav = true;

    @ContentChild(SidenavLayoutHeaderDirective) headerDirective: SidenavLayoutHeaderDirective;
    @ContentChild(SidenavLayoutNavigationDirective) navigationDirective: SidenavLayoutNavigationDirective;
    @ContentChild(SidenavLayoutContentDirective) contentDirective: SidenavLayoutContentDirective;

    @ViewChild('container') container: any;
    @ViewChild('emptyTemplate') emptyTemplate: any;

    mediaQueryList: MediaQueryList;
    isMenuMinimized;
    templateContext = {
        toggleMenu: () => {},
        isMenuMinimized: () => this.isMenuMinimized
    };

    constructor(private mediaMatcher: MediaMatcher) {
        this.onMediaQueryChange = this.onMediaQueryChange.bind(this);
    }

    ngOnInit() {
        const stepOver = this.stepOver || SidenavLayoutComponent.STEP_OVER;
        this.isMenuMinimized = !this.expandedSidenav;
        this.mediaQueryList = this.mediaMatcher.matchMedia(`(max-width: ${stepOver}px)`);
        this.mediaQueryList.addListener(this.onMediaQueryChange);
    }

    ngAfterViewInit() {
        this.templateContext.toggleMenu = this.toggleMenu.bind(this);
    }

    ngOnDestroy(): void {
        this.mediaQueryList.removeListener(this.onMediaQueryChange);
    }

    toggleMenu() {
        if (!this.mediaQueryList.matches) {
            this.isMenuMinimized = !this.isMenuMinimized;
        } else {
            this.isMenuMinimized = false;
        }

        this.container.toggleMenu();
    }

    get isHeaderInside() {
        return this.mediaQueryList.matches;
    }

    get headerTemplate(): TemplateRef<any> {
        return this.headerDirective && this.headerDirective.template || this.emptyTemplate;
    }

    get navigationTemplate(): TemplateRef<any> {
        return this.navigationDirective && this.navigationDirective.template || this.emptyTemplate;
    }

    get contentTemplate(): TemplateRef<any> {
        return this.contentDirective && this.contentDirective.template || this.emptyTemplate;
    }

    onMediaQueryChange() {
        this.isMenuMinimized = false;
    }
}
