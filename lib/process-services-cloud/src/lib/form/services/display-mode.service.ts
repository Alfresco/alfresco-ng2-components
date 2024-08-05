/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormCloudDisplayMode, FormCloudDisplayModeChange, FormCloudDisplayModeConfiguration } from '../../services/form-fields.interfaces';

@Injectable({
    providedIn: 'root'
})
export class DisplayModeService {
    public static readonly DEFAULT_DISPLAY_MODE_CONFIGURATIONS: FormCloudDisplayModeConfiguration[] = [
        {
            displayMode: FormCloudDisplayMode.inline,
            default: true
        }
    ];

    public static readonly IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS: FormCloudDisplayModeConfiguration[] = [
        ...DisplayModeService.DEFAULT_DISPLAY_MODE_CONFIGURATIONS,
        {
            displayMode: FormCloudDisplayMode.fullScreen,
            options: {
                onDisplayModeOn: () => {/** empty */ },
                onDisplayModeOff: (id: string) => DisplayModeService.changeDisplayMode({ displayMode: FormCloudDisplayMode.inline, id }),
                onCompleteTask: (id: string) => DisplayModeService.changeDisplayMode({ displayMode: FormCloudDisplayMode.inline, id }),
                onSaveTask: () => { /** empty */ },
                displayToolbar: true
            }
        }
    ];

    public static readonly DEFAULT_DISPLAY_MODE: FormCloudDisplayMode = FormCloudDisplayMode.inline;

    private static readonly displayMode = new Subject<FormCloudDisplayModeChange>();

    static readonly displayMode$: Observable<FormCloudDisplayModeChange> = DisplayModeService.displayMode.asObservable();

    static changeDisplayMode(change: FormCloudDisplayModeChange) {
        DisplayModeService.displayMode.next(change);
    }

    getDefaultDisplayModeConfigurations(): FormCloudDisplayModeConfiguration[] {
        return DisplayModeService.DEFAULT_DISPLAY_MODE_CONFIGURATIONS;
    }

    getDisplayModeConfigurations(availableConfigurations?: FormCloudDisplayModeConfiguration[]): FormCloudDisplayModeConfiguration[] {
        if (availableConfigurations && availableConfigurations.length > 0) {
            return availableConfigurations;
        } else {
            return this.getDefaultDisplayModeConfigurations();
        }
    }

    getDisplayMode(displayMode?: FormCloudDisplayMode, availableConfigurations?: FormCloudDisplayModeConfiguration[]): FormCloudDisplayMode {
        const configuration = this.findConfiguration(displayMode, availableConfigurations);

        if (configuration) {
            return configuration.displayMode;
        } else if (availableConfigurations && availableConfigurations.length > 0) {
            return availableConfigurations.length === 1 ?
                availableConfigurations[0].displayMode :
                (availableConfigurations.find(config => config.default)?.displayMode || availableConfigurations[0].displayMode);
        } else {
            return DisplayModeService.DEFAULT_DISPLAY_MODE;
        }
    }

    findConfiguration(displayMode?: FormCloudDisplayMode, availableConfigurations?: FormCloudDisplayModeConfiguration[]): FormCloudDisplayModeConfiguration {
        return this.getDisplayModeConfigurations(availableConfigurations).find(config => config.displayMode === displayMode);
    }

    onCompleteTask(id?: string, displayMode?: FormCloudDisplayMode, availableConfigurations?: FormCloudDisplayModeConfiguration[]) {
        const configuration = this.findConfiguration(displayMode, availableConfigurations);

        if (configuration?.options?.onCompleteTask) {
            configuration.options.onCompleteTask(id);
        }
    }

    onSaveTask(id?: string, displayMode?: FormCloudDisplayMode, availableConfigurations?: FormCloudDisplayModeConfiguration[]) {
        const configuration = this.findConfiguration(displayMode, availableConfigurations);

        if (configuration?.options?.onSaveTask) {
            configuration.options.onSaveTask(id);
        }
    }

    onDisplayModeOff(id?: string, displayMode?: FormCloudDisplayMode, availableConfigurations?: FormCloudDisplayModeConfiguration[]) {
        const configuration = this.findConfiguration(displayMode, availableConfigurations);

        if (configuration?.options?.onDisplayModeOff) {
            configuration.options.onDisplayModeOff(id);
        }
    }

    onDisplayModeOn(id?: string, displayMode?: FormCloudDisplayMode, availableConfigurations?: FormCloudDisplayModeConfiguration[]) {
        const configuration = this.findConfiguration(displayMode, availableConfigurations);

        if (configuration?.options?.onDisplayModeOn) {
            configuration.options.onDisplayModeOn(id);
        }
    }

    switchToDisplayMode(
        id?: string,
        newDisplayMode?: FormCloudDisplayMode,
        oldDisplayMode?: FormCloudDisplayMode,
        availableConfigurations?: FormCloudDisplayModeConfiguration[]
    ): FormCloudDisplayMode {
        const oldConfiguration = this.findConfiguration(oldDisplayMode, availableConfigurations);
        const newConfiguration = this.findConfiguration(newDisplayMode, availableConfigurations);

        if (oldConfiguration?.displayMode !== newConfiguration?.displayMode) {
            if (oldConfiguration) {
                this.onDisplayModeOff(id, oldDisplayMode, availableConfigurations);
            }

            if (newConfiguration) {
                DisplayModeService.changeDisplayMode({ id, displayMode: newConfiguration.displayMode });
                this.onDisplayModeOn(id, newDisplayMode, availableConfigurations);
                return newConfiguration.displayMode;
            } else {
                const displayMode = this.getDisplayMode(newDisplayMode, availableConfigurations);
                DisplayModeService.changeDisplayMode({ id, displayMode });
                this.onDisplayModeOn(id, displayMode, availableConfigurations);
                return displayMode;
            }
        } else {
            return oldConfiguration?.displayMode || this.getDisplayMode(oldDisplayMode, availableConfigurations);
        }
    }
}
