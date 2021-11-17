var mqtt = require('mqtt')
var _ = require('lodash')
var client  = mqtt.connect('mqtt://mqtt2.hunonicpro.com:1883', {
  username: 'bestbug',
  password: 'bigbugdmm'
})

client.on('connect', function () {
  client.subscribe('u/#', function (err) {
   
  })
  // client.subscribe('u/#', function (err) {
   
  // })
})
var cache = {}
client.on('message', function (topic, message) {
  // message is Buffer
  // console.log(topic, message.toString('hex'))
  var topics = topic.split('/')
  // console.log(topics)
  //console.log(message.length)
  if (topics.length == 4 && message.length == 64) {
    var id = topics[2]
    cache[id] = cache[id] || {index: 0, command_list: {}}
    var command_list = cache[id].command_list
    var command = message.toString('hex')
    command_list[command] = {
      command: message,
      topic: topic
    }
    // console.log(id, topic)
    //client.publish(topic, message)
    // console.log("noted")
  }
})

setInterval(function() {
  _.forEach(cache, function(device, alias) {
    var index = device.index 
    var command_keys = _.keys(device.command_list)
    var total_command = command_keys.length
    var command_to_be_sent = device.command_list[command_keys[index]]
    //console.log(command_to_be_sent)
    device.index++
    if (device.index >= command_keys.length) {
      device.index = 0
    }
    client.publish(command_to_be_sent.topic, command_to_be_sent.command)
  })
  console.log("Device online count", _.keys(cache).length)
}, 5000)

