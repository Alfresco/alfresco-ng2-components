const cpx = require('cpx');

//Workaround for https://github.com/angular/angular-cli/issues/8783
//we copy before the files in dist-dev-temp in the demo shell and after we let the angular cli watch over them..double wathh necessary for dev mode

cpx.watch('../lib/core/prebuilt-themes/**/*.*', './dist-dev-temp/assets/prebuilt-themes')
cpx.watch('../lib/core/assets/**/*.*', './dist-dev-temp/assets/' )
cpx.watch('../lib/process-services/assets/**/*.*', './dist-dev-temp/assets/' )
cpx.watch('../lib/content-services/assets/**/*.*', './dist-dev-temp/assets/' )

cpx.watch('../lib/core/i18n/**/*.*', './dist-dev-temp//assets/adf-core/i18n' )
cpx.watch('../lib/process-services/i18n/**/*.*', './dist-dev-temp/assets/adf-process-services/i18n' )
cpx.watch('../lib/content-services/i18n/**/*.*', './dist-dev-temp/assets/adf-content-services/i18n' )
cpx.watch('../lib/insights/i18n/**/*.*', './dist-dev-temp//assets/adf-insights/i18n' )
