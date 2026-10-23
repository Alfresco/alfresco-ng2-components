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

interface FakeTimer {
    dueAt: number;
    handler: () => void;
}

const SETTIMEOUT_KEY = '__zone_symbol__setTimeout';
const CLEARTIMEOUT_KEY = '__zone_symbol__clearTimeout';

/**
 * Replaces the unpatched timer API the session timeout service schedules through, and freezes Date.now, so tests can advance time manually.
 */
export class FakeNativeTimers {
    private now = Date.now();
    private nextTimerId = 1;
    private readonly timers = new Map<number, FakeTimer>();
    private originalTimerApi: Record<string, unknown> = {};

    install(): void {
        this.now = Date.now();
        this.nextTimerId = 1;
        this.timers.clear();
        spyOn(Date, 'now').and.callFake(() => this.now);
        this.originalTimerApi = { [SETTIMEOUT_KEY]: Reflect.get(window, SETTIMEOUT_KEY), [CLEARTIMEOUT_KEY]: Reflect.get(window, CLEARTIMEOUT_KEY) };
        Reflect.set(window, SETTIMEOUT_KEY, (handler: () => void, timeout = 0) => {
            const id = this.nextTimerId++;
            this.timers.set(id, { dueAt: this.now + timeout, handler });
            return id;
        });
        Reflect.set(window, CLEARTIMEOUT_KEY, (id: number) => this.timers.delete(id));
    }

    uninstall(): void {
        Object.entries(this.originalTimerApi).forEach(([key, value]) => Reflect.set(window, key, value));
    }

    advance(ms: number): void {
        const targetTime = this.now + ms;
        let next = this.getNextDueTimer(targetTime);
        while (next) {
            const [id, timer] = next;
            this.timers.delete(id);
            this.now = Math.max(this.now, timer.dueAt);
            timer.handler();
            next = this.getNextDueTimer(targetTime);
        }
        this.now = targetTime;
    }

    private getNextDueTimer(targetTime: number): [number, FakeTimer] | undefined {
        return [...this.timers.entries()].filter(([, timer]) => timer.dueAt <= targetTime).sort(([, a], [, b]) => a.dueAt - b.dueAt)[0];
    }
}
