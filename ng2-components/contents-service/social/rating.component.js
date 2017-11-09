"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rating_service_1 = require("./../services/rating.service");
var RatingComponent = (function () {
    function RatingComponent(ratingService) {
        this.ratingService = ratingService;
        this.average = 0;
        this.ratingType = 'fiveStar';
        this.changeVote = new core_1.EventEmitter();
        this.stars = [];
    }
    RatingComponent.prototype.ngOnChanges = function () {
        var _this = this;
        var ratingObserver = this.ratingService.getRating(this.nodeId, this.ratingType);
        ratingObserver.subscribe(function (data) {
            if (data.entry.aggregate) {
                _this.average = data.entry.aggregate.average;
                _this.calculateStars();
            }
        });
        return ratingObserver;
    };
    RatingComponent.prototype.calculateStars = function () {
        this.stars = [];
        for (var i = 0; i < 5; i++) {
            if (i < this.average) {
                this.stars.push({ fill: true });
            }
            else {
                this.stars.push({ fill: false });
            }
        }
        this.changeVote.emit(this.average);
    };
    RatingComponent.prototype.updateVote = function (vote) {
        var _this = this;
        this.ratingService.postRating(this.nodeId, this.ratingType, vote).subscribe(function (data) {
            if (data.entry.aggregate) {
                if (_this.average !== data.entry.aggregate.average) {
                    _this.average = data.entry.aggregate.average;
                    _this.calculateStars();
                }
            }
        });
    };
    __decorate([
        core_1.Input()
    ], RatingComponent.prototype, "nodeId", void 0);
    __decorate([
        core_1.Output()
    ], RatingComponent.prototype, "changeVote", void 0);
    RatingComponent = __decorate([
        core_1.Component({
            selector: 'adf-rating',
            styleUrls: ['./rating.component.scss'],
            templateUrl: './rating.component.html',
            providers: [rating_service_1.RatingService],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], RatingComponent);
    return RatingComponent;
}());
exports.RatingComponent = RatingComponent;
