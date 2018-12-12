module.exports = {
    "ngNameToDisplayName": ngNameToDisplayName,
    "ngNameToClassName": ngNameToClassName,
    "dekebabifyName": dekebabifyName,
    "kebabifyClassName": kebabifyClassName,
    "classTypes": ["component", "dialog", "directive", "model", "pipe", "service", "widget"]
}


function ngNameToDisplayName(ngName) {
    var mainSections = ngName.split(".");
    mainSections[0] = dekebabifyName(mainSections[0]);
    return mainSections.join(" ");
}


function initialCap(str) {
    return str[0].toUpperCase() + str.substr(1);
}


function ngNameToClassName(rawName, nameExceptions) {
    if (nameExceptions[rawName])
        return nameExceptions[rawName];

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

function displayNameToNgName(name) {
    var noSpaceName = ngName.replace(/ ([a-zA-Z])/, "$1".toUpperCase());
    return noSpaceName.substr(0, 1).toUpperCase() + noSpaceName.substr(1);
}


function dekebabifyName(name) {
    var result = name.replace(/-/g, " ");
    result = result.substr(0, 1).toUpperCase() + result.substr(1);
    return result;
}

function kebabifyClassName(name) {
    var result = name.replace(/(Component|Directive|Interface|Model|Pipe|Service|Widget)$/, match => {
        return "." + match.toLowerCase();
    });

    result = result.replace(/([A-Z])/g, "-$1");
    return result.substr(1).toLowerCase();
}