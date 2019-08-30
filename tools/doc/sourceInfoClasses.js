"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var skipMethodNames = [
    'ngOnChanges',
    'ngOnDestroy',
    'ngOnInit'
];
var PropInfo = /** @class */ (function () {
    function PropInfo(sourceData) {
        var _this = this;
        this.errorMessages = [];
        this.name = sourceData.name;
        this.docText = sourceData.summary || '';
        this.docText = this.docText.replace(/[\n\r]+/g, ' ').trim();
        var tempDefaultVal = sourceData.syntax['return'].defaultValue;
        this.defaultValue = tempDefaultVal ? tempDefaultVal.toString() : '';
        this.defaultValue = this.defaultValue.replace(/\|/, '\\|');
        this.type = sourceData.syntax['return'].type || '';
        this.type = this.type.toString().replace(/\|/, '\\|');
        if (sourceData.tags) {
            var depTag = sourceData.tags.find(function (tag) { return tag.name === 'deprecated'; });
            if (depTag) {
                this.isDeprecated = true;
                this.docText = '(**Deprecated:** ' + depTag.text.replace(/[\n\r]+/g, ' ').trim() + ') ' + this.docText;
            }
        }
        this.isInput = false;
        this.isOutput = false;
        if (sourceData.decorators) {
            sourceData.decorators.forEach(function (dec) {
                if (dec.name === 'Input') {
                    _this.isInput = true;
                    if (dec.arguments) {
                        var bindingName = dec.arguments['bindingPropertyName'];
                        if (bindingName && (bindingName !== '')) {
                            _this.name = bindingName.replace(/['"]/g, '');
                        }
                    }
                    if (!_this.docText && !_this.isDeprecated) {
                        _this.errorMessages.push("Warning: Input \"" + sourceData.name + "\" has no doc text.");
                    }
                }
                if (dec.name === 'Output') {
                    _this.isOutput = true;
                    if (!_this.docText && !_this.isDeprecated) {
                        _this.errorMessages.push("Warning: Output \"" + sourceData.name + "\" has no doc text.");
                    }
                }
            });
        }
    }
    Object.defineProperty(PropInfo.prototype, "errors", {
        get: function () {
            return this.errorMessages;
        },
        enumerable: true,
        configurable: true
    });
    return PropInfo;
}());
exports.PropInfo = PropInfo;
var ParamInfo = /** @class */ (function () {
    function ParamInfo(sourceData) {
        this.name = sourceData.id;
        this.type = sourceData.type.toString().replace(/\s/g, '');
        this.defaultValue = sourceData.defaultValue;
        this.docText = sourceData.description.replace(/[\n\r]+/g, ' ').trim();
        this.isOptional = false;
        if (sourceData.flags) {
            var flag = sourceData.flags.find(function (sourceFlag) { return sourceFlag.name === 'isOptional'; });
            if (flag) {
                this.isOptional = true;
            }
        }
        this.combined = this.name;
        if (this.isOptional) {
            this.combined += '?';
        }
        this.combined += ": `" + this.type + "`";
        if (this.defaultValue !== '') {
            this.combined += " = `" + this.defaultValue + "`";
        }
    }
    return ParamInfo;
}());
exports.ParamInfo = ParamInfo;
var MethodSigInfo = /** @class */ (function () {
    function MethodSigInfo(sourceData) {
        var _this = this;
        this.errorMessages = [];
        this.name = sourceData.name;
        this.docText = sourceData.summary || '';
        this.docText = this.docText.replace(/[\n\r]+/g, ' ').trim();
        if (!this.docText) {
            this.errorMessages.push("Warning: method \"" + sourceData.name + "\" has no doc text.");
        }
        this.returnType = sourceData.syntax['return'].type || '';
        this.returnType = this.returnType.toString().replace(/\s/g, '');
        this.returnsSomething = this.returnType && (this.returnType !== 'void');
        this.returnDocText = sourceData.syntax['return'].summary || '';
        if (this.returnDocText.toLowerCase() === 'nothing') {
            this.returnsSomething = false;
        }
        if (this.returnsSomething && !this.returnDocText) {
            this.errorMessages.push("Warning: Return value of method \"" + sourceData.name + "\" has no doc text.");
        }
        this.isDeprecated = false;
        if (sourceData.tags) {
            var depTag = sourceData.tags.find(function (tag) { return tag.name === 'deprecated'; });
            if (depTag) {
                this.isDeprecated = true;
                this.docText = '(**Deprecated:** ' + depTag.text.replace(/[\n\r]+/g, ' ').trim() + ') ' + this.docText;
            }
        }
        this.params = [];
        var paramStrings = [];
        if (sourceData.syntax.parameters) {
            sourceData.syntax.parameters.forEach(function (rawParam) {
                if (!rawParam.description) {
                    _this.errorMessages.push("Warning: parameter \"" + rawParam.name + "\" of method \"" + sourceData.name + "\" has no doc text.");
                }
                var param = new ParamInfo(rawParam);
                _this.params.push(param);
                paramStrings.push(param.combined);
            });
        }
        this.signature = '(' + paramStrings.join(', ') + ')';
    }
    Object.defineProperty(MethodSigInfo.prototype, "errors", {
        get: function () {
            return this.errorMessages;
        },
        enumerable: true,
        configurable: true
    });
    return MethodSigInfo;
}());
exports.MethodSigInfo = MethodSigInfo;
var ComponentInfo = /** @class */ (function () {
    function ComponentInfo(sourceData) {
        var _this = this;
        this.name = sourceData.items[0].name;
        this.itemType = sourceData.items[0].type;
        this.hasInputs = false;
        this.hasOutputs = false;
        this.hasMethods = false;
        this.sourcePath = sourceData.items[0].source.path;
        this.sourceLine = sourceData.items[0].source.line;
        if (this.itemType === 'type alias') {
            return;
        }
        this.properties = [];
        this.methods = [];
        sourceData.items.forEach(function (item) {
            switch (item.type) {
                case 'property':
                case 'accessor':
                    var prop = new PropInfo(item);
                    _this.properties.push(prop);
                    if (prop.isInput) {
                        _this.hasInputs = true;
                    }
                    if (prop.isOutput) {
                        _this.hasOutputs = true;
                    }
                    break;
                case 'method':
                    if (item.flags && (item.flags.length > 0) &&
                        !item.flags.find(function (flag) { return flag.name === 'isPrivate'; }) &&
                        !item.flags.find(function (flag) { return flag.name === 'isProtected'; }) &&
                        !skipMethodNames.includes(item.name)) {
                        _this.methods.push(new MethodSigInfo(item));
                        _this.hasMethods = true;
                    }
                    break;
                default:
                    break;
            }
        });
    }
    Object.defineProperty(ComponentInfo.prototype, "errors", {
        get: function () {
            var combinedErrors = [];
            this.methods.forEach(function (method) {
                method.errors.forEach(function (err) {
                    combinedErrors.push(err);
                });
            });
            this.properties.forEach(function (prop) {
                prop.errors.forEach(function (err) {
                    combinedErrors.push(err);
                });
            });
            return combinedErrors;
        },
        enumerable: true,
        configurable: true
    });
    return ComponentInfo;
}());
exports.ComponentInfo = ComponentInfo;
