describe('Message', function() {
  describe('Autodetect type', function() {
    beforeEach(function() {
      subscriber = broadcast.subscribe(test_name, function(value, message) {
        message_recived = message;
      });
    });
    
    it('should detect simple types', function() {
      var sent;
      broadcast.post(test_name, sent);
      expect(message_recived.type).toEqual(typeof sent);

      sent = 1;
      broadcast.post(test_name, sent);
      expect(message_recived.type).toEqual(typeof sent);

      sent = 'str';
      broadcast.post(test_name, sent);
      expect(message_recived.type).toEqual(typeof sent);

      sent = {key: 'value'};
      broadcast.post(test_name, sent);
      expect(message_recived.type).toEqual(typeof sent);
    });

    it('should detect File', function() {
      broadcast.post(test_name, new File([""], "filename"));
      expect(message_recived.type).toEqual('File');
    });

    it('should detect Blob', function() {
      broadcast.post(test_name, new Blob());
      expect(message_recived.type).toEqual('Blob');
    });
  });
});
