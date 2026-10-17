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
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NoopTranslateModule } from '../../../../src/lib/testing/noop-translate.module';
import { FormRendererComponent } from '../../../../src/lib/form/components/form-renderer.component';
import * as legacyForms from '../../../../src/lib/form/components/mock/form-renderer.component.mock';
import { FormService } from '../../../../src/lib/form/public-api';
import { readFormDefinition } from '../definition/read-form-definition';
import { SignalForm } from '../state/signal-form';
import { SignalFormRendererComponent } from '../ui/renderer/signal-form-renderer.component';
import { BUILT_IN_WIDGETS_LOADED_DIRECTLY, settleFixture } from '../ui/testing/signal-form-testing.mock';
import { FormWidgetRegistry, provideFormWidgets } from '../widgets/form-widget-registry';

type ColumnWidths = Record<string, number[][]>;

const LEGACY_ID = /^field-(.+)-container$/;
const SIGNAL_ID = /^adf-signal-form-(?:container|repeatable)-(.+)$/;
const FULL_WIDTH = 100;

const rounded = (width: number): number => Math.round(width * 1000) / 1000;
const shares = (widths: number[]): number[] => {
    const total = widths.reduce((sum, width) => sum + width, 0);
    return widths.map((width) => rounded((width / total) * FULL_WIDTH));
};

/**
 * Collects, per layout element id, the shares of its columns, one list per row (a repeatable section has one per row).
 *
 * @param root the rendered form
 * @param elements the layout elements, with the id pattern their attribute follows
 * @param rowsOf the column shares of an element, one list per row
 * @returns the shares by element id
 */
const collect = (
    root: HTMLElement,
    elements: { selector: string; attribute: string; pattern: RegExp },
    rowsOf: (element: Element) => number[][]
): ColumnWidths =>
    Object.fromEntries(
        Array.from(root.querySelectorAll(elements.selector))
            .filter((element) => !element.closest('[hidden]') && (element as HTMLElement).style.display !== 'none')
            .map((element) => [elements.pattern.exec(element.getAttribute(elements.attribute) ?? '')?.[1], rowsOf(element)] as const)
            .filter(([id, rows]) => id && rows.length > 0)
    );

const ownedBy = (element: Element, owner: Element, ownerSelector: string): boolean => element.parentElement?.closest(ownerSelector) === owner;

/**
 * The current renderer's column widths as shares of their row, which its growing columns fill, without the zero-width
 * columns it keeps for a covered column: the new renderer leaves those out.
 *
 * @param root the rendered form
 * @returns the shares by element id
 */
const legacyColumnShares = (root: HTMLElement): ColumnWidths => {
    const owners = '[id^="field-"][id$="-container"]';
    const rowShares = (columns: Element[]) =>
        shares(columns.map((column) => parseFloat((column as HTMLElement).style.width)).filter((width) => width > 0));
    return collect(root, { selector: owners, attribute: 'id', pattern: LEGACY_ID }, (element) => {
        if (element.classList.contains('adf-grid-list-section-single-column')) {
            return [rowShares(Array.from(element.children))];
        }
        return Array.from(element.querySelectorAll('section.adf-grid-list-column-view'))
            .filter((row) => ownedBy(row, element, owners))
            .map((row) => rowShares(Array.from(row.children).filter((column) => column.classList.contains('adf-grid-list-single-column'))));
    });
};

/**
 * The new renderer's columns as shares of their row, from each column's span (its flex growth).
 *
 * @param root the rendered form
 * @returns the shares by element id
 */
const signalColumnShares = (root: HTMLElement): ColumnWidths => {
    const owners = '[data-automation-id^="adf-signal-form-container-"], [data-automation-id^="adf-signal-form-repeatable-"]';
    return collect(root, { selector: owners, attribute: 'data-automation-id', pattern: SIGNAL_ID }, (element) =>
        Array.from(element.querySelectorAll('.adf-signal-form-columns'))
            .filter((row) => ownedBy(row, element, owners))
            .map((row) =>
                shares(
                    Array.from(row.children)
                        .filter((column) => column.classList.contains('adf-signal-form-column'))
                        .map((column) => parseFloat((column as HTMLElement).style.flexGrow))
                )
            )
    );
};

interface FormJson {
    formRepresentation?: { formDefinition?: object };
    formDefinition?: object;
}

const definitionOf = (form: FormJson): object | undefined => form?.formRepresentation?.formDefinition ?? form?.formDefinition;

const nestedSectionForm: FormJson = {
    formDefinition: {
        fields: [
            {
                id: 'outer',
                type: 'container',
                numberOfColumns: 2,
                fields: {
                    1: [
                        {
                            id: 'inner-section',
                            type: 'section',
                            numberOfColumns: 3,
                            fields: { 1: [{ id: 'spanning', type: 'text', colspan: 2 }], 2: [], 3: [{ id: 'single', type: 'text' }] }
                        }
                    ],
                    2: [{ id: 'beside', type: 'text' }]
                }
            }
        ],
        outcomes: [],
        variables: []
    }
};

const formsWithLayout: [string, FormJson][] = [
    ...(Object.entries(legacyForms) as [string, FormJson][]).filter(([, form]) => definitionOf(form)),
    ['a section with its own columns inside a container column', nestedSectionForm],
    ['a section at the root', { formDefinition: { fields: [legacyForms.mockSectionWithFields], outcomes: [], variables: [] } }],
    [
        'repeatable section rows with a field spanning two of three columns',
        {
            formDefinition: {
                fields: [
                    {
                        id: 'lines',
                        type: 'repeatable-section',
                        numberOfColumns: 3,
                        params: { initialNumberOfRows: 2, maxNumberOfRows: 4 },
                        fields: { 1: [{ id: 'description', type: 'text', colspan: 2 }], 2: [], 3: [{ id: 'amount', type: 'integer' }] }
                    }
                ],
                outcomes: [],
                variables: []
            }
        }
    ]
];

describe('SignalForm layout parity with the current renderer', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule],
            providers: [
                provideFormWidgets(...BUILT_IN_WIDGETS_LOADED_DIRECTLY),
                { provide: MatDialog, useValue: { open: () => ({ beforeClosed: () => of(false) }) } }
            ]
        });
    });

    const renderLegacy = async (definition: object): Promise<ColumnWidths> => {
        const fixture = TestBed.createComponent(FormRendererComponent);
        fixture.componentRef.setInput('formDefinition', TestBed.inject(FormService).parseForm(definition, null, false, false));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        return legacyColumnShares(fixture.nativeElement);
    };

    const renderSignal = async (json: object): Promise<ColumnWidths> => {
        const registry = TestBed.inject(FormWidgetRegistry);
        const form = new SignalForm(readFormDefinition(json, registry), {}, TestBed.inject(Injector), registry);
        const fixture = TestBed.createComponent(SignalFormRendererComponent);
        fixture.componentRef.setInput('form', form);
        await settleFixture(fixture);
        return signalColumnShares(fixture.nativeElement);
    };

    it('should compare a meaningful set of forms', () => {
        expect(formsWithLayout.length).toBeGreaterThan(10);
    });

    formsWithLayout.forEach(([name, json]) => {
        it(`should size the columns of ${name} like the current renderer`, async () => {
            const legacy = await renderLegacy(definitionOf(json));
            const signal = await renderSignal(json);

            expect(Object.keys(legacy).length).withContext('the current renderer has columns to compare').toBeGreaterThan(0);
            expect(signal).toEqual(legacy);
        });
    });
});
