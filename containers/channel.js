"use strict";
var id_generator_ts_1 = require('../utils/id_generator.ts');
var Channel = (function () {
    function Channel() {
        this.id_generator = new id_generator_ts_1.Id_generator;
    }
    return Channel;
}());
exports.Channel = Channel;
