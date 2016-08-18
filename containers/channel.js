"use strict";
var message_ts_1 = require('./message.ts');
var id_generator_ts_1 = require('../utils/id_generator.ts');
var history_ts_1 = require('./history.ts');
var Channel = (function () {
    function Channel() {
        this.id_generators = new id_generator_ts_1.Id_generator;
        this.history = new history_ts_1.History();
    }
    Channel.prototype.post = function (message_value) {
        var message = new message_ts_1.Message(message_value);
        message.id = this.id_generators.new();
        this.history.append(message);
        for (var id in this.subscribers) {
            this.subscribers[id].react(message);
        }
    };
    Channel.prototype.subscibe = function (subscriber) {
        var id = subscriber.id;
        this.subscribers[id] = subscriber;
    };
    Channel.prototype.unsubscribe = function (id) {
        delete this.subscribers[id];
    };
    return Channel;
}());
exports.Channel = Channel;
