var tools = require('../'),
    should = require('should'),
    mongoose = require('mongoose');

describe('assigns a source object to a target doc', function () {
    it('checks that no _id is assigned', function () {
        var Schema = mongoose.Schema;
        var testSchema = new Schema({
            prop1: Number,
            prop2: String,
            prop3: Boolean,
            prop4: Schema.Types.ObjectId,
            outerProp: {
                innerProp: Number
            },
            arrOfProps: [{
                nestedProp: Number
            }]
        });
        testSchema.plugin(tools.plugin);
        var testModel = mongoose.model('Test', testSchema);

        var testDoc = new testModel({
            arrOfProps: [{
                nestedProp: 0
            }, {
                nestedProp: 0
            }, {
                nestedProp: 0
            }]
        });

        var boilerplate = {
            prop1: 1,
            prop3: true,
            outerProp: {
                innerProp: 3
            }
        };

        testDoc.assign({
            _id: new Schema.Types.ObjectId,
            prop1: 1,
            prop3: true,
            outerProp: {
                innerProp: 3
            }
        });

        var testObj = testDoc.toObject();

        testObj.should.have.properties(boilerplate);
    });
});
