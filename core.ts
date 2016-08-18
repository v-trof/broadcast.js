import {Channel} from './containers/channel.ts';
import {Id_generator} from './utils/id_generator.ts';

class Broadcast {
  private channels: { [name: string]: Channel; } = {};

  private channels_reach: channels_reach = {
    local: [],
    global: []
  }

  origin: string = '0';
  id_generator = new Id_generator;

  /**
   *  Crates empty channel
      Adds it to matience
      Puts it into right reach
   *  @arg {string} name            | name of new channel
   *  @arg {string} scope = 'local' | local / global
   */
  create_channel(name: string, scope: string = 'local') {
    var new_channel = new Channel();
    this.channels[name] = new_channel;
    this.channels_reach[scope].push(name);

    return new_channel;
  }

  /**
   * Time needed for syncing messages
   * @return {number} current time
   */
  get_time() {
    return 0;
  }

  //channels facade
  params = {
    max_history: 0
  }
}

var a = new Id_generator;

var broadcast = new Broadcast();

export default broadcast;

broadcast.create_channel

//util
interface channels_reach {
  /**
   * Not server synced
   */
  local: string[],
  /**
   * Server synced
   */
  global: string[]
}
