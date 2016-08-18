"use strict";
var core_ts_1 = require('../core.ts');
var Subscriber = (function () {
    function Subscriber(reaction) {
        this.id = core_ts_1.default.id_generator.new();
        this.react = reaction;
    }
    return Subscriber;
}());
exports.Subscriber = Subscriber;
