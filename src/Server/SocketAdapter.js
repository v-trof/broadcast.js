(function() {

class Socket_Adapter {
  constructor(port) {
    this.on = {};
    this.connection_map = {};
    this.buffers_map = {};

    var self = this;

    this.server = ws.createServer(function (conn) {
      var origin = self.on.new_init();
      self.connection_map[origin] = conn;

      conn.on("close", function (code, reason) {
        self.on.drop();
      });

      conn.on("text", function (str) {
        self.on.message();
      });

      conn.on("binary", function (stream) {
        // Empty buffer for collecting binary data
        var data = new Buffer(0);
        // Read chunks of binary data and add to the buffer
        stream.on("readable", function () {
            var newData = stream.read();

            if (newData) {
              data = Buffer.concat([data, newData], data.length+newData.length);
            }
        });

        stream.on("end", function () {
            console.log("Received " + data.length + " bytes of binary data");
            process_my_data(data);
        });
      });
    }).listen(port);
  }


  send(message, relevant_origins) {
    relevant_origins.forEach(function(origin) {
      var connection = connection_map[origin];
      //file manipulation
      connection.send(message);
    });
  }

}

Broadcast._src.Socket_Adapter = Socket_Adapter;
} ());
