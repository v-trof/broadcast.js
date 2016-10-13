Broadcast.init = function (server_url, max_failures) {
  var broadcast = new Broadcast(max_failures);
  broadcast._router = new Broadcast._src.Router(broadcast, server_url);

  return broadcast;
}
