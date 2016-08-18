"use strict";
var core_ts_1 = require('../core.ts');
var History = (function () {
    function History() {
        this.values = [];
        this.reveal = {
            all: function (message_id) {
                return this.values;
            },
            scince: function (message_id) {
                var messages = [];
                var found = false;
                this.valeus.forEach(function (message) {
                    if (message.id === message_id)
                        found = true;
                    if (found)
                        messages.push(message);
                });
                return messages;
            },
            single: function (message_id) {
                this.valeus.forEach(function (message) {
                    if (message.id === message_id) {
                        return message;
                    }
                });
            },
        };
    }
    History.prototype.append = function (message) {
        if (this.values.length > core_ts_1.default.params.max_history) {
            this.values = this.values.slice(1);
        }
        this.values.push(message);
    };
    return History;
}());
exports.History = History;
