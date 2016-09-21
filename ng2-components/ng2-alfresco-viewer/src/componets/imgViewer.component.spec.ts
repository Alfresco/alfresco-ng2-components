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

/*
import { TestComponentBuilder } from '@angular/compiler/testing';
import { ImgViewerComponent } from './imgViewer.component';

describe('Img viewer component ', () => {

    let imgViewerComponentFixture, element, component;

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(ImgViewerComponent)
            .then(fixture => {
                imgViewerComponentFixture = fixture;
                element = fixture.nativeElement;
                component = fixture.componentInstance;
            });
    }));

    it('If no url is passed should thrown an error', () => {
        expect(() => {
            component.ngOnChanges();
        }).toThrow(new Error('Attribute urlFile is required'));
    });

    it('If  url is passed should not thrown an error', () => {
        component.urlFile = 'fake-url';
        expect(() => {
            component.ngOnChanges();
        }).not.toThrow(new Error('Attribute urlFile is required'));
    });

    it('The file Name should be present in the alt attribute', () => {
        component.nameFile = 'fake-name';
        imgViewerComponentFixture.detectChanges();
        expect(element.querySelector('#viewer-image').getAttribute('alt')).toEqual('fake-name');
    });
});
*/
