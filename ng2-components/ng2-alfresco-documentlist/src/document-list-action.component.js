System.register(['angular2/core', './document-list.component', './models/document-action.model'], function(exports_1, context_1) {
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
    var core_1, document_list_component_1, document_action_model_1;
    var DocumentListAction;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (document_list_component_1_1) {
                document_list_component_1 = document_list_component_1_1;
            },
            function (document_action_model_1_1) {
                document_action_model_1 = document_action_model_1_1;
            }],
        execute: function() {
            DocumentListAction = (function () {
                function DocumentListAction(list) {
                    this.list = list;
                    this.title = 'Action';
                    this.execute = new core_1.EventEmitter();
                    this.defaultHandlers = {};
                    // todo: just for dev/demo purposes, to be replaced with real actions
                    this.defaultHandlers['system1'] = this.handleStandardAction1;
                    this.defaultHandlers['system2'] = this.handleStandardAction2;
                }
                DocumentListAction.prototype.ngOnInit = function () {
                    var _this = this;
                    var model = new document_action_model_1.DocumentActionModel();
                    model.title = this.title;
                    if (this.handler) {
                        var defaultHandler = this.defaultHandlers[this.handler];
                        if (defaultHandler) {
                            model.handler = defaultHandler;
                        }
                    }
                    else if (this.execute) {
                        model.handler = function (document) {
                            _this.execute.emit({
                                value: document
                            });
                        };
                    }
                    this.list.registerDocumentAction(model);
                };
                DocumentListAction.prototype.handleStandardAction1 = function (document) {
                    window.alert('standard action 1');
                };
                DocumentListAction.prototype.handleStandardAction2 = function (document) {
                    window.alert('standard action 2');
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DocumentListAction.prototype, "title", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DocumentListAction.prototype, "handler", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], DocumentListAction.prototype, "execute", void 0);
                DocumentListAction = __decorate([
                    core_1.Component({
                        selector: 'document-action',
                        template: ''
                    }), 
                    __metadata('design:paramtypes', [document_list_component_1.DocumentList])
                ], DocumentListAction);
                return DocumentListAction;
            }());
            exports_1("DocumentListAction", DocumentListAction);
        }
    }
});
//# sourceMappingURL=document-list-action.component.js.map