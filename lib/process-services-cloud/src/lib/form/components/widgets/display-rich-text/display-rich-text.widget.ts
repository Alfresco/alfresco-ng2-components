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

/* eslint-disable @angular-eslint/component-selector */

import { Component, inject, InjectionToken, OnDestroy, OnInit, SecurityContext, ViewEncapsulation } from '@angular/core';
import { BaseDisplayTextWidgetComponent, FormExpressionService } from '@alfresco/adf-core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { RichTextParserService } from '../../../services/rich-text-parser.service';
import { hasResolvableRichTextExpressions, resolveRichTextExpressions } from './rich-text-expression-resolver';

export const RICH_TEXT_PARSER_TOKEN = new InjectionToken<RichTextParserService>('RichTextParserService', {
    factory: () => new RichTextParserService()
});

@Component({
    selector: 'display-rich-text',
    templateUrl: './display-rich-text.widget.html',
    styleUrls: ['./display-rich-text.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class DisplayRichTextWidgetComponent extends BaseDisplayTextWidgetComponent implements OnInit, OnDestroy {
    parsedHTML: string | null = null;

    private readonly richTextParserService = inject(RICH_TEXT_PARSER_TOKEN);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly expressions = inject(FormExpressionService);
    private fieldChangedSubscription?: Subscription;

    ngOnInit(): void {
        this.parseAndSanitize();

        // Re-parse when field changes (after expressions are evaluated)
        this.fieldChangedSubscription = this.fieldChanged.subscribe(() => {
            this.parseAndSanitize();
        });
    }

    ngOnDestroy(): void {
        this.fieldChangedSubscription?.unsubscribe();
    }

    protected storeOriginalValue(): void {
        this.originalFieldValue = this.getAuthoredExpressionTemplate();
    }

    protected evaluateExpressions(): void {
        this.renderAuthoredExpressionTemplate();
    }

    protected reevaluateExpressions(): void {
        this.renderAuthoredExpressionTemplate();
    }

    private getAuthoredExpressionTemplate(): string | undefined {
        const authoredValue = this.field?.authoredValue ?? null;
        const isExpressionTemplate = hasResolvableRichTextExpressions(authoredValue, (content) => this.expressions.hasExpressions(content));

        return isExpressionTemplate ? JSON.stringify(authoredValue) : undefined;
    }

    private renderAuthoredExpressionTemplate(): void {
        if (!this.field || !this.originalFieldValue) {
            return;
        }

        this.field.value = resolveRichTextExpressions(JSON.parse(this.originalFieldValue), (content) => this.resolveExpressions(content, true));
    }

    private parseAndSanitize(): void {
        const parsedValue = this.richTextParserService.parse(this.field.value);

        if (parsedValue instanceof Error) {
            throw parsedValue;
        }

        this.parsedHTML = this.sanitizer.sanitize(SecurityContext.HTML, parsedValue);
    }
}
