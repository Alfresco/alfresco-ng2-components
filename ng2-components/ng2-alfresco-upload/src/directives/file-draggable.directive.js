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
var FileDraggableDirective = (function () {
    function FileDraggableDirective() {
        this.onFilesDropped = new core_1.EventEmitter();
        this.onFilesEntityDropped = new core_1.EventEmitter();
        this.onFolderEntityDropped = new core_1.EventEmitter();
        this._inputFocusClass = false;
    }
    FileDraggableDirective.prototype._onDropFiles = function ($event) {
        this._preventDefault($event);
        var items = $event.dataTransfer.items;
        if (items) {
            for (var i = 0; i < items.length; i++) {
                if (typeof items[i].webkitGetAsEntry !== 'undefined') {
                    var item = items[i].webkitGetAsEntry();
                    if (item) {
                        this._traverseFileTree(item);
                    }
                }
                else {
                    var files = $event.dataTransfer.files;
                    this.onFilesDropped.emit(files);
                }
            }
        }
        else {
            var files = $event.dataTransfer.files;
            this.onFilesDropped.emit(files);
        }
        this._inputFocusClass = false;
    };
    FileDraggableDirective.prototype._traverseFileTree = function (item) {
        if (item.isFile) {
            var self_1 = this;
            self_1.onFilesEntityDropped.emit(item);
        }
        else {
            if (item.isDirectory) {
                this.onFolderEntityDropped.emit(item);
            }
        }
    };
    FileDraggableDirective.prototype._onDragEnter = function ($event) {
        this._preventDefault($event);
        this._inputFocusClass = true;
    };
    FileDraggableDirective.prototype._onDragLeave = function ($event) {
        this._preventDefault($event);
        this._inputFocusClass = false;
    };
    FileDraggableDirective.prototype._onDragOver = function ($event) {
        this._preventDefault($event);
        this._inputFocusClass = true;
    };
    FileDraggableDirective.prototype._preventDefault = function ($event) {
        $event.stopPropagation();
        $event.preventDefault();
    };
    FileDraggableDirective.prototype.getInputFocus = function () {
        return this._inputFocusClass;
    };
    return FileDraggableDirective;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], FileDraggableDirective.prototype, "onFilesDropped", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], FileDraggableDirective.prototype, "onFilesEntityDropped", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], FileDraggableDirective.prototype, "onFolderEntityDropped", void 0);
