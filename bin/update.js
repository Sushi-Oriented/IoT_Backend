'use strict';

const server = require('../server/server');
const ds = server.dataSources.db;

const lbTables = [
    'AccessToken', 'ACL', 'RoleMapping', 'Role',
    'AppUser', 
    'CollarDevice', 'DeviceData'
];

function updateTables(tables) {
    return new Promise((resolve, reject) => {
        ds.autoupdate(tables, (err) => {
            if (err) { return reject(err) }
            resolve(tables);
        })
    })
}

//================================================================
async function update() {
    try {
        console.log("Update Tables Models ....");

        let resultTables = await updateTables(lbTables);
        console.log("Success:", resultTables);

        process.exit(0);
    } catch (err) {
        console.log("Failed : ", err);
        process.exit(1);
    }
}
update();
