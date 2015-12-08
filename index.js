/*
 * var tools = require('mongoose-schema-tools')
 * var MySchema = new Schema({...});
 * MySchema.plugin(tools.plugin);
 *
 * @param {Object} schema
 */
module.exports = function (schema) {
    schema.methods.assign = function (source) {
        var doc = this;
        source = module.exports.flatten(source);
        schema.eachPath(function (path, def) {
            var isReadable = !/^([^\.]\.)*_+\w+$/.test(path) &&
                !def.options.readonly;
            if (isReadable) {
                doc.set(path, source[path]);
            }
        });
    };
};

/**
* flatten
*
* @param {Object} val a js native object that resembles a mongoose model
*/
var flatten = module.exports.flatten = function (val) {
    var acc = {};
    for (var key in val) {
        if (val[key] instanceof Object &&
            !('_id' in val[key]) &&
            !(val[key] instanceof Array)) {
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
