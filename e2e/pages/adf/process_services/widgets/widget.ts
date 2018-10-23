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

import { MultilineTextWidget } from './multilineTextWidget';
import { HeaderWidget } from './headerWidget';
import { DisplayTextWidget } from './displayTextWidget';
import { AttachFileWidget } from './attachFileWidget';
import { DisplayValueWidget } from './displayValueWidget';
import { RadioButtonsWidget } from './radioButtonsWidget';
import { HyperlinkWidget } from './hyperlinkWidget';
import { DropdownWidget } from './dropdownWidget';
import { DynamicTableWidget } from './dynamicTableWidget';
import { TextWidget } from './textWidget';
import { CheckboxWidget } from './checkboxWidget';
import { DateWidget } from './dateWidget';
import { DateTimeWidget } from './dateTimeWidget';
import { NumberWidget } from './numberWidget';
import { AmountWidget } from './amountWidget';
import { ContainerWidget } from './containerWidget';
import { PeopleWidget } from './peopleWidget';
import { DocumentWidget } from './documentWidget';

export class Widget {

    multilineTextWidget() {
        return new MultilineTextWidget();
    }

    headerWidget() {
        return new HeaderWidget();
    }

    displayTextWidget() {
        return new DisplayTextWidget();
    }

    attachFileWidget() {
        return new AttachFileWidget();
    }

    displayValueWidget() {
        return new DisplayValueWidget();
    }

    radioWidget() {
        return new RadioButtonsWidget();
    }

    hyperlink() {
        return new HyperlinkWidget();
    }

    dropdown() {
        return new DropdownWidget();
    }

    dynamicTable() {
        return new DynamicTableWidget();
    }

    textWidget() {
        return new TextWidget();
    }

    documentWidget() {
        return new DocumentWidget();
    }

    checkboxWidget() {
        return new CheckboxWidget();
    }

    dateWidget() {
        return new DateWidget();
    }

    dateTimeWidget() {
        return new DateTimeWidget();
    }

    numberWidget() {
        return new NumberWidget();
    }

    amountWidget() {
        return new AmountWidget();
    }

    containerWidget() {
        return new ContainerWidget();
    }

    peopleWidget() {
        return new PeopleWidget();
    }
}
