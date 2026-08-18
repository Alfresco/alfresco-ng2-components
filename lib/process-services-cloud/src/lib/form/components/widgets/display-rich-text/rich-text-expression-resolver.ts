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

type JsonObject = Record<string, unknown>;

export type RichTextExpressionResolver = (value: string) => string;

export interface RichTextExpressionResolverOptions {
    cloneValue?: boolean;
}

const isJsonObject = (value: unknown): value is JsonObject => typeof value === 'object' && value !== null && !Array.isArray(value);

const cloneJsonValue = (value: unknown): unknown => {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return undefined;
    }
};

const resolveNestedContent = (value: unknown, resolve: RichTextExpressionResolver): unknown => {
    if (typeof value === 'string') {
        return resolve(value);
    }

    if (Array.isArray(value)) {
        return value.map((entry) => resolveNestedContent(entry, resolve));
    }

    if (isJsonObject(value)) {
        return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, resolveNestedContent(entry, resolve)]));
    }

    return value;
};

const resolveListItems = (items: unknown, resolve: RichTextExpressionResolver): unknown => {
    if (!Array.isArray(items)) {
        return items;
    }

    return items.map((item) => {
        if (!isJsonObject(item)) {
            return item;
        }

        if (Object.hasOwn(item, 'content')) {
            item.content = resolveNestedContent(item.content, resolve);
        }

        if (Object.hasOwn(item, 'items')) {
            item.items = resolveListItems(item.items, resolve);
        }

        return item;
    });
};

export const resolveRichTextExpressions = (
    value: unknown,
    resolve: RichTextExpressionResolver,
    options: RichTextExpressionResolverOptions = {}
): unknown => {
    if (!isJsonObject(value) || !Array.isArray(value.blocks)) {
        return value;
    }

    const resolvedValue = options.cloneValue === false ? value : cloneJsonValue(value);
    if (!isJsonObject(resolvedValue) || !Array.isArray(resolvedValue.blocks)) {
        return value;
    }

    resolvedValue.blocks.forEach((block) => {
        if (!isJsonObject(block) || !isJsonObject(block.data)) {
            return;
        }

        if (typeof block.data.text === 'string') {
            block.data.text = resolve(block.data.text);
        }

        if (typeof block.data.caption === 'string') {
            block.data.caption = resolve(block.data.caption);
        }

        if (Object.hasOwn(block.data, 'content')) {
            block.data.content = resolveNestedContent(block.data.content, resolve);
        }

        if (block.type === 'list' && Object.hasOwn(block.data, 'items')) {
            block.data.items = resolveListItems(block.data.items, resolve);
        }
    });

    return resolvedValue;
};
