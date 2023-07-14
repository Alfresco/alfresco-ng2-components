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

import {ar, cs, da, de, enUS, es, fi, fr, it, ja, nb, nl, pl, ptBR, ru, sv, zhCN} from 'date-fns/locale';

export class DateFnsUtils {
    static getLocaleFromString(locale: string): Locale {
        let dateFnsLocale: Locale;
        switch(locale) {
            case 'ar':
                dateFnsLocale = ar;
                break;
            case 'cs':
                dateFnsLocale = cs;
                break;
            case 'da':
                dateFnsLocale = da;
                break;
            case 'de':
                dateFnsLocale = de;
                break;
            case 'en':
                dateFnsLocale = enUS;
                break;
            case 'es':
                dateFnsLocale = es;
                break;
            case 'fi':
                dateFnsLocale = fi;
                break;
            case 'fr':
                dateFnsLocale = fr;
                break;
            case 'it':
                dateFnsLocale = it;
                break;
            case 'ja':
                dateFnsLocale = ja;
                break;
            case 'nb':
                dateFnsLocale = nb;
                break;
            case 'nl':
                dateFnsLocale = nl;
                break;
            case 'pl':
                dateFnsLocale = pl;
                break;
            case 'pt-BR':
                dateFnsLocale = ptBR;
                break;
            case 'ru':
                dateFnsLocale = ru;
                break;
            case 'sv':
                dateFnsLocale = sv;
                break;
            case 'zh-CN':
                dateFnsLocale = zhCN;
                break;
            default:
                dateFnsLocale = enUS;
                break;
        }
        return dateFnsLocale;
    }
}
