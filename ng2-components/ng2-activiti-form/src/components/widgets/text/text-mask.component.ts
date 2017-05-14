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

import {
    Directive,
    ElementRef,
    Renderer,
    HostListener,
    Input,
    OnChanges,
    SimpleChanges,
    forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputMaskDirective),
    multi: true
};

@Directive({
    selector: '[textMask]',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class InputMaskDirective implements OnChanges, ControlValueAccessor {

    @Input('textMask') inputMask: {
        mask: '',
        isReversed: false
    };

    private translationMask = {
        '0': { pattern: /\d/ },
        '9': { pattern: /\d/, optional: true },
        '#': { pattern: /\d/, recursive: true },
        'A': { pattern: /[a-zA-Z0-9]/ },
        'S': { pattern: /[a-zA-Z]/ }
    };

    private byPassKeys = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91];
    private value;

    constructor(private el: ElementRef, private render: Renderer) {
    }

    _onChange = (_: any) => {
    }

    _onTouched = () => {
    }

    @HostListener('keyup', ['$event']) onInputTextInput(event: KeyboardEvent) {
        if (this.inputMask && this.inputMask.mask) {
            this.maskValue(this.el.nativeElement.value, this.el.nativeElement.selectionStart,
                this.inputMask.mask, this.inputMask.isReversed, event.keyCode);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);
        if (changes['inputMask'] && changes['inputMask'].currentValue['mask']) {
            this.inputMask = changes['inputMask'].currentValue;
        }
    }

    writeValue(value: any) {
        this.el.nativeElement.value = value;
    }

    registerOnChange(fn: any) {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => any): void {
        this._onTouched = fn;
    }

    private maskValue(actualValue, startCaret, maskToApply, isMaskReversed, keyCode) {
        console.log('======================================================================');
        console.log('actualValue : ' + actualValue);
        console.log('maskToApply : ' + maskToApply);
        if (this.byPassKeys.indexOf(keyCode) === -1) {
            let value = this.getMasked(false, actualValue, maskToApply, isMaskReversed);
            let calculatedCaret = this.calculateCaretPosition(startCaret, actualValue, keyCode);
            this.render.setElementAttribute(this.el.nativeElement, 'value', value);
            this.el.nativeElement.value = value;
            this.setValue(value);
            this._onChange(value);
            this.setCaretPosition(calculatedCaret);
        }
        console.log('======================================================================+');
    }

    private setCaretPosition(caretPosition) {
        setTimeout(() => {
            this.el.nativeElement.moveStart = caretPosition;
            this.el.nativeElement.selectionStart = caretPosition;
            this.el.nativeElement.moveEnd = caretPosition;
            this.el.nativeElement.selectionEnd = caretPosition;
        }, 60);
    }

    calculateCaretPosition(caretPosition, newValue, keyCode) {
        let newValueLength = newValue.length;
        let oldValue = this.getValue() || '';
        let oldValueLength = oldValue.length;

        // edge cases when erasing digits
        if (keyCode === 8 && oldValue !== newValue) {
            caretPosition = caretPosition - (newValue.slice(0, caretPosition).length - oldValue.slice(0, caretPosition).length);

            // edge cases when typing new digits
        } else if (oldValue !== newValue) {
            // if the cursor is at the end keep it there
            if (caretPosition >= oldValueLength) {
                caretPosition = newValueLength;
            } else {
                caretPosition = caretPosition + (newValue.slice(0, caretPosition).length - oldValue.slice(0, caretPosition).length);
            }
        }

        return caretPosition;
    }

    getMasked(skipMaskChars, val, mask, isReversed = false) {
        let buf = [],
            value = val,
            m = 0, maskLen = mask.length,
            v = 0, valLen = value.length,
            offset = 1, addMethod = 'push',
            resetPos = -1,
            lastMaskChar,
            check;

        if (isReversed) {
            addMethod = 'unshift';
            offset = -1;
            lastMaskChar = 0;
            m = maskLen - 1;
            v = valLen - 1;
            check = function () {
                return m > -1 && v > -1;
            };
        } else {
            lastMaskChar = maskLen - 1;
            check = function () {
                return m < maskLen && v < valLen;
            };
        }

        let lastUntranslatedMaskChar;
        while (check()) {
            let maskDigit = mask.charAt(m),
                valDigit = value.charAt(v),
                translation = this.translationMask[maskDigit];

            if (translation) {
                if (valDigit.match(translation.pattern)) {
                    buf[addMethod](valDigit);
                    if (translation.recursive) {
                        if (resetPos === -1) {
                            resetPos = m;
                        } else if (m === lastMaskChar) {
                            m = resetPos - offset;
                        }

                        if (lastMaskChar === resetPos) {
                            m -= offset;
                        }
                    }
                    m += offset;
                } else if (valDigit === lastUntranslatedMaskChar) {
                    // matched the last untranslated (raw) mask character that we encountered
                    // likely an insert offset the mask character from the last entry; fall
                    // through and only increment v
                    lastUntranslatedMaskChar = undefined;
                } else if (translation.optional) {
                    m += offset;
                    v -= offset;
                } else if (translation.fallback) {
                    buf[addMethod](translation.fallback);
                    m += offset;
                    v -= offset;
                } else {
                    // p.invalid.push({ p: v, v: valDigit, e: translation.pattern });
                    console.log('INVALID CHAR');
                }
                v += offset;
            } else {
                if (!skipMaskChars) {
                    buf[addMethod](maskDigit);
                }

                if (valDigit === maskDigit) {
                    v += offset;
                } else {
                    lastUntranslatedMaskChar = maskDigit;
                }

                m += offset;
            }
        }

        let lastMaskCharDigit = mask.charAt(lastMaskChar);
        if (maskLen === valLen + 1 && !this.translationMask[lastMaskCharDigit]) {
            buf.push(lastMaskCharDigit);
        }

        return buf.join('');
    }

    private setValue(value) {
        this.value = value;
    }

    private getValue() {
        return this.value;
    }
}
