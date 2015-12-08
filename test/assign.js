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
            prop5: { type: String, readonly: true, default: 'no' },
            _hidden: String,
            outerProp: {
                innerProp: Number
            },
            arrOfProps: [{
                nestedProp: Number
            }]
        });
        testSchema.plugin(tools);
        var testModel = mongoose.model('Test', testSchema);

        var testChildSchema = new Schema({
            prop6: String
        });

        testChildSchema.plugin(tools);

        var testChildModel = testModel.discriminator('TestChild', testChildSchema);

        assertAssign(testModel, {
            _id: new Schema.Types.ObjectId,
            prop1: 1,
            prop3: true,
            _hidden: 'hey',
            outerProp: {
                innerProp: 3
            }
        }, {
            prop1: 1,
            prop3: true,
            outerProp: {
                innerProp: 3
            }
        });

        assertAssign(testChildModel, {
            prop3: true,
            prop5: 'bye',
            prop6: 'hello',
            outerProp: {
                innerProp: 3
            }
        }, {
            prop3: true,
            prop5: 'no',
            prop6: 'hello',
            outerProp: {
                innerProp: 3
            }
        });

        function assertAssign(model, actual, expected) {
            var testDoc = new model({
                arrOfProps: [{
                    nestedProp: 0
                }, {
                    nestedProp: 0
                }, {
                    nestedProp: 0
                }]
            });

            testDoc.assign(actual);

            var testObj = testDoc.toObject();

            testObj.should.not.have.property('_hidden');
            testObj.should.have.properties(expected);
        }
    });
});
