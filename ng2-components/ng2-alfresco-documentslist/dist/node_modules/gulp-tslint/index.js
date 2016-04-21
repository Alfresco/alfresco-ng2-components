/*jshint node:true */
/*jshint nomen: true */
"use strict";

// Requires
var path = require('path');
var TSLint = require('tslint');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var map = require('map-stream');
var through = require('through');

// Load rc configs
var Rcloader = require('rcloader');

/**
 * Helper function to check if a value is a function
 * @param {any} value to check whether or not it is a function.
 * @returns {boolean} Returns true if the value is a function.
 */
function isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]';
}

/**
 * Returns the TSLint from the options, or if not set, the default TSLint.
 * @param {Object} options
 * @returns {Object} TSLint module
 */
function getTslint(options) {
    if (options && options.tslint) {
        return options.tslint;
    }
    return TSLint;
}

/**
 * Log an event or error using gutil.log.
 * @param {string} message the log message.
 * @param {string} level can be "error". Leave empty for the default logging type.
 */
function log(message, level) {
    var prefix = "[" + gutil.colors.cyan("gulp-tslint") + "]";

    if (level === "error") {
        gutil.log(prefix, gutil.colors.red("error"), message);
    } else {
        gutil.log(prefix, message);
    }
}

/**
 * Main plugin function
 * @param {Object} pluginOptions contains the options for gulp-tslint.
 */
var tslintPlugin = function(pluginOptions) {
    var loader;
    var tslint;

    // If user options are undefined, set an empty options object
    if (!pluginOptions) {
        pluginOptions = {};
    }

    // Create rcloader to load tslint.json
    loader = new Rcloader('tslint.json', pluginOptions.configuration);

    return map(function(file, cb) {
        // Skip
        if (file.isNull()) {
            return cb(null, file);
        }

        // Stream is not supported
        if (file.isStream()) {
            return cb(new PluginError('gulp-tslint', 'Streaming not supported'));
        }

        // Finds the config file closest to the linted file
        loader.for(file.path, function(error, fileopts) {
            // TSLint default options
            var options = {
                formatter: 'json',
                configuration: fileopts,
                rulesDirectory: pluginOptions.rulesDirectory || null,
                formattersDirectory: null // not used, use reporters instead
            };

            if (error) {
                return cb(error, undefined);
            }

            var linter = getTslint(pluginOptions);
            tslint = new linter(file.relative, file.contents.toString('utf8'), options);
            file.tslint = tslint.lint();

            // Pass file
            cb(null, file);
        });
    });
};

/*
 * Convert a failure to the prose error format.
 * @param {Object} failure
 * @returns {string} The failure in the prose error formar.
 */
var proseErrorFormat = function(failure) {
    // line + 1 because TSLint's first line and character is 0
    return failure.name + '[' + (failure.startPosition.line + 1) + ', ' +
        (failure.startPosition.character + 1) + ']: ' + failure.failure;
};

/**
 * Define default reporters
 */

 /**
  * JSON error reporter.
  * @param {Array<object>} failures
  */
var jsonReporter = function(failures) {
    log(JSON.stringify(failures), "error");
};

 /**
  * Prose error reporter.
  * @param {Array<object>} failures
  */
var proseReporter = function(failures) {
    failures.forEach(function(failure) {
        log(proseErrorFormat(failure), "error");
    });
};

 /**
  * Verbose error reporter.
  * @param {Array<object>} failures
  */
var verboseReporter = function(failures) {
    failures.forEach(function(failure) {
        // line + 1 because TSLint's first line and character is 0
        log('(' + failure.ruleName + ') ' + failure.name +
            '[' + (failure.startPosition.line + 1) + ', ' +
            (failure.startPosition.character + 1) + ']: ' +
            failure.failure, "error");
    });
};

 /**
  * Full error reporter. Like verbose, but prints full path.
  * @param {Array<object>} failures
  */
