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
import { TestBed } from '@angular/core/testing';
import { SessionTimeoutSyncChannel } from './session-timeout-sync-channel';

class MockBroadcastChannel {
    static instances: MockBroadcastChannel[] = [];
    postMessage = jasmine.createSpy('postMessage').and.callFake((message: unknown) => {
        MockBroadcastChannel.instances
            .filter((instance) => instance !== this && instance.name === this.name)
            .forEach((instance) => instance.dispatch(message));
    });
    close = jasmine.createSpy('close');
    private readonly listeners = new Set<(event: MessageEvent<unknown>) => void>();
    constructor(public name: string) {
        MockBroadcastChannel.instances.push(this);
    }
    addEventListener(type: string, listener: (event: MessageEvent<unknown>) => void): void {
        if (type === 'message') {
            this.listeners.add(listener);
        }
    }
    removeEventListener(_type: string, listener: (event: MessageEvent<unknown>) => void): void {
        this.listeners.delete(listener);
    }
    dispatch(data: unknown): void {
        this.listeners.forEach((listener) => listener({ data } as MessageEvent<unknown>));
    }
}

describe('SessionTimeoutSyncChannel', () => {
    let doc: Document;
    let original: typeof BroadcastChannel | undefined;

    beforeEach(() => {
        MockBroadcastChannel.instances = [];
        TestBed.configureTestingModule({ providers: [SessionTimeoutSyncChannel] });
        doc = TestBed.inject(DOCUMENT);
        original = (doc.defaultView as any).BroadcastChannel;
        (doc.defaultView as any).BroadcastChannel = MockBroadcastChannel;
    });

    afterEach(() => {
        (doc.defaultView as any).BroadcastChannel = original;
    });

    it('posts a well-formed event with type, sourceTabId and createdAt', () => {
        const channel = TestBed.inject(SessionTimeoutSyncChannel);
        channel.open();
        channel.post('activity');

        const instance = MockBroadcastChannel.instances[0];
        expect(instance.postMessage).toHaveBeenCalledTimes(1);
        const payload = instance.postMessage.calls.mostRecent().args[0];
        expect(payload.type).toBe('activity');
        expect(typeof payload.sourceTabId).toBe('string');
        expect(typeof payload.createdAt).toBe('number');
    });

    it('ignores messages originating from its own tab', () => {
        const channel = TestBed.inject(SessionTimeoutSyncChannel);
        const spy = jasmine.createSpy('messages');
        channel.messages$.subscribe(spy);
        channel.open();
        const instance = MockBroadcastChannel.instances[0];
        channel.post('timeout');
        instance.dispatch(instance.postMessage.calls.mostRecent().args[0]);

        expect(spy).not.toHaveBeenCalled();
    });

    it('emits validated messages from other tabs', () => {
        const channel = TestBed.inject(SessionTimeoutSyncChannel);
        const spy = jasmine.createSpy('messages');
        channel.messages$.subscribe(spy);
        channel.open();
        const instance = MockBroadcastChannel.instances[0];

        instance.dispatch({ type: 'logout', sourceTabId: 'other-tab', createdAt: 123 });

        expect(spy).toHaveBeenCalledWith({ type: 'logout', sourceTabId: 'other-tab', createdAt: 123 });
    });

    it('emits expired events from other tabs', () => {
        const channel = TestBed.inject(SessionTimeoutSyncChannel);
        const spy = jasmine.createSpy('messages');
        channel.messages$.subscribe(spy);
        channel.open();
        const instance = MockBroadcastChannel.instances[0];

        instance.dispatch({ type: 'expired', sourceTabId: 'other-tab', createdAt: 456 });

        expect(spy).toHaveBeenCalledWith({ type: 'expired', sourceTabId: 'other-tab', createdAt: 456 });
    });

    it('drops malformed messages', () => {
        const channel = TestBed.inject(SessionTimeoutSyncChannel);
        const spy = jasmine.createSpy('messages');
        channel.messages$.subscribe(spy);
        channel.open();
        const instance = MockBroadcastChannel.instances[0];

        instance.dispatch({ type: 'nope' });
        instance.dispatch(null);

        expect(spy).not.toHaveBeenCalled();
    });

    it('post() does not throw when channel is unavailable', () => {
        (doc.defaultView as any).BroadcastChannel = undefined;
        const channel = TestBed.inject(SessionTimeoutSyncChannel);
        channel.open();
        expect(() => channel.post('activity')).not.toThrow();
    });
});
