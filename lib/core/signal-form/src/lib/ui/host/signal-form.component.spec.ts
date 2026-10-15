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

import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopTranslateModule } from '../../../../../src/lib/testing/noop-translate.module';
import { readFormDefinition } from '../../definition/read-form-definition';
import { SignalForm, SignalFormOptions } from '../../state/signal-form';
import { FormWidgetRegistry, provideFormWidgets } from '../../widgets/form-widget-registry';
import { BUILT_IN_WIDGETS_LOADED_DIRECTLY, settleFixture } from '../testing/signal-form-testing.mock';
import { SignalFormOutcomeEvent } from './signal-form-outcome-event';
import { SignalFormComponent } from './signal-form.component';

describe('SignalFormComponent', () => {
    let fixture: ComponentFixture<SignalFormComponent>;
    let form: SignalForm;
    let executed: SignalFormOutcomeEvent[];

    const leaveRequest = (outcomes: object[] = [], selectedOutcome?: string) => ({
        formRepresentation: {
            name: 'Leave request',
            formDefinition: {
                theme: { form: { '--adf-form-label-color': 'red' } },
                fields: [
                    {
                        id: 'root',
                        type: 'container',
                        numberOfColumns: 1,
                        fields: { 1: [{ id: 'requester', name: 'Requester', type: 'text', required: true }] }
                    }
                ],
                outcomes,
                selectedOutcome,
                variables: []
            }
        }
    });
    const approvalOutcomes = [
        { id: 'approve', name: 'Approve' },
        { id: 'reject', name: 'Reject', skipValidation: true },
        {
            id: 'escalate',
            name: 'Escalate now',
            visibilityCondition: {
                leftType: 'field',
                leftValue: 'requester',
                operator: '==',
                rightValue: 'boss',
                rightType: 'value',
                nextConditionOperator: ''
            }
        }
    ];

    const render = async (definition: object, inputs: Record<string, unknown> = {}, options: SignalFormOptions = {}): Promise<void> => {
        const registry = TestBed.inject(FormWidgetRegistry);
        form = new SignalForm(readFormDefinition(definition, registry), options, TestBed.inject(Injector), registry);
        fixture = TestBed.createComponent(SignalFormComponent);
        fixture.componentRef.setInput('form', form);
        Object.entries(inputs).forEach(([name, value]) => fixture.componentRef.setInput(name, value));
        executed = [];
        fixture.componentInstance.executeOutcome.subscribe((event) => executed.push(event));
        await settleFixture(fixture);
    };

    const element = (selector: string): HTMLElement | null => fixture.nativeElement.querySelector(selector);
    const button = (outcomeName: string): HTMLButtonElement | null => element(`#adf-form-${outcomeName}`) as HTMLButtonElement | null;

    const typeRequester = async (value: string): Promise<void> => {
        const target = element('#requester') as HTMLInputElement;
        target.value = value;
        target.dispatchEvent(new Event('input'));
        await settleFixture(fixture);
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule],
            providers: [provideFormWidgets(...BUILT_IN_WIDGETS_LOADED_DIRECTLY)]
        });
    });

    it('should show the form name as title, or the title it is given, and hide it on request', async () => {
        await render(leaveRequest());
        expect(element('.adf-signal-form-title')?.textContent.trim()).toBe('Leave request');

        fixture.componentRef.setInput('title', 'Task: approve leave');
        await settleFixture(fixture);
        expect(element('.adf-signal-form-title')?.textContent.trim()).toBe('Task: approve leave');

        fixture.componentRef.setInput('showTitle', false);
        await settleFixture(fixture);
        expect(element('.adf-signal-form-title')).toBeNull();
    });

    it('should show whether the form is valid', async () => {
        await render(leaveRequest());
        expect(element('#adf-invalid-form-icon')).not.toBeNull();

        await typeRequester('Vito');

        expect(element('#adf-valid-form-icon')).not.toBeNull();
        expect(element('#adf-invalid-form-icon')).toBeNull();
    });

    it('should apply the form theme', async () => {
        await render(leaveRequest());

        expect(element('[data-automation-id="adf-signal-form-container"]').style.getPropertyValue('--adf-form-label-color')).toBe('red');
    });

    it('should enable an outcome that needs validation only once the form is valid', async () => {
        await render(leaveRequest(approvalOutcomes));

        expect(button('approve').disabled).toBeTrue();
        expect(button('reject').disabled).withContext('skips validation').toBeFalse();
        expect(button('save').disabled).withContext('saving never needs a valid form').toBeFalse();

        await typeRequester('Vito');

        expect(button('approve').disabled).toBeFalse();
    });

    it('should emit the executed outcome with the values the form would submit', async () => {
        await render(leaveRequest(approvalOutcomes));
        await typeRequester('Vito');

        button('approve').click();

        expect(executed.length).toBe(1);
        expect(executed[0].outcome.id).toBe('approve');
        expect(executed[0].values).toEqual({ requester: 'Vito' });
        expect(executed[0].defaultPrevented).toBeFalse();
        executed[0].preventDefault();
        expect(executed[0].defaultPrevented).toBeTrue();
    });

    it('should show an outcome only while its visibility condition is met', async () => {
        await render(leaveRequest(approvalOutcomes));
        expect(button('escalate_now')).toBeNull();

        await typeRequester('boss');

        expect(button('escalate_now')).not.toBeNull();
    });

    it('should hide or disable the save and complete outcomes as the host asks', async () => {
        await render(leaveRequest());
        await typeRequester('Vito');
        expect(button('save')).not.toBeNull();
        expect(button('complete').disabled).toBeFalse();

        fixture.componentRef.setInput('disableSaveButton', true);
        fixture.componentRef.setInput('disableCompleteButton', true);
        await settleFixture(fixture);
        expect(button('save').disabled).toBeTrue();
        expect(button('complete').disabled).toBeTrue();

        fixture.componentRef.setInput('showSaveButton', false);
        fixture.componentRef.setInput('showCompleteButton', false);
        await settleFixture(fixture);
        expect(button('save')).toBeNull();
        expect(button('complete')).toBeNull();
    });

    it('should show only the selected outcome of a read-only form, disabled', async () => {
        await render(leaveRequest(approvalOutcomes, 'Approve'), {}, { readOnly: true });

        expect(button('approve').disabled).toBeTrue();
        expect(button('reject')).toBeNull();
        expect(button('save')).toBeNull();

        button('approve').click();
        expect(executed).toEqual([]);
    });

    describe('tab navigation', () => {
        const tabbedForm = (showBottomTabNavButtons?: boolean) => ({
            formDefinition: {
                showBottomTabNavButtons,
                tabs: [
                    { id: 'first', title: 'First' },
                    { id: 'second', title: 'Second' },
                    {
                        id: 'third',
                        title: 'Third',
                        visibilityCondition: {
                            leftType: 'field',
                            leftValue: 'more',
                            operator: '==',
                            rightValue: 'yes',
                            rightType: 'value',
                            nextConditionOperator: ''
                        }
                    }
                ],
                fields: [
                    { id: 'first-root', type: 'container', tab: 'first', numberOfColumns: 1, fields: { 1: [{ id: 'more', type: 'text' }] } },
                    { id: 'second-root', type: 'container', tab: 'second', numberOfColumns: 1, fields: { 1: [{ id: 'note', type: 'text' }] } },
                    { id: 'third-root', type: 'container', tab: 'third', numberOfColumns: 1, fields: { 1: [{ id: 'extra', type: 'text' }] } }
                ],
                outcomes: [],
                variables: []
            }
        });
        const previous = () => element('[data-automation-id="tab-nav-previous-button"]') as HTMLButtonElement | null;
        const next = () => element('[data-automation-id="tab-nav-next-button"]') as HTMLButtonElement | null;
        const shownTab = () => element('[role="tab"][aria-selected="true"]')?.textContent.trim();

        it('should show the tab buttons only when the form asks for them and the host allows them', async () => {
            await render(tabbedForm());
            expect(next()).withContext('not asked by the form').toBeNull();

            await render(tabbedForm(true), { showTabNavigation: false });
            expect(next()).withContext('not allowed by the host').toBeNull();

            await render(tabbedForm(true));
            expect(next()).not.toBeNull();
        });

        it('should move between the visible tabs, up to the last one', async () => {
            await render(tabbedForm(true));
            expect(previous().disabled).toBeTrue();

            next().click();
            await settleFixture(fixture);

            expect(shownTab()).toBe('Second');
            expect(previous().disabled).toBeFalse();
            expect(next().disabled).withContext('the third tab is hidden').toBeTrue();

            previous().click();
            await settleFixture(fixture);
            expect(shownTab()).toBe('First');
        });

        it('should follow a tab the user selects', async () => {
            await render(tabbedForm(true));

            (fixture.nativeElement.querySelectorAll('[role="tab"]')[1] as HTMLElement).click();
            await settleFixture(fixture);

            expect(shownTab()).toBe('Second');
            expect(previous().disabled).toBeFalse();
        });

        it('should hide the tab buttons while only one tab is visible', async () => {
            const singleTab = tabbedForm(true);
            singleTab.formDefinition.tabs = singleTab.formDefinition.tabs.filter(({ id }) => id !== 'second');
            singleTab.formDefinition.fields = singleTab.formDefinition.fields.filter(({ tab }) => tab !== 'second');
            await render(singleTab);
            expect(next()).toBeNull();

            const more = element('#more') as HTMLInputElement;
            more.value = 'yes';
            more.dispatchEvent(new Event('input'));
            await settleFixture(fixture);
            expect(next()).withContext('the third tab is now visible').not.toBeNull();
        });
    });
});
