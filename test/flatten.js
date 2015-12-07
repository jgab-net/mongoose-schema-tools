var tools = require('../'),
    should = require('should');

describe('complex flatten operation', function () {
    it('checks that the flatten is done correctly', function () {
        var flattened = tools.flatten({
            a: 1,
            b: {
                c: {
                    d: 2
                },
                e: 3,
                f: 4,
                g: {
                    h: {
                        _id: 5
                    },
                    i: 6
                }
            },
            j: {
                _id: 7
            },
            k: [{
                l: 8,
                m: [{
                    n: 9
                }],
                o: {
                    p: 10
                }
            }]
        });

        flattened.should.have.properties({
            'a': 1,
            'b.c.d': 2,
            'b.e': 3,
            'b.f': 4,
            'b.g.h': {
                _id: 5
            },
            'b.g.i': 6,
            'j': {
                _id: 7
            },
            'k': [{
                l: 8,
                m: [{
                    n: 9
                }],
                o: {
                    p: 10
                }
            }]
        });
    });
});
