Broadcast.init = function (server_url, max_failures) {
  var broadcast = new Broadcast(max_failures);
  broadcast._router = Broadcast._src.Router.init(broadcast, server_url);

  return broadcast;
}
