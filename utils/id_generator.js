"use strict";
var Id_generator = (function () {
    function Id_generator() {
        this.next_id = 0;
    }
    Id_generator.prototype.new = function () {
        this.next_id++;
        return this.next_id - 1;
    };
    return Id_generator;
}());
exports.Id_generator = Id_generator;
