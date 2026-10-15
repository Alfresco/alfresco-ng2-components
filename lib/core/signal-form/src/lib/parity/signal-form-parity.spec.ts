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

import { Injector, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { FormService, WidgetVisibilityService } from '../../../../src/lib/form/public-api';
import {
    formRequiredNumberWidget,
    mockRepeatableSectionForm01,
    mockSectionVisibilityForm,
    numberMinMaxForm,
    numberWidgetVisibilityForm,
    textWidgetVisibility
} from '../../../../src/lib/form/components/mock/form-renderer.component.mock';
import { FormEngineDriver, FormInteraction, FormSnapshot, LoadOptions } from './form-engine-driver';
import { CorrectedWidgetVisibilityService, IntentionalDifference, INTENTIONAL_DIFFERENCES } from './intentional-differences';
import { LegacyFormEngineDriver } from './legacy-form-engine.driver';
import { SignalFormEngineDriver } from './signal-form-engine.driver';

interface ParityCase {
    name: string;
    definition: object;
    steps: FormInteraction[];
    exercises: Array<'hiddenField' | 'invalidField'>;
    options?: LoadOptions;
}

describe('SignalForm parity with the current engine', () => {
    const setValue = (fieldId: string, value: unknown): FormInteraction => ({ kind: 'setValue', fieldId, value });
    const withProcessVariables = (definition: { formRepresentation: object }, processVariables: object[]): object => ({
        formRepresentation: { ...structuredClone(definition.formRepresentation), processVariables }
    });
    const inRow = (index: number, fieldId: string, value: unknown): FormInteraction => ({
        kind: 'setValue',
        fieldId,
        value,
        row: { sectionId: 'RepeatableSection0tbw2y', index }
    });
    const addRow: FormInteraction = { kind: 'addRow', sectionId: 'RepeatableSection0tbw2y' };
    const removeRow = (index: number): FormInteraction => ({ kind: 'removeRow', sectionId: 'RepeatableSection0tbw2y', index });
    const withField = (definition: object, fieldId: string, patch: object): object => {
        const copy = structuredClone(definition);
        const visit = (node: unknown): void => {
            if (Array.isArray(node)) {
                node.forEach(visit);
            } else if (node && typeof node === 'object') {
                if ((node as { id?: string }).id === fieldId) {
                    Object.assign(node, patch);
                }
                Object.values(node).forEach(visit);
            }
        };
        visit(copy);
        return copy;
    };
    const sectionSteps = [
        setValue('Text0n9o62', 'section'),
        setValue('Text0nu6os', 'section text'),
        setValue('Text0t23xu', 'x'),
        setValue('Text0t23xu', ''),
        setValue('Text0n9o62', 'other'),
        setValue('Text0nu6os', 'nope')
    ];
    const requiredInSection = (): object => withField(mockSectionVisibilityForm, 'Text0t23xu', { required: true });
    const tabForm = {
        formRepresentation: {
            id: 'tab-visibility',
            name: 'tab-visibility',
            formDefinition: {
                tabs: [
                    { id: 'main', title: 'Main' },
                    {
                        id: 'extra',
                        title: 'Extra',
                        visibilityCondition: {
                            leftType: 'field',
                            leftValue: 'showExtra',
                            operator: '==',
                            rightValue: 'yes',
                            rightType: 'value',
                            nextConditionOperator: ''
                        }
                    }
                ],
                fields: [
                    { id: 'main-root', type: 'container', tab: 'main', numberOfColumns: 1, fields: { 1: [{ id: 'showExtra', type: 'text' }] } },
                    {
                        id: 'extra-root',
                        type: 'container',
                        tab: 'extra',
                        numberOfColumns: 2,
                        fields: {
                            1: [{ id: 'extraText', type: 'text', required: true }],
                            2: [
                                {
                                    id: 'extraSection',
                                    type: 'section',
                                    numberOfColumns: 1,
                                    fields: { 1: [{ id: 'nestedText', type: 'text', required: true }] }
                                }
                            ]
                        }
                    }
                ],
                outcomes: [],
                variables: []
            }
        }
    };
    const shownWhen = (leftValue: string, rightValue: string) => ({
        leftType: 'field',
        leftValue,
        operator: '==',
        rightValue,
        rightType: 'value',
        nextConditionOperator: ''
    });
    const allFieldTypesForm = {
        formRepresentation: {
            id: 'all-field-types',
            name: 'all-field-types',
            formDefinition: {
                tabs: [],
                fields: [
                    {
                        id: 'all-root',
                        type: 'container',
                        numberOfColumns: 2,
                        fields: {
                            1: [
                                {
                                    id: 'country',
                                    type: 'dropdown',
                                    required: true,
                                    hasEmptyValue: true,
                                    options: [
                                        { id: 'it', name: 'Italy' },
                                        { id: 'fr', name: 'France' }
                                    ]
                                },
                                {
                                    id: 'tags',
                                    type: 'dropdown',
                                    required: true,
                                    selectionType: 'multiple',
                                    options: [
                                        { id: 'a', name: 'Alpha' },
                                        { id: 'b', name: 'Beta' }
                                    ]
                                },
                                {
                                    id: 'size',
                                    type: 'radio-buttons',
                                    required: true,
                                    value: 'Large',
                                    options: [
                                        { id: 's', name: 'Small' },
                                        { id: 'l', name: 'Large' }
                                    ]
                                },
                                { id: 'start', type: 'date', required: true, minValue: '2024-01-10', maxValue: '2024-12-31' },
                                { id: 'meeting', type: 'datetime', required: true, minValue: '2024-01-10T10:00:00.000Z' },
                                { id: 'price', type: 'amount', required: true, enableFractions: true, minValue: 1, maxValue: 100 },
                                { id: 'ratio', type: 'bigdecimal', required: true, precision: 2 },
                                { id: 'agree', type: 'boolean', required: true },
                                { id: 'owner', type: 'people', required: true },
                                { id: 'team', type: 'functional-group' },
                                { id: 'files', type: 'upload', required: true },
                                { id: 'notice', type: 'readonly-text', value: 'Read me' },
                                { id: 'link', type: 'hyperlink', hyperlinkUrl: 'https://example.com' },
                                { id: 'richText', type: 'display-rich-text', value: { blocks: [{ type: 'paragraph', data: { text: 'Hello' } }] } },
                                { id: 'table', type: 'data-table', value: [{ name: 'row one' }] },
                                { id: 'jsonField', type: 'json', value: { nested: 1 } },
                                { id: 'action', type: 'button' },
                                { id: 'external', type: 'display-external-property', required: true },
                                { id: 'viewer', type: 'file-viewer', required: true },
                                { id: 'properties', type: 'properties-viewer' }
                            ],
                            2: [
                                { id: 'whenFrance', type: 'text', visibilityCondition: shownWhen('country', 'fr') },
                                { id: 'whenFranceLabel', type: 'text', visibilityCondition: shownWhen('country_LABEL', 'France') },
                                { id: 'whenLarge', type: 'text', visibilityCondition: shownWhen('size', 'l') },
                                { id: 'whenAgreed', type: 'text', visibilityCondition: shownWhen('agree', 'true') },
                                { id: 'whenMayFirst', type: 'text', visibilityCondition: shownWhen('start', '2024-05-01') }
                            ]
                        }
                    }
                ],
                outcomes: [],
                variables: []
            }
        }
    };
    const approvalForm = (selectedOutcome?: string) => ({
        formRepresentation: {
            id: 'approval',
            name: 'approval',
            formDefinition: {
                tabs: [],
                selectedOutcome,
                fields: [
                    {
                        id: 'approval-root',
                        type: 'container',
                        numberOfColumns: 1,
                        fields: {
                            1: [
                                { id: 'reason', type: 'text', required: true },
                                { id: 'decision', type: 'text' },
                                { id: 'locked', type: 'text', readOnly: true }
                            ]
                        }
                    }
                ],
                outcomes: [
                    { id: 'approve', name: 'Approve' },
                    { id: 'reject', name: 'Reject', skipValidation: true },
                    { id: 'escalate', name: 'Escalate', visibilityCondition: shownWhen('decision', 'escalate') }
                ],
                variables: []
            }
        }
    });
    const approvalSteps = [setValue('reason', 'because'), setValue('decision', 'escalate'), setValue('reason', ''), setValue('decision', 'no')];
    const ruleOn = (kind: 'setVisibility' | 'setDisabled' | 'setRequired', fieldId: string, enabled: boolean): FormInteraction => ({
        kind,
        fieldId,
        enabled
    });
    const ruleSetsVariable = (variableId: string, value: unknown): FormInteraction => ({ kind: 'setVariable', variableId, value });
    const sectionId = '48e6bfed-b477-4641-86cb-bfa70229a31e';
    const allFieldTypesSteps = [
        setValue('country', { id: 'fr', name: 'France' }),
        setValue('country', 'it'),
        setValue('country', 'empty'),
        setValue('tags', [{ id: 'a', name: 'Alpha' }]),
        setValue('tags', []),
        setValue('size', 's'),
        setValue('size', 'unknown'),
        setValue('start', new Date(2024, 4, 1)),
        setValue('start', new Date(2023, 0, 1)),
        setValue('start', '2024-02-30'),
        setValue('meeting', new Date(2024, 0, 10, 12, 30)),
        setValue('meeting', new Date(2024, 0, 9, 12, 30)),
        setValue('price', 12.5),
        setValue('price', 150),
        setValue('price', 12.345),
        setValue('ratio', '3.14'),
        setValue('ratio', '3.141'),
        setValue('ratio', 'x'),
        setValue('agree', true),
        setValue('agree', false),
        setValue('owner', [{ id: 'u1', username: 'bob' }]),
        setValue('owner', []),
        setValue('team', [{ id: 'g1', name: 'Finance' }]),
        setValue('files', [{ id: 'n1', name: 'a.pdf' }]),
        setValue('files', []),
        setValue('external', 'From the repository'),
        setValue('external', ''),
        setValue('viewer', 'node-1'),
        setValue('viewer', '   ')
    ];
    const tabSteps = [
        setValue('showExtra', 'yes'),
        setValue('extraText', 'filled'),
        setValue('nestedText', 'filled'),
        setValue('nestedText', ''),
        setValue('showExtra', 'no')
    ];
    const variableSteps = [
        setValue('Number1', '5'),
        setValue('Number1', '6'),
        setValue('Number1', '7'),
        setValue('Number1', '9'),
        setValue('Number1', '')
    ];

    const corpus: ParityCase[] = [
        {
            name: 'text visibility conditions chained with and / or, in the legacy condition shape',
            definition: textWidgetVisibility,
            steps: [
                setValue('textOne', 'Test'),
                setValue('textTwo', 'other'),
                setValue('textTwo', ''),
                setValue('textOne', ''),
                setValue('textTwo', 'x')
            ],
            exercises: ['hiddenField']
        },
        {
            name: 'an integer with a minimum and a maximum',
            definition: numberMinMaxForm,
            steps: [
                setValue('Number0him2z', '5'),
                setValue('Number0him2z', '30'),
                setValue('Number0him2z', '70'),
                setValue('Number0him2z', 'abc'),
                setValue('Number0him2z', '')
            ],
            exercises: ['invalidField']
        },
        {
            name: 'an integer shown when two texts match an and condition',
            definition: numberWidgetVisibilityForm,
            steps: [setValue('Text0hs0gt', 'aaa'), setValue('Text0cuqet', 'aaa'), setValue('Text0cuqet', 'bbb'), setValue('Number0wxaur', '12x')],
            exercises: ['hiddenField', 'invalidField']
        },
        {
            name: 'an integer shown when another integer equals a form variable',
            definition: formRequiredNumberWidget,
            steps: variableSteps,
            exercises: ['hiddenField', 'invalidField']
        },
        {
            name: 'a form variable overridden by a process variable',
            definition: withProcessVariables(formRequiredNumberWidget, [{ name: 'integerVariable', type: 'integer', value: 6 }]),
            steps: variableSteps,
            exercises: ['hiddenField', 'invalidField']
        },
        {
            name: 'a form variable overridden by a process variable with the variables. prefix',
            definition: withProcessVariables(formRequiredNumberWidget, [{ name: 'variables.integerVariable', type: 'integer', value: 7 }]),
            steps: variableSteps,
            exercises: ['hiddenField', 'invalidField']
        },
        {
            name: 'a repeatable section with rows added up to the maximum and removed',
            definition: mockRepeatableSectionForm01,
            steps: [
                inRow(0, 'Text0wwp7n', 'first'),
                inRow(1, 'Integer0rzkwq', '5'),
                addRow,
                addRow,
                addRow,
                addRow,
                removeRow(0),
                inRow(0, 'Integer0rzkwq', '12')
            ],
            exercises: []
        },
        {
            name: 'a repeatable section whose row fields are required or have a minimum',
            definition: withField(withField(mockRepeatableSectionForm01, 'Text0wwp7n', { required: true }), 'Integer0rzkwq', { minValue: 3 }),
            steps: [
                inRow(0, 'Text0wwp7n', 'first'),
                inRow(1, 'Integer0rzkwq', '1'),
                addRow,
                inRow(2, 'Integer0rzkwq', 'x'),
                removeRow(1),
                inRow(1, 'Text0wwp7n', ' ')
            ],
            exercises: ['invalidField']
        },
        {
            name: 'a field inside a section that has its own visibility condition',
            definition: mockSectionVisibilityForm,
            steps: sectionSteps,
            exercises: ['hiddenField']
        },
        {
            name: 'a required field in a hidden section, which is not validated while the section is hidden',
            definition: requiredInSection(),
            steps: sectionSteps,
            exercises: ['hiddenField', 'invalidField']
        },
        {
            name: 'required fields in a tab shown by a visibility condition',
            definition: tabForm,
            steps: tabSteps,
            exercises: ['hiddenField', 'invalidField']
        },
        {
            name: 'custom outcomes enabled by form validity, skipping validation, and shown by a condition',
            definition: approvalForm(),
            steps: approvalSteps,
            exercises: ['invalidField']
        },
        {
            name: 'a required read-only field, which is not validated',
            definition: withField(approvalForm(), 'locked', { required: true }),
            steps: approvalSteps,
            exercises: ['invalidField']
        },
        {
            name: 'a read-only form showing only its selected outcome, with nothing validated',
            definition: approvalForm('Approve'),
            steps: approvalSteps,
            exercises: [],
            options: { readOnly: true }
        },
        {
            name: 'the default outcomes with the complete button shown',
            definition: textWidgetVisibility,
            steps: [setValue('textOne', 'Test')],
            exercises: [],
            options: { showCompleteButton: true }
        },
        {
            name: 'rules hiding, disabling and requiring fields',
            definition: approvalForm(),
            steps: [
                ruleOn('setVisibility', 'decision', false),
                ruleOn('setRequired', 'decision', true),
                ruleOn('setVisibility', 'decision', true),
                setValue('decision', 'escalate'),
                ruleOn('setDisabled', 'reason', true),
                ruleOn('setDisabled', 'locked', false),
                ruleOn('setRequired', 'reason', false),
                setValue('decision', '')
            ],
            exercises: ['hiddenField', 'invalidField']
        },
        {
            name: 'rules hiding and showing a whole section',
            definition: requiredInSection(),
            steps: [
                setValue('Text0n9o62', 'section'),
                setValue('Text0nu6os', 'section text'),
                ruleOn('setVisibility', sectionId, false),
                ruleOn('setVisibility', sectionId, true),
                ruleOn('setVisibility', 'Text0t23xu', false)
            ],
            exercises: ['hiddenField', 'invalidField']
        },
        {
            name: 'rules setting a form variable by name and by id',
            definition: formRequiredNumberWidget,
            steps: [
                setValue('Number1', '6'),
                ruleSetsVariable('integerVariable', 6),
                ruleSetsVariable('f9f6d1ae-374a-49f9-b664-5286c558abaa', 7),
                setValue('Number1', '7')
            ],
            exercises: ['hiddenField']
        },
        {
            name: 'a variable set by a rule taking precedence over a process variable',
            definition: withProcessVariables(formRequiredNumberWidget, [{ name: 'integerVariable', type: 'integer', value: 6 }]),
            steps: [setValue('Number1', '6'), ruleSetsVariable('integerVariable', 5), setValue('Number1', '5')],
            exercises: ['hiddenField']
        },
        {
            name: 'every cloud field type, with fields shown by dropdown, radio, checkbox and date values',
            definition: allFieldTypesForm,
            steps: allFieldTypesSteps,
            exercises: ['hiddenField', 'invalidField']
        }
    ];

    const legacyDriver = (differences: IntentionalDifference[] = INTENTIONAL_DIFFERENCES): FormEngineDriver => {
        const visibilityService = differences.some((difference) => difference.correctsVisibility)
            ? TestBed.runInInjectionContext(() => new CorrectedWidgetVisibilityService())
            : TestBed.inject(WidgetVisibilityService);
        return new LegacyFormEngineDriver(TestBed.inject(FormService), visibilityService, differences);
    };
    const createDrivers = (): FormEngineDriver[] => [legacyDriver(), new SignalFormEngineDriver(TestBed.inject(Injector))];

    corpus.forEach(({ name, definition, steps, exercises, options }) => {
        it(`should match the current engine for ${name}`, () => {
            const [legacy, candidate] = createDrivers();
            legacy.load(definition, options);
            candidate.load(definition, options);
            const legacySnapshots = [legacy.snapshot()];

            expect(candidate.snapshot()).withContext('after loading').toEqual(legacySnapshots[0]);

            steps.forEach((step, index) => {
                legacy.apply(step);
                candidate.apply(step);
                legacySnapshots.push(legacy.snapshot());

                expect(candidate.snapshot())
                    .withContext(`after step ${index + 1}: ${JSON.stringify(step)}`)
                    .toEqual(legacySnapshots[index + 1]);
            });

            const fieldStates = legacySnapshots.flatMap((snapshot) => Object.values(snapshot.fields));
            const exercised = {
                hiddenField: fieldStates.some(({ visible }) => !visible),
                invalidField: fieldStates.some(({ valid }) => !valid)
            };
            exercises.forEach((state) => expect(exercised[state]).withContext(`the case should reach a ${state}`).toBeTrue());
        });
    });

    it('should compare with the process variable, not the form variable default, when both exist', () => {
        createDrivers().forEach((driver) => {
            driver.load(withProcessVariables(formRequiredNumberWidget, [{ name: 'integerVariable', type: 'integer', value: 6 }]));

            driver.apply(setValue('Number1', '5'));
            expect(driver.snapshot().fields['Number2'].visible).withContext(`${driver.constructor.name} at the default`).toBeFalse();

            driver.apply(setValue('Number1', '6'));
            expect(driver.snapshot().fields['Number2'].visible).withContext(`${driver.constructor.name} at the override`).toBeTrue();
        });
    });

    it('should add rows up to the section maximum and remove them', () => {
        createDrivers().forEach((driver) => {
            const rowCount = () => (driver.snapshot().values['RepeatableSection0tbw2y'] as unknown[]).length;
            driver.load(mockRepeatableSectionForm01);

            expect(rowCount()).withContext(`${driver.constructor.name} initial rows`).toBe(2);

            [1, 2, 3, 4].forEach(() => driver.apply(addRow));
            expect(rowCount()).withContext(`${driver.constructor.name} capped at the maximum`).toBe(5);

            driver.apply(removeRow(0));
            expect(rowCount()).withContext(`${driver.constructor.name} after removing a row`).toBe(4);
        });
    });

    it('should read, show and submit every cloud field type the way the current engine does', () => {
        createDrivers().forEach((driver) => {
            const engine = driver.constructor.name;
            const visible = (fieldId: string) => driver.snapshot().fields[fieldId].visible;
            const submitted = () => driver.snapshot().values;
            driver.load(allFieldTypesForm);

            expect(visible('whenLarge')).withContext(`${engine}: radio value given by name resolves to its id`).toBeTrue();
            expect(submitted()['size']).withContext(engine).toEqual({ id: 'l', name: 'Large' });
            expect(submitted()['country']).withContext(`${engine}: empty option submits null`).toBeNull();
            expect('notice' in submitted())
                .withContext(`${engine}: display text writes nothing`)
                .toBeFalse();
            expect('link' in submitted())
                .withContext(`${engine}: hyperlink writes nothing`)
                .toBeFalse();

            driver.apply(setValue('country', { id: 'fr', name: 'France' }));
            expect(visible('whenFrance')).withContext(engine).toBeTrue();
            expect(visible('whenFranceLabel')).withContext(engine).toBeTrue();
            expect(submitted()['country']).withContext(engine).toEqual({ id: 'fr', name: 'France' });

            driver.apply(setValue('start', new Date(2024, 4, 1)));
            expect(visible('whenMayFirst')).withContext(engine).toBeTrue();
            expect(submitted()['start']).withContext(engine).toBe('2024-05-01T00:00:00.000Z');

            driver.apply(setValue('agree', true));
            expect(visible('whenAgreed')).withContext(engine).toBeTrue();

            driver.apply(setValue('files', [{ id: 'n1', name: 'a.pdf' }]));
            expect(submitted()['files']).withContext(engine).toBe('n1');

            driver.apply(setValue('owner', []));
            expect(driver.snapshot().fields['owner'].valid).withContext(`${engine}: an empty people list fails required`).toBeFalse();
        });
    });

    describe('intentional differences', () => {
        interface DifferenceScenario {
            definition: object;
            steps: FormInteraction[];
            observe: (snapshot: FormSnapshot) => unknown;
        }

        const textEqualTo = (rightValue: string) => ({
            formRepresentation: {
                id: 'date-literal',
                name: 'date-literal',
                formDefinition: {
                    tabs: [],
                    fields: [
                        {
                            id: 'date-literal-root',
                            type: 'container',
                            numberOfColumns: 1,
                            fields: {
                                1: [
                                    { id: 'typed', type: 'text' },
                                    { id: 'shown', type: 'text', visibilityCondition: shownWhen('typed', rightValue) }
                                ]
                            }
                        }
                    ],
                    outcomes: [],
                    variables: []
                }
            }
        });

        const scenarios: Record<string, DifferenceScenario> = {
            'hidden-fields-not-validated': {
                definition: requiredInSection(),
                steps: sectionSteps.slice(0, 5),
                observe: (snapshot) => snapshot.valid
            },
            'empty-people-list-is-empty': {
                definition: allFieldTypesForm,
                steps: [setValue('owner', [])],
                observe: (snapshot) => snapshot.fields['owner'].valid
            },
            'custom-widgets-handled-by-value-type': {
                definition: {
                    formRepresentation: {
                        id: 'custom-widget',
                        name: 'custom-widget',
                        formDefinition: {
                            tabs: [],
                            fields: [
                                {
                                    id: 'custom-root',
                                    type: 'container',
                                    numberOfColumns: 1,
                                    fields: { 1: [{ id: 'score', type: 'my-widget-emulm', isCustomType: true, valueType: 'string', required: true }] }
                                }
                            ],
                            outcomes: [],
                            variables: []
                        }
                    }
                },
                steps: [],
                observe: (snapshot) => snapshot.valid
            },
            'string-fields-validated-as-text': {
                definition: {
                    formRepresentation: {
                        id: 'string-field',
                        name: 'string-field',
                        formDefinition: {
                            tabs: [],
                            fields: [
                                {
                                    id: 'string-root',
                                    type: 'container',
                                    numberOfColumns: 1,
                                    fields: { 1: [{ id: 'nickname', type: 'string', required: true }] }
                                }
                            ],
                            outcomes: [],
                            variables: []
                        }
                    }
                },
                steps: [],
                observe: (snapshot) => snapshot.valid
            },
            'read-only-fields-not-validated': {
                definition: withField(approvalForm(), 'locked', { required: true }),
                steps: [setValue('reason', 'because')],
                observe: (snapshot) => snapshot.valid
            },
            'condition-dates-parsed-as-dates': {
                definition: textEqualTo('2024-13-01'),
                steps: [setValue('typed', '2024-13-01')],
                observe: (snapshot) => snapshot.fields['shown'].visible
            },
            'unmatched-dropdown-value-submits-null': {
                definition: allFieldTypesForm,
                steps: [setValue('country', { id: 'fr', name: 'France' }), setValue('country', { id: 'xx', name: 'Unknown' })],
                observe: (snapshot) => snapshot.values['country']
            }
        };

        const observe = (driver: FormEngineDriver, { definition, steps, observe: read }: DifferenceScenario): unknown => {
            driver.load(definition);
            steps.forEach((step) => driver.apply(step));
            return read(driver.snapshot());
        };

        INTENTIONAL_DIFFERENCES.forEach((difference) => {
            it(`should apply "${difference.id}" (${difference.group}): ${difference.description}`, () => {
                const scenario = scenarios[difference.id];
                expect(scenario).withContext('every intentional difference needs a scenario').toBeDefined();

                const today = observe(legacyDriver([]), scenario);
                const fixed = observe(legacyDriver([difference]), scenario);

                expect(fixed).withContext('the fix changes the current engine').not.toEqual(today);
                expect(observe(new SignalFormEngineDriver(TestBed.inject(Injector)), scenario))
                    .withContext('the new engine')
                    .toEqual(fixed);
            });
        });
    });

    it('should enable and show outcomes the way the cloud form does', () => {
        createDrivers().forEach((driver) => {
            const engine = driver.constructor.name;
            const outcomes = () => driver.snapshot().outcomes;

            driver.load(approvalForm());
            expect(outcomes()['approve']).withContext(`${engine}: needs a valid form`).toEqual({ visible: true, enabled: false });
            expect(outcomes()['reject']).withContext(`${engine}: skips validation`).toEqual({ visible: true, enabled: true });
            expect(outcomes()['escalate'].visible).withContext(`${engine}: hidden by its condition`).toBeFalse();

            driver.apply(setValue('reason', 'because'));
            driver.apply(setValue('decision', 'escalate'));
            expect(outcomes()['approve'].enabled).withContext(engine).toBeTrue();
            expect(outcomes()['escalate']).withContext(engine).toEqual({ visible: true, enabled: true });

            driver.load(withField(approvalForm(), 'locked', { required: true }));
            driver.apply(setValue('reason', 'because'));
            expect(outcomes()['approve'].enabled).withContext(`${engine}: a required read-only field doesn't block the form`).toBeTrue();
            expect(driver.snapshot().fields['locked']).withContext(engine).toEqual({ visible: true, valid: true, readOnly: true });

            driver.load(approvalForm('Approve'), { readOnly: true });
            expect(outcomes()['approve']).withContext(`${engine}: read-only shows the selected outcome`).toEqual({ visible: true, enabled: false });
            expect(outcomes()['reject'].visible).withContext(engine).toBeFalse();
            expect(driver.snapshot().fields['reason'].readOnly).withContext(engine).toBeTrue();
        });
    });

    it('should keep a field hidden by a rule even when its own condition is met later', () => {
        createDrivers().forEach((driver) => {
            driver.load(textWidgetVisibility);
            driver.apply(ruleOn('setVisibility', 'textTwo', false));
            driver.apply(setValue('textOne', 'Test'));

            expect(driver.snapshot().fields['textTwo'].visible).withContext(driver.constructor.name).toBeFalse();
        });
    });

    it('should leave the definition it was given untouched, unlike the current engine', () => {
        const definition = structuredClone(formRequiredNumberWidget);
        const original = structuredClone(definition);
        const driver = new SignalFormEngineDriver(TestBed.inject(Injector));

        driver.load(definition);
        driver.apply(ruleSetsVariable('integerVariable', 6));
        driver.apply(ruleOn('setVisibility', 'Number2', false));
        driver.apply(setValue('Number1', '6'));

        expect(definition).toEqual(original);
    });

    it('should need a value for every field, because Signal Forms creates no field for an undefined key', () => {
        const tree = form(signal<Record<string, unknown>>({ unset: undefined, empty: null }), { injector: TestBed.inject(Injector) });

        expect(tree['unset']).toBeUndefined();
        expect(tree['empty']).toBeDefined();
    });
});
