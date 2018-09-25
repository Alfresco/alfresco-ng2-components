"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var undocMethodNames = {
    "ngOnChanges": 1
};
var PropInfo = /** @class */ (function () {
    /*
    constructor(rawProp: DeclarationReflection) {
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
            rawProp.decorators.forEach(dec => {
                //console.log(dec);
                if (dec.name === "Input") {
                    this.isInput = true;
                    
                    if (dec.arguments) {
                        let bindingName = dec.arguments["bindingPropertyName"];
                        
                        if (bindingName && (bindingName !== ""))
                            this.name = bindingName.replace(/['"]/g, "");
                    }
                    
                    if (!this.docText && !this.isDeprecated) {
                        this.errorMessages.push(`Warning: Input "${rawProp.name}" has no doc text.`);
                    }
                }

                if (dec.name === "Output") {
                    this.isOutput = true;

                    if (!this.docText && !this.isDeprecated) {
                        this.errorMessages.push(`Warning: Output "${rawProp.name}" has no doc text.`);
                    }
                }
            });
        }
    }
    */
    function PropInfo(sourceData) {
        var _this = this;
        this.errorMessages = [];
        this.name = sourceData.name;
        this.docText = sourceData.summary || "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
        var tempDefaultVal = sourceData.syntax["return"].defaultValue;
        this.defaultValue = tempDefaultVal ? tempDefaultVal.toString() : "";
        this.defaultValue = this.defaultValue.replace(/\|/, "\\|");
        this.type = sourceData.syntax["return"].type || "";
        this.type = this.type.toString().replace(/\|/, "\\|");
        if (sourceData.tags) {
            var depTag = sourceData.tags.find(function (tag) { return tag.name === "deprecated"; });
            if (depTag) {
                this.isDeprecated = true;
                this.docText = "(**Deprecated:** " + depTag.text.replace(/[\n\r]+/g, " ").trim() + ") " + this.docText;
            }
        }
        this.isInput = false;
        this.isOutput = false;
        if (sourceData.decorators) {
            sourceData.decorators.forEach(function (dec) {
                //console.log(dec);
                if (dec.name === "Input") {
                    _this.isInput = true;
                    if (dec.arguments) {
                        var bindingName = dec.arguments["bindingPropertyName"];
                        if (bindingName && (bindingName !== ""))
                            _this.name = bindingName.replace(/['"]/g, "");
                    }
                    if (!_this.docText && !_this.isDeprecated) {
                        _this.errorMessages.push("Warning: Input \"" + sourceData.name + "\" has no doc text.");
                    }
                }
                if (dec.name === "Output") {
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
;
var ParamInfo = /** @class */ (function () {
    /*
    constructor(rawParam: ParameterReflection) {
        this.name = rawParam.name;
        this.type = rawParam.type.toString().replace(/\s/g, "");
        this.defaultValue = rawParam.defaultValue;
        this.docText = rawParam.comment ? rawParam.comment.text : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
        this.isOptional = rawParam.flags.isOptional;

        this.combined = this.name;

        if (this.isOptional)
            this.combined += "?";

        this.combined += `: \`${this.type}\``;
        
        if (this.defaultValue !== "")
            this.combined += ` = \`${this.defaultValue}\``;
    }
    */
    function ParamInfo(sourceData) {
        this.name = sourceData.id;
        this.type = sourceData.type.toString().replace(/\s/g, "");
        this.defaultValue = sourceData.defaultValue;
        this.docText = sourceData.description.replace(/[\n\r]+/g, " ").trim();
        this.isOptional = false;
        if (sourceData.flags) {
            var flag = sourceData.flags.find(function (flag) { return flag.name === "isOptional"; });
            if (flag) {
                this.isOptional = true;
            }
        }
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
    /*
    constructor(rawSig: SignatureReflection) {
        this.errorMessages = [];
        this.name = rawSig.name;
        this.returnType = rawSig.type ? rawSig.type.toString().replace(/\s/g, "") : "";
        this.returnsSomething = this.returnType != "void";

        if (rawSig.hasComment()) {
            this.docText = rawSig.comment.shortText + rawSig.comment.text;
            this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
            
            if (!this.docText) {
                this.errorMessages.push(`Warning: method "${rawSig.name}" has no doc text.`);
            }

            this.returnDocText = rawSig.comment.returns;
            this.returnDocText = this.returnDocText ? this.returnDocText.replace(/[\n\r]+/g, " ").trim() : "";
            
            if (this.returnDocText.toLowerCase() === "nothing") {
                this.returnsSomething = false;
            }

            if (this.returnsSomething && !this.returnDocText) {
                this.errorMessages.push(`Warning: Return value of method "${rawSig.name}" has no doc text.`);
            }

            this.isDeprecated = rawSig.comment.hasTag("deprecated");
        }

        this.params = [];
        let paramStrings = [];

        if (rawSig.parameters) {
            rawSig.parameters.forEach(rawParam => {
                if (!rawParam.comment || !rawParam.comment.text) {
                    this.errorMessages.push(`Warning: parameter "${rawParam.name}" of method "${rawSig.name}" has no doc text.`);
                }

                let param = new ParamInfo(rawParam);
                this.params.push(param);
                paramStrings.push(param.combined);
            });
        }

        this.signature = "(" + paramStrings.join(", ") + ")";
    }
*/
    function MethodSigInfo(sourceData) {
        var _this = this;
        this.errorMessages = [];
        this.name = sourceData.name;
        this.docText = sourceData.summary || "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
        if (!this.docText) {
            this.errorMessages.push("Warning: method \"" + sourceData.name + "\" has no doc text.");
        }
        this.returnType = sourceData.syntax["return"].type || "";
        this.returnType = this.returnType.toString().replace(/\s/g, "");
        this.returnsSomething = this.returnType && (this.returnType !== "void");
        this.returnDocText = sourceData.syntax["return"].summary || "";
        if (this.returnDocText.toLowerCase() === "nothing") {
            this.returnsSomething = false;
        }
        if (this.returnsSomething && !this.returnDocText) {
            this.errorMessages.push("Warning: Return value of method \"" + sourceData.name + "\" has no doc text.");
        }
        this.isDeprecated = false;
        if (sourceData.tags) {
            var depTag = sourceData.tags.find(function (tag) { return tag.name === "deprecated"; });
            if (depTag) {
                this.isDeprecated = true;
                this.docText = "(**Deprecated:** " + depTag.text.replace(/[\n\r]+/g, " ").trim() + ") " + this.docText;
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
    /*
    constructor(classRef: DeclarationReflection) {
        let props = classRef.getChildrenByKind(ReflectionKind.Property);
        let accessors = classRef.getChildrenByKind(ReflectionKind.Accessor);
        
        this.properties = [...props, ...accessors].map(item => {
            return new PropInfo(item);
        });

        let methods = classRef.getChildrenByKind(ReflectionKind.Method);

        this.methods = [];

        methods.forEach(method =>{
            if (!(method.flags.isPrivate || method.flags.isProtected || undocMethodNames[method.name])) {
                method.signatures.forEach(sig => {
                    this.methods.push(new MethodSigInfo(sig));
                });
            }
        });
        
        this.hasInputs = false;
        this.hasOutputs = false;
        
        this.properties.forEach(prop => {
            if (prop.isInput)
                this.hasInputs = true;
            
            if (prop.isOutput)
                this.hasOutputs = true;
        });

        this.hasMethods = methods.length > 0;
    }
*/
    function ComponentInfo(sourceData) {
        var _this = this;
        this.hasInputs = false;
        this.hasOutputs = false;
        this.hasMethods = false;
        this.sourcePath = sourceData.items[0].source.path;
        this.sourceLine = sourceData.items[0].source.line;
        this.properties = [];
        this.methods = [];
        sourceData.items.forEach(function (item) {
            switch (item.type) {
                case "property":
                case "accessor":
                    var prop = new PropInfo(item);
                    _this.properties.push(prop);
                    if (prop.isInput) {
                        _this.hasInputs = true;
                    }
                    if (prop.isOutput) {
                        _this.hasOutputs = true;
                    }
                    break;
                case "method":
                    if (item.flags && (item.flags.length > 0) &&
                        !item.flags.find(function (flag) { return flag.name === "isPrivate"; }) &&
                        !item.flags.find(function (flag) { return flag.name === "isProtected"; }) &&
                        !undocMethodNames[item.name]) {
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
