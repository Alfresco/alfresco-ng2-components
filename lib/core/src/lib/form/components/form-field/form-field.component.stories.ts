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

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CoreStoryModule } from '../../../testing/core.story.module';
import { FormFieldComponent } from './form-field.component';
import { FormBaseModule } from '../../form-base.module';
import * as data from '../mock/form-field-content.mock';

export default {
    component: FormFieldComponent,
    title: 'Core/Form Base/Form Field',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, FormBaseModule]
        })
    ]
} as Meta;

const template: Story = (args) => ({
    props: args
});

export const BooleanField = template.bind({});
BooleanField.args = {
    field: data.booleanData
};

export const DateField = template.bind({});
DateField.args = {
    field: data.dateData
};

export const ProcessCloudDateField = template.bind({});
ProcessCloudDateField.args = {
    field: data.processCloudDateData
};

export const DateTimeField = template.bind({});
DateTimeField.args = {
    field: data.datetimeData
};

export const ReadOnlyTextField = template.bind({});
ReadOnlyTextField.args = {
    field: data.readonlyTextData
};

export const ReadOnlyField = template.bind({});
ReadOnlyField.args = {
    field: data.readonlyData
};

export const IntegerField = template.bind({});
IntegerField.args = {
    field: data.integerData
};

export const PeopleField = template.bind({});
PeopleField.args = {
    field: data.peopleData
};

export const UploadField = template.bind({});
UploadField.args = {
    field: data.uploadData
};

export const ProcessUploadField = template.bind({});
ProcessUploadField.args = {
    field: data.processUploadData
};

export const ProcessCloudUploadField = template.bind({});
ProcessCloudUploadField.args = {
    field: data.processCloudUploadData
};

export const ProcessCloudPeopleField = template.bind({});
ProcessCloudPeopleField.args = {
    field: data.processCloudPeopleData
};

export const TextField = template.bind({});
TextField.args = {
    field: data.textData
};

export const UnknownField = template.bind({});
UnknownField.args = {
    field: data.unknownData
};

export const AmountField = template.bind({});
AmountField.args = {
    field: data.amountData
};

export const DropdownField = template.bind({});
DropdownField.args = {
    field: data.dropdownData
};

export const ProcessCloudDropdownField = template.bind({});
ProcessCloudDropdownField.args = {
    field: data.processCloudDropdownData
};

export const MultilineTextField = template.bind({});
MultilineTextField.args = {
    field: data.multiLineTextData
};

export const FunctionalGroupField = template.bind({});
FunctionalGroupField.args = {
    field: data.functionalGroupData
};

export const ProcessCloudFunctionalGroupField = template.bind({});
ProcessCloudFunctionalGroupField.args = {
    field: data.processCloudFunctionalGroupData
};

export const HyperlinkField = template.bind({});
HyperlinkField.args = {
    field: data.hyperlinkData
};

export const RadioButtonsField = template.bind({});
RadioButtonsField.args = {
    field: data.radioButtonsData
};

export const DynamicTableField = template.bind({});
DynamicTableField.args = {
    field: data.dynamicTableData
};

export const GroupField = template.bind({});
GroupField.args = {
    field: data.groupData
};

export const SelectFolderField = template.bind({});
SelectFolderField.args = {
    field: data.selectFolderData
};

export const FileViewerField = template.bind({});
FileViewerField.args = {
    field: data.fileViewerData
};

export const DocumentField = template.bind({});
DocumentField.args = {
    field: data.documentData
};

export const JsonField = template.bind({});
JsonField.args = {
    field: data.jsonData
};

export const TypeaheadField = template.bind({});
TypeaheadField.args = {
    field: data.typeaheadData
};

export const ContainerField = template.bind({});
ContainerField.args = {
    field: data.containerData
};
