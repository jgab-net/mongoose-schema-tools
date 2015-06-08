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

        var boilerplate = testDoc.toObject();

        boilerplate.arrOfProps[0].nestedProp = 1;
        boilerplate.arrOfProps[1].nestedProp = 2;
        boilerplate.arrOfProps[2].nestedProp = 0;

        testDoc.assign({
            _id: new Schema.Types.ObjectId,
            prop1: 1,
            prop3: true,
            arrOfProps: [{
                _id: new Schema.Types.ObjectId,
                nestedProp: 1
            }, {
                nestedProp: 2
            }, {
                _id: new Schema.Types.ObjectId,
            }]
        });

        var testObj = testDoc.toObject();

        testObj.should.have.properties(boilerplate);
    });
});
