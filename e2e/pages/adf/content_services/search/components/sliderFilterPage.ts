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
import { SliderPage } from '../../../material/sliderPage';
import { by } from 'protractor';

export class SliderFilterPage {

    filter;
    slider;

    constructor(filter) {
        this.filter = filter;
        this.slider = new SliderPage(this.filter.element(by.css('mat-slider')));
    }

    setSliderToValue(value) {
        this.slider.setToValue(value);
        return this;
    }

    checkSliderIsDisplayed() {
        this.slider.checkIsDisplayed();
        return this;
    }
}
