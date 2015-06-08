/*
 * flatten({ a: 1, b: { c: 2, d: { e: 3 } } }) -> { a: 1, 'b.c': 2, 'b.d.e': 3 }
 */
var flatten = exports.flatten = function (val) {
    var acc = {};
    for (var key in val) {
        if (val[key] instanceof Object) {
            var subset = flatten(val[key]);
            for (var subkey in subset) {
                acc[key + '.' + subkey] = subset[subkey];
            }
        } else {
            acc[key] = val[key];
        }
    }
    return acc;
};

/*
 * var tools = require('mongoose-schema-tools')
 * var MySchema = new Schema({...});
 * MySchema.plugin(tools);
 */

module.exports = exports = function lastModifiedPlugin (schema, options) {

    schema.methods.assign = function (source) {
        source = flatten(source);
        for (var key in source) {
            if (key.split('.').reverse()[0] !== '_id') {
                var attr = this.schema.path(key);
                if (attr &&
                    attr.options.select !== false &&
                    !attr.options.readonly)
                    this[key] = source[key];
            }
        }
    };
};
