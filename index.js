/*
 * flatten({ a: 1, b: { c: 2, d: { e: 3 } } }) -> { a: 1, 'b.c': 2, 'b.d.e': 3 }
 */
exports.flatten = function (val) {
    var acc = {};
    for (var key in val) {
        if (val[key] instanceof Object) {
            var subset = exports.flatten(val[key]);
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
 * var MySchema = new Schema({...});
 * MySchema.methods.assign = require('mongoose-schema-tools').assign(MySchema);
 */
exports.assign = function (schema) {
    return function (source) {
        source = exports.flatten(source);
        for (var key in source) {
            if (key.split('.').reverse()[0] !== '_id') {
                var attr = schema.path(key),
                if (attr &&
                    attr.options.select !== false &&
                    !attr.options.readonly)
                    this[key] = source[key];
            }
        }
    };
};
