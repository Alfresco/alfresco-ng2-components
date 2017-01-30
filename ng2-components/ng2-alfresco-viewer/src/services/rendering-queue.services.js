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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var RenderingQueueServices = (function () {
    function RenderingQueueServices() {
        this.renderingStates = {
            INITIAL: 0,
            RUNNING: 1,
            PAUSED: 2,
            FINISHED: 3
        };
        this.CLEANUP_TIMEOUT = 30000;
        this.pdfViewer = null;
        this.pdfThumbnailViewer = null;
        this.onIdle = null;
        this.highestPriorityPage = null;
        this.idleTimeout = null;
        this.printing = false;
        this.isThumbnailViewEnabled = false;
    }
    RenderingQueueServices.prototype.setViewer = function (pdfViewer) {
        this.pdfViewer = pdfViewer;
    };
    RenderingQueueServices.prototype.setThumbnailViewer = function (pdfThumbnailViewer) {
        this.pdfThumbnailViewer = pdfThumbnailViewer;
    };
    RenderingQueueServices.prototype.isHighestPriority = function (view) {
        return this.highestPriorityPage === view.renderingId;
    };
    RenderingQueueServices.prototype.renderHighestPriority = function (currentlyVisiblePages) {
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
            this.idleTimeout = null;
        }
        if (this.pdfViewer.forceRendering(currentlyVisiblePages)) {
            return;
        }
        if (this.pdfThumbnailViewer && this.isThumbnailViewEnabled) {
            if (this.pdfThumbnailViewer.forceRendering()) {
                return;
            }
        }
        if (this.printing) {
            return;
        }
        if (this.onIdle) {
            this.idleTimeout = setTimeout(this.onIdle.bind(this), this.CLEANUP_TIMEOUT);
        }
    };
    RenderingQueueServices.prototype.getHighestPriority = function (visible, views, scrolledDown) {
        var visibleViews = visible.views;
        var numVisible = visibleViews.length;
        if (numVisible === 0) {
            return false;
        }
        for (var i = 0; i < numVisible; ++i) {
            var view = visibleViews[i].view;
            if (!this.isViewFinished(view)) {
                return view;
            }
        }
        if (scrolledDown) {
            var nextPageIndex = visible.last.id;
            if (views[nextPageIndex] && !this.isViewFinished(views[nextPageIndex])) {
                return views[nextPageIndex];
            }
        }
        else {
            var previousPageIndex = visible.first.id - 2;
            if (views[previousPageIndex] && !this.isViewFinished(views[previousPageIndex])) {
                return views[previousPageIndex];
            }
        }
        return null;
    };
    RenderingQueueServices.prototype.isViewFinished = function (view) {
        return view.renderingState === this.renderingStates.FINISHED;
    };
    RenderingQueueServices.prototype.renderView = function (view) {
        var state = view.renderingState;
        switch (state) {
            case this.renderingStates.FINISHED:
                return false;
            case this.renderingStates.PAUSED:
                this.highestPriorityPage = view.renderingId;
                view.resume();
                break;
            case this.renderingStates.RUNNING:
                this.highestPriorityPage = view.renderingId;
                break;
            case this.renderingStates.INITIAL:
                this.highestPriorityPage = view.renderingId;
                var continueRendering = function () {
                    this.renderHighestPriority();
                }.bind(this);
                view.draw().then(continueRendering, continueRendering);
                break;
            default:
                break;
        }
        return true;
    };
    return RenderingQueueServices;
}());
RenderingQueueServices = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], RenderingQueueServices);
exports.RenderingQueueServices = RenderingQueueServices;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL3JlbmRlcmluZy1xdWV1ZS5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTJDO0FBUzNDLElBQWEsc0JBQXNCO0lBRG5DO1FBR0ksb0JBQWUsR0FBRztZQUNkLE9BQU8sRUFBRSxDQUFDO1lBQ1YsT0FBTyxFQUFFLENBQUM7WUFDVixNQUFNLEVBQUUsQ0FBQztZQUNULFFBQVEsRUFBRSxDQUFDO1NBQ2QsQ0FBQztRQUVGLG9CQUFlLEdBQVcsS0FBSyxDQUFDO1FBRWhDLGNBQVMsR0FBUSxJQUFJLENBQUM7UUFDdEIsdUJBQWtCLEdBQVEsSUFBSSxDQUFDO1FBQy9CLFdBQU0sR0FBUSxJQUFJLENBQUM7UUFFbkIsd0JBQW1CLEdBQVEsSUFBSSxDQUFDO1FBQ2hDLGdCQUFXLEdBQVEsSUFBSSxDQUFDO1FBQ3hCLGFBQVEsR0FBUSxLQUFLLENBQUM7UUFDdEIsMkJBQXNCLEdBQVEsS0FBSyxDQUFDO0lBOEh4QyxDQUFDO0lBekhHLDBDQUFTLEdBQVQsVUFBVSxTQUFTO1FBQ2YsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUtELG1EQUFrQixHQUFsQixVQUFtQixrQkFBa0I7UUFDakMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO0lBQ2pELENBQUM7SUFNRCxrREFBaUIsR0FBakIsVUFBa0IsSUFBUztRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixLQUFLLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDekQsQ0FBQztJQUVELHNEQUFxQixHQUFyQixVQUFzQixxQkFBcUI7UUFDdkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDbkIsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FB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Q1osS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVE7Z0JBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU07Z0JBQzVCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2QsS0FBSyxDQUFDO1lBQ1YsS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU87Z0JBQzdCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUM1QyxLQUFLLENBQUM7WUFDVixLQUFLLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTztnQkFDN0IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQzVDLElBQUksaUJBQWlCLEdBQUc7b0JBQ3BCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2dCQUNqQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNiLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztnQkFDdkQsS0FBSyxDQUFDO1lBQ1Y7Z0JBQ0ksS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNMLDZCQUFDO0FBQUQsQ0FoSkEsQUFnSkMsSUFBQTtBQWhKWSxzQkFBc0I7SUFEbEMsaUJBQVUsRUFBRTs7R0FDQSxzQkFBc0IsQ0FnSmxDO0FBaEpZLHdEQUFzQiIsImZpbGUiOiJzZXJ2aWNlcy9yZW5kZXJpbmctcXVldWUuc2VydmljZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICpcbiAqIFJlbmRlcmluZ1F1ZXVlU2VydmljZXMgcmVuZGVyaW5nIG9mIHRoZSB2aWV3cyBmb3IgcGFnZXMgYW5kIHRodW1ibmFpbHMuXG4gKlxuICogQHJldHVybnMge1JlbmRlcmluZ1F1ZXVlU2VydmljZXN9IC5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJlbmRlcmluZ1F1ZXVlU2VydmljZXMge1xuXG4gICAgcmVuZGVyaW5nU3RhdGVzID0ge1xuICAgICAgICBJTklUSUFMOiAwLFxuICAgICAgICBSVU5OSU5HOiAxLFxuICAgICAgICBQQVVTRUQ6IDIsXG4gICAgICAgIEZJTklTSEVEOiAzXG4gICAgfTtcblxuICAgIENMRUFOVVBfVElNRU9VVDogbnVtYmVyID0gMzAwMDA7XG5cbiAgICBwZGZWaWV3ZXI6IGFueSA9IG51bGw7XG4gICAgcGRmVGh1bWJuYWlsVmlld2VyOiBhbnkgPSBudWxsO1xuICAgIG9uSWRsZTogYW55ID0gbnVsbDtcblxuICAgIGhpZ2hlc3RQcmlvcml0eVBhZ2U6IGFueSA9IG51bGw7XG4gICAgaWRsZVRpbWVvdXQ6IGFueSA9IG51bGw7XG4gICAgcHJpbnRpbmc6IGFueSA9IGZhbHNlO1xuICAgIGlzVGh1bWJuYWlsVmlld0VuYWJsZWQ6IGFueSA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtQREZWaWV3ZXJ9IHBkZlZpZXdlclxuICAgICAqL1xuICAgIHNldFZpZXdlcihwZGZWaWV3ZXIpIHtcbiAgICAgICAgdGhpcy5wZGZWaWV3ZXIgPSBwZGZWaWV3ZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtQREZUaHVtYm5haWxWaWV3ZXJ9IHBkZlRodW1ibmFpbFZpZXdlclxuICAgICAqL1xuICAgIHNldFRodW1ibmFpbFZpZXdlcihwZGZUaHVtYm5haWxWaWV3ZXIpIHtcbiAgICAgICAgdGhpcy5wZGZUaHVtYm5haWxWaWV3ZXIgPSBwZGZUaHVtYm5haWxWaWV3ZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtJUmVuZGVyYWJsZVZpZXd9IHZpZXdcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0hpZ2hlc3RQcmlvcml0eSh2aWV3OiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlnaGVzdFByaW9yaXR5UGFnZSA9PT0gdmlldy5yZW5kZXJpbmdJZDtcbiAgICB9XG5cbiAgICByZW5kZXJIaWdoZXN0UHJpb3JpdHkoY3VycmVudGx5VmlzaWJsZVBhZ2VzKSB7XG4gICAgICAgIGlmICh0aGlzLmlkbGVUaW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5pZGxlVGltZW91dCk7XG4gICAgICAgICAgICB0aGlzLmlkbGVUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBhZ2VzIGhhdmUgYSBoaWdoZXIgcHJpb3JpdHkgdGhhbiB0aHVtYm5haWxzLCBzbyBjaGVjayB0aGVtIGZpcnN0LlxuICAgICAgICBpZiAodGhpcy5wZGZWaWV3ZXIuZm9yY2VSZW5kZXJpbmcoY3VycmVudGx5VmlzaWJsZVBhZ2VzKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vIHBhZ2VzIG5lZWRlZCByZW5kZXJpbmcgc28gY2hlY2sgdGh1bWJuYWlscy5cbiAgICAgICAgaWYgKHRoaXMucGRmVGh1bWJuYWlsVmlld2VyICYmIHRoaXMuaXNUaHVtYm5haWxWaWV3RW5hYmxlZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGRmVGh1bWJuYWlsVmlld2VyLmZvcmNlUmVuZGVyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcmludGluZykge1xuICAgICAgICAgICAgLy8gSWYgcHJpbnRpbmcgaXMgY3VycmVudGx5IG9uZ29pbmcgZG8gbm90IHJlc2NoZWR1bGUgY2xlYW51cC5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9uSWRsZSkge1xuICAgICAgICAgICAgdGhpcy5pZGxlVGltZW91dCA9IHNldFRpbWVvdXQodGhpcy5vbklkbGUuYmluZCh0aGlzKSwgdGhpcy5DTEVBTlVQX1RJTUVPVVQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SGlnaGVzdFByaW9yaXR5KHZpc2libGUsIHZpZXdzLCBzY3JvbGxlZERvd24pIHtcbiAgICAgICAgLy8gVGhlIHN0YXRlIGhhcyBjaGFuZ2VkIGZpZ3VyZSBvdXQgd2hpY2ggcGFnZSBoYXMgdGhlIGhpZ2hlc3QgcHJpb3JpdHkgdG9cbiAgICAgICAgLy8gcmVuZGVyIG5leHQgKGlmIGFueSkuXG4gICAgICAgIC8vIFByaW9yaXR5OlxuICAgICAgICAvLyAxIHZpc2libGUgcGFnZXNcbiAgICAgICAgLy8gMiBpZiBsYXN0IHNjcm9sbGVkIGRvd24gcGFnZSBhZnRlciB0aGUgdmlzaWJsZSBwYWdlc1xuICAgICAgICAvLyAyIGlmIGxhc3Qgc2Nyb2xsZWQgdXAgcGFnZSBiZWZvcmUgdGhlIHZpc2libGUgcGFnZXNcbiAgICAgICAgbGV0IHZpc2libGVWaWV3cyA9IHZpc2libGUudmlld3M7XG5cbiAgICAgICAgbGV0IG51bVZpc2libGUgPSB2aXNpYmxlVmlld3MubGVuZ3RoO1xuICAgICAgICBpZiAobnVtVmlzaWJsZSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVmlzaWJsZTsgKytpKSB7XG4gICAgICAgICAgICBsZXQgdmlldyA9IHZpc2libGVWaWV3c1tpXS52aWV3O1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVmlld0ZpbmlzaGVkKHZpZXcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpZXc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbGwgdGhlIHZpc2libGUgdmlld3MgaGF2ZSByZW5kZXJlZCwgdHJ5IHRvIHJlbmRlciBuZXh0L3ByZXZpb3VzIHBhZ2VzLlxuICAgICAgICBpZiAoc2Nyb2xsZWREb3duKSB7XG4gICAgICAgICAgICBsZXQgbmV4dFBhZ2VJbmRleCA9IHZpc2libGUubGFzdC5pZDtcbiAgICAgICAgICAgIC8vIElEJ3Mgc3RhcnQgYXQgMSBzbyBubyBuZWVkIHRvIGFkZCAxLlxuICAgICAgICAgICAgaWYgKHZpZXdzW25leHRQYWdlSW5kZXhdICYmICF0aGlzLmlzVmlld0ZpbmlzaGVkKHZpZXdzW25leHRQYWdlSW5kZXhdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2aWV3c1tuZXh0UGFnZUluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBwcmV2aW91c1BhZ2VJbmRleCA9IHZpc2libGUuZmlyc3QuaWQgLSAyO1xuICAgICAgICAgICAgaWYgKHZpZXdzW3ByZXZpb3VzUGFnZUluZGV4XSAmJiAhdGhpcy5pc1ZpZXdGaW5pc2hlZCh2aWV3c1twcmV2aW91c1BhZ2VJbmRleF0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpZXdzW3ByZXZpb3VzUGFnZUluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFdmVyeXRoaW5nIHRoYXQgbmVlZHMgdG8gYmUgcmVuZGVyZWQgaGFzIGJlZW4uXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7SVJlbmRlcmFibGVWaWV3fSB2aWV3XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaXNWaWV3RmluaXNoZWQodmlldykge1xuICAgICAgICByZXR1cm4gdmlldy5yZW5kZXJpbmdTdGF0ZSA9PT0gdGhpcy5yZW5kZXJpbmdTdGF0ZXMuRklOSVNIRUQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVuZGVyIGEgcGFnZSBvciB0aHVtYm5haWwgdmlldy4gVGhpcyBjYWxscyB0aGUgYXBwcm9wcmlhdGUgZnVuY3Rpb25cbiAgICAgKiBiYXNlZCBvbiB0aGUgdmlld3Mgc3RhdGUuIElmIHRoZSB2aWV3IGlzIGFscmVhZHkgcmVuZGVyZWQgaXQgd2lsbCByZXR1cm5cbiAgICAgKiBmYWxzZS5cbiAgICAgKiBAcGFyYW0ge0lSZW5kZXJhYmxlVmlld30gdmlld1xuICAgICAqL1xuICAgIHJlbmRlclZpZXcodmlldzogYW55KSB7XG4gICAgICAgIGxldCBzdGF0ZSA9IHZpZXcucmVuZGVyaW5nU3RhdGU7XG4gICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgdGhpcy5yZW5kZXJpbmdTdGF0ZXMuRklOSVNIRUQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgY2FzZSB0aGlzLnJlbmRlcmluZ1N0YXRlcy5QQVVTRUQ6XG4gICAgICAgICAgICAgICAgdGhpcy5oaWdoZXN0UHJpb3JpdHlQYWdlID0gdmlldy5yZW5kZXJpbmdJZDtcbiAgICAgICAgICAgICAgICB2aWV3LnJlc3VtZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0aGlzLnJlbmRlcmluZ1N0YXRlcy5SVU5OSU5HOlxuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGVzdFByaW9yaXR5UGFnZSA9IHZpZXcucmVuZGVyaW5nSWQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHRoaXMucmVuZGVyaW5nU3RhdGVzLklOSVRJQUw6XG4gICAgICAgICAgICAgICAgdGhpcy5oaWdoZXN0UHJpb3JpdHlQYWdlID0gdmlldy5yZW5kZXJpbmdJZDtcbiAgICAgICAgICAgICAgICBsZXQgY29udGludWVSZW5kZXJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVySGlnaGVzdFByaW9yaXR5KCk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIHZpZXcuZHJhdygpLnRoZW4oY29udGludWVSZW5kZXJpbmcsIGNvbnRpbnVlUmVuZGVyaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuIl19
