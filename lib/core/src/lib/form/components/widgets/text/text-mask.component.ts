/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

 /* tslint:disable: component-selector no-use-before-declare no-input-rename  */

import {
    Directive,
    ElementRef,
    forwardRef,
    HostListener,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputMaskDirective),
    multi: true
};

/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
@Directive({
    selector: '[adf-text-mask], [textMask]',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class InputMaskDirective implements OnChanges, ControlValueAccessor {

    /** Object defining mask and "reversed" status. */
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
    private invalidCharacters = [];

    constructor(private el: ElementRef, private render: Renderer2) {
    }

    _onChange = (_: any) => {
    }

    _onTouched = () => {
    }

    @HostListener('input', ['$event'])
    @HostListener('keyup', ['$event']) onTextInput(event: KeyboardEvent) {
        if (this.inputMask && this.inputMask.mask) {
            this.maskValue(this.el.nativeElement.value, this.el.nativeElement.selectionStart,
                this.inputMask.mask, this.inputMask.isReversed, event.keyCode);
        } else {
            this._onChange(this.el.nativeElement.value);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
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
        if (this.byPassKeys.indexOf(keyCode) === -1) {
            const value = this.getMasked(false, actualValue, maskToApply, isMaskReversed);
            const calculatedCaret = this.calculateCaretPosition(startCaret, actualValue, keyCode);
            this.render.setAttribute(this.el.nativeElement, 'value', value);
            this.el.nativeElement.value = value;
            this.setValue(value);
            this._onChange(value);
            this.setCaretPosition(calculatedCaret);
        }
    }

    private setCaretPosition(caretPosition) {
        this.el.nativeElement.moveStart = caretPosition;
        this.el.nativeElement.moveEnd = caretPosition;
    }

    calculateCaretPosition(caretPosition, newValue, keyCode) {
        const newValueLength = newValue.length;
        const oldValue = this.getValue() || '';
        const oldValueLength = oldValue.length;

        if (keyCode === 8 && oldValue !== newValue) {
            caretPosition = caretPosition - (newValue.slice(0, caretPosition).length - oldValue.slice(0, caretPosition).length);
        } else if (oldValue !== newValue) {
            if (caretPosition >= oldValueLength) {
                caretPosition = newValueLength;
            } else {
                caretPosition = caretPosition + (newValue.slice(0, caretPosition).length - oldValue.slice(0, caretPosition).length);
            }
        }
        return caretPosition;
    }

    getMasked(skipMaskChars, val, mask, isReversed = false) {
        const buf = [];
        const value = val;
        let maskIndex = 0;
        const maskLen = mask.length;
        let valueIndex = 0;
        const valueLength = value.length;
        let offset = 1;
        let addMethod = 'push';
        let resetPos = -1;
        let lastMaskChar;
        let lastUntranslatedMaskChar;
        let check;

        if (isReversed) {
            addMethod = 'unshift';
            offset = -1;
            lastMaskChar = 0;
            maskIndex = maskLen - 1;
            valueIndex = valueLength - 1;
        } else {
            lastMaskChar = maskLen - 1;
        }
        check = this.isToCheck(isReversed, maskIndex, maskLen, valueIndex, valueLength);
        while (check) {
            const maskDigit = mask.charAt(maskIndex),
                valDigit = value.charAt(valueIndex),
                translation = this.translationMask[maskDigit];

            if (translation) {
                if (valDigit.match(translation.pattern)) {
                    buf[addMethod](valDigit);
                    if (translation.recursive) {
                        if (resetPos === -1) {
                            resetPos = maskIndex;
                        } else if (maskIndex === lastMaskChar) {
                            maskIndex = resetPos - offset;
                        }
                        if (lastMaskChar === resetPos) {
                            maskIndex -= offset;
                        }
                    }
                    maskIndex += offset;
                } else if (valDigit === lastUntranslatedMaskChar) {
                    lastUntranslatedMaskChar = undefined;
                } else if (translation.optional) {
                    maskIndex += offset;
                    valueIndex -= offset;
                } else {
                    this.invalidCharacters.push({
                        index: valueIndex,
                        digit: valDigit,
                        translated: translation.pattern
                    });
                }
                valueIndex += offset;
            } else {
                if (!skipMaskChars) {
                    buf[addMethod](maskDigit);
                }
                if (valDigit === maskDigit) {
                    valueIndex += offset;
                } else {
                    lastUntranslatedMaskChar = maskDigit;
                }
                maskIndex += offset;
            }
            check = this.isToCheck(isReversed, maskIndex, maskLen, valueIndex, valueLength);
        }

        const lastMaskCharDigit = mask.charAt(lastMaskChar);
        if (maskLen === valueLength + 1 && !this.translationMask[lastMaskCharDigit]) {
            buf.push(lastMaskCharDigit);
        }

        return buf.join('');
    }

    private isToCheck(isReversed, maskIndex, maskLen, valueIndex, valueLength) {
        let check = false;
        if (isReversed) {
            check = (maskIndex > -1) && (valueIndex > -1);
        } else {
            check = (maskIndex < maskLen) && (valueIndex < valueLength);
        }
        return check;
    }

    private setValue(value) {
        this.value = value;
    }

    private getValue() {
        return this.value;
    }
}
