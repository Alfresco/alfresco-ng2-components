module.exports = {
    ngNameToDisplayName: ngNameToDisplayName,
    ngNameToClassName: ngNameToClassName,
    dekebabifyName: dekebabifyName,
    kebabifyClassName: kebabifyClassName,
    classTypes: ['component', 'dialog', 'directive', 'model', 'pipe', 'service', 'widget']
};

function ngNameToDisplayName(ngName) {
    const mainSections = ngName.split('.');
    mainSections[0] = dekebabifyName(mainSections[0]);
    return mainSections.join(' ');
}

function initialCap(str) {
    return str[0].toUpperCase() + str.substr(1);
}

function ngNameToClassName(rawName, nameExceptions) {
    if (nameExceptions[rawName]) return nameExceptions[rawName];

    const name = rawName.replace(/\]|\(|\)/g, '');

    const fileNameSections = name.split('.');
    const compNameSections = fileNameSections[0].split('-');

    let outCompName = '';

    for (let i = 0; i < compNameSections.length; i++) {
        outCompName = outCompName + initialCap(compNameSections[i]);
    }

    let itemTypeIndicator = '';

    if (fileNameSections.length > 1) {
        itemTypeIndicator = initialCap(fileNameSections[1]);
    }

    return outCompName + itemTypeIndicator;
}

function dekebabifyName(name) {
    let result = name.replace(/-/g, ' ');
    result = result.substr(0, 1).toUpperCase() + result.substr(1);
    return result;
}

function kebabifyClassName(name) {
    let result = name.replace(/(Component|Directive|Interface|Model|Pipe|Service|Widget)$/, (match) => {
        return '.' + match.toLowerCase();
    });

    result = result.replace(/([A-Z])/g, '-$1');
    return result.substr(1).toLowerCase();
}
