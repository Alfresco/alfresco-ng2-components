/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

/* tslint:disable:no-console */

import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigService } from '../app-config/app-config.service';
import { LogService } from './log.service';
import { setupTestBed } from '../testing/setupTestBed';

@Component({
   template: '',
   providers: [LogService]
})
class ProvidesLogComponent {
   constructor(public logService: LogService) {

   }

   error() {
       this.logService.error('Test message');
   }

   info() {
       this.logService.info('Test message');
   }

   warn() {
       this.logService.warn('Test message');
   }

   log() {
       this.logService.log('Test message');
   }

   debug() {
       this.logService.debug('Test message');
   }

   trace() {
       this.logService.trace('Test message');
   }

}

describe('Log Service', () => {

   let providesLogComponent: ComponentFixture<ProvidesLogComponent>;
   let appConfigService: AppConfigService;

   setupTestBed({
       imports: [
           HttpClientModule
       ],
       declarations: [ProvidesLogComponent],
       providers: [
           LogService,
           AppConfigService
       ]
   });

   beforeEach(() => {
       appConfigService = TestBed.get(AppConfigService);
   });

   it('should not log anything if is silent', () => {
       appConfigService.config['logLevel'] = 'silent';
       providesLogComponent = TestBed.createComponent(ProvidesLogComponent);

       spyOn(console, 'log');
       spyOn(console, 'trace');
       spyOn(console, 'debug');
       spyOn(console, 'info');
       spyOn(console, 'warn');
       spyOn(console, 'error');

       providesLogComponent.componentInstance.log();
       providesLogComponent.componentInstance.trace();
       providesLogComponent.componentInstance.debug();
       providesLogComponent.componentInstance.info();
       providesLogComponent.componentInstance.warn();
       providesLogComponent.componentInstance.error();

       expect(console.log).not.toHaveBeenCalled();
       expect(console.trace).not.toHaveBeenCalled();
       expect(console.debug).not.toHaveBeenCalled();
       expect(console.info).not.toHaveBeenCalled();
       expect(console.warn).not.toHaveBeenCalled();
       expect(console.error).not.toHaveBeenCalled();
   });

   it('should log only warning and errors if is warning level', () => {
       appConfigService.config['logLevel'] = 'WARN';
       providesLogComponent = TestBed.createComponent(ProvidesLogComponent);

       spyOn(console, 'log');
       spyOn(console, 'error');
       spyOn(console, 'trace');
       spyOn(console, 'warn');

       providesLogComponent.componentInstance.log();
       providesLogComponent.componentInstance.error();
       providesLogComponent.componentInstance.trace();
       providesLogComponent.componentInstance.warn();

       expect(console.log).not.toHaveBeenCalled();
       expect(console.error).toHaveBeenCalled();
       expect(console.warn).toHaveBeenCalled();
       expect(console.trace).not.toHaveBeenCalled();
   });

   it('should debug level not log trace and log', () => {
       appConfigService.config['logLevel'] = 'debug';
       providesLogComponent = TestBed.createComponent(ProvidesLogComponent);

       spyOn(console, 'log');
       spyOn(console, 'trace');
       spyOn(console, 'debug');
       spyOn(console, 'info');
       spyOn(console, 'warn');
       spyOn(console, 'error');

       providesLogComponent.componentInstance.log();
       providesLogComponent.componentInstance.trace();
       providesLogComponent.componentInstance.debug();
       providesLogComponent.componentInstance.info();
       providesLogComponent.componentInstance.warn();
       providesLogComponent.componentInstance.error();

       expect(console.log).not.toHaveBeenCalled();
       expect(console.trace).not.toHaveBeenCalled();
       expect(console.debug).toHaveBeenCalled();
       expect(console.info).toHaveBeenCalled();
       expect(console.warn).toHaveBeenCalled();
       expect(console.error).toHaveBeenCalled();
   });

   it('should trace level log all', () => {
       appConfigService.config['logLevel'] = 'trace';
       providesLogComponent = TestBed.createComponent(ProvidesLogComponent);

       spyOn(console, 'log');
       spyOn(console, 'trace');
       spyOn(console, 'debug');
       spyOn(console, 'info');
       spyOn(console, 'warn');
       spyOn(console, 'error');

       providesLogComponent.componentInstance.log();
       providesLogComponent.componentInstance.trace();
       providesLogComponent.componentInstance.debug();
       providesLogComponent.componentInstance.info();
       providesLogComponent.componentInstance.warn();
       providesLogComponent.componentInstance.error();

       expect(console.log).toHaveBeenCalled();
       expect(console.trace).toHaveBeenCalled();
       expect(console.debug).toHaveBeenCalled();
       expect(console.info).toHaveBeenCalled();
       expect(console.warn).toHaveBeenCalled();
       expect(console.error).toHaveBeenCalled();
   });

   it('message Observable', (done) => {
       appConfigService.config['logLevel'] = 'trace';
       providesLogComponent = TestBed.createComponent(ProvidesLogComponent);

       providesLogComponent.componentInstance.logService.onMessage.subscribe(() => {
           done();
       });

       providesLogComponent.componentInstance.log();

   });

});
