/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var FormDefinitionFieldModel = require('./FormDefinitionFieldModel');

var FormDefinitionModel = function (fields) {

    var fields = null;
    var widgets = null;

    this.setFields = function (arr) {
        fields = arr.map(function(item) {
            return new FormDefinitionFieldModel(item);
        })
    };

    this.setAllWidgets = function (arr) {
        widgets = arr.reduce(function(acc, item) {
            if(item.type === 'container') {
                var children = Object.keys(item.fields).map(function(key) {
                    return item.fields[key][0];
                });

                return acc.concat(children);
            }
            return acc.concat(item);
        }, []);
    };

    this.getWidgets = function () {
        return widgets;
    };

    this.getWidgetBy = function (key, value) {
        return widgets.find(function(widget) {
            return widget[key]===value;
        })
    };

    this.findFieldBy = function(key, value) {
        return fields.find(function(field) {
            return field[key]===value;
        })
    };
};

module.exports = FormDefinitionModel;
