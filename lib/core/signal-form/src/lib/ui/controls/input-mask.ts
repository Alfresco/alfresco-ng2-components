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

interface MaskSlot {
    pattern: RegExp;
    optional?: boolean;
    recursive?: boolean;
}

/** The mask characters: `0` a digit, `9` an optional digit, `#` any number of digits, `A` a letter or digit, `S` a letter. */
const MASK_SLOTS: Readonly<Record<string, MaskSlot>> = {
    '0': { pattern: /\d/ },
    '9': { pattern: /\d/, optional: true },
    '#': { pattern: /\d/, recursive: true },
    A: { pattern: /[a-zA-Z0-9]/ },
    S: { pattern: /[a-zA-Z]/ }
};

/**
 * Applies an input mask to typed text, as today's text widget does: characters the mask doesn't accept are dropped,
 * and the mask's literal characters are added. A reversed mask is filled from the right, as for amounts.
 *
 * @param text the typed text
 * @param mask the mask, for example `(000) 000-0000`
 * @param reversed whether the mask is filled from the right
 * @returns the masked text
 */
export const applyInputMask = (text: string, mask: string, reversed = false): string => {
    const masked: string[] = [];
    const add = (character: string) => (reversed ? masked.unshift(character) : masked.push(character));
    const step = reversed ? -1 : 1;
    const lastMaskIndex = reversed ? 0 : mask.length - 1;
    let maskIndex = reversed ? mask.length - 1 : 0;
    let textIndex = reversed ? text.length - 1 : 0;
    let resetIndex = -1;
    let pendingLiteral: string | undefined;
    const inRange = () => (reversed ? maskIndex > -1 && textIndex > -1 : maskIndex < mask.length && textIndex < text.length);

    while (inRange()) {
        const maskCharacter = mask.charAt(maskIndex);
        const character = text.charAt(textIndex);
        const slot = MASK_SLOTS[maskCharacter];

        if (slot) {
            if (slot.pattern.test(character)) {
                add(character);
                if (slot.recursive) {
                    if (resetIndex === -1) {
                        resetIndex = maskIndex;
                    } else if (maskIndex === lastMaskIndex) {
                        maskIndex = resetIndex - step;
                    }
                    if (lastMaskIndex === resetIndex) {
                        maskIndex -= step;
                    }
                }
                maskIndex += step;
            } else if (character === pendingLiteral) {
                pendingLiteral = undefined;
            } else if (slot.optional) {
                maskIndex += step;
                textIndex -= step;
            }
            textIndex += step;
        } else {
            add(maskCharacter);
            if (character === maskCharacter) {
                textIndex += step;
            } else {
                pendingLiteral = maskCharacter;
            }
            maskIndex += step;
        }
    }

    const lastMaskCharacter = mask.charAt(lastMaskIndex);
    if (mask.length === text.length + 1 && !MASK_SLOTS[lastMaskCharacter]) {
        masked.push(lastMaskCharacter);
    }
    return masked.join('');
};
