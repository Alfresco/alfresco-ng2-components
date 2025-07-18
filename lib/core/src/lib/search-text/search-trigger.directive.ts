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

/* eslint-disable @angular-eslint/no-input-rename, @typescript-eslint/no-use-before-define, @angular-eslint/no-input-rename */

import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, DestroyRef, Directive, ElementRef, forwardRef, inject, Inject, Input, NgZone, OnDestroy, Optional } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { fromEvent, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { SearchComponentInterface } from '../common/interface/search-component.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const SEARCH_AUTOCOMPLETE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchTriggerDirective),
    multi: true
};

/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: `input[searchAutocomplete], textarea[searchAutocomplete]`,
    host: {
        role: 'combobox',
        '[attr.autocomplete]': 'autocomplete',
        'aria-autocomplete': 'list',
        '[attr.aria-expanded]': 'panelOpen.toString()',
        '(blur)': 'onTouched()',
        '(input)': 'handleInput($event)',
        '(keydown)': 'handleKeydown($event)'
    },
    providers: [SEARCH_AUTOCOMPLETE_VALUE_ACCESSOR]
})
export class SearchTriggerDirective implements ControlValueAccessor, OnDestroy {
    @Input('searchAutocomplete')
    searchPanel: SearchComponentInterface;

    @Input()
    autocomplete: string = 'off';

    private _panelOpen: boolean = false;
    private closingActionsSubscription: Subscription;
    private escapeEventStream = new Subject<void>();

    onChange: (value: any) => void = () => {};

    onTouched = () => {};

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private element: ElementRef,
        private ngZone: NgZone,
        private changeDetectorRef: ChangeDetectorRef,
        @Optional() @Inject(DOCUMENT) private document: any
    ) {}

    ngOnDestroy() {
        if (this.escapeEventStream) {
            this.escapeEventStream = null;
        }
        if (this.closingActionsSubscription) {
            this.closingActionsSubscription.unsubscribe();
        }
    }

    get panelOpen(): boolean {
        return this._panelOpen && this.searchPanel.showPanel;
    }

    openPanel(): void {
        this.searchPanel.isOpen = this._panelOpen = true;
        this.closingActionsSubscription = this.subscribeToClosingActions();
    }

    closePanel(): void {
        if (this._panelOpen) {
            this.closingActionsSubscription.unsubscribe();
            this._panelOpen = false;
            this.searchPanel.resetResults();
            this.searchPanel.hidePanel();
            this.changeDetectorRef.detectChanges();
        }
    }

    get panelClosingActions(): Observable<any> {
        return merge(this.escapeEventStream, this.outsideClickStream);
    }

    private get outsideClickStream(): Observable<any> {
        if (!this.document) {
            return of(null);
        }

        return merge(fromEvent(this.document, 'click'), fromEvent(this.document, 'touchend')).pipe(
            filter((event: MouseEvent | TouchEvent) => {
                const clickTarget = event.target as HTMLElement;
                return this._panelOpen && clickTarget !== this.element.nativeElement;
            }),
            takeUntilDestroyed(this.destroyRef)
        );
    }

    writeValue(value: any): void {
        Promise.resolve(null).then(() => this.setTriggerValue(value));
    }

    registerOnChange(fn: (value: any) => any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => any) {
        this.onTouched = fn;
    }

    handleKeydown(event: KeyboardEvent): void {
        const keyCode = event.keyCode;

        if (keyCode === ESCAPE && this.panelOpen) {
            this.escapeEventStream.next();
            event.stopPropagation();
        } else if (keyCode === ENTER) {
            this.escapeEventStream.next();
            event.preventDefault();
        }
    }

    handleInput(event: KeyboardEvent): void {
        if (document.activeElement === event.target) {
            const inputValue: string = (event.target as HTMLInputElement).value;
            this.onChange(inputValue);
            if (inputValue && this.searchPanel) {
                this.searchPanel.keyPressedStream.next(inputValue);
                this.openPanel();
            } else if (this.searchPanel) {
                this.searchPanel.resetResults();
                this.closePanel();
            }
        }
    }

    private isPanelOptionClicked(event: MouseEvent) {
        let isPanelOption: boolean = false;
        if (event && this.searchPanel) {
            const clickTarget = event.target as HTMLElement;
            isPanelOption = !this.isNoResultOption() && !!this.searchPanel.panel && !!this.searchPanel.panel.nativeElement.contains(clickTarget);
        }
        return isPanelOption;
    }

    private isNoResultOption(): boolean {
        return this.searchPanel?.results?.list ? this.searchPanel.results.list.entries.length === 0 : true;
    }

    private subscribeToClosingActions(): Subscription {
        const firstStable = this.ngZone.onStable.asObservable();
        const optionChanges = this.searchPanel.keyPressedStream.asObservable();

        return merge(firstStable, optionChanges)
            .pipe(
                switchMap(() => {
                    this.searchPanel.setVisibility();
                    return this.panelClosingActions;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((event) => this.setValueAndClose(event));
    }

    private setTriggerValue(value: any): void {
        const toDisplay = this.searchPanel?.displayWith ? this.searchPanel.displayWith(value) : value;
        this.element.nativeElement.value = toDisplay != null ? toDisplay : '';
    }

    private setValueAndClose(event: any | null): void {
        if (this.isPanelOptionClicked(event) && !event.defaultPrevented) {
            this.setTriggerValue(event.target.textContent.trim());
            this.onChange(event.target.textContent.trim());
            this.element.nativeElement.focus();
        }
        this.closePanel();
    }
}
