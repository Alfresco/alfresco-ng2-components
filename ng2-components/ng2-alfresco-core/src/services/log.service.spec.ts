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

import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigService } from './app-config.service';
import { LogService } from './log.service';

describe('Log Service', () => {

    let providesLogComponent: ComponentFixture<ProvidesLogComponent>;
    let appConfigService: AppConfigService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            declarations: [ProvidesLogComponent],
            providers: [
                LogService,
                AppConfigService
            ]
        });

        TestBed.compileComponents();
    }));

    beforeEach(() => {
        appConfigService = TestBed.get(AppConfigService);
    });

    it('should log all the levels by default', () => {
        providesLogComponent = TestBed.createComponent(ProvidesLogComponent);

        spyOn(console, 'log');
        spyOn(console, 'error');
        spyOn(console, 'trace');

        providesLogComponent.componentInstance.log();
        providesLogComponent.componentInstance.error();
        providesLogComponent.componentInstance.trace();

        expect(console.log).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
        expect(console.trace).toHaveBeenCalled();
    });

    it('should not log anything if is silent', () => {
        appConfigService.config['logLevel'] = 'silent';
        providesLogComponent = TestBed.createComponent(ProvidesLogComponent);

        spyOn(console, 'log');
        spyOn(console, 'error');
        spyOn(console, 'trace');

        providesLogComponent.componentInstance.log();
        providesLogComponent.componentInstance.error();
        providesLogComponent.componentInstance.trace();

        expect(console.log).not.toHaveBeenCalled();
        expect(console.error).not.toHaveBeenCalled();
        expect(console.trace).not.toHaveBeenCalled();
    });

});

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

    trace() {
        this.logService.trace('Test message');
    }

}
