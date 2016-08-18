"use strict";
var core_ts_1 = require('../core.ts');
var Message = (function () {
    function Message(value) {
        this.value = value;
        this.time = core_ts_1.default.get_time();
        this.origin = core_ts_1.default.origin;
    }
    return Message;
}());
exports.Message = Message;
core_ts_1.default.create_channel;
