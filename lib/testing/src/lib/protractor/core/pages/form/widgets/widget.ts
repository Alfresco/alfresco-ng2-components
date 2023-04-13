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

import { MultilineTextWidgetPage } from './multiline-text-widget.page';
import { HeaderWidgetPage } from './header-widget.page';
import { DisplayTextWidgetPage } from './display-text-widget.page';
import { DisplayValueWidgetPage } from './display-value-widget.page';
import { AttachFileWidgetPage } from './attach-file-widget.page';
import { RadioButtonsWidgetPage } from './radio-buttons-widget.page';
import { HyperlinkWidgetPage } from './hyperlink-widget.page';
import { DropdownWidgetPage } from './dropdown-widget.page';
import { DynamicTableWidgetPage } from './dynamic-table-widget.page';
import { TextWidgetPage } from './text-widget.page';
import { CheckboxWidgetPage } from './checkbox-widget.page';
import { DateWidgetPage } from './date-widget.page';
import { DateTimeWidgetPage } from './date-time-widget.page';
import { NumberWidgetPage } from './number-widget.page';
import { AmountWidgetPage } from './amount-widget.page';
import { ContainerWidgetPage } from './container-widget.page';
import { PeopleWidgetPage } from './people-widget.page';
import { TabPage } from './tab.page';
import { DocumentWidgetPage } from './document-widget.page';
import { GroupWidgetPage } from './group-widget.page';
import { TypeaheadWidgetPage } from './typeahead-widget.page';
import { AttachFolderWidgetPage } from './attach-folder-widget.page';
import { JsonWidgetPage } from './json-widget.page';

export class Widget {

    multilineTextWidget(): MultilineTextWidgetPage {
        return new MultilineTextWidgetPage();
    }

    headerWidget(): HeaderWidgetPage {
        return new HeaderWidgetPage();
    }

    displayTextWidget(): DisplayTextWidgetPage {
        return new DisplayTextWidgetPage();
    }

    attachFileWidget(): AttachFileWidgetPage {
        return new AttachFileWidgetPage();
    }

    attachFolderWidget(): AttachFolderWidgetPage {
        return new AttachFolderWidgetPage();
    }

    displayValueWidget(): DisplayValueWidgetPage {
        return new DisplayValueWidgetPage();
    }

    radioWidget(): RadioButtonsWidgetPage {
        return new RadioButtonsWidgetPage();
    }

    hyperlink(): HyperlinkWidgetPage {
        return new HyperlinkWidgetPage();
    }

    dropdown(): DropdownWidgetPage {
        return new DropdownWidgetPage();
    }

    dynamicTable(): DynamicTableWidgetPage {
        return new DynamicTableWidgetPage();
    }

    textWidget(): TextWidgetPage {
        return new TextWidgetPage();
    }

    documentWidget(): DocumentWidgetPage {
        return new DocumentWidgetPage();
    }

    checkboxWidget(): CheckboxWidgetPage {
        return new CheckboxWidgetPage();
    }

    dateWidget(): DateWidgetPage {
        return new DateWidgetPage();
    }

    dateTimeWidget(): DateTimeWidgetPage {
        return new DateTimeWidgetPage();
    }

    numberWidget(): NumberWidgetPage {
        return new NumberWidgetPage();
    }

    amountWidget(): AmountWidgetPage {
        return new AmountWidgetPage();
    }

    containerWidget(): ContainerWidgetPage {
        return new ContainerWidgetPage();
    }

    peopleWidget(): PeopleWidgetPage {
        return new PeopleWidgetPage();
    }

    groupWidget(): GroupWidgetPage {
        return new GroupWidgetPage();
    }

    typeahedWidget(): TypeaheadWidgetPage {
        return new TypeaheadWidgetPage();
    }

    tab(): TabPage {
        return new TabPage();
    }

    json(): JsonWidgetPage {
        return new JsonWidgetPage();
    }
}
