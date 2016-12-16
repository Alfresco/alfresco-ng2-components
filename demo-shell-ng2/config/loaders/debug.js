module.exports = function(source) {
    this.cacheable();
    console.log(this.resource);
    return source;
}
