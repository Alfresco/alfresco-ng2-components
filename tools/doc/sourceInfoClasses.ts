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

const skipMethodNames = [
    'ngOnChanges',
    'ngOnDestroy',
    'ngOnInit'
];

export class PropInfo {
    name: string;
    type: string;
    typeLink: string;
    defaultValue: string;
    docText: string;
    isInput: boolean;
    isOutput: boolean;
    isDeprecated: boolean;

    errorMessages: string[];

    constructor(sourceData) {
        this.errorMessages = [];

        this.name = sourceData.name;
        this.docText = sourceData.summary || '';
        this.docText = this.docText.replace(/[\n\r]+/g, ' ').trim();

        const tempDefaultVal = sourceData.syntax['return'].defaultValue;
        this.defaultValue = tempDefaultVal ? tempDefaultVal.toString() : '';
        this.defaultValue = this.defaultValue.replace(/\|/, '\\|');
        this.type = sourceData.syntax['return'].type || '';
        this.type = this.type.toString().replace(/\|/, '\\|').replace('unknown', '');

        if (sourceData.tags) {
            const depTag = sourceData.tags.find(tag => tag.name === 'deprecated');

            if (depTag) {
                this.isDeprecated = true;
                this.docText = '(**Deprecated:** ' + depTag.text.replace(/[\n\r]+/g, ' ').trim() + ') ' + this.docText;
            }
        }

        this.isInput = false;
        this.isOutput = false;

        if (sourceData.decorators) {
            sourceData.decorators.forEach(dec => {
                if (dec.name === 'Input') {
                    this.isInput = true;

                    if (dec.arguments) {
                        const bindingName = dec.arguments['bindingPropertyName'];

                        if (bindingName && (bindingName !== '')) {
                            this.name = bindingName.replace(/['"]/g, '');
                        }
                    }

                    if (!this.docText && !this.isDeprecated) {
                        this.errorMessages.push(`Error: Input "${sourceData.name}" has no doc text.`);
                    }
                }

                if (dec.name === 'Output') {
                    this.isOutput = true;

                    if (!this.docText && !this.isDeprecated) {
                        this.errorMessages.push(`Error: Output "${sourceData.name}" has no doc text.`);
                    }
                }
            });
        }
    }

    get errors() {
        return this.errorMessages;
    }
}

export class ParamInfo {
    name: string;
    type: string;
    defaultValue: string;
    docText: string;
    combined: string;
    isOptional: boolean;

    constructor(sourceData) {
        this.name = sourceData.id;
        this.type = sourceData.type.toString().replace(/\s/g, '');
        this.defaultValue = sourceData.defaultValue;
        this.docText = sourceData.description.replace(/[\n\r]+/g, ' ').trim();

        this.isOptional = false;

        if (sourceData.flags) {
            const flag = sourceData.flags.find((sourceFlag: any) => sourceFlag.name === 'isOptional');

            if (flag) {
                this.isOptional = true;
            }
        }

        this.combined = this.name;

        if (this.isOptional) {
            this.combined += '?';
        }

        this.combined += `: \`${this.type}\``;

        if (this.defaultValue !== '') {
            this.combined += ` = \`${this.defaultValue}\``;
        }
    }
}

export class MethodSigInfo {
    name: string;
    docText: string;
    returnType: string;
    returnDocText: string;
    returnsSomething: boolean;
    signature: string;
    params: ParamInfo[];
    isDeprecated: boolean;
    errorMessages: string[];

    constructor(sourceData) {
        this.errorMessages = [];

        this.name = sourceData.name;

        this.docText = sourceData.summary || '';
        this.docText = this.docText.replace(/[\n\r]+/g, ' ').trim();

        if (!this.docText && this.name.indexOf('service') > 0) {
            this.errorMessages.push(`Warning: method "${sourceData.name}" has no doc text.`);
        }

        this.returnType = sourceData.syntax['return'].type || '';
        this.returnType = this.returnType.toString().replace(/\s/g, '');
        this.returnsSomething = this.returnType && (this.returnType !== 'void');
        this.returnDocText = sourceData.syntax['return'].summary || '';

        if (this.returnDocText.toLowerCase() === 'nothing') {
            this.returnsSomething = false;
        }

        if (this.returnsSomething && !this.returnDocText && this.name.indexOf('service') > 0) {
            this.errorMessages.push(`Warning: Return value of method "${sourceData.name}" has no doc text.`);
        }

        this.isDeprecated = false;

        if (sourceData.tags) {
            const depTag = sourceData.tags.find(tag => tag.name === 'deprecated');

            if (depTag) {
                this.isDeprecated = true;
                this.docText = '(**Deprecated:** ' + depTag.text.replace(/[\n\r]+/g, ' ').trim() + ') ' + this.docText;
            }
        }

        this.params = [];
        const paramStrings = [];

        if (sourceData.syntax.parameters) {
            sourceData.syntax.parameters.forEach(rawParam => {
                if (rawParam.name && !rawParam.description && !rawParam.name.startWith('on')) {
                    this.errorMessages.push(`Warning: parameter "${rawParam.name}" of method "${sourceData.name}" has no doc text.`);
                }

                const param = new ParamInfo(rawParam);
                this.params.push(param);
                paramStrings.push(param.combined);
            });
        }

        this.signature = '(' + paramStrings.join(', ') + ')';
    }

    get errors() {
        return this.errorMessages;
    }
}

export class ComponentInfo {
    name: string;
    itemType: string;
    properties: PropInfo[];
    methods: MethodSigInfo[];
    hasInputs: boolean;
    hasOutputs: boolean;
    hasMethods: boolean;
    sourcePath: string;
    sourceLine: number;

    constructor(sourceData) {
        this.name = sourceData.items[0].name;
        this.itemType = sourceData.items[0].type;

        this.hasInputs = false;
        this.hasOutputs = false;
        this.hasMethods = false;

        this.sourcePath = sourceData.items[0].source.path;
        this.sourceLine = sourceData.items[0].source.line;

        if (this.itemType === 'type alias') {
            return;
        }

        this.properties = [];
        this.methods = [];

        sourceData.items.forEach(item => {
            switch (item.type) {
                case 'property':
                case 'accessor':
                    const prop = new PropInfo(item);
                    this.properties.push(prop);

                    if (prop.isInput) {
                        this.hasInputs = true;
                    }

                    if (prop.isOutput) {
                        this.hasOutputs = true;
                    }
                    break;

                case 'method':
                    if (item.flags && (item.flags.length > 0) &&
                        !item.flags.find(flag => flag.name === 'isPrivate') &&
                        !item.flags.find(flag => flag.name === 'isProtected') &&
                        !skipMethodNames.includes(item.name)
                    ) {
                        this.methods.push(new MethodSigInfo(item));
                        this.hasMethods = true;
                    }
                    break;

                default:
                    break;
            }
        });
    }

    get errors() {
        const combinedErrors = [];

        this.methods.forEach(method => {
            method.errors.forEach(err => {
                combinedErrors.push(err);
            });
        });

        this.properties.forEach(prop => {
            prop.errors.forEach(err => {
                combinedErrors.push(err);
            });
        });

        return combinedErrors;
    }
}
