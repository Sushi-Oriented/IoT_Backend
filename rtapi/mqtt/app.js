const aedes = require('aedes')()
const httpServer = require('http').createServer()
const ws = require('websocket-stream')
const minimatch = require("minimatch");

// === Change to setting ====
const port = 3889
const appName = 'gpscollar'
//=============================

ws.createServer({ server: httpServer }, aedes.handle)
httpServer.listen(port, function () {
    console.log('MQTT websocket server listening on port ', port)
})

const AuthApp = {
    username: appName+ '_dash',
    password: 'asdh@453bia&2sfeeYq3rs',
    subscribe: '**',
    publish: ''
}
const AuthServer = {
    username: appName + '_server',
    password: 'asdf56ce@dH3Dwqp7dfre2',
    subscribe: '**',
    publish: '**'
}

aedes.authenticate = function (client, username, password, callback) {
    // console.log(client)
    // console.log(username, password.toString())

    if (username === AuthApp.username && password.toString() === AuthApp.password) {
        // console.log('OK')
        client.Profile = { subscribe: AuthApp.subscribe, publish: AuthApp.publish };
        return callback(null, true)
    }
    if (username === AuthServer.username && password.toString() === AuthServer.password) {
        // console.log('OK')
        client.Profile = { subscribe: AuthServer.subscribe, publish: AuthServer.publish };
        return callback(null, true)
    }

    // console.log('Fail')
    callback({ returnCode: 5, message: ' Fail Authenticate!.' })
}
aedes.authorizePublish = function (client, packet, callback) {
    const result = minimatch(packet.topic, client.Profile.publish)
    // console.log(result, client.Profile.publish)
    if (result) {
        return callback(null)
    }
    callback(new Error('UnAuthorization!.'));
}
aedes.authorizeSubscribe = function (client, sub, callback) {
    const result = minimatch(sub.topic, client.Profile.subscribe)
    if (result) {
        return callback(null, sub)
    }
    callback(new Error('UnAuthorization!.'));
}

setInterval(() => {
    aedes.publish({
        topic: 'HR',
        payload: JSON.stringify({})
    })
}, 30000)

module.exports = aedes