/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

const SESSION_TIMEOUT_CHANNEL_NAME = 'hxp-session-timeout';

export const SESSION_TIMEOUT_SYNC_EVENT_TYPES = ['activity', 'timeout', 'continue', 'logout', 'expired'] as const;

export type SessionTimeoutSyncEventType = (typeof SESSION_TIMEOUT_SYNC_EVENT_TYPES)[number];

export interface SessionTimeoutSyncEvent {
    type: SessionTimeoutSyncEventType;
    sourceTabId: string;
    createdAt: number;
}

@Injectable()
export class SessionTimeoutSyncChannel implements OnDestroy {
    private readonly document = inject(DOCUMENT);
    private readonly window = this.document.defaultView;
    private readonly tabId = this.createTabId();
    private readonly messageSubject = new Subject<SessionTimeoutSyncEvent>();
    private channel: BroadcastChannel | undefined;

    readonly messages$: Observable<SessionTimeoutSyncEvent> = this.messageSubject.asObservable();

    open(): void {
        if (this.channel || !this.window?.BroadcastChannel) {
            return;
        }

        this.channel = new this.window.BroadcastChannel(SESSION_TIMEOUT_CHANNEL_NAME);
        this.channel.addEventListener('message', this.handleMessage);
    }

    close(): void {
        if (!this.channel) {
            return;
        }

        this.channel.removeEventListener('message', this.handleMessage);
        this.channel.close();
        this.channel = undefined;
    }

    post(type: SessionTimeoutSyncEventType): void {
        try {
            this.channel?.postMessage({
                type,
                sourceTabId: this.tabId,
                createdAt: Date.now()
            } satisfies SessionTimeoutSyncEvent);
        } catch {
            // Cross-tab sync is best-effort; local tab timeout behavior still works.
        }
    }

    ngOnDestroy(): void {
        this.close();
    }

    private readonly handleMessage = (event: MessageEvent<unknown>): void => {
        const syncEvent = this.parse(event.data);
        if (!syncEvent || syncEvent.sourceTabId === this.tabId) {
            return;
        }

        this.messageSubject.next(syncEvent);
    };

    private parse(value: unknown): SessionTimeoutSyncEvent | undefined {
        if (typeof value !== 'object' || value === null) {
            return undefined;
        }

        const syncEvent = value as Partial<SessionTimeoutSyncEvent>;
        if (
            typeof syncEvent.type === 'string' &&
            (SESSION_TIMEOUT_SYNC_EVENT_TYPES as readonly string[]).includes(syncEvent.type) &&
            typeof syncEvent.sourceTabId === 'string' &&
            typeof syncEvent.createdAt === 'number'
        ) {
            return syncEvent as SessionTimeoutSyncEvent;
        }

        return undefined;
    }

    private createTabId(): string {
        const crypto = this.window?.crypto;
        if (crypto?.randomUUID) {
            return crypto.randomUUID();
        }

        if (crypto?.getRandomValues) {
            const buffer = new Uint32Array(4);
            crypto.getRandomValues(buffer);
            return Array.from(buffer, (value) => value.toString(16)).join('-');
        }

        return `${Date.now()}-${this.window?.performance?.now?.() ?? 0}`;
    }
}
