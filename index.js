/*
 * var tools = require('mongoose-schema-tools')
 * var MySchema = new Schema({...});
 * MySchema.plugin(tools.plugin);
 *
 * @param {Object} schema
 */
var _ = require('lodash');
var PROTECTED_REGEXP = /^([^\.]*\.)*_/;

module.exports = function (schema, options) {
    options = options || {};
    schema.methods.assign = function (source) {
        var doc = this;
        schema.eachPath(function (path, def) {
            var isProtected = PROTECTED_REGEXP.test(path);
            if (!_.has(source, path) || def.options.readonly || isProtected || (options.ignore && options.ignore === path))
                return;
            doc.set(path, _.get(source, path));
        });
    };
};
