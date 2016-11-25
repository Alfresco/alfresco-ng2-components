var adf = (window.adf = window.adf || { components: {} });
adf.registerComponent = function (componentKey, componentClass) {
    var components = (adf.components = adf.components || {});
    components[componentKey] = {
        class: componentClass,
        factory: null
    };
};
