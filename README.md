# Server API

Server API using Loopback

Model AppUser:
1. System: register admin
2. Admin: register admin, register manager, register supervisor, register normal user
3. Manager: register supervisor, register normal user
4. Supervisor: register normal user

API Route:
1. registerAdmin - admin
2. registerManager - admin
3. registerSupervisor - admin, manager
4. registerNormalUser - admin, manager, supervisor

5. removeUser - admin: [owner, admin, manager, supervisor, normal], manager: [owner, supervisor, normal], supervisor: [owner, normal], normal: [owner]

6. listAdmin -admin
7. listManager - admin
8. istSupervisor - admin, manager
9. listNormalUser - admin, manager, supervisor

10. updateUser - admin: [admin, manager, supervisor, normal], manager: [owner, supervisor, normal], supervisor: [owner, normal], normal: [owner]
11. changeUserRole - admin
12. resetPasswordUser - admin: [admin, manager, supervisor, normal], manager: [owner], supervisor: [owner], normal: [owner]