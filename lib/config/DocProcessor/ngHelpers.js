module.exports = {
    "ngNameToDisplayName": ngNameToDisplayName,
    "dekebabifyName": dekebabifyName,
    "kebabifyClassName": kebabifyClassName,
    "classTypes": ["component", "directive", "model", "pipe", "service", "widget"]
}


function ngNameToDisplayName(ngName) {
    var mainSections = ngName.split(".");
    mainSections[0] = dekebabifyName(mainSections[0]);
    return mainSections.join(" ");
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