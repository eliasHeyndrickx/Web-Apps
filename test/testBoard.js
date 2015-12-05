var expect = require("chai").expect;

var app     = require("./../server.js");
var request = require('supertest');

var agent   = request.agent(app);

describe("GET /boards", function() {
    it('should respond with 200 in case of valid request', function() {
        agent.get('/boards')
            .send()
            .end(function(err, res) {
                // Check if get a board array
                expect(res.text).to.be.an("array");
                done();
            });
    });
});