"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typedoc_1 = require("typedoc");
var undocMethodNames = {
    "ngOnChanges": 1
};
var PropInfo = /** @class */ (function () {
    function PropInfo(rawProp) {
        var _this = this;
        this.errorMessages = [];
        this.name = rawProp.name;
        this.docText = rawProp.comment ? rawProp.comment.shortText : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
        this.defaultValue = rawProp.defaultValue || "";
        this.defaultValue = this.defaultValue.replace(/\|/, "\\|");
        this.type = rawProp.type ? rawProp.type.toString().replace(/\s/g, "") : "";
        this.type = this.type.replace(/\|/, "\\|");
        this.isDeprecated = rawProp.comment && rawProp.comment.hasTag("deprecated");
        if (this.isDeprecated) {
            this.docText = "(**Deprecated:** " + rawProp.comment.getTag("deprecated").text.replace(/[\n\r]+/g, " ").trim() + ") " + this.docText;
        }
        if (rawProp.decorators) {
            rawProp.decorators.forEach(function (dec) {
                //console.log(dec);
                if (dec.name === "Input") {
                    _this.isInput = true;
                    if (dec.arguments) {
                        var bindingName = dec.arguments["bindingPropertyName"];
                        if (bindingName && (bindingName !== ""))
                            _this.name = bindingName.replace(/['"]/g, "");
                    }
                    if (!_this.docText && !_this.isDeprecated) {
                        _this.errorMessages.push("Warning: Input \"" + rawProp.name + "\" has no doc text.");
                    }
                }
                if (dec.name === "Output") {
                    _this.isOutput = true;
                    if (!_this.docText && !_this.isDeprecated) {
                        _this.errorMessages.push("Warning: Output \"" + rawProp.name + "\" has no doc text.");
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
;
var ParamInfo = /** @class */ (function () {
    function ParamInfo(rawParam) {
        this.name = rawParam.name;
        this.type = rawParam.type.toString().replace(/\s/g, "");
        this.defaultValue = rawParam.defaultValue;
        this.docText = rawParam.comment ? rawParam.comment.text : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
        this.isOptional = rawParam.flags.isOptional;
        this.combined = this.name;
        if (this.isOptional)
            this.combined += "?";
        this.combined += ": `" + this.type + "`";
        if (this.defaultValue !== "")
            this.combined += " = `" + this.defaultValue + "`";
    }
    return ParamInfo;
}());
exports.ParamInfo = ParamInfo;
var MethodSigInfo = /** @class */ (function () {
    function MethodSigInfo(rawSig) {
        var _this = this;
        this.errorMessages = [];
        this.name = rawSig.name;
        this.returnType = rawSig.type ? rawSig.type.toString().replace(/\s/g, "") : "";
        this.returnsSomething = this.returnType != "void";
        if (rawSig.hasComment()) {
            this.docText = rawSig.comment.shortText + rawSig.comment.text;
            this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
            if (!this.docText) {
                this.errorMessages.push("Warning: method \"" + rawSig.name + "\" has no doc text.");
            }
            this.returnDocText = rawSig.comment.returns;
            this.returnDocText = this.returnDocText ? this.returnDocText.replace(/[\n\r]+/g, " ").trim() : "";
            if (this.returnDocText.toLowerCase() === "nothing") {
                this.returnsSomething = false;
            }
            if (this.returnsSomething && !this.returnDocText) {
                this.errorMessages.push("Warning: Return value of method \"" + rawSig.name + "\" has no doc text.");
            }
            this.isDeprecated = rawSig.comment.hasTag("deprecated");
        }
        this.params = [];
        var paramStrings = [];
        if (rawSig.parameters) {
            rawSig.parameters.forEach(function (rawParam) {
                if (!rawParam.comment || !rawParam.comment.text) {
                    _this.errorMessages.push("Warning: parameter \"" + rawParam.name + "\" of method \"" + rawSig.name + "\" has no doc text.");
                }
                var param = new ParamInfo(rawParam);
                _this.params.push(param);
                paramStrings.push(param.combined);
            });
        }
        this.signature = "(" + paramStrings.join(", ") + ")";
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
    function ComponentInfo(classRef) {
        var _this = this;
        var props = classRef.getChildrenByKind(typedoc_1.ReflectionKind.Property);
        var accessors = classRef.getChildrenByKind(typedoc_1.ReflectionKind.Accessor);
        this.properties = props.concat(accessors).map(function (item) {
            return new PropInfo(item);
        });
        var methods = classRef.getChildrenByKind(typedoc_1.ReflectionKind.Method);
        this.methods = [];
        methods.forEach(function (method) {
            if (!(method.flags.isPrivate || method.flags.isProtected || undocMethodNames[method.name])) {
                method.signatures.forEach(function (sig) {
                    _this.methods.push(new MethodSigInfo(sig));
                });
            }
        });
        this.hasInputs = false;
        this.hasOutputs = false;
        this.properties.forEach(function (prop) {
            if (prop.isInput)
                _this.hasInputs = true;
            if (prop.isOutput)
                _this.hasOutputs = true;
        });
        this.hasMethods = methods.length > 0;
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
