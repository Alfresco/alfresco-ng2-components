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

import { Injectable, Type, InjectionToken, Inject } from '@angular/core';
import { RuleEvaluator, RuleRef, RuleContext } from '../config/rule.extensions';
import { ExtensionConfig } from '../config/extension.config';
import { ExtensionLoaderService } from './extension-loader.service';
import { RouteRef } from '../config/routing.extensions';
import { ActionRef } from '../config/action.extensions';
import * as core from '../evaluators/core.evaluators';
import { ComponentRegisterService } from './component-register.service';
import { RuleService } from './rule.service';
import { ExtensionElement } from '../config/extension-element';
import { BehaviorSubject, Observable } from 'rxjs';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function extensionJsonsFactory() {
    return [];
};

export const EXTENSION_JSONS = new InjectionToken<string[][]>('extension-jsons', {
    providedIn: 'root',
    factory: extensionJsonsFactory
});

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function provideExtensionConfig(jsons: string[]) {
    return {
        provide: EXTENSION_JSONS,
        useValue: jsons,
        multi: true
    };
};

@Injectable({
    providedIn: 'root'
})
export class ExtensionService {
    configPath = 'assets/app.extensions.json';
    pluginsPath = 'assets/plugins';

    routes: Array<RouteRef> = [];
    actions: Array<ActionRef> = [];
    features: Array<any> = [];
    authGuards: { [key: string]: Type<any> } = {};

    setup$: Observable<ExtensionConfig>;

    protected config: ExtensionConfig = null;
    protected onSetup$ = new BehaviorSubject<ExtensionConfig>(this.config);

    constructor(
        protected loader: ExtensionLoaderService,
        protected componentRegister: ComponentRegisterService,
        protected ruleService: RuleService,
        @Inject(EXTENSION_JSONS) protected extensionJsons: string[]
    ) {
        this.setup$ = this.onSetup$.asObservable();
    }

    /**
     * Loads and registers an extension config file and plugins (specified by path properties).
     *
     * @returns The loaded config data
     */
    async load(): Promise<ExtensionConfig> {
        const config = await this.loader.load(
            this.configPath,
            this.pluginsPath,
            this.extensionJsons.flat()
        );
        this.setup(config);
        return config;
    }

    /**
     * Registers extensions from a config object.
     *
     * @param config Object with config data
     */
    setup(config: ExtensionConfig) {
        if (!config) {
            console.warn('Extension configuration not found');
            return;
        }

        this.config = config;

        this.setEvaluators({
            'core.every': core.every,
            'core.some': core.some,
            'core.not': core.not
        });

        this.actions = this.loader.getActions(config);
        this.routes = this.loader.getRoutes(config);
        this.features = this.loader.getFeatures(config);

        this.ruleService.setup(config);
        this.onSetup$.next(config);
    }

    /**
     * Gets features by key.
     *
     * @param key Key string using dot notation or array of strings
     * @param defaultValue Default value returned if feature is not found, default is empty array
     * @returns Feature found by key
     */
    getFeature<T = any[]>(key: string | string[], defaultValue: any = []): T {
        const properties: string[] = Array.isArray(key) ? key : key.split('.');
        return properties.reduce((prev, curr) => prev && prev[curr], this.features) || defaultValue;
    }

    getElements<T extends ExtensionElement>(key: string, fallback: Array<T> = []): Array<T> {
        return this.loader.getElements(this.config, key, fallback);
    }

    /**
     * Adds one or more new rule evaluators to the existing set.
     *
     * @param values The new evaluators to add
     */
    setEvaluators(values: { [key: string]: RuleEvaluator }) {
        this.ruleService.setEvaluators(values);
    }

    /**
     * Adds one or more new auth guards to the existing set.
     *
     * @param values The new auth guards to add
     */
    setAuthGuards(values: { [key: string]: Type<any> }) {
        if (values) {
            this.authGuards = Object.assign({}, this.authGuards, values);
        }
    }

    /**
     * Adds one or more new components to the existing set.
     *
     * @param values The new components to add
     */
    setComponents(values: { [key: string]: Type<any> }) {
        this.componentRegister.setComponents(values);
    }

    /**
     * Retrieves a route using its ID value.
     *
     * @param id The ID value to look for
     * @returns The route or null if not found
     */
    getRouteById(id: string): RouteRef {
        return this.routes.find((route) => route.id === id);
    }

    /**
     * Retrieves one or more auth guards using an array of ID values.
     *
     * @param ids Array of ID value to look for
     * @returns Array of auth guards or empty array if none were found
     */
    getAuthGuards(ids: string[]): Array<Type<any>> {
        return (ids || [])
            .map((id) => this.authGuards[id])
            .filter((guard) => guard);
    }

    /**
     * Retrieves an action using its ID value.
     *
     * @param id The ID value to look for
     * @returns Action or null if not found
     */
    getActionById(id: string): ActionRef {
        return this.actions.find((action) => action.id === id);
    }

    /**
     * Retrieves a RuleEvaluator function using its key name.
     *
     * @param key Key name to look for
     * @returns RuleEvaluator or null if not found
     */
    getEvaluator(key: string): RuleEvaluator {
        return this.ruleService.getEvaluator(key);
    }

    /**
     * Evaluates a rule.
     *
     * @param ruleId ID of the rule to evaluate
     * @param context Custom rule execution context.
     * @returns True if the rule passed, false otherwise
     */
    evaluateRule(ruleId: string, context?: RuleContext): boolean {
        return this.ruleService.evaluateRule(ruleId, context);
    }

    /**
     * Retrieves a registered extension component using its ID value.
     *
     * @param id The ID value to look for
     * @returns The component or null if not found
     */
    getComponentById<T>(id: string) {
        return this.componentRegister.getComponentById<T>(id);
    }

    /**
     * Retrieves a rule using its ID value.
     *
     * @param id The ID value to look for
     * @returns The rule or null if not found
     */
    getRuleById(id: string): RuleRef {
        return this.ruleService.getRuleById(id);
    }

    /**
     * Runs a lightweight expression stored in a string.
     *
     * @param value String containing the expression or literal value
     * @param context Parameter object for the expression with details of app state
     * @returns Result of evaluated expression, if found, or the literal value otherwise
     */
    runExpression(value: string | any , context?: any) {
        if (typeof value === 'string' ) {
            return this.evaluateExpression(value, context);
        } else {
            const duplicate = Object.assign({}, value);
            Object.keys(duplicate).forEach( (key) => {
                duplicate[key] = this.evaluateExpression(duplicate[key], context);
            });
            return duplicate;
        }
    }

    private evaluateExpression(value: string, context?: any): string {
        const pattern = new RegExp(/\$\((.*\)?)\)/g);
        const matches = pattern.exec(value);

        if (matches && matches.length > 1) {
            const expression = matches[1];
            const fn = new Function('context', `return ${expression}`);
            const result = fn(context);

            return result;
        }
        return value;
    }
}
