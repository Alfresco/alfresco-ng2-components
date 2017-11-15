// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';

import { ServiceModule } from './services/service.module';
import { DirectiveModule } from './directives/directive.module';
import { ContextMenuModule } from './context-menu/context-menu.module';
import { PipeModule } from './pipes/pipe.module';
import { AppConfigModule } from './app-config/app-config.module';
import { LogService } from './services/log.service';
import { TranslateLoaderService } from './services/translate-loader.service';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

export function createTranslateLoader(http, logService) {
  return new TranslateLoaderService(http, logService);
}

beforeEach(() => {
  getTestBed().configureTestingModule({
    imports: [
      ServiceModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient, LogService]
        }
      }),
      DirectiveModule,
      ContextMenuModule,
      PipeModule,
      AppConfigModule,
      NoopAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule
    ]
  });
});

afterEach(() => {
  getTestBed().resetTestingModule();
});

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
