const moduleIdRegex = /moduleId: module.id,/g;
const moduleNameRegex = /moduleId: __moduleName,/g;

module.exports = function(source) {
    this.cacheable();

    let result = source;

    if (moduleIdRegex.test(source)) {
        result = source.replace(moduleIdRegex, (match) => {
            return `// ${match}`;
        });
    }

    if (moduleNameRegex.test(source)) {
        result = source.replace(moduleNameRegex, (match) => {
            return `// ${match}`;
        });
    }

    return result;
}