FileDraggableDirective = __decorate([
    core_1.Directive({
        selector: '[file-draggable]',
        host: {
            '(drop)': '_onDropFiles($event)',
            '(dragenter)': '_onDragEnter($event)',
            '(dragleave)': '_onDragLeave($event)',
            '(dragover)': '_onDragOver($event)',
            '[class.input-focus]': '_inputFocusClass'
        }
    }),
    __metadata("design:paramtypes", [])
], FileDraggableDirective);
exports.FileDraggableDirective = FileDraggableDirective;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZmlsZS1kcmFnZ2FibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBZ0U7QUF1QmhFLElBQWEsc0JBQXNCO0lBZS9CO1FBWkEsbUJBQWMsR0FBc0IsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFHdkQseUJBQW9CLEdBQXNCLElBQUksbUJBQVksRUFBRSxDQUFDO1FBRzdELDBCQUFxQixHQUFzQixJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUl0RCxxQkFBZ0IsR0FBWSxLQUFLLENBQUM7SUFHMUMsQ0FBQztJQU9ELDZDQUFZLEdBQVosVUFBYSxNQUFXO1FBQ3BCLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0IsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNSLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNwQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUNuRCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDdkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDUCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2pDLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztvQkFDdEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BDLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBRUosSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFDdEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFDbEMsQ0FBQztJQU9PLGtEQUFpQixHQUF6QixVQUEwQixJQUFTO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxNQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLE1BQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBT0QsNkNBQVksR0FBWixVQUFhLE1BQWE7UUFDdEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0lBQ2pDLENBQUM7SUFPRCw2Q0FBWSxHQUFaLFVBQWEsTUFBYTtRQUN0QixJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFDbEMsQ0FBQztJQVFELDRDQUFXLEdBQVgsVUFBWSxNQUFhO1FBQ3JCLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBT0QsZ0RBQWUsR0FBZixVQUFnQixNQUFhO1FBQ3pCLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN6QixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQU1ELDhDQUFhLEdBQWI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQ2pDLENBQUM7SUFDTCw2QkFBQztBQUFELENBbEhBLEFBa0hDLElBQUE7QUEvR0c7SUFEQyxhQUFNLEVBQUU7OEJBQ08sbUJBQVk7OERBQTJCO0FBR3ZEO0lBREMsYUFBTSxFQUFFOzhCQUNhLG1CQUFZO29FQUEyQjtBQUc3RDtJQURDLGFBQU0sRUFBRTs4QkFDYyxtQkFBWTtxRUFBMkI7QUFUckQsc0JBQXNCO0lBVmxDLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsa0JBQWtCO1FBQzVCLElBQUksRUFBRTtZQUNGLFFBQVEsRUFBRSxzQkFBc0I7WUFDaEMsYUFBYSxFQUFFLHNCQUFzQjtZQUNyQyxhQUFhLEVBQUUsc0JBQXNCO1lBQ3JDLFlBQVksRUFBRSxxQkFBcUI7WUFDbkMscUJBQXFCLEVBQUUsa0JBQWtCO1NBQzVDO0tBQ0osQ0FBQzs7R0FDVyxzQkFBc0IsQ0FrSGxDO0FBbEhZLHdEQUFzQiIsImZpbGUiOiJkaXJlY3RpdmVzL2ZpbGUtZHJhZ2dhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBbZmlsZS1kcmFnZ2FibGVdXG4gKlxuICogVGhpcyBkaXJlY3RpdmUsIHByb3ZpZGUgYSBkcmFnIGFuZCBkcm9wIGFyZWEgZm9yIGZpbGVzIGFuZCBmb2xkZXJzLlxuICpcbiAqIEBPdXRwdXRFdmVudCB7RXZlbnRFbWl0dGVyfSBvbkZpbGVzRHJvcHBlZChGaWxlKS0gZXZlbnQgZmlyZWQgZm90IGVhY2ggZmlsZSBkcm9wcGVkXG4gKiBpbiB0aGUgZHJhZyBhbmQgZHJvcCBhcmVhLlxuICpcbiAqXG4gKiBAcmV0dXJucyB7RmlsZURyYWdnYWJsZURpcmVjdGl2ZX0gLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1tmaWxlLWRyYWdnYWJsZV0nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJyhkcm9wKSc6ICdfb25Ecm9wRmlsZXMoJGV2ZW50KScsXG4gICAgICAgICcoZHJhZ2VudGVyKSc6ICdfb25EcmFnRW50ZXIoJGV2ZW50KScsXG4gICAgICAgICcoZHJhZ2xlYXZlKSc6ICdfb25EcmFnTGVhdmUoJGV2ZW50KScsXG4gICAgICAgICcoZHJhZ292ZXIpJzogJ19vbkRyYWdPdmVyKCRldmVudCknLFxuICAgICAgICAnW2NsYXNzLmlucHV0LWZvY3VzXSc6ICdfaW5wdXRGb2N1c0NsYXNzJ1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgRmlsZURyYWdnYWJsZURpcmVjdGl2ZSB7XG5cbiAgICBAT3V0cHV0KClcbiAgICBvbkZpbGVzRHJvcHBlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBvbkZpbGVzRW50aXR5RHJvcHBlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBvbkZvbGRlckVudGl0eURyb3BwZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgZmlsZXM6IEZpbGUgW107XG5cbiAgICBwcml2YXRlIF9pbnB1dEZvY3VzQ2xhc3M6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBjYWxsZWQgd2hlbiBmaWxlcyBpcyBkcm9wcGVkIGluIHRoZSBkcmFnIGFuZCBkcm9wIGFyZWEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyRldmVudH0gJGV2ZW50IC0gRE9NICRldmVudC5cbiAgICAgKi9cbiAgICBfb25Ecm9wRmlsZXMoJGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcHJldmVudERlZmF1bHQoJGV2ZW50KTtcblxuICAgICAgICBsZXQgaXRlbXMgPSAkZXZlbnQuZGF0YVRyYW5zZmVyLml0ZW1zO1xuICAgICAgICBpZiAoaXRlbXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW1zW2ldLndlYmtpdEdldEFzRW50cnkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtID0gaXRlbXNbaV0ud2Via2l0R2V0QXNFbnRyeSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJhdmVyc2VGaWxlVHJlZShpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWxlcyA9ICRldmVudC5kYXRhVHJhbnNmZXIuZmlsZXM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25GaWxlc0Ryb3BwZWQuZW1pdChmaWxlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gc2FmYXJpIG9yIEZGXG4gICAgICAgICAgICBsZXQgZmlsZXMgPSAkZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzO1xuICAgICAgICAgICAgdGhpcy5vbkZpbGVzRHJvcHBlZC5lbWl0KGZpbGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2lucHV0Rm9jdXNDbGFzcyA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYXZlcnMgYWxsIHRoZSBmaWxlcyBhbmQgZm9sZGVycywgYW5kIGVtaXQgYW4gZXZlbnQgZm9yIGVhY2ggZmlsZSBvciBkaXJlY3RvcnkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaXRlbSAtIGNhbiBjb250YWlucyBmaWxlcyBvciBmb2xkZXJzLlxuICAgICAqL1xuICAgIHByaXZhdGUgX3RyYXZlcnNlRmlsZVRyZWUoaXRlbTogYW55KTogdm9pZCB7XG4gICAgICAgIGlmIChpdGVtLmlzRmlsZSkge1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi5vbkZpbGVzRW50aXR5RHJvcHBlZC5lbWl0KGl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGl0ZW0uaXNEaXJlY3RvcnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uRm9sZGVyRW50aXR5RHJvcHBlZC5lbWl0KGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBzdHlsZSBvZiB0aGUgZHJhZyBhcmVhIHdoZW4gYSBmaWxlIGRyYWcgaW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyRldmVudH0gJGV2ZW50IC0gRE9NICRldmVudC5cbiAgICAgKi9cbiAgICBfb25EcmFnRW50ZXIoJGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wcmV2ZW50RGVmYXVsdCgkZXZlbnQpO1xuXG4gICAgICAgIHRoaXMuX2lucHV0Rm9jdXNDbGFzcyA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBzdHlsZSBvZiB0aGUgZHJhZyBhcmVhIHdoZW4gYSBmaWxlIGRyYWcgb3V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHskZXZlbnR9ICRldmVudCAtIERPTSAkZXZlbnQuXG4gICAgICovXG4gICAgX29uRHJhZ0xlYXZlKCRldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcHJldmVudERlZmF1bHQoJGV2ZW50KTtcblxuICAgICAgICB0aGlzLl9pbnB1dEZvY3VzQ2xhc3MgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgdGhlIHN0eWxlIG9mIHRoZSBkcmFnIGFyZWEgd2hlbiBhIGZpbGUgaXMgb3ZlciB0aGUgZHJhZyBhcmVhLlxuICAgICAqXG4gICAgICogQHBhcmFtICRldmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX29uRHJhZ092ZXIoJGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wcmV2ZW50RGVmYXVsdCgkZXZlbnQpO1xuICAgICAgICB0aGlzLl9pbnB1dEZvY3VzQ2xhc3MgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByZXZlbnQgZGVmYXVsdCBhbmQgc3RvcCBwcm9wYWdhdGlvbiBvZiB0aGUgRE9NIGV2ZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHskZXZlbnR9ICRldmVudCAtIERPTSAkZXZlbnQuXG4gICAgICovXG4gICAgX3ByZXZlbnREZWZhdWx0KCRldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIGlucHV0IGZvY3VzIGNsYXNzXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0SW5wdXRGb2N1cyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnB1dEZvY3VzQ2xhc3M7XG4gICAgfVxufVxuIl19
