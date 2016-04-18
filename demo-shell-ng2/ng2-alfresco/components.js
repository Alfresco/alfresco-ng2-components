System.register(['./src/HelloWorld'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var HelloWorld_1;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters:[
            function (HelloWorld_1_1) {
                HelloWorld_1 = HelloWorld_1_1;
                exportStar_1(HelloWorld_1_1);
            }],
        execute: function() {
            exports_1("default",{
                directives: [HelloWorld_1.HelloWorld]
            });
        }
    }
});
//# sourceMappingURL=components.js.map