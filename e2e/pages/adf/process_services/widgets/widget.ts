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

import { MultilineText } from './multilineText';
import { Header } from './header';
import { DisplayText } from './displayText';
import { AttachFile } from './attachFile';
import { DisplayValue } from './displayValue';
import { RadioButtons } from './radioButtons';
import { Hyperlink } from './hyperlink';
import { Dropdown } from './dropdown';
import { DynamicTable } from './dynamicTable';
import { TextWidget } from './text-widget';
import { Checkbox } from './checkbox';
import { DateWidget } from './date';
import { DateTime } from './dateTime';
import { People } from './people';
import { NumberWidget } from './number';
import { Amount } from './amount';

export class Widget {

    multilineTextWidget() {
        return new MultilineText();
    }

    headerWidget() {
        return new Header();
    }

    displayTextWidget() {
        return new DisplayText();
    }

    attachFileWidget() {
        return new AttachFile();
    }

    displayValueWidget() {
        return new DisplayValue();
    }

    radioWidget() {
        return new RadioButtons();
    }

    hyperlink() {
        return new Hyperlink();
    }

    dropdown() {
        return new Dropdown();
    }

    dynamicTable() {
        return new DynamicTable();
    }

    textWidget() {
        return new TextWidget();
    }

    documentWidget() {
        return new Document();
    }

    checkboxWidget() {
        return new Checkbox();
    }

    dateWidget() {
        return new DateWidget();
    }

    dateTimeWidget() {
        return new DateTime();
    }

    numberWidget() {
        return new NumberWidget();
    }

    amountWidget() {
        return new Amount();
    }

    peopleWidget() {
        return new People();
    }

}
