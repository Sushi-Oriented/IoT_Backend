'use strict';

module.exports = function (DeviceData) {
    _disableRemoteMethod(DeviceData)

    var __app;
    let count = 1

    DeviceData.on('attached', function (a) {
        __app = a;
    });

    DeviceData.dataDevice = async function (req) {
        if (typeof (req.headers.api_key) === 'undefined' && typeof (req.headers.device_id) === 'undefined') {
            return Promise.reject({ status: 400, message: "Missing apikey parameter or deviceid." })
        }

        let collarDevice = null
        if (typeof (req.headers.api_key) !== 'undefined') {
            if (req.headers.api_key !== '') {
                collarDevice = await __app.models.CollarDevice.findOne({ where: { api_key: req.headers.api_key } })
            }
        }
        if (typeof (req.headers.device_id) !== 'undefined') {
            if (req.headers.device_id !== '') {
                collarDevice = await __app.models.CollarDevice.findOne({ where: { device_id: req.headers.device_id } })
            }
        }

        if (collarDevice === null) {
            return Promise.reject({ status: 400, message: "Missing Collar Device not found." })
        }

        // console.log(req.body)
        if (typeof (req.body) === 'undefined') {
            return Promise.reject({ statusCode: 400, message: 'Missing Paramer data!.' })
        }

        // parameter data
        // let data = {
        //     "id_tx": 1,
        //     "volatge_input_tx": 12.5,
        //     "power_solar_tx": 40.5,
        //     "power_piezo_tx": 45.3,
        //     "gps_date_tx": "2021-09-02",
        //     "gps_time_tx": "2021-09-02 17:45:12",
        //     "gps_latitude_tx": 1.5204,
        //     "gps_longitude_tx": 105.2654,
        //     "gps_altitude_tx": 15.3,
        //     "gps_speed_tx": 2.3,
        //     "sattelite": 3,
        //     "direction": N,
        //     "rssi": -45,
        //     "snr": 60,
        //     "gps_date_rx": "2021-09-02",
        //     "gps_time_rx": "2021-09-02 17:45:45",
        //     "gps_latitude_rx": 1.5221,
        //     "gps_longitude_rx": 105.2987,
        //     "gps_altituder_rx": 15.5
        // }
        console.log(new Date().toISOString(), req.body)
        let res = await DeviceData.create(req.body)

        // Send Data Notification
        __app.rtapi.publish({
            topic: 'datastream',
            payload: JSON.stringify(res)
        })

        return Promise.resolve({ id: count++, timestamp: new Date() })
    }
    DeviceData.remoteMethod('dataDevice', {
        description: `Data from Device.`,
        isStatic: true,
        accepts: [
            { arg: 'req', type: 'object', 'http': { source: 'req' } }
        ],
        returns: {
            type: 'object',
            root: true
        },
        http: { path: '/sendData', verb: 'post' }
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