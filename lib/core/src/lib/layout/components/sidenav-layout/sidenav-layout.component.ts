/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChild,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { UserPreferencesService } from '../../../common/services/user-preferences.service';
import { SidenavLayoutContentDirective } from '../../directives/sidenav-layout-content.directive';
import { SidenavLayoutHeaderDirective } from '../../directives/sidenav-layout-header.directive';
import { SidenavLayoutNavigationDirective } from '../../directives/sidenav-layout-navigation.directive';
import { BehaviorSubject } from 'rxjs';
import { Direction } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { LayoutContainerComponent } from '../layout-container/layout-container.component';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: 'adf-sidenav-layout',
    standalone: true,
    imports: [CommonModule, LayoutContainerComponent],
    templateUrl: './sidenav-layout.component.html',
    styleUrls: ['./sidenav-layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-sidenav-layout' }
})
export class SidenavLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
    static STEP_OVER = 600;

    /** The direction of the layout. 'ltr' or 'rtl' */
    dir: Direction = 'ltr';

    /** The side that the drawer is attached to. Possible values are 'start' and 'end'. */
    @Input() position: 'start' | 'end' = 'start';

    /** Minimum size of the navigation region. */
    @Input() sidenavMin: number;

    /** Maximum size of the navigation region. */
    @Input() sidenavMax: number;

    /** Screen size at which display switches from small screen to large screen configuration. */
    @Input() stepOver: number;

    /** Toggles showing/hiding the navigation region. */
    @Input() hideSidenav = false;

    /** Should the navigation region be expanded initially? */
    @Input() expandedSidenav = true;

    /** Emitted when the menu toggle and the collapsed/expanded state of the sideNav changes. */
    @Output() expanded = new EventEmitter<boolean>();

    @ContentChild(SidenavLayoutHeaderDirective)
    headerDirective: SidenavLayoutHeaderDirective;

    @ContentChild(SidenavLayoutNavigationDirective)
    navigationDirective: SidenavLayoutNavigationDirective;

    @ContentChild(SidenavLayoutContentDirective)
    contentDirective: SidenavLayoutContentDirective;

    private menuOpenStateSubject = new BehaviorSubject<boolean>(false);
    public menuOpenState$ = this.menuOpenStateSubject.asObservable();

    @ViewChild('container', { static: true }) container: any;
    @ViewChild('emptyTemplate', { static: true }) emptyTemplate: any;

    mediaQueryList: MediaQueryList;
    _isMenuMinimized;

    templateContext = {
        toggleMenu: () => {},
        isMenuMinimized: () => this.isMenuMinimized
    };

    private destroyRef = inject(DestroyRef);

    constructor(
        private readonly mediaMatcher: MediaMatcher,
        private readonly userPreferencesService: UserPreferencesService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        this.onMediaQueryChange = this.onMediaQueryChange.bind(this);
    }

    ngOnInit() {
        const initialMenuState = !this.expandedSidenav;

        const stepOver = this.stepOver || SidenavLayoutComponent.STEP_OVER;
        this.isMenuMinimized = initialMenuState;

        this.mediaQueryList = this.mediaMatcher.matchMedia(`(max-width: ${stepOver}px)`);
        this.mediaQueryList.addListener(this.onMediaQueryChange);

        this.userPreferencesService
            .select('textOrientation')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((direction: Direction) => {
                this.dir = direction;
            });
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
        this.changeDetectorRef.detectChanges();

        this.container.toggleMenu();
        this.expanded.emit(!this.isMenuMinimized);
    }

    get isMenuMinimized() {
        return this._isMenuMinimized;
    }

    set isMenuMinimized(menuState: boolean) {
        this._isMenuMinimized = menuState;
        this.menuOpenStateSubject.next(!menuState);
    }

    get isHeaderInside() {
        return this.mediaQueryList.matches;
    }

    get headerTemplate(): TemplateRef<any> {
        return this?.headerDirective?.template || this.emptyTemplate;
    }

    get navigationTemplate(): TemplateRef<any> {
        return this?.navigationDirective?.template || this.emptyTemplate;
    }

    get contentTemplate(): TemplateRef<any> {
        return this?.contentDirective?.template || this.emptyTemplate;
    }

    onMediaQueryChange() {
        this.isMenuMinimized = false;
        this.expanded.emit(!this.isMenuMinimized);
    }
}
