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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var NodeNameTooltipPipe = /** @class */ (function () {
    function NodeNameTooltipPipe() {
    }
    NodeNameTooltipPipe.prototype.transform = function (node) {
        if (node) {
            return this.getNodeTooltip(node);
        }
        return null;
    };
    NodeNameTooltipPipe.prototype.containsLine = function (lines, line) {
        return lines.some(function (item) {
            return item.toLowerCase() === line.toLowerCase();
        });
    };
    NodeNameTooltipPipe.prototype.removeDuplicateLines = function (lines) {
        var _this = this;
        var reducer = function (acc, line) {
            if (!_this.containsLine(acc, line)) {
                acc.push(line);
            }
            return acc;
        };
        return lines.reduce(reducer, []);
    };
    NodeNameTooltipPipe.prototype.getNodeTooltip = function (node) {
        if (!node || !node.entry) {
            return null;
        }
        var _a = node.entry, properties = _a.properties, name = _a.name;
        var lines = [name];
        if (properties) {
            var title = properties["cm:title"], description = properties["cm:description"];
            if (title && description) {
                lines[0] = title;
                lines[1] = description;
            }
            if (title) {
                lines[1] = title;
            }
            if (description) {
                lines[1] = description;
            }
        }
        return this.removeDuplicateLines(lines).join("\n");
    };
    NodeNameTooltipPipe = __decorate([
        core_1.Pipe({
            name: 'adfNodeNameTooltip'
        })
    ], NodeNameTooltipPipe);
    return NodeNameTooltipPipe;
}());
exports.NodeNameTooltipPipe = NodeNameTooltipPipe;
//# sourceMappingURL=node-name-tooltip.pipe.js.map