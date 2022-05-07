'use strict';
const uid = require('uid2');
const LENGTH = 64

module.exports = function (CollarDevice) {
    _disableRemoteMethod(CollarDevice)

    var __app;

    CollarDevice.on('attached', function (a) {
        __app = a;
    });

    CollarDevice.register = async function (data) {
        // console.log(data)
        if (typeof (data.name) === 'undefined') {
            return Promise.reject({ statusCode: 400, message: 'Missing name.' })
        }
        if (typeof (data.devid) === 'undefined') {
            return Promise.reject({ statusCode: 400, message: 'Missing devid.' })
        }

        try {
            // Check
            let __sensor = await CollarDevice.findOne({ where: { devid: data.devid } })
            if (__sensor !== null) {
                return Promise.reject({ statusCode: 400, message: 'Sensor Device already register!.' })
            }

            let _apiKey = await __createApiKey()
            let _data = { name: data.name, device_id: data.devid, api_key: _apiKey }
            let _res = await CollarDevice.create(_data)

            return Promise.resolve(_res)
        } catch (error) {
            return Promise.reject(error)
        }
    }
    CollarDevice.remoteMethod('register', {
        description: 'Register Sensor Device',
        isStatic: true,
        accepts: [{ arg: 'data', type: 'object', http: { source: 'body' } }],
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/register', verb: 'post' }
    })

    CollarDevice.updateInfo = async function (id, data) {
        // console.log(data)
        if (typeof (id) === 'undefined') {
            return Promise.reject({ statusCode: 400, message: 'Missing id.' })
        }
        if (typeof (data.name) === 'undefined') {
            return Promise.reject({ statusCode: 400, message: 'Missing name.' })
        }
        if (typeof (data.devid) === 'undefined') {
            return Promise.reject({ statusCode: 400, message: 'Missing devid.' })
        }

        try {
            // Check
            let __sensor = await CollarDevice.findOne({ where: { devid: data.devid } })
            if (__sensor !== null) {
                if (__sensor.id !== id) {
                    return Promise.reject({ statusCode: 400, message: 'Sensor Device already register!.' })
                }
            }

            let _res = await CollarDevice.updateAll({id: id}, data)

            return Promise.resolve(_res)
        } catch (error) {
            return Promise.reject(error)
        }
    }
    CollarDevice.remoteMethod('updateInfo', {
        description: 'Update Info',
        isStatic: true,
        accepts: [
            { arg: 'id', type: 'string', required: true },
            { arg: 'data', type: 'object', http: { source: 'body' } }
        ],
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/update/info/:id', verb: 'post' }
    })
};

function _disableRemoteMethod(Model) {
    // GET
    // Model.disableRemoteMethodByName('find')

    // POST 
    Model.disableRemoteMethodByName('create')

    // PUT
    Model.disableRemoteMethodByName('replaceOrCreate')

    // PATCH
    Model.disableRemoteMethodByName('patchOrCreate')

    // GET /findOne
    Model.disableRemoteMethodByName('findOne')

    // GET /:id
    Model.disableRemoteMethodByName('findById')

    // GET /:id/exists
    Model.disableRemoteMethodByName('exists')

    // GET /count
    // Model.disableRemoteMethodByName('count')

    // POST /update
    Model.disableRemoteMethodByName('updateAll')

    // DELETE /:id
    Model.disableRemoteMethodByName('deleteById')

    // PATCH /:id
    Model.disableRemoteMethodByName('prototype.patchAttributes')

    // PUT /:id
    Model.disableRemoteMethodByName('replaceById')

    // POST|GET	/change-stream
    Model.disableRemoteMethodByName('createChangeStream')

    // POST	/upsertWithWhere
    Model.disableRemoteMethodByName('upsertWithWhere')


    //=================== From Related Model =====================================

    let _relationName = []
    // POST /{id}/{relation-name}
    // Model.disableRemoteMethodByName('prototype.__create__' + _relationName)
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__create__' + element)
    });

    // // GET /{id}/{relation-name}
    // Model.disableRemoteMethodByName('prototype.__get__' + _relationName);

    // DELETE /{id}/{relation-name}
    // Model.disableRemoteMethodByName('prototype.__delete__' + _relationName)
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__delete__' + element)
    });

    // // PUT /{id}/{relation-name}
    // Model.disableRemoteMethodByName('prototype.__update__' + _relationName);
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__update__' + element)
    });

    // // DELETE /{id}/{relation-name}
    // Model.disableRemoteMethodByName('prototype.__destroy__' + _relationName)
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__destroy__' + element)
    });

    // GET /{id}/{relation-name}/{fk}
    // Model.disableRemoteMethodByName('prototype.__findById__' + _relationName);
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__findById__' + element)
    });

    // PUT /{id}/{relation-name}/{fk}
    // Model.disableRemoteMethodByName('prototype.__updateById__' + _relationName);
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__updateById__' + element)
    });

    // DELETE /{id}/{relation-name}/{fk}
    // Model.disableRemoteMethodByName('prototype.__destroyById__' + _relationName)
    _relationName.forEach(element => {
        Model.disableRemoteMethodByName('prototype.__destroyById__' + element)
    });

}

function __createApiKey() {
    return new Promise((resolve, reject) => {
        uid(LENGTH, function (err, guid) {
            if (err) {
                console.log(err)
                return reject(err)
            }

            // console.log(guid)
            resolve(guid)
        });
    })
}