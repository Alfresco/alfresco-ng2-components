System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var HelloWorld;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            HelloWorld = (function () {
                function HelloWorld() {
                    this.message = "Click Me ...";
                }
                HelloWorld.prototype.onClick = function () {
                    this.message = "Hello World!";
                    console.log(this.message);
                };
                HelloWorld = __decorate([
                    core_1.Component({
                        selector: 'hello-world',
                        styles: ["\n       h1 {\n            color: blue;\n        }\n    "],
                        template: "<div>\n                  <h1 (click)=\"onClick()\">{{message}}</h1>\n               </div>"
                    }), 
                    __metadata('design:paramtypes', [])
                ], HelloWorld);
                return HelloWorld;
            }());
            exports_1("HelloWorld", HelloWorld);
        }
    }
});
//# sourceMappingURL=HelloWorld.js.map