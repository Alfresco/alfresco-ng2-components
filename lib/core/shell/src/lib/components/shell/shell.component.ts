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

import { AppConfigService, SidenavLayoutComponent, SidenavLayoutModule } from '@alfresco/adf-core';
import { DynamicExtensionComponent } from '@alfresco/adf-extensions';
import { Component, DestroyRef, inject, Inject, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Directionality } from '@angular/cdk/bidi';
import { SHELL_APP_SERVICE, SHELL_NAVBAR_MAX_WIDTH, SHELL_NAVBAR_MIN_WIDTH, ShellAppService } from '../../services/shell-app.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-shell',
    imports: [CommonModule, SidenavLayoutModule, RouterModule, DynamicExtensionComponent],
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'app-shell' }
})
export class ShellLayoutComponent implements OnInit {
    @ViewChild('layout', { static: true })
    layout: SidenavLayoutComponent;

    isSmallScreen$: Observable<boolean>;

    expandedSidenav: boolean;
    minimizeSidenav = false;
    hideSidenav = false;
    sidenavMin: number;
    sidenavMax: number;
    direction: Directionality;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private router: Router,
        private appConfigService: AppConfigService,
        private breakpointObserver: BreakpointObserver,
        @Inject(SHELL_APP_SERVICE) private shellService: ShellAppService,
        @Optional() @Inject(SHELL_NAVBAR_MIN_WIDTH) navBarMinWidth: number,
        @Optional() @Inject(SHELL_NAVBAR_MAX_WIDTH) navbarMaxWidth: number
    ) {
        this.sidenavMin = navBarMinWidth ?? 70;
        this.sidenavMax = navbarMaxWidth ?? 320;
    }

    ngOnInit() {
        this.isSmallScreen$ = this.breakpointObserver.observe(['(max-width: 600px)']).pipe(map((result) => result.matches));

        this.hideSidenav = this.shellService.hideSidenavConditions.some((el) => this.router.routerState.snapshot.url.includes(el));
        this.minimizeSidenav = this.shellService.minimizeSidenavConditions.some((el) => this.router.routerState.snapshot.url.includes(el));

        if (!this.minimizeSidenav) {
            this.expandedSidenav = this.getSidenavState();
        } else {
            this.expandedSidenav = false;
        }

        this.router.events
            .pipe(
                withLatestFrom(this.isSmallScreen$),
                filter(([event, isSmallScreen]) => isSmallScreen && event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.layout.container.sidenav.close();
            });

        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((event: NavigationEnd) => {
                this.minimizeSidenav = this.shellService.minimizeSidenavConditions.some((el) => event.urlAfterRedirects.includes(el));
                this.hideSidenav = this.shellService.hideSidenavConditions.some((el) => event.urlAfterRedirects.includes(el));

                this.updateState();
            });
    }
    hideMenu(event: Event) {
        if (this.layout.container.isMobileScreenSize) {
            event.preventDefault();
            this.layout.container.toggleMenu();
        }
    }

    private updateState() {
        if (this.minimizeSidenav && !this.layout.isMenuMinimized) {
            this.layout.isMenuMinimized = true;
            if (!this.layout.container.isMobileScreenSize) {
                this.layout.container.toggleMenu();
            }
        }

        if (!this.minimizeSidenav) {
            if (this.getSidenavState() && this.layout.isMenuMinimized) {
                this.layout.isMenuMinimized = false;
                this.layout.container.toggleMenu();
            }
        }
    }

    onExpanded(state: boolean) {
        if (!this.minimizeSidenav && this.appConfigService.get('sideNav.preserveState')) {
            this.shellService.preferencesService.set('expandedSidenav', state);
        }
    }

    private getSidenavState(): boolean {
        const expand = this.appConfigService.get<boolean>('sideNav.expandedSidenav', true);
        const preserveState = this.appConfigService.get<boolean>('sideNav.preserveState', true);

        if (preserveState) {
            return this.shellService.preferencesService.get('expandedSidenav', expand.toString()) === 'true';
        }

        return expand;
    }
}
