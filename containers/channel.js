"use strict";
var message_ts_1 = require('./message.ts');
var id_generator_ts_1 = require('../utils/id_generator.ts');
var history_ts_1 = require('./history.ts');
var Channel = (function () {
    function Channel() {
        this.history = new history_ts_1.History();
        this.id_generators = {
            message: new id_generator_ts_1.Id_generator,
            subscribers: new id_generator_ts_1.Id_generator
        };
    }
    Channel.prototype.post = function (message_value) {
        var message = new message_ts_1.Message(message_value);
        message.id = this.id_generators.message.new();
        this.history.append(message);
        this.subscribers.forEach(function (subscriber) {
            return subscriber.react(message);
        });
    };
    Channel.prototype.subscibe = function (subscriber) {
        subscriber.id = this.id_generators.subscribers.new();
        this.subscribers.push(subscriber);
    };
    return Channel;
}());
exports.Channel = Channel;
