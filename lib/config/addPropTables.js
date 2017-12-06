var fs = require('fs');
var path = require('path');

var docDataFilePath = 'docs';
var docDataFileName = 'documentation.json';

var mdSourceFolder = 'docs';


function initialCap(str) {
    return str[0].toUpperCase() + str.substr(1);
}


function fixCompodocFilename(rawName) {
	var name = rawName.replace(/\]|\(|\)/g, '');
	
    var fileNameSections = name.split('.');
    var compNameSections = fileNameSections[0].split('-');
    
    var outCompName = '';
    
    for (var i = 0; i < compNameSections.length; i++) {
        outCompName = outCompName + initialCap(compNameSections[i]);
    }
    
    var itemTypeIndicator = '';
    
    if (fileNameSections.length > 1) {
        itemTypeIndicator = initialCap(fileNameSections[1]);
    }
	
    var finalName = outCompName + itemTypeIndicator;
	
    return finalName;
}


function replacePropSection(text, replacementText) {
    var propStartMarker = '<!-- propsection start -->';
    var propEndMarker = '<!-- propsection end -->';
    var contentRegex = new RegExp('(?:' + propStartMarker + ')([\\s\\S]*)(?:' + propEndMarker + ')');
    return text.replace(contentRegex, propStartMarker + '\n' + replacementText + propEndMarker);
}

function buildClassNameDict(mainData) {
    var result = {};

    for (var i = 0; i < mainData.components.length; i++) {
        result[mainData.components[i].name] = mainData.components[i];
    }

    return result;
}


function makePropsTable(props) {
    if (props.length === 0) {
        return '';
    }

    var result = '';

    result += '### Properties\n\n';
    result += '| Name | Type | Default value | Description |\n';
    result += '| -- | -- | -- | -- |\n';
    
    for (var i = 0; i < props.length; i++){
        var pName = props[i].name;
        var pType = props[i].type;
        var pDefault = props[i].defaultValue || '';
        var pDesc = props[i].description;

        if (pDesc) {
            pDesc = pDesc.trim().replace(/[\n\r]+/, ' ');
        }

        result += `| ${pName} | ${pType} | ${pDefault} | ${pDesc} |\n`;
    }

    return result;
}

function makeEventsTable(events) {
    var result = '';

    result += '### Events\n\n';
    result += '| Name | Type | Description |\n';
    result += '| -- | -- | -- |\n';
    
    for (var i = 0; i < events.length; i++){
        var eName = events[i].name;
        var eType = events[i].type;
        var eDesc = events[i].description;

        if (eDesc) {
            eDesc = eDesc.trim().replace(/[\n\r]+/, ' ');
        }

        result += `| ${eName} | ${eType} | ${eDesc} |\n`;
    }

    return result;
}

var docData = JSON.parse(fs.readFileSync(path.resolve('..', docDataFilePath, docDataFileName)));
var classNameDict = buildClassNameDict(docData);

var mdFiles = fs.readdirSync(path.resolve('..', mdSourceFolder));

for (var i = 0; i < mdFiles.length; i++) {
    var currFileName = mdFiles[i];

    if (currFileName.match(/component/)) {
        var className = fixCompodocFilename(currFileName);

        var classDocs = classNameDict[className];

        var propsText = '';

        if (classDocs) {
            if (classDocs.inputsClass && classDocs.inputsClass.length > 0) {
                propsText += makePropsTable(classDocs.inputsClass);
            }

            if (classDocs.outputsClass && classDocs.outputsClass.length > 0) {
                if (classDocs.inputsClass && classDocs.inputsClass.length > 0) {
                    propsText += '\n';
                }

                propsText += makeEventsTable(classDocs.outputsClass);
            }
        }

        var currFilePath = path.resolve('..', mdSourceFolder, currFileName);

        var mdText = fs.readFileSync(currFilePath, 'utf8');

        mdText = replacePropSection(mdText, propsText);

        fs.writeFileSync(currFilePath, mdText);
    }
}


