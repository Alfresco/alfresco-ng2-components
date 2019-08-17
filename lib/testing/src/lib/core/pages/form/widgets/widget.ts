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

import { MultilineTextWidget } from './multilineTextWidget';
import { HeaderWidget } from './headerWidget';
import { DisplayTextWidget } from './displayTextWidget';
import { DisplayValueWidget } from './displayValueWidget';
import { AttachFileWidget } from './attachFileWidget';
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
import { AttachFileWidgetCloud } from './attachFileWidgetCloud';

export class Widget {

    multilineTextWidget(): MultilineTextWidget {
        return new MultilineTextWidget();
    }

    headerWidget(): HeaderWidget {
        return new HeaderWidget();
    }

    displayTextWidget(): DisplayTextWidget {
        return new DisplayTextWidget();
    }

    attachFileWidget(): AttachFileWidget {
        return new AttachFileWidget();
    }

    attachFileWidgetCloud(fieldId: string): AttachFileWidgetCloud {
        return new AttachFileWidgetCloud(fieldId);
    }

    displayValueWidget(): DisplayValueWidget {
        return new DisplayValueWidget();
    }

    radioWidget(): RadioButtonsWidget {
        return new RadioButtonsWidget();
    }

    hyperlink(): HyperlinkWidget {
        return new HyperlinkWidget();
    }

    dropdown(): DropdownWidget {
        return new DropdownWidget();
    }

    dynamicTable(): DynamicTableWidget {
        return new DynamicTableWidget();
    }

    textWidget(): TextWidget {
        return new TextWidget();
    }

    documentWidget(): DocumentWidget {
        return new DocumentWidget();
    }

    checkboxWidget(): CheckboxWidget {
        return new CheckboxWidget();
    }

    dateWidget(): DateWidget {
        return new DateWidget();
    }

    dateTimeWidget(): DateTimeWidget {
        return new DateTimeWidget();
    }

    numberWidget(): NumberWidget {
        return new NumberWidget();
    }

    amountWidget(): AmountWidget {
        return new AmountWidget();
    }

    containerWidget(): ContainerWidget {
        return new ContainerWidget();
    }

    peopleWidget(): PeopleWidget {
        return new PeopleWidget();
    }
}
