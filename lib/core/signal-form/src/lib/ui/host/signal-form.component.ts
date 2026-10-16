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

import { UpperCasePipe } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FormatSpacePipe } from '@alfresco/adf-core';
import { OutcomeDefinition, SystemOutcomeName } from '../../definition/form-definition.model';
import { isOutcomeEnabled, isOutcomeShown, OutcomeHostOptions } from '../../outcomes/outcome-rules';
import { SignalForm } from '../../state/signal-form';
import { SignalFormRendererComponent } from '../renderer/signal-form-renderer.component';
import { SignalFormOutcomeEvent } from './signal-form-outcome-event';

interface OutcomeButton {
    outcome: OutcomeDefinition;
    enabled: boolean;
}

/**
 * Hosts a form: its title and validation state, the rendered layout, and the outcome buttons. It doesn't save or
 * complete anything itself; it emits `executeOutcome` and leaves the action to the host that knows the backend.
 */
@Component({
    selector: 'adf-signal-form',
    templateUrl: './signal-form.component.html',
    styleUrl: './signal-form.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UpperCasePipe, MatButtonModule, MatIconModule, TranslatePipe, FormatSpacePipe, SignalFormRendererComponent],
    host: { class: 'adf-signal-form' }
})
export class SignalFormComponent {
    readonly form = input.required<SignalForm>();
    /** The title shown above the form; the form definition's name by default. */
    readonly title = input<string>();
    readonly showTitle = input(true, { transform: booleanAttribute });
    readonly showValidationIcon = input(true, { transform: booleanAttribute });
    readonly showSaveButton = input(true, { transform: booleanAttribute });
    readonly showCompleteButton = input(true, { transform: booleanAttribute });
    /** Shows the `Save` outcome disabled, for example while a save is in progress. */
    readonly disableSaveButton = input(false, { transform: booleanAttribute });
    /** Shows the `Complete` outcome disabled, for example while a completion is in progress. */
    readonly disableCompleteButton = input(false, { transform: booleanAttribute });

    readonly executeOutcome = output<SignalFormOutcomeEvent>();

    protected readonly selectedTab = signal(0);
    protected readonly tabNavigationShown = computed(() => this.form().definition.showTabNavigation && this.form().visibleTabs().length > 1);
    protected readonly canGoToPreviousTab = computed(() => this.selectedTab() > 0);
    protected readonly canGoToNextTab = computed(() => this.selectedTab() < this.form().visibleTabs().length - 1);

    protected readonly displayedTitle = computed(() => this.title() ?? this.form().definition.name);

    protected readonly formStyle = computed(() =>
        Object.entries(this.form().definition.theme?.form ?? {})
            .map(([variable, value]) => `${variable}: ${value}`)
            .join(';')
    );

    protected readonly outcomeButtons = computed((): OutcomeButton[] => {
        const form = this.form();
        const options: OutcomeHostOptions = {
            readOnly: form.readOnly,
            showSaveButton: this.showSaveButton(),
            showCompleteButton: this.showCompleteButton()
        };
        const valid = form.valid();
        return form.definition.outcomes
            .filter((outcome) => isOutcomeShown(outcome, options) && form.isOutcomeConditionMet(outcome))
            .map((outcome) => ({ outcome, enabled: isOutcomeEnabled(outcome, valid, options) && !this.isDisabledByHost(outcome) }));
    });

    protected execute(outcome: OutcomeDefinition): void {
        this.executeOutcome.emit(new SignalFormOutcomeEvent(outcome, this.form().submissionValues()));
    }

    protected previousTab(): void {
        this.selectedTab.update((index) => Math.max(index - 1, 0));
    }

    protected nextTab(): void {
        this.selectedTab.update((index) => Math.min(index + 1, this.form().visibleTabs().length - 1));
    }

    private isDisabledByHost(outcome: OutcomeDefinition): boolean {
        return (
            (outcome.name === SystemOutcomeName.Save && this.disableSaveButton()) ||
            (outcome.name === SystemOutcomeName.Complete && this.disableCompleteButton())
        );
    }
}
