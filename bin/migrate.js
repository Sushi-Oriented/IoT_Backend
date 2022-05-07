'use strict';

const server = require('../server/server');
const ds = server.dataSources.mysql;

const lbTables = [
    'AccessToken', 'ACL', 'RoleMapping', 'Role',
    'AppUser', 
    'CollarDevice', 'DeviceData'
];

async function __migrateTable() {
    try {
        await ds.automigrate(lbTables)
        console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name)
        return Promise.resolve()
    } catch (error) {
        return Promise.reject(error)
    }
}

async function __createRole() {
    const roles = [
        {
            name: 'system',
            description: 'System Application',
            created: new Date(),
        },
        {
            name: 'admin',
            description: 'Admin System',
            created: new Date(),
        },
        {
            name: 'manager',
            description: 'Manager System',
            created: new Date(),
        },
        {
            name: 'supervisor',
            description: 'Supervisor System',
            created: new Date(),
        },
        {
            name: 'normal',
            description: 'Normal User',
            created: new Date(),
        },
    ];

    try {
        let __result = await server.models.Role.create(roles)
        console.log('Created:');
        return Promise.resolve(__result)
    } catch (error) {
        return Promise.reject(error)
    }
}

async function __createUserLoginSystem() {
    var users = [
        {
            user: {
                username: 'system-dev',
                password: 'system1029384756',
                email: 'system-dev@iot.com',
                name: 'System Development',
                contact: '123456789',
                createdBy: 1,
                createdAt: new Date()
            },
            role: 'system'
        },
        {
            user: {
                username: 'admin-dev',
                password: 'admin123456789',
                email: 'admin-dev@iot.com',
                name: 'Admin Development',
                contact: '123456789',
                createdBy: 1,
                createdAt: new Date()
            },
            role: 'admin'
        },
        {
            user: {
                username: 'admin',
                password: 'admin12345678',
                email: 'admin-system@iot.com',
                name: 'Admin System',
                contact: '123456789',
                createdBy: 1,
                createdAt: new Date()
            },
            role: 'admin'
        }
    ];

    try {
        // Get Roles
        let __roles = await server.models.Role.find()
        if (__roles.length === 0) {
            return Promise.reject('No Role in System.')
        }
        for (let i = 0; i < users.length; i++) {
            let __rolesSelected = null
            for (let j = 0; j < __roles.length; j++) {
                if (users[i].role === __roles[j].name) {
                    __rolesSelected = __roles[j]
                }
            }

            if (__rolesSelected !== null) {
                let __appUser = await server.models.AppUser.create(users[i].user)
                await server.models.RoleMapping.create({
                    principalType: server.models.RoleMapping.USER,
                    principalId: __appUser.id,
                    roleId: __rolesSelected.id
                })
                console.log('Create User: ', __appUser)
            }
        }
        return Promise.resolve('Done')
    } catch (error) {
        return Promise.reject(error)
    }
}

async function __createCollarDevice() {
    try {
        await server.models.CollarDevice.create({
            name: 'Device01',
            device_id: 'GCI574210',
            api_key: 'DveHRK9MXOPjP7BMtBh7VtLNjqcyz3e6hoxgFMWBhv2PZECBOcWkv1ueOHkbToag'
        })

        return Promise.resolve('done')
    } catch (error) {
        return Promise.reject(error)
    }
}

async function __run() {
    try {
        await __migrateTable()
        await __createRole()
        await __createUserLoginSystem()
        await __createCollarDevice()
    } catch (error) {
        console.log(error)
    }

    process.exit(0);
} __run()