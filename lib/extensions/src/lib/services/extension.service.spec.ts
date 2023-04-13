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

import { ExtensionService } from './extension.service';
import { ExtensionLoaderService } from './extension-loader.service';
import { ExtensionConfig } from '../config/extension.config';
import { RuleRef } from '../config/rule.extensions';
import { RouteRef } from '../config/routing.extensions';
import { ActionRef } from '../config/action.extensions';
import { ComponentRegisterService } from './component-register.service';
import { RuleService } from './rule.service';

describe('ExtensionService', () => {
    const blankConfig: ExtensionConfig = {
        $id: 'test',
        $name: 'test.config',
        $version: '1.0.0',
        $vendor: 'Alfresco',
        $license: 'MIT',
        $runtime: '2.6.1'
    };

    let loader: ExtensionLoaderService;
    let componentRegister: ComponentRegisterService;
    let service: ExtensionService;
    let ruleService: RuleService;

    beforeEach(() => {
        loader = new ExtensionLoaderService(null);
        componentRegister = new ComponentRegisterService();
        ruleService = new RuleService(loader);
        service = new ExtensionService(loader, componentRegister, ruleService, []);
    });

    it('should load and setup a config', async () => {
        spyOn(loader, 'load').and.callFake(() => Promise.resolve(blankConfig));
        spyOn(service, 'setup').and.stub();

        await service.load();

        expect(loader.load).toHaveBeenCalled();
        expect(loader.load).toHaveBeenCalledWith('assets/app.extensions.json', 'assets/plugins', []);
        expect(service.setup).toHaveBeenCalledWith(blankConfig);
    });

    describe('getFeature', () => {
        it('should return array if seached feature is an array', async () => {
            const searchedArrayFeature = [{ test: 'test' }];

            service.setup({
                ...blankConfig,
                features: {
                    searchedArrayFeature
                }
            });

            const requestedFeatue = service.getFeature('searchedArrayFeature');
            expect(requestedFeatue).toEqual(searchedArrayFeature);
        });

        it('should return object if seached feature is an object', async () => {
            const searchedObjectFeature: { test: string } = { test: 'test' };
            service.setup({
                ...blankConfig,
                features: {
                    searchedObjectFeature
                }
            });

            const requestedFeatue = service.getFeature<{ test: string }>('searchedObjectFeature');
            expect(requestedFeatue).toEqual(searchedObjectFeature);
        });

        it('should return default value if feature is not found', async () => {
            const defaultValue = {};
            service.setup(blankConfig);

            const requestedFeatue = service.getFeature<{ test: string }>('searchedFeature', defaultValue);
            expect(requestedFeatue).toEqual(defaultValue);
        });
    });

    it('should raise warning if setting up with missing config', () => {
        spyOn(console, 'warn').and.stub();

        service.setup(null);

        expect(console.warn).toHaveBeenCalledWith('Extension configuration not found');
    });

    it('should setup default evaluators', () => {
        service.setup(blankConfig);

        const evaluators = ['core.every', 'core.some', 'core.not'];
        evaluators.forEach((key) => {
            expect(service.getEvaluator(key)).toBeDefined(`Evaluator ${key} is missing`);
        });
    });

    it('should set custom evaluators', () => {
        const evaluator1 = () => true;
        const evaluator2 = () => false;

        service.setEvaluators({
            eval1: evaluator1,
            eval2: evaluator2
        });

        expect(service.getEvaluator('eval1')).toBe(evaluator1);
        expect(service.getEvaluator('eval2')).toBe(evaluator2);
    });

    it('should override existing evaluators', () => {
        const evaluator1 = () => true;
        const evaluator2 = () => false;

        service.setup(blankConfig);
        expect(service.getEvaluator('core.every')).toBeDefined();
        expect(service.getEvaluator('core.every')).not.toBe(evaluator1);

        service.setEvaluators({
            'core.every': evaluator1,
            eval2: evaluator2
        });

        expect(service.getEvaluator('core.every')).toBe(evaluator1);
        expect(service.getEvaluator('eval2')).toBe(evaluator2);
    });

    it('should negate existing evaluator', () => {
        const positive = () => true;

        service.setEvaluators({
            positive
        });

        let evaluator = service.getEvaluator('positive');
        expect(evaluator(null)).toBe(true);

        evaluator = service.getEvaluator('!positive');
        expect(evaluator(null, 'param1', 'param2')).toBe(false);
    });

    it('should not update evaluators with null value', () => {
        service.setup(blankConfig);
        service.setEvaluators(null);

        expect(service.getEvaluator('core.every')).toBeDefined();
    });

    it('should set authentication guards', () => {
        let registered = service.getAuthGuards(['guard1']);
        expect(registered.length).toBe(0);

        const guard1: any = {};
        const guard2: any = {};

        service.setAuthGuards({
            auth1: guard1,
            auth2: guard2
        });

        registered = service.getAuthGuards(['auth1', 'auth2']);
        expect(registered.length).toBe(2);
        expect(registered[0]).toBe(guard1);
        expect(registered[1]).toBe(guard2);
    });

    it('should overwrite authentication guards', () => {
        const guard1: any = {};
        const guard2: any = {};

        service.setAuthGuards({
            auth: guard1
        });

        expect(service.getAuthGuards(['auth'])).toEqual([guard1]);

        service.setAuthGuards({
            auth: guard2
        });

        expect(service.getAuthGuards(['auth'])).toEqual([guard2]);
    });

    it('should not set authentication guards with null value', () => {
        const guard1: any = {};

        service.setAuthGuards({
            auth: guard1
        });

        service.setAuthGuards(null);

        expect(service.getAuthGuards(['auth'])).toEqual([guard1]);
    });

    it('should not fetch auth guards for missing ids', () => {
        const guards = service.getAuthGuards(null);
        expect(guards).toEqual([]);
    });

    it('should set components', () => {
        const component: any = {};

        service.setComponents({
            component1: component
        });

        expect(service.getComponentById('component1')).toBe(component);
    });

    it('should overwrite components', () => {
        const component1: any = {};
        const component2: any = {};

        service.setComponents({
            component: component1
        });

        expect(service.getComponentById('component')).toBe(component1);

        service.setComponents({
            component: component2
        });

        expect(service.getComponentById('component')).toBe(component2);
    });

    it('should not set components with null value', () => {
        const component: any = {};

        service.setComponents({
            component1: component
        });

        expect(service.getComponentById('component1')).toBe(component);

        service.setComponents(null);

        expect(service.getComponentById('component1')).toBe(component);
    });

    it('should fetch route by id', () => {
        const route: RouteRef = {
            id: 'test.route',
            component: 'component',
            path: '/ext/route1'
        };

        spyOn(loader, 'getRoutes').and.returnValue([route]);
        service.setup(blankConfig);

        expect(service.getRouteById('test.route')).toBe(route);
    });

    it('should fetch action by id', () => {
        const action: ActionRef = {
            id: 'test.action',
            type: 'action'
        };

        spyOn(loader, 'getActions').and.returnValue([action]);
        service.setup(blankConfig);

        expect(service.getActionById('test.action')).toBe(action);
    });

    it('should fetch rule by id', () => {
        const rule: RuleRef = {
            id: 'test.rule',
            type: 'core.every'
        };

        spyOn(loader, 'getRules').and.returnValue([rule]);
        service.setup(blankConfig);

        expect(service.getRuleById('test.rule')).toBe(rule);
    });

    it('should evaluate condition', () => {
        const condition = () => true;

        service.setEvaluators({
            'test.condition': condition
        });

        const context: any = {
            getEvaluator: (key: string) => service.getEvaluator(key)
        };

        const result = service.evaluateRule('test.condition', context);
        expect(result).toBe(true);
    });

    it('should evaluate missing condition as [false]', () => {
        const context: any = {
            getEvaluator: (key: string) => service.getEvaluator(key)
        };

        const result = service.evaluateRule('missing.condition', context);
        expect(result).toBe(false);
    });

    it('should evaluate rule by reference', () => {
        const ruleRef: RuleRef = {
            id: 'test.rule',
            type: 'core.every',
            parameters: [
                {
                    type: 'rule',
                    value: 'test.condition'
                }
            ]
        };

        spyOn(loader, 'getRules').and.returnValue([ruleRef]);
        service.setup(blankConfig);

        const condition = () => true;

        service.setEvaluators({
            'test.condition': condition
        });

        const context: any = {
            getEvaluator: (key: string) => service.getEvaluator(key)
        };

        const result = service.evaluateRule('test.rule', context);
        expect(result).toBe(true);
    });

    it('should evaluate rule ref with missing condition as [false]', () => {
        const ruleRef: RuleRef = {
            id: 'test.rule',
            type: 'missing.evaluator'
        };

        spyOn(loader, 'getRules').and.returnValue([ruleRef]);
        service.setup(blankConfig);

        const context: any = {
            getEvaluator: (key: string) => service.getEvaluator(key)
        };

        const result = service.evaluateRule('test.rule', context);
        expect(result).toBe(false);
    });

    it('should evaluate rule ref with missing evaluator as [false]', () => {
        const ruleRef: RuleRef = {
            id: 'test.rule',
            type: 'core.every',
            parameters: [
                {
                    type: 'rule',
                    value: 'missing.condition'
                }
            ]
        };

        spyOn(loader, 'getRules').and.returnValue([ruleRef]);
        service.setup(blankConfig);

        const context: any = {
            getEvaluator: (key: string) => service.getEvaluator(key)
        };

        const result = service.evaluateRule('test.rule', context);
        expect(result).toBe(false);
    });

    describe('expressions', () => {
        it('should eval static value', () => {
            const value = service.runExpression('hello world');
            expect(value).toBe('hello world');
        });

        it('should eval string as an expression', () => {
            const value = service.runExpression('$( "hello world" )');
            expect(value).toBe('hello world');
        });

        it('should eval expression with no context', () => {
            const value = service.runExpression('$( 1 + 1 )');
            expect(value).toBe(2);
        });

        it('should eval expression with context', () => {
            const context = {
                a: 'hey',
                b: 'there'
            };
            const expression = '$( context.a + " " + context.b + "!" )';
            const value = service.runExpression(expression, context);
            expect(value).toBe('hey there!');
        });
    });
});
