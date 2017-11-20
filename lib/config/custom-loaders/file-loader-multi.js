var path = require('path');
var loaderUtils = require('loader-utils');

module.exports = function(content) {
    this.cacheable && this.cacheable();
    if(!this.emitFile) throw new Error('emitFile is required from module system');

    var query = loaderUtils.getOptions(this) || {};
    var configKey = query.config || 'multiFileLoader';
    var options = this.options[configKey] || {};
    var config = {
        publicPath: false,
        useRelativePath: false,
        name: '[hash].[ext]'
    };

    // options takes precedence over config
    Object.keys(options).forEach(function(attr) {
        config[attr] = options[attr];
    });

    // query takes precedence over config and options
    Object.keys(query).forEach(function(attr) {
        config[attr] = query[attr];
    });

    var context = config.context || this.options.context;
    var url = loaderUtils.interpolateName(this, config.name, {
        context: context,
        content: content,
        regExp: config.regExp
    });
    var path = loaderUtils.interpolateName(this, '[path]', {
        context: context,
        content: content,
        regExp: config.regExp
    });

    var outputPath = '';

    if (config.outputPath) {
        outputPath = (
            typeof config.outputPath === 'function'
                ? config.outputPath(url, path)
                : config.outputPath + url
        );
    } else {
        outputPath = url;
    }

    var publicPath = JSON.stringify(url);

    if (config.publicPath) {
        publicPath = JSON.stringify(
            typeof config.publicPath === 'function'
                ? config.publicPath(url, path)
                : config.publicPath + url
        );
    }

    publicPath = '__webpack_public_path__ + ' + publicPath;

    if (query.emitFile === undefined || query.emitFile) {
        this.emitFile(outputPath, content);
    }

    return 'module.exports = ' + publicPath + ';';
};

module.exports.raw = true;
