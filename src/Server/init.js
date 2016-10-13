var Router = require('./Router');

//Will be Broadcast.init
module.exports = function(args, max_failures) {
  var broadcast = Broadcast.init();
  broadcast._router = new Router(broadcast);

  // broadcast._router.on.get_origin = function(origin) {
  //   broadcast.origin = origin;
  // }
  //
  // broadcast._router.on.get_time = function(time) {
  //   broadcast.time = time;
  // }

  return broadcast;
}
