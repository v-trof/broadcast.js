"use strict";
var channel_ts_1 = require('./containers/channel.ts');
var id_generator_ts_1 = require('./utils/id_generator.ts');
var Broadcast = (function () {
    function Broadcast() {
        this.channels = {};
        this.channels_reach = {
            local: [],
            global: []
        };
        this.origin = '0';
        this.id_generator = new id_generator_ts_1.Id_generator;
        this.params = {
            max_history: 0
        };
    }
    Broadcast.prototype.create_channel = function (name, scope) {
        if (scope === void 0) { scope = 'local'; }
        var new_channel = new channel_ts_1.Channel();
        this.channels[name] = new_channel;
        this.channels_reach[scope].push(name);
        return new_channel;
    };
    Broadcast.prototype.get_time = function () {
        return 0;
    };
    return Broadcast;
}());
var a = new id_generator_ts_1.Id_generator;
var broadcast = new Broadcast();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = broadcast;
broadcast.create_channel;
