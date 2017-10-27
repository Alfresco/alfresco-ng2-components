/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Directionality } from '@angular/cdk/bidi';
import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import {
    ConnectedPositionStrategy,
    Overlay,
    OverlayConfig,
    OverlayRef,
    PositionStrategy
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { filter, first, RxChain, switchMap, doOperator, delay } from '@angular/cdk/rxjs';
import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    forwardRef,
    Inject,
    Input,
    NgZone,
    OnDestroy,
    Optional,
    ViewContainerRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';
import { SearchAutocompleteComponent } from './search-autocomplete.component';

export const AUTOCOMPLETE_OPTION_HEIGHT = 48;

export const AUTOCOMPLETE_PANEL_HEIGHT = 256;

export const SEARCH_AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AdfAutocompleteTriggerDirective),
  multi: true
};

export function getAutocompleteMissingPanelError(): Error {
  return Error('Attempting to open an undefined instance of `mat-autocomplete`. ' +
               'Make sure that the id passed to the `matAutocomplete` is correct and that ' +
               'you\'re attempting to open it after the ngAfterContentInit hook.');
}

@Directive({
  selector: `input[adfSearchAutocomplete]`,
  host: {
    'role': 'combobox',
    'autocomplete': 'off',
    'aria-autocomplete': 'list',
    '[attr.aria-activedescendant]': 'activeOption?.id',
    '[attr.aria-expanded]': 'panelOpen.toString()',
    '[attr.aria-owns]': 'autocomplete?.id',
    '(blur)': 'onTouched()',
    '(input)': 'handleInput($event)',
    '(keydown)': 'handleKeydown($event)'
  },
  providers: [SEARCH_AUTOCOMPLETE_VALUE_ACCESSOR]
})
export class AdfAutocompleteTriggerDirective implements ControlValueAccessor, OnDestroy {

  @Input('adfSearchAutocomplete')
  autocomplete: SearchAutocompleteComponent;

  private _overlayRef: OverlayRef | null;
  private _portal: TemplatePortal<any>;
  private _panelOpen: boolean = false;

  /** Strategy that is used to position the panel. */
  private _positionStrategy: ConnectedPositionStrategy;

  /** The subscription for closing actions (some are bound to document). */
  private _closingActionsSubscription: Subscription;

  /** Stream of escape keyboard events. */
  private _escapeEventStream = new Subject<void>();

  onChange: (value: any) => void = () => {};

  onTouched = () => {};

  constructor(private element: ElementRef, private _overlay: Overlay,
              private _viewContainerRef: ViewContainerRef,
              private _zone: NgZone,
              private changeDetectorRef: ChangeDetectorRef,
              @Optional() private _dir: Directionality,
              @Optional() @Inject(DOCUMENT) private _document: any) {}

  ngOnDestroy() {
    this._destroyPanel();
    this._escapeEventStream.complete();
  }

  get panelOpen(): boolean {
    return this._panelOpen && this.autocomplete.showPanel;
  }

  openPanel(): void {
    this._attachOverlay();
  }

  closePanel(): void {
    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
      this._closingActionsSubscription.unsubscribe();
    }

    if (this._panelOpen) {
      this.autocomplete._isOpen = this._panelOpen = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  get panelClosingActions(): Observable<any> {
    return merge(
      this._escapeEventStream,
      this._outsideClickStream
    );
  }

  /** Stream of clicks outside of the autocomplete panel. */
  private get _outsideClickStream(): Observable<any> {
    if (!this._document) {
      return observableOf(null);
    }

    return RxChain.from(merge(
      fromEvent(this._document, 'click'),
      fromEvent(this._document, 'touchend')
    )).call(filter, (event: MouseEvent | TouchEvent) => {
      const clickTarget = event.target as HTMLElement;
      return this._panelOpen &&
             clickTarget !== this.element.nativeElement &&
             (!!this._overlayRef && !this._overlayRef.overlayElement.contains(clickTarget));
    }).result();
  }

  writeValue(value: any): void {
    Promise.resolve(null).then(() => this._setTriggerValue(value));
  }

  registerOnChange(fn: (value: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}) {
    this.onTouched = fn;
  }

  handleKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;

    if (keyCode === ESCAPE && this.panelOpen) {
      this._escapeEventStream.next();
      event.stopPropagation();
    } else if (keyCode === ENTER && this.panelOpen) {
      event.preventDefault();
    }
  }

  handleInput(event: KeyboardEvent): void {
    if (document.activeElement === event.target) {
      let inputValue: string = (event.target as HTMLInputElement).value;
      this.onChange(inputValue);
      if ( inputValue.length >= 3 ) {
        this.autocomplete.keyPressedStream.next(inputValue);
        this.openPanel();
      }else {
          this.autocomplete.resetResults();
      }
    }
  }

  private _subscribeToClosingActions(): Subscription {
    const firstStable = first.call(this._zone.onStable.asObservable());
    const optionChanges = RxChain.from(this.autocomplete.keyPressedStream)
      .call(doOperator, () => this._positionStrategy.recalculateLastPosition())
      .call(delay, 0)
      .result();

    return RxChain.from(merge(firstStable, optionChanges))
      .call(switchMap, () => {
        this.autocomplete.setVisibility();
        return this.panelClosingActions;
      })
      .call(first)
      .subscribe(event => this._setValueAndClose(event));
  }

  private _destroyPanel(): void {
    if (this._overlayRef) {
      this.closePanel();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  private _setTriggerValue(value: any): void {
    const toDisplay = this.autocomplete && this.autocomplete.displayWith ?
      this.autocomplete.displayWith(value) : value;
    const inputValue = toDisplay != null ? toDisplay : '';
    this.element.nativeElement.value = inputValue;
  }

  private _setValueAndClose(event: any | null): void {
    if (event && event.source) {
      this._setTriggerValue(event.source.value);
      this.onChange(event.source.value);
      this.element.nativeElement.focus();
      // this.autocomplete._emitSelectEvent(event.source);
    }

    this.closePanel();
  }

  private _attachOverlay(): void {
    if (!this.autocomplete) {
      throw getAutocompleteMissingPanelError();
    }

    if (!this._overlayRef) {
      this._portal = new TemplatePortal(this.autocomplete.template, this._viewContainerRef);
      this._overlayRef = this._overlay.create(this._getOverlayConfig());
    } else {
      /** Update the panel width, in case the host width has changed */
      this._overlayRef.getConfig().width = this._getHostWidth();
      this._overlayRef.updateSize();
    }

    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._portal);
      this._closingActionsSubscription = this._subscribeToClosingActions();
    }
    this.autocomplete._isOpen = this._panelOpen = true;
  }

  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPosition(),
      width: this._getHostWidth(),
      direction: this._dir ? this._dir.value : 'ltr'
    });
  }

  private _getOverlayPosition(): PositionStrategy {
    this._positionStrategy =  this._overlay.position().connectedTo(
        this._getConnectedElement(),
        {originX: 'start', originY: 'bottom'}, {overlayX: 'start', overlayY: 'top'})
        .withFallbackPosition(
            {originX: 'start', originY: 'top'}, {overlayX: 'start', overlayY: 'bottom'}
        );
    return this._positionStrategy;
  }

  private _getConnectedElement(): ElementRef {
    return this.element;
  }

  private _getHostWidth(): number {
    return this._getConnectedElement().nativeElement.getBoundingClientRect().width;
  }

}
