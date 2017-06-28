var path = require('path');
var fs = require('fs');

var erase = true;
var readmeContent = null;
var readmeFilePath = '';

function isFileEmpty(fileContents) {
    return fileContents.toString('utf8').trim() === '';
}

function writeFile(file, newValue) {
    fs.writeFileSync(file, newValue, 'utf-8');
}

function readFile(file) {
    return fs.readFileSync(file, 'utf8');
}

function eraseContentList() {
    if (erase) {
        erase = false;

        var businessRegex = /(?:<!-- BUSINESS START-->)([\s\S]*?)(?:<!-- BUSINESS END-->)/;
        var contentRegex = /(?:<!-- CONTENT START-->)([\s\S]*?)(?:<!-- CONTENT END-->)/;
        var coreRegex = /(?:<!-- CORE START-->)([\s\S]*?)(?:<!-- CORE END-->)/;
        var businessRegexDirective = /(?:<!-- BUSINESS DIRECTIVE START-->)([\s\S]*?)(?:<!-- BUSINESS DIRECTIVE END-->)/;
        var contentRegexDirective = /(?:<!-- CONTENT DIRECTIVE START-->)([\s\S]*?)(?:<!-- CONTENT DIRECTIVE END-->)/;
        var coreRegexDirective = /(?:<!-- CORE DIRECTIVE START-->)([\s\S]*?)(?:<!-- CORE DIRECTIVE END-->)/;

        readmeContent = readmeContent.replace(businessRegex, '<!-- BUSINESS START--><!-- BUSINESS END-->');
        readmeContent = readmeContent.replace(contentRegex, '<!-- CONTENT START--><!-- CONTENT END-->');
        readmeContent = readmeContent.replace(coreRegex, '<!-- CORE START--><!-- CORE END-->');

        readmeContent = readmeContent.replace(businessRegexDirective, '<!-- BUSINESS DIRECTIVE START--><!-- BUSINESS DIRECTIVE END-->');
        readmeContent = readmeContent.replace(contentRegexDirective, '<!-- CONTENT DIRECTIVE START--><!-- CONTENT DIRECTIVE END-->');
        readmeContent = readmeContent.replace(coreRegexDirective, '<!-- CORE DIRECTIVE START--><!-- CORE DIRECTIVE END-->');

        writeFile(readmeFilePath, readmeContent)
    }
}

function generateListComponent(currentFileContent, webpackInstance) {
    if (!isFileEmpty(currentFileContent)) {

        var componentReg = /(@Component)(\s?)\((\s?){(\s?)((.|\n)*)}(\s?)\)/gm;
        var componentSection = componentReg.exec(currentFileContent);

        if (componentSection) {
            var selectorReg = /(selector)(\s?):(\s?)('|")((.|)*)('|")/gm;
            var selector = selectorReg.exec(componentSection[0]);


            if (selector) {
                if (selector[0].indexOf('alfresco') > 0 || selector[0].indexOf('activiti') > 0 || selector[0].indexOf('adf') > 0) {
                    var selector = selector[0].replace("selector: '[", "").replace("']", '').replace("]", '').replace("selector: '", "").replace("'", '');
                    var removeRoot = webpackInstance.resourcePath.substr(webpackInstance.resourcePath.indexOf('/ng2-components') + 16, webpackInstance.resourcePath.length);
                    var url = removeRoot.substr(0, removeRoot.indexOf('src')) + 'README.md';

                    var link = '- [' + selector + '](' + url + ')';

                    if (webpackInstance.resourcePath.match('ng2-alfresco-core')) {
                        readmeContent = readmeContent.replace('<!-- CORE START-->', '<!-- CORE START-->\n' + link);
                    } else if (webpackInstance.resourcePath.match('ng2-alfresco-')) {
                        readmeContent = readmeContent.replace('<!-- CONTENT START-->', '<!-- CONTENT START-->\n' + link);
                    } else if (webpackInstance.resourcePath.match('ng2-activiti-')) {
                        readmeContent = readmeContent.replace('<!-- BUSINESS START-->', '<!-- BUSINESS START-->\n' + link);
                    }
                }
            }
        }


        var directiveReg = /(@Directive)(\s?)\((\s?){(\s?)((.|\n)*)}(\s?)\)/gm;
        var directiveSection = directiveReg.exec(currentFileContent);

        if (directiveSection) {
            var selectorReg = /(selector)(\s?):(\s?)('|")((.|)*)('|")/gm;
            var selector = selectorReg.exec(directiveSection[0]);

            if (selector) {
                var selector = selector[0].replace("selector: '[", "").replace("']", '').replace("]", '').replace("selector: '", "").replace("'", '');
                var removeRoot = webpackInstance.resourcePath.substr(webpackInstance.resourcePath.indexOf('/ng2-components') + 16, webpackInstance.resourcePath.length);
                var url = removeRoot.substr(0, removeRoot.indexOf('src')) + 'README.md';

                var link = '- [' + selector + '](' + url + ')';

                if (webpackInstance.resourcePath.match('ng2-alfresco-core')) {
                    readmeContent = readmeContent.replace('<!-- CORE DIRECTIVE START-->', '<!-- CORE DIRECTIVE START-->\n' + link);
                }
                //else if (webpackInstance.resourcePath.match('ng2-alfresco-')) {
                //    readmeContent = readmeContent.replace('<!-- CONTENT DIRECTIVE START-->', '<!-- CONTENT DIRECTIVE START-->\n' + link);
                //}
                //else if (webpackInstance.resourcePath.match('ng2-activiti-')) {
                //    readmeContent = readmeContent.replace('<!-- BUSINESS DIRECTIVE START-->', '<!-- BUSINESS DIRECTIVE START-->\n' + link);
                //}
            }
        }

        writeFile(readmeFilePath, readmeContent);

        return true;
    }
}


module.exports = function (input, map) {
    this.cacheable && this.cacheable();
    var callback = this.async();

    readmeFilePath = path.resolve(__dirname, '../../README.md');

    if (!readmeContent) {
        readmeContent = readFile(readmeFilePath);
    }

    if (readmeContent) {
        eraseContentList();
        generateListComponent(input, this);
    }
    callback(null, input, map);
}

