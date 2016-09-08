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
