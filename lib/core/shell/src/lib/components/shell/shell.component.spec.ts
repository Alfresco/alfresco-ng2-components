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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppConfigService } from '@alfresco/adf-core';
import { ShellLayoutComponent } from './shell.component';
import { provideRouter, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { ShellAppService, SHELL_APP_SERVICE } from '../../services/shell-app.service';
import { RouterTestingHarness } from '@angular/router/testing';

describe('AppLayoutComponent', () => {
    let fixture: ComponentFixture<ShellLayoutComponent>;
    let component: ShellLayoutComponent;
    let appConfig: AppConfigService;
    let shellAppService: ShellAppService;
    let routerHarness: RouterTestingHarness;

    beforeEach(async () => {
        const shellService: ShellAppService = {
            pageHeading$: of('Title'),
            hideSidenavConditions: [],
            minimizeSidenavConditions: [],
            preferencesService: {
                get: () => 'true',
                set: () => {}
            }
        };

        TestBed.configureTestingModule({
            imports: [RouterModule.forChild([]), ShellLayoutComponent],
            providers: [
                {
                    provide: SHELL_APP_SERVICE,
                    useValue: shellService
                },
                provideRouter([{ path: 'minimize', component: ShellLayoutComponent }])
            ]
        });

        fixture = TestBed.createComponent(ShellLayoutComponent);
        component = fixture.componentInstance;
        appConfig = TestBed.inject(AppConfigService);
        shellAppService = TestBed.inject(SHELL_APP_SERVICE);
        routerHarness = await RouterTestingHarness.create();
    });

    beforeEach(() => {
        appConfig.config.languages = [];
        appConfig.config.locale = 'en';
    });

    describe('sidenav state', () => {
        it('should get state from configuration', () => {
            appConfig.config.sideNav = {
                expandedSidenav: false,
                preserveState: false
            };

            fixture.detectChanges();

            expect(component.expandedSidenav).toBe(false);
        });

        it('should resolve state to true is no configuration', () => {
            appConfig.config.sidenav = {};

            fixture.detectChanges();

            expect(component.expandedSidenav).toBe(true);
        });

        it('should get state from user settings as true', () => {
            appConfig.config.sideNav = {
                expandedSidenav: false,
                preserveState: true
            };

            spyOn(shellAppService.preferencesService, 'get').and.callFake((key) => {
                if (key === 'expandedSidenav') {
                    return 'true';
                }
                return 'false';
            });

            fixture.detectChanges();

            expect(component.expandedSidenav).toBe(true);
        });

        it('should get state from user settings as false', () => {
            appConfig.config.sidenav = {
                expandedSidenav: false,
                preserveState: true
            };

            spyOn(shellAppService.preferencesService, 'get').and.callFake((key) => {
                if (key === 'expandedSidenav') {
                    return 'false';
                }
                return 'true';
            });

            fixture.detectChanges();

            expect(component.expandedSidenav).toBe(false);
        });
    });

    it('should close menu on mobile screen size', () => {
        component.minimizeSidenav = false;
        component.layout.container = {
            isMobileScreenSize: true,
            toggleMenu: () => {}
        };

        spyOn(component.layout.container, 'toggleMenu');
        fixture.detectChanges();

        component.hideMenu({ preventDefault: () => {} } as any);

        expect(component.layout.container.toggleMenu).toHaveBeenCalled();
    });

    it('should close menu on mobile screen size also when minimizeSidenav true', () => {
        fixture.detectChanges();
        component.minimizeSidenav = true;
        component.layout.container = {
            isMobileScreenSize: true,
            toggleMenu: () => {}
        };

        spyOn(component.layout.container, 'toggleMenu');
        fixture.detectChanges();

        component.hideMenu({ preventDefault: () => {} } as any);

        expect(component.layout.container.toggleMenu).toHaveBeenCalled();
    });

    it('should minimize menu when navigates to minimize url', async () => {
        shellAppService.minimizeSidenavConditions = ['/minimize'];
        component.layout.container = {
            isMobileScreenSize: false,
            isMenuMinimized: false,
            toggleMenu: () => {}
        };

        spyOn(component.layout.container, 'toggleMenu');

        fixture.detectChanges();
        await routerHarness.navigateByUrl('/minimize');
        fixture.detectChanges();

        expect(component.minimizeSidenav).toBeTrue();
        expect(component.layout.isMenuMinimized).toBeTrue();
        expect(component.layout.container.toggleMenu).toHaveBeenCalled();
    });

    it('should not minimize menu again when previous and current route contain minimize url', async () => {
        shellAppService.minimizeSidenavConditions = ['/minimize'];
        component.layout.container = {
            isMobileScreenSize: false,
            isMenuMinimized: false,
            toggleMenu: () => {}
        };

        spyOn(component.layout.container, 'toggleMenu');

        fixture.detectChanges();
        await routerHarness.navigateByUrl('/minimize?query=123');
        fixture.detectChanges();

        expect(component.minimizeSidenav).toBeTrue();

        await routerHarness.navigateByUrl('/minimize?query=456');
        fixture.detectChanges();

        expect(component.minimizeSidenav).toBeFalse();
    });
});
