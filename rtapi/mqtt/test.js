var mqtt = require('mqtt');
// === Change to setting ====
const port = 3889
const appName = 'gpscollar'
//=============================

// Specify the connection settings (Native MQTT)
var settings = {
	// username: appName+ '_dash',
	// password: 'asdh@453bia&2sfeeYq3rs',

	username: appName + '_server',
	password: 'asdf56ce@dH3Dwqp7dfre2',
	// port: 1883,
	port: port,
	clientId: 'mqttjs_innates' + Math.random().toString(16).substr(2, 8),
};

// Connect to MQTT broker
// var client = mqtt.connect('mqtt://127.0.0.1', settings);
var client = mqtt.connect('ws://127.0.0.1', settings);

client.on('connect', function () {
	console.log("Connected to broker");
	client.subscribe('#');
})

/* Upon message received, 
 * 	  - Display the message for all the topics that we have subscribed
 */
client.on('message', function (topic, message) {
	// message is Buffer 
	console.log(topic, message.toString());
});

client.on('error', function (err) { console.log('MQTT error: ' + err); });
client.on('close', function (err) { console.log('MQTT close: ' + err); });
