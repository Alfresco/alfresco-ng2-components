/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppConfigService, SidenavLayoutModule } from '@alfresco/adf-core';
import { ShellLayoutComponent } from './shell.component';
import { Router, NavigationStart, RouterModule } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { ShellAppService, SHELL_APP_SERVICE } from '../../services/shell-app.service';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockRouter {
  private url = 'some-url';
  private subject = new Subject();
  events = this.subject.asObservable();
  routerState = { snapshot: { url: this.url } };

  navigateByUrl(url: string) {
    const navigationStart = new NavigationStart(0, url);
    this.subject.next(navigationStart);
  }
}

describe('AppLayoutComponent', () => {
  let fixture: ComponentFixture<ShellLayoutComponent>;
  let component: ShellLayoutComponent;
  let appConfig: AppConfigService;
  let shellAppService: ShellAppService;

  beforeEach(() => {
    const shellService: ShellAppService = {
      pageHeading$: of('Title'),
      hideSidenavConditions: [],
      minimizeSidenavConditions: [],
      preferencesService: {
        get: (_key: string) => 'true',
        set: (_key: string, _value: any) => {}
      }
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, NoopAnimationsModule, HttpClientModule, SidenavLayoutModule, ExtensionsModule, RouterModule.forChild([])],
      providers: [
        {
          provide: Router,
          useClass: MockRouter
        },
        {
          provide: SHELL_APP_SERVICE,
          useValue: shellService
        }
      ],
      declarations: [ShellLayoutComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ShellLayoutComponent);
    component = fixture.componentInstance;
    appConfig = TestBed.inject(AppConfigService);
    shellAppService = TestBed.inject(SHELL_APP_SERVICE);
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
});
