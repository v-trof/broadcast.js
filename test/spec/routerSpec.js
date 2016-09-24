describe('Router', function() {
  var router_message_recieved;
  beforeEach(function() {
    router_message_recieved = 0;
    broadcast.subscribe(test_name, function(value, message) {
      router_message_recieved = message;
    });
  });

  it('should route messages to the mediator', function() {
    var message_sent = new Broadcast._src.Message('this one should be routed', channel._host, test_name);
    broadcast._router.parse_message(message_sent);
    expect(router_message_recieved).toEqual(message_sent);
  });

  it('should keep the type of value while routing', function () {
    var message_sent = new Broadcast._src.Message(new File([""], 'filename'), channel._host, test_name);
    broadcast._router.parse_message(message_sent);
    expect(router_message_recieved.value).toBe(message_sent.value);
  });

});
