/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { WidgetVisibilityModel } from '../../../models/widget-visibility.model';
import { ContainerModel } from './container.model';
import { FormFieldModel } from './form-field.model';
import { FormFieldTypes } from './form-field-types';
import { FormWidgetModel } from './form-widget.model';

export type TabChildrenLayout = 'sidenav' | 'tabs';

export class TabModel extends FormWidgetModel {
    title: string;
    isVisible: boolean = true;
    visibilityCondition: WidgetVisibilityModel;
    icon: string;
    order: number;

    /**
     * Controls how the `children` of this node are rendered when the form uses the `sidenav` layout:
     * - `sidenav` (default): children are shown as further expandable entries in the side navigation tree.
     * - `tabs`: children are hidden from the side navigation tree and instead rendered as a `mat-tab-group`
     *   inside this node's content pane, allowing a sidenav entry to internally group its sub-sections as tabs.
     */
    childrenLayout: TabChildrenLayout = 'sidenav';

    fields: FormWidgetModel[] = [];
    children: TabModel[] = [];

    constructor(form: any, json?: any) {
        super(form, json);

        if (json) {
            this.title = json.title;
            this.visibilityCondition = new WidgetVisibilityModel(json.visibilityCondition);
            this.icon = json.icon;
            this.order = json.order;
            this.childrenLayout = json.childrenLayout === 'tabs' ? 'tabs' : 'sidenav';
            this.children = (json.children || json.subTabs || []).map((childJson) => new TabModel(form, childJson));
        }
    }

    hasContent(): boolean {
        return this.fields && this.fields.length > 0;
    }

    hasChildren(): boolean {
        return this.children && this.children.length > 0;
    }

    /**
     * Indicates whether this node's children should be rendered as tabs, within this node's content pane,
     * instead of as further nested side navigation entries.
     *
     * @returns true when this node has children and they are configured to render as tabs
     */
    hasTabbedChildren(): boolean {
        return this.childrenLayout === 'tabs' && this.hasChildren();
    }

    /**
     * Returns the direct children of this node that are currently visible.
     *
     * @returns list of visible child nodes
     */
    visibleChildren(): TabModel[] {
        return (this.children || []).filter((child) => child.isVisible);
    }

    /**
     * Recursively looks for a node (this tab or one of its descendants) matching the given id.
     *
     * @param tabId id of the tab/section to find
     * @returns the matching `TabModel`, or `undefined` when not found
     */
    findTabById(tabId: string): TabModel | undefined {
        if (this.id === tabId) {
            return this;
        }

        for (const child of this.children) {
            const found = child.findTabById(tabId);
            if (found) {
                return found;
            }
        }

        return undefined;
    }

    /**
     * Collects all the form fields owned by this node, excluding descendants.
     *
     * @returns list of form fields directly assigned to this node
     */
    getOwnFields(): FormFieldModel[] {
        const collected: FormFieldModel[] = [];
        this.collectFields(this.fields, collected);
        return collected;
    }

    /**
     * Collects all the form fields owned by this node and its descendants.
     *
     * @returns list of form fields assigned to this node or any of its children
     */
    getAllFields(): FormFieldModel[] {
        return this.children.reduce((fields, child) => [...fields, ...child.getAllFields()], this.getOwnFields());
    }

    /**
     * Indicates whether this node, or any of its descendants, contains an invalid field.
     *
     * @returns true when at least one field is invalid
     */
    hasErrors(): boolean {
        return this.getOwnFields().some((field) => !field.isValid) || this.children.some((child) => child.hasErrors());
    }

    /**
     * Indicates whether all the required fields owned by this node, and its descendants, are filled in.
     *
     * @returns true when the node (and its descendants) has no incomplete required field
     */
    isComplete(): boolean {
        const ownFieldsComplete = this.getOwnFields()
            .filter((field) => field.required)
            .every((field) => !this.isFieldEmpty(field));

        return ownFieldsComplete && this.children.every((child) => child.isComplete());
    }

    /**
     * Total count of required fields owned by this node and its descendants.
     *
     * @returns number of required fields
     */
    getRequiredFieldsCount(): number {
        return this.getAllFields().filter((field) => field.required).length;
    }

    /**
     * Count of required fields, owned by this node and its descendants, that have a value.
     *
     * @returns number of completed required fields
     */
    getCompletedRequiredFieldsCount(): number {
        return this.getAllFields().filter((field) => field.required && !this.isFieldEmpty(field)).length;
    }

    private isFieldEmpty(field: FormFieldModel): boolean {
        return field.value === undefined || field.value === null || field.value === '';
    }

    private collectFields(fields: FormWidgetModel[], collected: FormFieldModel[]): void {
        (fields || []).forEach((field) => {
            if (field instanceof ContainerModel) {
                collected.push(field.field);
                (field.columns || []).forEach((column) => this.collectFields(column.fields, collected));
            } else if (field instanceof FormFieldModel) {
                collected.push(field);
                if (field.type === FormFieldTypes.SECTION) {
                    (field.columns || []).forEach((column) => this.collectFields(column.fields, collected));
                }
            }
        });
    }
}
