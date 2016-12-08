const moduleIdRegex = /moduleId: module.id,/g;

module.exports = function(source) {
    this.cacheable();

    let result = source;
    let modified = false;
    if (moduleIdRegex.test(source)) {
        result = source.replace(moduleIdRegex, (match) => {
            return `// ${match}`;
        });
        // console.log(result);
    }
    return result;
}
