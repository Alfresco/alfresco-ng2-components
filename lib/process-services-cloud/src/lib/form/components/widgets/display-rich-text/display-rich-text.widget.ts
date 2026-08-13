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
import { BaseDisplayTextWidgetComponent } from '@alfresco/adf-core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { RichTextParserService } from '../../../services/rich-text-parser.service';
import { resolveRichTextExpressions } from './rich-text-expression-resolver';

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
    parsedHTML: string | Error;

    private readonly richTextParserService = inject(RICH_TEXT_PARSER_TOKEN);
    private readonly sanitizer = inject(DomSanitizer);
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
        if (this.field) {
            this.originalFieldValue = JSON.stringify(this.field.authoredValue);
        }
    }

    protected evaluateExpressions(): void {
        if (!this.field) {
            return;
        }

        this.applyExpressionsToBlocks(this.field.authoredValue);
    }

    protected reevaluateExpressions(): void {
        if (!this.field || !this.originalFieldValue) {
            return;
        }

        const value = JSON.parse(this.originalFieldValue);
        this.applyExpressionsToBlocks(value);
    }

    private applyExpressionsToBlocks(value: any): void {
        this.field.value = resolveRichTextExpressions(value, (content) => this.resolveExpressions(content, true));
    }

    private parseAndSanitize(): void {
        this.parsedHTML = this.richTextParserService.parse(this.field.value);

        if (this.parsedHTML instanceof Error) {
            throw this.parsedHTML;
        } else {
            this.sanitizeHtmlContent();
        }
    }

    private sanitizeHtmlContent(): void {
        this.parsedHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.parsedHTML);
    }
}
