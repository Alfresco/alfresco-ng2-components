import {
  Rule, SchematicsException,
  apply, chain, mergeWith, move, template, url
} from '@angular-devkit/schematics';



export function docpage(options: any): Rule {
  let nameParts = options.name.match(/([a-zA-Z-0-9_\-]+)\.(component|directive|interface|model|pipe|service|widget)/);
  
  if (!nameParts) {
    throw new SchematicsException('Doc filename in wrong format. Must be "lib-name/file-name.type.md"');
  }

  let libFolder = options.path.match(/\/([a-zA-Z-0-9_\-]+)/)[1];

  if (!libFolder.match(/content-services|core|process-services|insights/)) {
    throw new SchematicsException(`Folder "${libFolder}" is not a valid ADF library (must be "content-services", "core", "process-services" or "insights".`);
  }

  let templateContext = {
      "name": options.name,
      "basename": nameParts[1],
      "displayName": dekebabifyName(nameParts[1]),
      "type": nameParts[2]
  }
 
  const templateSource = apply(url('./templates'), [
    template(templateContext),
    move("docs/" + libFolder)
  ]);
 
  return chain([
    mergeWith(templateSource)
  ]);
      
}


function dekebabifyName(name: string) {
  var result = name.replace(/-/g, " ");
  result = result.substr(0, 1).toUpperCase() + result.substr(1);
  return result;
}