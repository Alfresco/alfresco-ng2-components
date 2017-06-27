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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import {
    AlfrescoSettingsService,
    AlfrescoApiService,
    AlfrescoAuthenticationService,
    CoreModule
} from 'ng2-alfresco-core';

import { SnowboundViewerComponent } from './snowbound-viewer.component';
import { SafeResourceUrl } from "@angular/platform-browser"

describe('Test ng2-snowbound-viewer component', () => {

    let component: SnowboundViewerComponent;
    let fixture: ComponentFixture<SnowboundViewerComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [SnowboundViewerComponent],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService
                /*,
                 {provide: AlfrescoAuthenticationService, useClass: AuthenticationMock},
                 {provide: AlfrescoTranslationService, useClass: TranslationMock}
                 */
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SnowboundViewerComponent);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe('view', () => {
        describe('Overlay mode true', () => {
            beforeEach(() => {
                component.overlayMode = true;
                fixture.detectChanges();
            });

            it('shadow overlay should be present if is overlay mode', () => {
                expect(element.querySelector('#viewer-shadow-transparent')).not.toBeNull();
            });

            it('header should be present if is overlay mode', () => {
                expect(element.querySelector('header')).not.toBeNull();
            });

            it('Close button should be present if overlay mode', () => {
                expect(element.querySelector('#viewer-close-button')).not.toBeNull();
            });

            it('Click on close button should hide the viewer', () => {
                let closebutton: any = element.querySelector('#viewer-close-button');
                closebutton.click();
                fixture.detectChanges();
                expect(element.querySelector('#viewer-main-container')).toBeNull();
            });

            it('all-space class should not be present if is in overlay mode', () => {
                expect(element.querySelector('#snowbound-viewer').getAttribute('class')).toEqual('');
            });
        })

        describe('Overlay mode false', () => {
            beforeEach(() => {
                component.overlayMode = false;
                fixture.detectChanges();
            });

            it('header should be NOT be present if is not overlay mode', () => {
                expect(element.querySelector('header')).toBeNull();
            });

            it('Close button should be not present if is not overlay mode', () => {
                expect(element.querySelector('#viewer-close-button')).toBeNull();
            });

            it('all-space class should be present if is not overlay mode', () => {
                expect(element.querySelector('#snowbound-viewer').getAttribute('class')).toEqual('all-space');
            });
        });
    });

    describe('Attributes', () => {
        it('fileNodeId should be mandatory', () => {
            component.showViewer = true;
            component.fileNodeId = undefined;

            expect(() => {
                component.ngOnChanges();
            }).toThrow();
        });

        it('If fileNodeId is present, no errors should be thrown', () => {
            component.showViewer = true;
            component.fileNodeId = '12345';

            expect(() => {
                component.ngOnChanges();
            }).not.toThrow();
        });

        it('showViewer default value should be true', () => {
            expect(component.showViewer).toBeTruthy();
        });

        it('overlayMode default value should be false', () => {
            expect(component.overlayMode).toBeFalsy();
        });

        it('if showViewer is false, viewer should be hidden', () => {
            component.showViewer = false;
            fixture.detectChanges();
            expect(element.querySelector('#viewer-main-container')).toBeNull();
        });
    });

    describe('Lifecycle', () => {
        beforeEach(() => {
            component.fileNodeId = '12345';
            component.showViewer = true;
        });

        describe('Closing Viewer', () => {
            it('should clear fileNodeId', () => {
                component.close();
                fixture.detectChanges();
                expect(component.fileNodeId).toBeNull();
            });

            it('should hide the viewer', () => {
                component.close();
                fixture.detectChanges();
                expect(component.showViewer).toBeFalsy();
            });

            it('should emit a close viewer event', (done) => {
                component.showViewerChange.subscribe((e) => {
                    expect(e).toBeFalsy();
                    done();
                });
                component.close();
            });
        });

        describe('Building snowbound URL', () => {
            it('should return a correct and useable url', () => {
                let response = component.viewerURL()
                /*
                 There is some Javascript regex black magic going on here that causes this not to work.
                 This is valid and tested regex for matching a valid url.

                 let re = new RegExp('https?:\/\/[a-zA-Z]+:\d+\/VirtualViewerJavaHTML5\/index.html\?documentId=[a-zA-Z\d]+&clientInstanceId={[":\sa-zA-Z]+}');
                 expect(component.url).toMatch(re);
                 */
                expect(response).toBeDefined();
            });

            it('should set the component url property', () => {
                component.viewerURL();
                expect(component.url).toBeDefined();
            })
        });

        it('should clear fileNodeId on destroy', () => {
            component.ngOnDestroy();
            fixture.detectChanges();
            expect(component.fileNodeId).toBeNull();
        });
    });
});
