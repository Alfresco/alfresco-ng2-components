/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
"use strict";
var core_1 = require("@angular/core");
var rendering_queue_services_1 = require("./rendering-queue.services");
describe('RenderingQueueServices', function () {
    var service, injector;
    beforeEach(function () {
        injector = core_1.ReflectiveInjector.resolveAndCreate([
            rendering_queue_services_1.RenderingQueueServices
        ]);
    });
    beforeEach(function () {
        service = injector.get(rendering_queue_services_1.RenderingQueueServices);
    });
    it('Simple import example', function () {
        expect(service.CLEANUP_TIMEOUT).toEqual(30000);
    });
});
//# sourceMappingURL=rendering-queue.services.spec.js.map