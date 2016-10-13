var broadcast,
    channel;
var subscriber,
    bad_subscriber;
var message_recieved;

var test_name = 'test';

beforeEach(function() {
  // test Broadcast instance
  broadcast = Broadcast.init();
  channel = broadcast._create_channel(test_name);
});
