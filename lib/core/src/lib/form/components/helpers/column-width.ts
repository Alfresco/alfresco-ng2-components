/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export interface FormLayoutField {
    colspan?: number | null;
}

export interface FormLayoutColumn {
    fields?: FormLayoutField[] | null;
}

export const getFormLayoutColumnWidth = (
    numberOfColumns: number | null | undefined,
    columns: FormLayoutColumn[] | null | undefined,
    columnIndex: number
): string => {
    const normalizedColumnCount = typeof numberOfColumns === 'number' && numberOfColumns > 0 ? numberOfColumns : 1;
    const defaultColumnWidth = 100 / normalizedColumnCount;
    const columnFields = columns?.[columnIndex]?.fields ?? [];

    if (columnFields.length === 0) {
        return isColumnCoveredByPreviousField(columns, columnIndex) ? '0' : `${defaultColumnWidth}`;
    }

    const maxColspan = Math.max(...columnFields.map((field) => field.colspan || 1));
    return `${Math.min(100, defaultColumnWidth * maxColspan)}`;
};

const isColumnCoveredByPreviousField = (columns: FormLayoutColumn[] | null | undefined, columnIndex: number): boolean => {
    if (!columns || columnIndex <= 0) {
        return false;
    }

    for (let previousColumnIndex = 0; previousColumnIndex < columnIndex; previousColumnIndex++) {
        const previousFields = columns[previousColumnIndex]?.fields ?? [];

        if (previousFields.length === 0) {
            continue;
        }

        const previousColumnSpan = Math.max(...previousFields.map((field) => field.colspan || 1));
        if (previousColumnIndex + previousColumnSpan > columnIndex) {
            return true;
        }
    }

    return false;
};
