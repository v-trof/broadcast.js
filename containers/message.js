"use strict";
var core_ts_1 = require('../core.ts');
var Message = (function () {
    function Message(channel, value) {
        this.value = value;
        this.time = channel.get_time();
        this.id = channel.id_generator.new();
        this.origin = core_ts_1.default.origin;
    }
    return Message;
}());
exports.Message = Message;
