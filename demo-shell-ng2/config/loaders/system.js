const moduleIdRegex = /moduleId: module.id,/g;
const moduleNameRegex = /moduleId: __moduleName,/g;
const moduleIdPath = /module.id.replace/g;

module.exports = function(source) {
    this.cacheable();

    if (moduleIdRegex.test(source)) {
        source = source.replace(moduleIdRegex, (match) => {
                return `// ${match}`;
    });
    }

    if (moduleNameRegex.test(source)) {
        source = source.replace(moduleNameRegex, (match) => {
                return `// ${match}`;
    });
    }

    if (moduleIdPath.test(source)) {
        source = source.replace(moduleIdPath, (match) => {
                return `''.replace`;
    });
    }

    return source;
}
