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

import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ScreenRenderingService } from './screen-rendering.service';
import { APP_CUSTOM_SCREEN_TOKEN, provideScreen } from './provide-screen';

@Component({
    template: '<div>Test Component 1</div>'
})
class TestComponent1 {}

@Component({
    template: '<div>Test Component 2</div>'
})
class TestComponent2 {}

describe('ScreenRenderingService', () => {
    let service: ScreenRenderingService;

    describe('without custom screens', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({});
            service = TestBed.inject(ScreenRenderingService);
        });

        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should handle empty custom screens array', () => {
            expect(service).toBeTruthy();
            expect(() => service).not.toThrow();
        });
    });

    describe('with custom screens', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [provideScreen('test-screen-1', TestComponent1), provideScreen('test-screen-2', TestComponent2)]
            });
        });

        it('should be created with custom screens', () => {
            const service = TestBed.inject(ScreenRenderingService);
            expect(service).toBeTruthy();
        });

        it('should register custom screens on initialization', () => {
            const spy = spyOn(ScreenRenderingService.prototype, 'setComponentTypeResolver');
            TestBed.inject(ScreenRenderingService);

            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy).toHaveBeenCalledWith('test-screen-1', jasmine.any(Function), true);
            expect(spy).toHaveBeenCalledWith('test-screen-2', jasmine.any(Function), true);
        });

        it('should register component resolvers that return correct components', () => {
            const resolverCalls: any[] = [];
            spyOn(ScreenRenderingService.prototype, 'setComponentTypeResolver').and.callFake((key, resolver, override) => {
                resolverCalls.push({ key, resolver: resolver({ type: key }), override });
            });
            TestBed.inject(ScreenRenderingService);

            expect(resolverCalls).toEqual([
                { key: 'test-screen-1', resolver: TestComponent1, override: true },
                { key: 'test-screen-2', resolver: TestComponent2, override: true }
            ]);
        });
    });

    describe('with single custom screen', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [provideScreen('single-screen', TestComponent1)]
            });
        });

        it('should handle single custom screen', () => {
            const spy = spyOn(ScreenRenderingService.prototype, 'setComponentTypeResolver');
            TestBed.inject(ScreenRenderingService);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('single-screen', jasmine.any(Function), true);
        });
    });

    describe('with null custom screens', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: APP_CUSTOM_SCREEN_TOKEN,
                        useValue: null,
                        multi: true
                    }
                ]
            });
        });

        it('should handle null custom screens gracefully', () => {
            expect(() => {
                service = TestBed.inject(ScreenRenderingService);
            }).not.toThrow();
            expect(service).toBeTruthy();
        });
    });
});
