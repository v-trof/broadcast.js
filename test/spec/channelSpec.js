describe('Channel', function() {
  var broadcast,
      channel;
  var subscriber,
      bad_subscriber;
  var message_recived;

  var test_name = 'test';

  beforeEach(function() {
    //test Broadcast instance
    broadcast = new Broadcast();
    channel = broadcast._create_channel(test_name);
  });

  it('should be deleteable', function() {
    broadcast._delete_channel(test_name);
    expect(broadcast._channels).not.toContain(channel);
  });

  it('should be editable', function() {
    broadcast.edit_channel(test_name, {scope: 'global'});
    expect(channel.scope).toEqual('global');

    broadcast.edit_channel(test_name, {
      scope: 'local',
      max_failures: 100
    });

    expect(channel.scope).toEqual('local');
    expect(channel.max_failures).toEqual(100);
  });

  it('should allow subscribtion', function() {
    subscriber = broadcast.subscribe(test_name, function(value, message) {
      message_recived = message;
    });

    broadcast.post(test_name, 'val');
    expect(message_recived.value).toEqual('val');
    expect(message_recived.value).not.toEqual('wrong val');
  });

  describe('Max failures', function() {
    it('should be 5 by default', function() {
      expect(broadcast._channels[test_name].max_failures).toEqual(5);
    });

    it('can be custom', function() {
      for(var i=0; i<100; i++) {
        var another_broadcast = new Broadcast(i);
        var another_channel = another_broadcast._create_channel(test_name);
        expect(another_broadcast._channels[test_name].max_failures).toEqual(i);
      }
    });
  });

  describe('Scope', function() {
    it('should be local by default', function() {
      expect(channel.scope).toEqual('local');
    });

    it('can be global', function() {
      channel = broadcast._create_channel(test_name, 'global');
      expect(channel.scope).toEqual('global');
    });
  });

  describe('Subscibers', function() {
    beforeEach(function() {
      subscriber = broadcast.subscribe(test_name, function(value, message) {
        message_recived = message;
      });
    });

    it('should call subscriber reactions', function() {
      broadcast.post(test_name, 'val');
      expect(message_recived.value).toEqual('val');
    });

    it('only Bad should be removed', function() {
      bad_subscriber = broadcast.subscribe(test_name, function(value, message) {
        var b = var_that_never.exist;
      });

      //making it sync
      var counter = 0;
      broadcast.subscribe(test_name, function(value, message) {
        //using done
        counter++;
        if(counter > channel.max_failures*2) done();
      });
      for(var i=0; i<channel.max_failures*2; i++) {
        broadcast.post(test_name, '0');
      }

      expect(channel._subscribers)
        .not.toContain(bad_subscriber);
      expect(channel._subscribers)
        .toContain(subscriber);
    });

    it('should be able to unsubscribe', function() {
      broadcast.unsubscribe(test_name, subscriber);
      expect(channel._subscribers).not.toContain(subscriber);
    });
  });

  describe('History', function() {
    var message_last;
    beforeEach(function() {
      message = broadcast.post(test_name, 'sample');
      for(var i=0; i<10; i++) {
        broadcast.post(test_name, i);
      }
      message_last = broadcast.post(test_name, 'last');
    });

    it('exisits in channel', function() {
      expect(channel.history).toBeDefined();
    });

    it('should be able to return array scince', function() {
      var scince_start = channel.history.get.scince(message);
      expect(scince_start.length).toEqual(12);
      expect(scince_start).toContain(message);
      expect(scince_start).toContain(message_last);

      var scince_end = channel.history.get.scince(scince_end);
      expect(scince_end.length).toEqual(1);
      expect(scince_end).toContain(message_last);
      expect(scince_end).not.toContain(message);
    });

    it('should be able to all messages', function() {
      var all = channel.history.get.all();
      expect(all.length).toEqual(12);
      expect(scince).toContain(message);
      expect(scince).toContain(message_last);
    });
  });
});
