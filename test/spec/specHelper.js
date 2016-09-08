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
