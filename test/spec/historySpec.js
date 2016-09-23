describe('History', function() {
  var message_last;
  beforeEach(function() {
    message = broadcast.post(test_name, 'sample');
    for(var i=0; i<98; i++) {
      broadcast.post(test_name, i);
    }
    message_last = broadcast.post(test_name, 'last');
    spyOn(console, 'error');
  });

  it('exists in channel', function() {
    expect(channel.history).toBeDefined();
  });

  it('should be able to return array since', function() {
    var since_start = channel.history.since(message);
    expect(since_start.length).toEqual(100);
    expect(since_start).toContain(message);
    expect(since_start).toContain(message_last);

    var since_end = channel.history.since(message_last);
    expect(since_end.length).toEqual(1);
    expect(since_end).toContain(message_last);
    expect(since_end).not.toContain(message);
  });

  it('should be able to return all messages', function() {
    var all = channel.history.all();
    expect(all.length).toEqual(100);
    expect(all).toContain(message);
    expect(all).toContain(message_last);
  });

  it('should properly handle the case when a non-existing in the channel\'s ' +
  'history message is passed to history.since(message)', function() {
    var since_empty = channel.history.since(new Broadcast._src.Message('this one is definitely non-existent in the channel\'s history', channel._host));
    expect(console.error).toHaveBeenCalled();
    expect(since_empty.length).toEqual(0);
  });

  it('the history array should be able to fit in max_length', function() {
    shift_message = broadcast.post(test_name, 'i will shift the array');
    var all = channel.history.all();
    expect(all.length).toEqual(100);
    expect(all).not.toContain(message);
    expect(all).toContain(message_last);
    expect(all).toContain(shift_message);
  });

  it('the history array should be empty at all times if max_length equals to zero', function() {
    var another_channel = broadcast._create_channel('zero_channel', 'local', 0);
    untracked_message = broadcast.post('zero_channel', 'this message leaves no trace in history');
    var all = another_channel.history.all();
    var since_empty = another_channel.history.since(untracked_message);
    expect(all.length).toEqual(0);
    expect(since_empty.length).toEqual(0);
  });
});
