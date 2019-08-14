"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable: component-selector no-use-before-declare no-input-rename  */
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
exports.CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return InputMaskDirective; }),
    multi: true
};
/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
var InputMaskDirective = /** @class */ (function () {
    function InputMaskDirective(el, render) {
        this.el = el;
        this.render = render;
        this.translationMask = {
            '0': { pattern: /\d/ },
            '9': { pattern: /\d/, optional: true },
            '#': { pattern: /\d/, recursive: true },
            'A': { pattern: /[a-zA-Z0-9]/ },
            'S': { pattern: /[a-zA-Z]/ }
        };
        this.byPassKeys = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91];
        this.invalidCharacters = [];
        this._onChange = function (_) {
        };
        this._onTouched = function () {
        };
    }
    InputMaskDirective.prototype.onTextInput = function (event) {
        if (this.inputMask && this.inputMask.mask) {
            this.maskValue(this.el.nativeElement.value, this.el.nativeElement.selectionStart, this.inputMask.mask, this.inputMask.isReversed, event.keyCode);
        }
        else {
            this._onChange(this.el.nativeElement.value);
        }
    };
    InputMaskDirective.prototype.ngOnChanges = function (changes) {
        if (changes['inputMask'] && changes['inputMask'].currentValue['mask']) {
            this.inputMask = changes['inputMask'].currentValue;
        }
    };
    InputMaskDirective.prototype.writeValue = function (value) {
        this.el.nativeElement.value = value;
    };
    InputMaskDirective.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    InputMaskDirective.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    InputMaskDirective.prototype.maskValue = function (actualValue, startCaret, maskToApply, isMaskReversed, keyCode) {
        if (this.byPassKeys.indexOf(keyCode) === -1) {
            var value = this.getMasked(false, actualValue, maskToApply, isMaskReversed);
            var calculatedCaret = this.calculateCaretPosition(startCaret, actualValue, keyCode);
            this.render.setAttribute(this.el.nativeElement, 'value', value);
            this.el.nativeElement.value = value;
            this.setValue(value);
            this._onChange(value);
            this.setCaretPosition(calculatedCaret);
        }
    };
    InputMaskDirective.prototype.setCaretPosition = function (caretPosition) {
        this.el.nativeElement.moveStart = caretPosition;
        this.el.nativeElement.moveEnd = caretPosition;
    };
    InputMaskDirective.prototype.calculateCaretPosition = function (caretPosition, newValue, keyCode) {
        var newValueLength = newValue.length;
        var oldValue = this.getValue() || '';
        var oldValueLength = oldValue.length;
        if (keyCode === 8 && oldValue !== newValue) {
            caretPosition = caretPosition - (newValue.slice(0, caretPosition).length - oldValue.slice(0, caretPosition).length);
        }
        else if (oldValue !== newValue) {
            if (caretPosition >= oldValueLength) {
                caretPosition = newValueLength;
            }
            else {
                caretPosition = caretPosition + (newValue.slice(0, caretPosition).length - oldValue.slice(0, caretPosition).length);
            }
        }
        return caretPosition;
    };
    InputMaskDirective.prototype.getMasked = function (skipMaskChars, val, mask, isReversed) {
        if (isReversed === void 0) { isReversed = false; }
        var buf = [];
        var value = val;
        var maskIndex = 0;
        var maskLen = mask.length;
        var valueIndex = 0;
        var valueLength = value.length;
        var offset = 1;
        var addMethod = 'push';
        var resetPos = -1;
        var lastMaskChar;
        var lastUntranslatedMaskChar;
        var check;
        if (isReversed) {
            addMethod = 'unshift';
            offset = -1;
            lastMaskChar = 0;
            maskIndex = maskLen - 1;
            valueIndex = valueLength - 1;
        }
        else {
            lastMaskChar = maskLen - 1;
        }
        check = this.isToCheck(isReversed, maskIndex, maskLen, valueIndex, valueLength);
        while (check) {
            var maskDigit = mask.charAt(maskIndex), valDigit = value.charAt(valueIndex), translation = this.translationMask[maskDigit];
            if (translation) {
                if (valDigit.match(translation.pattern)) {
                    buf[addMethod](valDigit);
                    if (translation.recursive) {
                        if (resetPos === -1) {
                            resetPos = maskIndex;
                        }
                        else if (maskIndex === lastMaskChar) {
                            maskIndex = resetPos - offset;
                        }
                        if (lastMaskChar === resetPos) {
                            maskIndex -= offset;
                        }
                    }
                    maskIndex += offset;
                }
                else if (valDigit === lastUntranslatedMaskChar) {
                    lastUntranslatedMaskChar = undefined;
                }
                else if (translation.optional) {
                    maskIndex += offset;
                    valueIndex -= offset;
                }
                else {
                    this.invalidCharacters.push({
                        index: valueIndex,
                        digit: valDigit,
                        translated: translation.pattern
                    });
                }
                valueIndex += offset;
            }
            else {
                if (!skipMaskChars) {
                    buf[addMethod](maskDigit);
                }
                if (valDigit === maskDigit) {
                    valueIndex += offset;
                }
                else {
                    lastUntranslatedMaskChar = maskDigit;
                }
                maskIndex += offset;
            }
            check = this.isToCheck(isReversed, maskIndex, maskLen, valueIndex, valueLength);
        }
        var lastMaskCharDigit = mask.charAt(lastMaskChar);
        if (maskLen === valueLength + 1 && !this.translationMask[lastMaskCharDigit]) {
            buf.push(lastMaskCharDigit);
        }
        return buf.join('');
    };
    InputMaskDirective.prototype.isToCheck = function (isReversed, maskIndex, maskLen, valueIndex, valueLength) {
        var check = false;
        if (isReversed) {
            check = (maskIndex > -1) && (valueIndex > -1);
        }
        else {
            check = (maskIndex < maskLen) && (valueIndex < valueLength);
        }
        return check;
    };
    InputMaskDirective.prototype.setValue = function (value) {
        this.value = value;
    };
    InputMaskDirective.prototype.getValue = function () {
        return this.value;
    };
    __decorate([
        core_1.Input('textMask'),
        __metadata("design:type", Object)
    ], InputMaskDirective.prototype, "inputMask", void 0);
    __decorate([
        core_1.HostListener('input', ['$event']),
        core_1.HostListener('keyup', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [KeyboardEvent]),
        __metadata("design:returntype", void 0)
    ], InputMaskDirective.prototype, "onTextInput", null);
    InputMaskDirective = __decorate([
        core_1.Directive({
            selector: '[adf-text-mask], [textMask]',
            providers: [exports.CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
        }),
        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer2])
    ], InputMaskDirective);
    return InputMaskDirective;
}());
exports.InputMaskDirective = InputMaskDirective;
//# sourceMappingURL=text-mask.component.js.map