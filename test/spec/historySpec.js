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

  it('should be able to return array since', function() {
    var since_start = channel.history.since(message);
    expect(since_start.length).toEqual(12);
    expect(since_start).toContain(message);
    expect(since_start).toContain(message_last);

    var since_end = channel.history.since(message_last);
    expect(since_end.length).toEqual(1);
    expect(since_end).toContain(message_last);
    expect(since_end).not.toContain(message);
  });

  it('should be able to return all messages', function() {
    var all = channel.history.all();
    expect(all.length).toEqual(12);
    expect(all).toContain(message);
    expect(all).toContain(message_last);
  });
});
