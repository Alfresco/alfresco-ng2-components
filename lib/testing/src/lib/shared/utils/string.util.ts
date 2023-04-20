/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export class StringUtil {

    static generatePasswordString(length: number = 8): string {
        let text = '';
        const lowerCaseLimit = Math.floor(length / 2);
        text += StringUtil.generateRandomCharset(lowerCaseLimit, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        text += StringUtil.generateRandomCharset(length - lowerCaseLimit, 'abcdefghijklmnopqrstuvwxyz');

        return text;
    }

    /**
     * Generates a random string.
     *
     * @param length If this parameter is not provided the length is set to 8 by default.
     */
    static generateRandomString(length: number = 8): string {
        return StringUtil.generateRandomCharset(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
    }

    /**
     * Generates a random lowercase string.
     *
     * @param length If this parameter is not provided the length is set to 8 by default.
     */
    static generateRandomLowercaseString(length: number = 8): string {
        return StringUtil.generateRandomCharset(length, 'abcdefghijklmnopqrstuvwxyz0123456789');
    }

    /**
     * Generates a random email address following the format: abcdef@activiti.test.com
     *
     * @param domain
     * @param length
     */
    static generateRandomEmail(domain: string, length: number = 5): string {
        let email = StringUtil.generateRandomCharset(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
        email += domain;
        return email.toLowerCase();
    }

    /**
     * Generates a random string - digits only.
     *
     * @param length {int} If this parameter is not provided the length is set to 8 by default.
     */
    static generateRandomStringDigits(length: number = 8): string {
        return StringUtil.generateRandomCharset(length, '0123456789');
    }

    /**
     * Generates a random string - non-latin characters only.
     *
     * @param length {int} If this parameter is not provided the length is set to 3 by default.
     */
    static generateRandomStringNonLatin(length: number = 3): string {
        return StringUtil.generateRandomCharset(length, '密码你好𠮷');
    }

    /**
     * Generates a random string.
     *
     * @param length If this parameter is not provided the length is set to 8 by default.
     * @param charSet to use
     */
    static generateRandomCharset(length: number = 8, charSet: string): string {
        let text = '';

        for (let i = 0; i < length; i++) {
            text += charSet.charAt(Math.floor(Math.random() * charSet.length));
        }

        return text;
    }

    /**
     * Generates a sequence of files with name: baseName + index + extension (e.g.) baseName1.txt, baseName2.txt, ...
     *
     * @param startIndex
     * @param endIndex
     * @param baseName  the base name of all files
     * @param extension the extension of the file
     * @return fileNames
     */
    static generateFilesNames(startIndex: number, endIndex: number, baseName: string, extension: string): string [] {
        const fileNames: string[] = [];
        for (let i = startIndex; i <= endIndex; i++) {
            fileNames.push(baseName + i + extension);
        }
        return fileNames;
    }

    /** Generates a random name for a process
     *
     * @param length  {int} If this parameter is not provided the length is set to 5 by default.
     */
    static generateProcessName(length: number = 5): string {
        return 'process_' + StringUtil.generateRandomString(length);
    }

    /** Generates a random name for a process
     *
     * @param length  {int} If this parameter is not provided the length is set to 5 by default.
     */
     static generateUserTaskName(length: number = 5): string {
        return 'userTask_' + StringUtil.generateRandomString(length);
    }

}