var fullReporter = function(failures, file) {
    failures.forEach(function(failure) {
        // line + 1 because TSLint's first line and character is 0
        log('(' + failure.ruleName + ') ' + file.path +
            '[' + (failure.startPosition.line + 1) + ', ' +
            (failure.startPosition.character + 1) + ']: ' +
            failure.failure, "error");
    });
};

 /**
  * MsBuild Format error reporter.
  * @param {Array<object>} failures
  */
var msbuildReporter = function(failures, file) {
    failures.forEach(function(failure) {
        var positionTuple = "(" + (failure.startPosition.line + 1) + "," + (failure.startPosition.character + 1) + ")";
        console.log(file.path + positionTuple + ": warning " + failure.ruleName + ": " + failure.failure);
    });
};

// Export proseErrorFormat function
tslintPlugin.proseErrorFormat = proseErrorFormat;

/* Output is in the following form:
 * [{
 *   "name": "invalid.ts",
 *   "failure": "missing whitespace",
 *   // Lines and characters start from 0
 *   "startPosition": {"position": 8, "line": 0, "character": 8},
 *   "endPosition": {"position": 9, "line": 0, "character": 9},
 *   "ruleName": "one-line"
 * }]
 */
tslintPlugin.report = function(reporter, options) {
    // Default options
    if (!options) {
        options = {};
    }
    if (options.emitError === undefined) {
        options.emitError = true;
    }
    if (options.reportLimit === undefined) {
        // 0 or less is unlimited
        options.reportLimit = 0;
    }
    if (options.summarizeFailureOutput === undefined){
        options.summarizeFailureOutput = false;
    }

    // Collect all files with errors
    var errorFiles = [];

    // Collect all failures
    var allFailures = [];

    // Track how many errors have been reported
    var totalReported = 0;

    // Run the reporter for each file individually
    var reportFailures = function(file) {
        var failures = JSON.parse(file.tslint.output);
        if (failures.length > 0) {
            errorFiles.push(file);
            Array.prototype.push.apply(allFailures, failures);

            if (options.reportLimit <= 0 || (options.reportLimit && options.reportLimit > totalReported)) {
                totalReported += failures.length;
                if (reporter === 'json') {
                    jsonReporter(failures, file, options);
                } else if (reporter === 'prose') {
                    proseReporter(failures, file, options);
                } else if (reporter === 'verbose') {
                    verboseReporter(failures, file, options);
                } else if (reporter === 'full') {
                    fullReporter(failures, file, options);
                } else if (reporter === 'msbuild') {
                    msbuildReporter(failures, file, options);
                } else if (isFunction(reporter)) {
                    reporter(failures, file, options);
                }

                if (options.reportLimit > 0 && options.reportLimit <= totalReported) {
                    log('More than ' + options.reportLimit + ' failures reported. Turning off reporter.');
                }
            }
        }

        // Pass file
        this.emit('data', file);
    };

    /**
     * After reporting on all files, throw the error.
     */
    var throwErrors = function() {
        // Throw error
        if (options && options.emitError === true && errorFiles.length > 0) {
            var failuresToOutput = allFailures;
            var ignoreFailureCount = 0;

            // If error count is limited, calculate number of errors not shown and slice reportLimit
            // number of errors to be included in the error.
            if (options.reportLimit > 0) {
                ignoreFailureCount = allFailures.length - options.reportLimit;
                failuresToOutput = allFailures.slice(0, options.reportLimit);
            }

            // Always use the proseErrorFormat for the error.
            var failureOutput = failuresToOutput.map(function(failure) {
                return proseErrorFormat(failure);
            }).join(', ');

            var errorOutput = 'Failed to lint: ';
            if (options.summarizeFailureOutput) {
                errorOutput += failuresToOutput.length + ' errors.';
            }
            else {
                errorOutput += failureOutput + '.';
            }
            if (ignoreFailureCount > 0) {
                errorOutput += ' (' + ignoreFailureCount + ' other errors not shown.)';
            }
            return this.emit('error', new PluginError('gulp-tslint', errorOutput));
        }

        // Notify through that we're done
        this.emit('end');
    };

    return through(reportFailures, throwErrors);
};

module.exports = tslintPlugin;
