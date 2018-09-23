/*!
 * @license
 * Copyright 2016 - 2018 Alfresco Software, Ltd.
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

import { Injectable, Type } from '@angular/core';
import { RuleEvaluator, RuleRef, RuleContext, RuleParameter } from '../config/rule.extensions';
import { ExtensionConfig } from '../config/extension.config';
import { ExtensionLoaderService } from './extension-loader.service';
import { RouteRef } from '../config/routing.extensions';
import { ActionRef } from '../config/action.extensions';
import * as core from '../evaluators/core.evaluators';

@Injectable({
    providedIn: 'root'
})
export class ExtensionService {
    configPath = 'assets/app.extensions.json';
    pluginsPath = 'assets/plugins';

    rules: Array<RuleRef> = [];
    routes: Array<RouteRef> = [];
    actions: Array<ActionRef> = [];

    authGuards: { [key: string]: Type<{}> } = {};
    components: { [key: string]: Type<{}> } = {};
    evaluators: { [key: string]: RuleEvaluator } = {};

    constructor(private loader: ExtensionLoaderService) {}

    async load(): Promise<ExtensionConfig> {
        const config = await this.loader.load(
            this.configPath,
            this.pluginsPath
        );
        this.setup(config);
        return config;
    }

    setup(config: ExtensionConfig) {
        if (!config) {
            console.warn('Extension configuration not found');
            return;
        }

        this.setEvaluators({
            'core.every': core.every,
            'core.some': core.some,
            'core.not': core.not
        });

        this.rules = this.loader.getRules(config);
        this.actions = this.loader.getActions(config);
        this.routes = this.loader.getRoutes(config);
    }

    setEvaluators(values: { [key: string]: RuleEvaluator }) {
        if (values) {
            this.evaluators = Object.assign({}, this.evaluators, values);
        }
    }

    setAuthGuards(values: { [key: string]: Type<{}> }) {
        if (values) {
            this.authGuards = Object.assign({}, this.authGuards, values);
        }
    }

    setComponents(values: { [key: string]: Type<{}> }) {
        if (values) {
            this.components = Object.assign({}, this.components, values);
        }
    }

    getRouteById(id: string): RouteRef {
        return this.routes.find(route => route.id === id);
    }

    getAuthGuards(ids: string[]): Array<Type<{}>> {
        return (ids || [])
            .map(id => this.authGuards[id])
            .filter(guard => guard);
    }

    getActionById(id: string): ActionRef {
        return this.actions.find(action => action.id === id);
    }

    getEvaluator(key: string): RuleEvaluator {
        if (key && key.startsWith('!')) {
            const fn = this.evaluators[key.substring(1)];
            return (context: RuleContext, ...args: RuleParameter[]): boolean => {
                return !fn(context, ...args);
            };
        }
        return this.evaluators[key];
    }

    evaluateRule(ruleId: string, context: RuleContext): boolean {
        const ruleRef = this.getRuleById(ruleId);

        if (ruleRef) {
            const evaluator = this.getEvaluator(ruleRef.type);
            if (evaluator) {
                return evaluator(context, ...ruleRef.parameters);
            }
        } else {
            const evaluator = this.getEvaluator(ruleId);
            if (evaluator) {
                return evaluator(context);
            }
        }
        return false;
    }

    getComponentById(id: string): Type<{}> {
        return this.components[id];
    }

    getRuleById(id: string): RuleRef {
        return this.rules.find(ref => ref.id === id);
    }

    runExpression(value: string, context?: any) {
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
