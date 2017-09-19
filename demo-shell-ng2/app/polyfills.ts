/* tslint:disable */

import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import 'intl';

require('element.scrollintoviewifneeded-polyfill'); // IE/FF

if (process.env.ENV === 'production') {
    // Production

} else {
    // Development

    Error['stackTraceLimit'] = Infinity;

    require('zone.js/dist/long-stack-trace-zone');
}
