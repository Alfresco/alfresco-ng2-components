var fs = require('fs');
var file = require('../package.json');


Object.keys(file.dependencies).forEach((currentDep)=>{

    if(currentDep.indexOf("@alfresco/adf-")>=0) {
        delete file.dependencies[currentDep];
    }
});

fs.writeFileSync('package.json', JSON.stringify(file), function (err) {
    if (err) return console.log(err);
});
