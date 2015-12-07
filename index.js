/**
 * flatten
 *
 * @param {Object} val a js native object that resembles a mongoose model
 */
var flatten = exports.flatten = function (val) {
    var acc = {};
    for (var key in val) {
        var isSubset = (val[key] instanceof Object) &&
            !('_id' in val[key]) &&
            !(val[key] instanceof Array);
        if (isSubset) {
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
 * MySchema.plugin(tools.plugin);
 *
 * @param {Object} schema
 */
module.exports.plugin = exports.plugin = function (schema) {
    schema.methods.assign = function (source) {
        var doc = this;
        source = flatten(source);
        schema.eachPath(function (path, def) {
            var isReadonly = !/^([^\.]\.)*_id$/.test(path) &&
                !def.options.readonly;
            if (isReadonly) {
                doc.set(path, source[path]);
            }
        });
    };
};
