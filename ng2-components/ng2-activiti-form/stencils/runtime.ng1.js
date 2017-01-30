/** stubs for Angular 1 api */
window.angular = {
    module: function (moduleName) {
        console.info('ng1: module %s requested', moduleName);
        return {
            controller: function (controllerName) {
                console.info('ng1: controller %s requested', controllerName);
                return {}
            },
            directive: function (directiveName) {
                console.info('ng1: directive %s requested', directiveName);
                return {}
            }
        }
    }
};
