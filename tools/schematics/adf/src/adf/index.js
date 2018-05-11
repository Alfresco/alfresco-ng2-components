"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
function docpage(options) {
    let nameParts = options.name.match(/([a-zA-Z-0-9_\-]+)\.(component|directive|interface|model|pipe|service|widget)/);
    if (!nameParts) {
        throw new schematics_1.SchematicsException('Doc filename in wrong format. Must be "lib-name/file-name.type.md"');
    }
    let libFolder = options.path.match(/\/([a-zA-Z-0-9_\-]+)/)[1];
    if (!libFolder.match(/content-services|core|process-services|insights/)) {
        throw new schematics_1.SchematicsException(`Folder "${libFolder}" is not a valid ADF library (must be "content-services", "core", "process-services" or "insights".`);
    }
    let templateContext = {
        "name": options.name,
        "basename": nameParts[1],
        "displayName": dekebabifyName(nameParts[1]),
        "type": nameParts[2]
    };
    const templateSource = schematics_1.apply(schematics_1.url('./templates'), [
        schematics_1.template(templateContext),
        schematics_1.move("docs/" + libFolder)
    ]);
    return schematics_1.chain([
        schematics_1.mergeWith(templateSource)
    ]);
}
exports.docpage = docpage;
function dekebabifyName(name) {
    var result = name.replace(/-/g, " ");
    result = result.substr(0, 1).toUpperCase() + result.substr(1);
    return result;
}
//# sourceMappingURL=index.js.map