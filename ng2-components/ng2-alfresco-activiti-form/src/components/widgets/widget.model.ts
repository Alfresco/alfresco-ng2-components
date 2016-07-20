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

export interface FormFieldMetadata {
    [key: string]: any;
}

export class FormWidgetModel {

    private _form: FormModel;
    private _json: any;

    get form(): FormModel {
        return this._form;
    }

    get json(): any {
        return this._json;
    }

    constructor(form: FormModel, json: any) {
        this._form = form;
        this._json = json;
    }
}

export class FormFieldModel extends FormWidgetModel {

    id: string;
    name: string;
    type: string;
    value: any;
    tab: string;
    colspan: number = 1;

    metadata: FormFieldMetadata = {};

    constructor(form: FormModel, json?: any) {
        super(form, json);

        if (json) {
            this.id = json.id;
            this.name = json.name;
            this.type = json.type;
            this.value = json.value;
            this.tab = json.tab;
            this.colspan = <number> json.colspan;
        }
    }
}

export class ContainerColumnModel {

    size: number = 12;
    fields: FormFieldModel[] = [];

    hasFields(): boolean {
        return this.fields && this.fields.length > 0;
    }
}

export class ContainerModel extends FormWidgetModel {

    fieldType: string;
    id: string;
    name: string;
    type: string;
    tab: string;
    numberOfColumns: number = 1;

    columns: ContainerColumnModel[] = [];

    constructor(form: FormModel, json?: any) {
        super(form, json);

        if (json) {
            this.fieldType = json.fieldType;
            this.id = json.id;
            this.name = json.name;
            this.type = json.type;
            this.tab = json.tab;
            this.numberOfColumns = <number> json.numberOfColumns;

            let columnSize: number = 12;
            if (this.numberOfColumns > 1) {
                columnSize = 12 / this.numberOfColumns;
            }

            for (let i = 0; i < this.numberOfColumns; i++) {
                let col = new ContainerColumnModel();
                col.size = columnSize;
                this.columns.push(col);
            }

            Object.keys(json.fields).map(key => {
                let fields = (json.fields[key] || []).map(f => new FormFieldModel(form, f));
                let col = this.columns[parseInt(key, 10) - 1];
                col.fields = fields;
            });
        }
    }
}

export class TabModel extends FormWidgetModel {

    id: string;
    title: string;
    visibilityCondition: any;

    fields: ContainerModel[] = [];

    hasContent(): boolean {
        return this.fields && this.fields.length > 0;
    }

    constructor(form: FormModel, json?: any) {
        super(form, json);

        if (json) {
            this.id = json.id;
            this.title = json.title;
            this.visibilityCondition = json.visibilityCondition;
        }
    }
}

export interface WidgetModelCache<T extends FormWidgetModel> {
    [key: string]: T;
}

export class FormModel {

    tabs: TabModel[] = [];
    fields: ContainerModel[] = [];

    private _json: any;

    get json() {
        return this._json;
    }

    hasTabs(): boolean {
        return this.tabs && this.tabs.length > 0;
    }

    hasFields(): boolean {
        return this.fields && this.fields.length > 0;
    }

    constructor(json?: any) {
        if (json) {
            this._json = json;
            let tabCache: WidgetModelCache<TabModel> = {};

            // this.tabs = (json.tabs || []).map(t => new TabModel(this, t));
            this.tabs = (json.tabs || []).map(t => {
                let model = new TabModel(this, t);
                tabCache[model.id] = model;
                return model;
            });
            this.fields = (json.fields || []).map(f => new ContainerModel(this, f));

            for (let i = 0; i < this.fields.length; i++) {
                let field = this.fields[i];
                if (field.tab) {
                    let tab = tabCache[field.tab];
                    if (tab) {
                        // tab.content = new ContainerModel(this, field.json);
                        // tab.fields.push(field);
                        tab.fields.push(new ContainerModel(this, field.json));
                    }
                }
            }
        }
    }
}
