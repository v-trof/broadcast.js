describe('Router', function() {
  var router_message_recieved;
  beforeEach(function() {
    router_message_recieved = 0;
    broadcast.subscribe(test_name, function(value, message) {
      router_message_recieved = message;
    });
  });

  it('should route messages to the mediator', function() {
    var message_sent = new Broadcast._src.Message('this one should be routed',
      channel._host, test_name);
    broadcast._router.parse_message(message_sent);
    expect(router_message_recieved).toEqual(message_sent);
  });

  it('should keep the type of value while routing', function () {
    var message_sent = new Broadcast._src.Message(new File([""], 'filename'),
      channel._host, test_name);
    broadcast._router.parse_message(message_sent);
    expect(router_message_recieved.value).toBe(message_sent.value);
  });

  describe('Should parse incoming internal events', function() {
    it('init', function() {
      var new_upstart = new Date();
      var new_origin = Math.floor(Math.random() * 100 + 1) + 1;
      var message_sent = new Broadcast._src.InternalEvent('init', {
        upstart: new_upstart,
        origin: new_origin
      }, broadcast);
      broadcast._router.parse_message(message_sent);
      expect(broadcast._time.upstart).toEqual(new_upstart);
      expect(broadcast.origin).toEqual(new_origin);
    });

    it('history_sync', function() {
      var temp_broadcast = new Broadcast();
      var temp_channel = temp_broadcast._create_channel('historygen');
      for (var i=0; i<110; i++) {
        temp_broadcast.post('historygen', i.toString());
      }
      var new_history = temp_channel.history.all();
      var message_sent = new Broadcast._src.InternalEvent('history_sync', {
        channel_name: test_name,
        messages: new_history
      }, broadcast);
      /* we simulate that sample_message was sent later
         than any message in 'historygen' channel */
      broadcast._time.upstart = +new Date() - 20;
      var sample_message = broadcast.post(test_name, 'sample message')
      broadcast._router.parse_message(message_sent);
      var merged_history = channel.history.all();
      var since_sample = channel.history.since(sample_message);
      expect(merged_history.length).toEqual(100);
      expect(since_sample.length).toEqual(1);
    });
  });

  describe('Should route outcoming internal events', function() {
    var event_type, request;
    beforeEach(function() {
      spyOn(broadcast._router._socket_adapter, 'send').and
        .callFake(function(internal_event) {
        event_type = internal_event.event_type;
        request = internal_event.value;
      });
    });

    it('init', function() {
      broadcast._router.get_init_data();
      expect(event_type).toEqual('init');
      expect(request).toBeNull();
    });

    it('relevancy', function() {
      var name = channel._name;
      broadcast._router.set_relevancy(name, false);
      expect(event_type).toEqual('relevancy');
      expect(request.channel).toEqual(name);
      expect(request.toggle).toBeFalsy();
    });
  });

  it('should sync all messages in global channels to a remote', function() {
    var value, channel_name;
    spyOn(broadcast._router._socket_adapter, 'send').and
      .callFake(function(message) {
       value = message.value;
       channel_name = message.channel_name;
    });
    var global_name = 'global_test';
    broadcast._create_channel(global_name, 'global');
    var sent = broadcast.post(global_name,
      'this should be synced to a remote mediator through router');
    expect(value).toEqual(sent.value);
    expect(channel_name).toEqual(channel_name);
  });

  it('should not sync local channels', function() {
    spyOn(broadcast._router._socket_adapter, 'send');
    broadcast.post(test_name, 'this one wouldn\'t be synced');
    expect(broadcast._router._socket_adapter.send).not.toHaveBeenCalled();
  });

  it('should not redirect incoming messages with a different origin back', function() {
    spyOn(broadcast._router._socket_adapter, 'send');
    var global_name = 'global_test';
    broadcast._create_channel(global_name, 'global');
    var incoming_message = new Broadcast._src.Message('this one is incoming from a different origin',
      broadcast, global_name);
    incoming_message.origin = 1;
    broadcast._router.parse_message(incoming_message);
    expect(broadcast._router._socket_adapter.send).not.toHaveBeenCalled();
  });
});
