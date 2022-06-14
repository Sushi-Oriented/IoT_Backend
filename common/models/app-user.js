var nodemailer = require("nodemailer");

("use strict");
const Role = {
  System: "system",
  Admin: "admin",
  Manager: "manager",
  Supervisor: "supervisor",
  NormalUser: "normal",
};

module.exports = function (AppUser) {
  _disableRemoteMethod(AppUser);

  var app;

  AppUser.on("attached", function (a) {
    app = a;
  });

  AppUser.beforeRemote("login", async function (ctx, model) {
    // console.log(ctx.args.credentials)
    try {
      if (typeof ctx.args.credentials.username !== "undefined") {
        let __user = await AppUser.findOne({
          where: { username: ctx.args.credentials.username },
        });
        if (__user === null) {
          return Promise.resolve();
        }
        console.log(__user);
        ctx.name = __user.name;
        ctx.username = __user.username;
        ctx.uid = __user.id;
        ctx.contact = __user.contact;
        // ctx.picture = __user.picture;
        ctx.createdDate = __user.createdDate;


        let __roleMap = await app.models.RoleMapping.findOne({
          where: { principalId: __user.id },
        });
        if (__roleMap === null) {
          return Promise.resolve();
        }

        let __roles = await app.models.Role.findOne({
          where: { id: __roleMap.roleId },
        });
        if (__roles !== null) {
          ctx.roles = __roles.name;
        }
      }
      // else if (typeof (ctx.args.credentials.email) !== 'undefined') {
      //     let __user = await AppUser.findOne({ where: { email: ctx.args.credentials.email } })
      //     if (__user === null) {
      //         return Promise.resolve()
      //     }
      //     ctx.name = __user.name
      //     ctx.username = __user.username
      //     ctx.uid = __user.id
      //     ctx.contact = __user.contact
      //     ctx.picture = __user.picture

      //     let __roleMap = await app.models.RoleMapping.findOne({ where: { principalId: __user.id } })
      //     if (__roleMap === null) {
      //         return Promise.resolve()
      //     }

      //     let __roles = await app.models.Role.findOne({ where: { id: __roleMap.roleId } })
      //     if (__roles !== null) {
      //         ctx.roles = __roles.name
      //     }
      // }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  });
  AppUser.afterRemote("login", function (ctx, model, next) {
    ctx.result.role = ctx.roles;
    ctx.result.name = ctx.name;
    ctx.result.username = ctx.username;
    ctx.result.contact = ctx.contact;
    ctx.result.uid = ctx.uid;
    // ctx.result.picture = ctx.picture;
    ctx.result.createdDate = ctx.createdDate;
    // {"id":"BZfz6FLvTp2HN3KogqN0WPjt6BYKKiKu6E8o3kYj6uahAHvynswitJ0Vw4yoLU0i","ttl":1209600,"created":"2021-08-15T14:09:09.108Z","userId":1,"role":"admin"}
    // {token: '', name: '', uid: '', role:'', contact: '', created: ''}

    // console.log(ctx.result.userId)
    AppUser.updateAll(
      { id: ctx.result.userId },
      { lastLogin: new Date() },
      (err, result) => {
        if (err) next(err);
        // console.log(result)
        else next();
      }
    );
  });

  // ========= reset Password with email =======
  AppUser.ListUserbyEmail = async function (ctx, model, cb) {
    console.log("email1", ctx);
    try {
      // if (typeof (ctx.args.email) !== 'undefined') {
      //     let __user = await AppUser.findOne({ where: { username: ctx.args.email } })
      //     console.log("test __user",__useremail);
      //         if (__useremail === null) {
      //             return Promise.resolve()
      //         }
      //     }

      let user = await app.models.AppUser.findOne({ where: { email: ctx } });
      console.log("user123", user);
      if (user === null) {
        console.log("The email is not exist");
        return Promise.reject({
          statusCode: 400,
          message: "The email is not exist",
        });
      }

      var email = ctx
      let _user = await app.models.AppUser.findOne({ where: { email: ctx } });
    console.log(_user);

    function makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
    var temppwd = makeid(15);
    console.log(temppwd);
    var transporter = nodemailer.createTransport({
      service: "gmail",
    //   type: "smtp",
      host: "smtp.gmail.com",
      secure: false,
      port: 587,
    //   tls: true,
    //   ssl: true,
      auth: {
        user: "triplem5917@gmail.com",
        pass: "innates.my",
      },
      //   auth: {
      //     user: 'triplem5917@gmail.com',
      //     pass: 'innates.my'
      //   }
    });
    var mailOptions = {
      from: "triplem5917@gmail.com",
      to: email,
      subject: "myJentera Monitoring System - Temporary Password",
      html:
        "<p>Your username is: <strong>" +
        _user.username +
        "</strong>" +
        "<p>Your new password is: <strong>" +
        temppwd +
        "</strong>" +
        "<p>For security purpose, Please do not share the username and password with anyone. You are advised to change your password after login at user profile page. If you did not initiate this action, please change your password immediately and contact our customer support team. " +
        "<br><br><h3>MyJentera Development Team</h3>" +
        "<p>This is an automated message, please do not reply.",
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        Promise.reject({
          statusCode: 400,
          message: "Reset password is unsuccessful",
        });
        // return Promise.reject({
        //     statusCode: 400,
        //     message: err
        //   });
      } else {
        app.models.AppUser.updateAll(
          { email: email },
          { password: app.models.AppUser.hashPassword(temppwd) }
        );
        console.log("Email sent: " + info.response);
      }
    });
    } catch (error) {
        console.log('========sini pulak========',error);
      return Promise.reject(error);
    }
    // __listUserWithEmail(app, ctx, cb);
  };

  AppUser.remoteMethod("ListUserbyEmail", {
    description: `Get User of Email`,
    isStatic: true,
    accepts: [
      { arg: "email", type: "string", required: true },
      { arg: "data", type: "object", required: true, http: { source: "body" } },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/resetpassword/:email", verb: "get" },
  });

  // ========= Register User ========
  AppUser.registerUser = function (body, options, cb) {
    console.log(body);
    if (typeof body === "undefined") {
      return cb({ statusCode: 400, message: "Missing Parameter." });
    }

    const token = options && options.accessToken;

    body.role = Role.Admin;
    body.createdBy = token && token.userId;

    __registerUser(app, body, cb);
  };

  AppUser.remoteMethod("registerUser", {
    description: `Register User`,
    isStatic: true,
    accepts: [
      { arg: "data", type: "object", required: true, http: { source: "body" } },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/register/user", verb: "post" },
  });

  AppUser.registerAdmin = function (body, options, cb) {
    if (typeof body === "undefined") {
      return cb({ statusCode: 400, message: "Missing Paramter." });
    }

    const token = options && options.accessToken;

    body.role = Role.Admin;
    body.createdBy = token && token.userId;

    __registerUser(app, body, cb);
  };

  AppUser.remoteMethod("registerAdmin", {
    description: `Register User Admin`,
    isStatic: true,
    accepts: [
      { arg: "data", type: "object", required: true, http: { source: "body" } },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/register/admin", verb: "post" },
  });

  AppUser.registerManager = function (body, options, cb) {
    if (typeof body === "undefined") {
      return cb({ statusCode: 400, message: "Missing Paramter." });
    }

    const token = options && options.accessToken;

    body.role = Role.Manager;
    body.createdBy = token && token.userId;

    __registerUser(app, body, cb);
  };
  AppUser.remoteMethod("registerManager", {
    description: `Register User Manager`,
    isStatic: true,
    accepts: [
      { arg: "body", type: "object", required: true, http: { source: "body" } },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/register/manager", verb: "post" },
  });

  AppUser.registerSupervisor = function (body, options, cb) {
    if (typeof body === "undefined") {
      return cb({ statusCode: 400, message: "Missing Paramter." });
    }

    const token = options && options.accessToken;

    body.role = Role.Supervisor;
    body.createdBy = token && token.userId;

    __registerUser(app, body, cb);
  };
  AppUser.remoteMethod("registerSupervisor", {
    description: `Register User Supervisor`,
    isStatic: true,
    accepts: [
      { arg: "body", type: "object", required: true, http: { source: "body" } },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/register/supervisor", verb: "post" },
  });

  AppUser.registerNormalUser = function (body, options, cb) {
    if (typeof body === "undefined") {
      return cb({ statusCode: 400, message: "Missing Paramter." });
    }

    const token = options && options.accessToken;

    body.role = Role.NormalUser;
    body.createdBy = token && token.userId;

    __registerUser(app, body, cb);
  };
  AppUser.remoteMethod("registerNormalUser", {
    description: `Register User Normal User`,
    isStatic: true,
    accepts: [
      { arg: "body", type: "object", required: true, http: { source: "body" } },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/register/normalUser", verb: "post" },
  });

  // ============ Remove User ======
  AppUser.removeUser = async function (userid, options) {
    try {
      // Check User
      let _user = await AppUser.findOne({ where: { id: userid } });
      if (_user === null) {
        return Promise.reject({ statusCode: 400, message: "User not Found." });
      }

      // Check Current User
      const token = options && options.accessToken;
      let _userBy = await AppUser.findOne({ where: { id: token.userId } });
      if (_userBy === null) {
        return Promise.reject({ statusCode: 400, message: "User not Found." });
      }

      // Check Role
      let _rolesMap = await app.models.RoleMapping.findOne({
        where: { principalId: _user.id },
      });
      if (_rolesMap === null) {
        await AppUser.destroyById(_user.id);
        return Promise.resolve("OK");
      }
      let _roles = await app.models.Role.findOne({
        where: { id: _rolesMap.roleId },
      });
      if (_rolesMap === null) {
        await AppUser.destroyById(_user.id);
        return Promise.resolve("OK");
      }

      // Check Role UserBy
      let _rolesMapUserBy = await app.models.RoleMapping.findOne({
        where: { principalId: _userBy.id },
      });
      if (_rolesMapUserBy === null) {
        return Promise.reject({
          statusCode: 400,
          message: "Cannot remove this User.",
        });
      }
      let _rolesUserBy = await app.models.Role.findOne({
        where: { id: _rolesMapUserBy.roleId },
      });
      if (_rolesUserBy === null) {
        return Promise.reject({
          statusCode: 400,
          message: "Cannot remove this User.",
        });
      }

      if (_rolesUserBy.name === Role.System) {
        if (_roles.name === Role.System) {
          return Promise.reject({
            statusCode: 400,
            message: "Cannot remove this User.",
          });
        }
      } else if (_rolesUserBy.name === Role.Admin) {
        if (_roles.name === Role.System) {
          return Promise.reject({
            statusCode: 400,
            message: "Cannot remove this User.",
          });
        }
      } else if (_rolesUserBy.name === Role.Manager) {
        if (_roles.name === Role.System) {
          return Promise.reject({
            statusCode: 400,
            message: "Cannot remove this User.",
          });
        } else if (_roles.name === Role.Admin) {
          return Promise.reject({
            statusCode: 400,
            message: "UnAuthorized remove this User.",
          });
        } else if (_roles.name === Role.Manager) {
          if (_user.id !== _userBy.id) {
            return Promise.reject({
              statusCode: 400,
              message: "UnAuthorized remove this User.",
            });
          }
        }
      } else if (_rolesUserBy.name === Role.Supervisor) {
        if (_roles.name === Role.System) {
          return Promise.reject({
            statusCode: 400,
            message: "Cannot remove this User.",
          });
        } else if (_roles.name === Role.Admin) {
          return Promise.reject({
            statusCode: 400,
            message: "UnAuthorized remove this User.",
          });
        } else if (_roles.name === Role.Manager) {
          return Promise.reject({
            statusCode: 400,
            message: "UnAuthorized remove this User.",
          });
        } else if (_roles.name === Role.Supervisor) {
          if (_user.id !== _userBy.id) {
            return Promise.reject({
              statusCode: 400,
              message: "UnAuthorized remove this User.",
            });
          }
        }
      } else {
        if (_user.id !== _userBy.id) {
          return Promise.reject({
            statusCode: 400,
            message: "UnAuthorized remove this User.",
          });
        }
      }

      await AppUser.destroyById(_user.id);
      await app.models.RoleMapping.destroyById(_rolesMap.id);

      return Promise.resolve("OK");
    } catch (error) {
      return Promise.reject(error);
    }
  };
  AppUser.remoteMethod("removeUser", {
    description: `Remove User`,
    isStatic: true,
    accepts: [
      { arg: "id", type: "number", required: true },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/remove/:id", verb: "delete" },
  });

  // ============ List User =========
  AppUser.listAdmin = function (cb) {
    __listUser(app, Role.Admin, cb);
  };
  AppUser.remoteMethod("listAdmin", {
    description: `Get List of Admin`,
    isStatic: true,
    accepts: [],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/list/admins", verb: "get" },
  });

  AppUser.listManager = function (cb) {
    __listUser(app, Role.Manager, cb);
  };
  AppUser.remoteMethod("listManager", {
    description: `Get List of Manager`,
    isStatic: true,
    accepts: [],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/list/managers", verb: "get" },
  });

  AppUser.listSupervisor = function (cb) {
    __listUser(app, Role.Supervisor, cb);
  };
  AppUser.remoteMethod("listSupervisor", {
    description: `Get List of Supervisor`,
    isStatic: true,
    accepts: [],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/list/supervisors", verb: "get" },
  });

  AppUser.listNormalUser = function (cb) {
    __listUser(app, Role.NormalUser, cb);
  };
  AppUser.remoteMethod("listNormalUser", {
    description: `Get List of Normal user`,
    isStatic: true,
    accepts: [],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/list/normalUsers", verb: "get" },
  });

  AppUser.listAllUser = function (cb) {
    __listAllUser(app, Role.NormalUser, cb);
  };
  AppUser.remoteMethod("listAllUser", {
    description: `Get List of Users`,
    isStatic: true,
    accepts: [],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/list/AllUsers", verb: "get" },
  });

  // ======= Update User =========
  AppUser.updateUser = async function (userid, body, options) {
    console.log(body);
    try {
      let _user = await AppUser.findOne({ where: { id: userid } });
      if (_user === null) {
        return Promise.reject({ statusCode: 400, message: "User not Found." });
      }

      let existuser = await AppUser.findOne({
        fields: ["id", "email"],
        where: { username: body.username },
        // where: { or: [{ username: body.username }, { email: body.email  }]}
      });
      if (existuser !== null) {
        if (existuser.id !== userid) {
          return Promise.reject({
            statusCode: 400,
            message: "User Already register.",
          });
        }
      }

      let existEmail = await AppUser.findOne({
        fields: ["id", "email"],
        where: { email: body.email },
        // where: { or: [{ username: body.username }, { email: body.email  }]}
      });
      if (existEmail !== null) {
        console.log("exist", existEmail);
        if (existEmail.id !== body.id) {
          return Promise.reject({
            statusCode: 400,
            message: "Email Already register.",
          });
        }
      }

      // Check User

      if (typeof body.name === "undefined" || body.name === "") {
        return Promise.reject({
          statusCode: 400,
          message: "Missing user fullname.",
        });
      }

      if (typeof body.username === "undefined" || body.username === "") {
        return Promise.reject({
          statusCode: 400,
          message: "Missing username.",
        });
      }

      if (typeof body.email === "undefined" || body.email === "") {
        // create dummy email
        // body.email = body.username + Date.now() + '@appsystem.com'
        return Promise.reject({ statusCode: 400, message: "Missing email." });
      }

      // Check Role
      let _rolesMap = await app.models.RoleMapping.findOne({
        where: { principalId: _user.id },
      });
      if (_rolesMap === null) {
        return Promise.reject({
          statusCode: 400,
          message: "Cannot update this User.",
        });
      }
      let _roles = await app.models.Role.findOne({
        where: { id: _rolesMap.roleId },
      });
      if (_rolesMap === null) {
        return Promise.reject({
          statusCode: 400,
          message: "Cannot update this User.",
        });
      }

      // Check Role UserBy
      const token = options && options.accessToken;
      let _rolesMapUserBy = await app.models.RoleMapping.findOne({
        where: { principalId: token.userId },
      });
      if (_rolesMapUserBy === null) {
        return Promise.reject({ statusCode: 400, message: "Role not Found." });
      }
      let _rolesUserBy = await app.models.Role.findOne({
        where: { id: _rolesMapUserBy.roleId },
      });
      if (_rolesUserBy === null) {
        return Promise.reject({ statusCode: 400, message: "Role not Found." });
      }

      if (_rolesUserBy.name === Role.Admin) {
        if (_roles.name === Role.System) {
          return Promise.reject({
            statusCode: 400,
            message: "Cannot update this User.",
          });
        }
      } else if (_rolesUserBy.name === Role.Manager) {
        if (_roles.name === Role.System) {
          return Promise.reject({
            statusCode: 400,
            message: "UnAuthorized update this User.",
          });
        } else if (_roles.name === Role.Admin) {
          return Promise.reject({
            statusCode: 400,
            message: "UnAuthorized update this User.",
          });
        } else if (_roles.name === Role.Manager) {
          if (_user.id !== _userBy.id) {
            return Promise.reject({
              statusCode: 400,
              message: "UnAuthorized update this User.",
            });
          }
        }
      } else if (_rolesUserBy.name === Role.Supervisor) {
        if (_roles.name === Role.System) {
          return Promise.reject({
            statusCode: 400,
            message: "UnAuthorized update this User.",
          });
        } else if (_roles.name === Role.Admin) {
          return Promise.reject({
            statusCode: 400,
            message: "UnAuthorized update this User.",
          });
        } else if (_roles.name === Role.Manager) {
          return Promise.reject({
            statusCode: 400,
            message: "UnAuthorized update this User.",
          });
        } else if (_roles.name === Role.Supervisor) {
          if (_user.id !== _userBy.id) {
            return Promise.reject({
              statusCode: 400,
              message: "UnAuthorized update this User.",
            });
          }
        }
      } else {
        if (_user.id !== _userBy.id) {
          return Promise.reject({
            statusCode: 400,
            message: "UnAuthorized update this User.",
          });
        }
      }

      if (typeof body.username === "undefined") {
        return Promise.reject({
          statusCode: 400,
          message: "Cannot update username.",
        });
      }

      await AppUser.updateAll({ id: userid }, body);

      return Promise.resolve("OK");
    } catch (error) {
      return Promise.reject(error);
    }
  };
  AppUser.remoteMethod("updateUser", {
    description: `Update User`,
    isStatic: true,
    accepts: [
      { arg: "id", type: "number", required: true },
      { arg: "data", type: "object", required: true, http: { source: "body" } },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/update/:id", verb: "post" },
  });

  AppUser.changeProfile = async function (userid, contact, options) {
    console.log(contact)
    try {
      let _user = await AppUser.findOne({ where: { id: userid } });
      if (_user === null) {
        return Promise.reject({ statusCode: 400, message: "User not Found." });
      }



      if (contact.name === null || contact.name === undefined || contact.name === "") {
        return Promise.reject({ statusCode: 400, message: "Name cannot be empty" });
      }

      if (contact.contact === null || contact.contact === undefined || contact.contact === "") {
        return Promise.reject({ statusCode: 400, message: "Contact cannot be empty" });
      }

      if ((contact.name === null || contact.name === undefined) && (contact.contact === null || contact.contact === undefined)) {
        return Promise.reject({ statusCode: 400, message: "Name and contact cannot be empty" });
      }



      const token = options && options.accessToken;
      let _rolesMapUserBy = await app.models.RoleMapping.findOne({
        where: { principalId: token.userId },
      });
      if (_rolesMapUserBy === null) {
        return Promise.reject({ statusCode: 400, message: "Role not Found." });
      }
      let _rolesUserBy = await app.models.Role.findOne({
        where: { id: _rolesMapUserBy.roleId },
      });
      if (_rolesUserBy === null) {
        return Promise.reject({ statusCode: 400, message: "Role not Found." });
      }

      // if (_rolesUserBy.name === Role.Manager || _rolesUserBy.name === Role.Supervisor || _rolesUserBy.name === Role.NormalUser) {
      //     return Promise.reject({ statusCode: 400, message: 'UnAuthorized reset user Psssword.' })
      // }

      await AppUser.updateAll({ id: userid }, contact);
      return Promise.resolve("OK");
    } catch (error) {
      return Promise.reject(error);
    }
  };
  AppUser.remoteMethod("changeProfile", {
    description: `Change User Profile Information`,
    isStatic: true,
    accepts: [
      { arg: "id", type: "number", required: true },
      { arg: "data", type: "object", required: true, http: { source: "body" } },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/changeProfile/:id", verb: "post" },
  });

  // === Change User Role =======
  AppUser.changeUserRole = async function (userid, roleName, options) {
    try {
      let _user = await AppUser.findOne({ where: { id: userid } });
      if (_user === null) {
        return Promise.reject({ statusCode: 400, message: "User not Found." });
      }

      // Check Role
      let _roles = await app.models.Role.findOne({ where: { name: roleName } });
      if (_roles === null) {
        return Promise.reject({ statusCode: 400, message: "Role not Found." });
      }

      // Check Role UserBy
      const token = options && options.accessToken;
      let _rolesMapUserBy = await app.models.RoleMapping.findOne({
        where: { principalId: token.userId },
      });
      if (_rolesMapUserBy === null) {
        return Promise.reject({ statusCode: 400, message: "Role not Found." });
      }
      let _rolesUserBy = await app.models.Role.findOne({
        where: { id: _rolesMapUserBy.roleId },
      });
      if (_rolesUserBy === null) {
        return Promise.reject({ statusCode: 400, message: "Role not Found." });
      }

      if (
        _rolesUserBy.name === Role.Manager ||
        _rolesUserBy.name === Role.Supervisor ||
        _rolesUserBy.name === Role.NormalUser
      ) {
        return Promise.reject({
          statusCode: 400,
          message: "UnAuthorized change user Role.",
        });
      }

      if (_rolesUserBy.name === Role.Admin) {
        if (roleName === Role.System) {
          return Promise.reject({
            statusCode: 400,
            message: "Cannot change user Role.",
          });
        }
      }

      await app.models.RoleMapping.updateAll(
        { principalId: userid },
        { roleId: _roles.id }
      );

      return Promise.resolve("OK");
    } catch (error) {
      return Promise.reject(error);
    }
  };
  AppUser.remoteMethod("changeUserRole", {
    description: `Change User Role`,
    isStatic: true,
    accepts: [
      { arg: "id", type: "number", required: true },
      { arg: "roleName", type: "string", required: true },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/changeRole/:id", verb: "get" },
  });

  AppUser.resetPasswordUser = async function (userid, newPassword, options) {
    //User.setPassword(userId, newPassword, [options], callback)
    try {
      let _user = await AppUser.findOne({ where: { id: userid } });
      if (_user === null) {
        return Promise.reject({ statusCode: 400, message: "User not Found." });
      }

      // Check Role UserBy
      const token = options && options.accessToken;
      let _rolesMapUserBy = await app.models.RoleMapping.findOne({
        where: { principalId: token.userId },
      });
      if (_rolesMapUserBy === null) {
        return Promise.reject({ statusCode: 400, message: "Role not Found." });
      }
      let _rolesUserBy = await app.models.Role.findOne({
        where: { id: _rolesMapUserBy.roleId },
      });
      if (_rolesUserBy === null) {
        return Promise.reject({ statusCode: 400, message: "Role not Found." });
      }

      if (
        _rolesUserBy.name === Role.Manager ||
        _rolesUserBy.name === Role.Supervisor ||
        _rolesUserBy.name === Role.NormalUser
      ) {
        return Promise.reject({
          statusCode: 400,
          message: "UnAuthorized reset user Psssword.",
        });
      }

      await AppUser.setPassword(userid, newPassword);
      return Promise.resolve({ result: "OK" });
    } catch (error) {
      return Promise.reject(error);
    }
  };
  AppUser.remoteMethod("resetPasswordUser", {
    description: `Reset Password User`,
    isStatic: true,
    accepts: [
      { arg: "id", type: "number", required: true },
      { arg: "newPassword", type: "string", required: true },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/password/reset/:id", verb: "post" },
  });

  AppUser.testing = async function (userid, newPassword, options) {
    //User.setPassword(userId, newPassword, [options], callback)
    try {
      let _user = await AppUser.findOne({ where: { id: userid } });
      if (_user === null) {
        return Promise.reject({ statusCode: 400, message: "User not Found." });
      }

      // Check Role UserBy
      const token = options && options.accessToken;
      let _rolesMapUserBy = await app.models.RoleMapping.findOne({
        where: { principalId: token.userId },
      });
      if (_rolesMapUserBy === null) {
        return Promise.reject({ statusCode: 400, message: "Role not Found." });
      }
      let _rolesUserBy = await app.models.Role.findOne({
        where: { id: _rolesMapUserBy.roleId },
      });
      if (_rolesUserBy === null) {
        return Promise.reject({ statusCode: 400, message: "Role not Found." });
      }

      if (
        _rolesUserBy.name === Role.Manager ||
        _rolesUserBy.name === Role.Supervisor ||
        _rolesUserBy.name === Role.NormalUser
      ) {
        return Promise.reject({
          statusCode: 400,
          message: "UnAuthorized reset user Psssword.",
        });
      }

      await AppUser.setPassword(userid, newPassword);
      return Promise.resolve({ result: "OK" });
    } catch (error) {
      return Promise.reject(error);
    }
  };
  AppUser.remoteMethod("resetPasswordUser", {
    description: `Reset User Password`,
    isStatic: true,
    accepts: [
      { arg: "id", type: "number", required: true },
      { arg: "newPassword", type: "string", required: true },
      { arg: "options", type: "object", http: "optionsFromRequest" },
    ],
    returns: {
      type: "object",
      root: true,
    },
    http: { path: "/password/reset/testing/:id", verb: "post" },
  });
};

function _disableRemoteMethod(Model) {
  // GET
  Model.disableRemoteMethodByName("find");

  // POST
  Model.disableRemoteMethodByName("create");

  // PUT
  Model.disableRemoteMethodByName("replaceOrCreate");

  // PATCH
  Model.disableRemoteMethodByName("patchOrCreate");

  // GET /findOne
  Model.disableRemoteMethodByName("findOne");

  // GET /:id
  Model.disableRemoteMethodByName("findById");

  // GET /:id/exists
  Model.disableRemoteMethodByName("exists");

  // GET /count
  Model.disableRemoteMethodByName("count");

  // POST /update
  Model.disableRemoteMethodByName("updateAll");

  // DELETE /:id
  Model.disableRemoteMethodByName("deleteById");

  // PATCH /:id
  Model.disableRemoteMethodByName("prototype.patchAttributes");

  // PUT /:id
  Model.disableRemoteMethodByName("replaceById");

  // POST|GET	/change-stream
  Model.disableRemoteMethodByName("createChangeStream");

  // POST	/upsertWithWhere
  Model.disableRemoteMethodByName("upsertWithWhere");

  // POST /{id}/verify
  Model.disableRemoteMethodByName("prototype.verify");

  // GET /confirm
  Model.disableRemoteMethodByName("confirm");

  // POST /reset
  Model.disableRemoteMethodByName("resetPassword");

  // POST /MyUsers/reset-password
  Model.disableRemoteMethodByName("setPassword");

  //=================== From Related Model =====================================

  // POST /{id}/accessTokens
  Model.disableRemoteMethodByName("prototype.__create__accessTokens");

  // GET /{id}/accessTokens
  Model.disableRemoteMethodByName("prototype.__get__accessTokens");

  // DELETE /{id}/accessTokens
  Model.disableRemoteMethodByName("prototype.__delete__accessTokens");

  // GET /{id}/accessTokens/{fk}
  Model.disableRemoteMethodByName("prototype.__updateById__accessTokens");

  // GET /{id}/accessTokens/{fk}
  Model.disableRemoteMethodByName("prototype.__findById__accessTokens");

  // GET /{id}/accessTokens/{fk}
  Model.disableRemoteMethodByName("prototype.__count__accessTokens");

  // DELETE /{id}/accessTokens/{fk}
  Model.disableRemoteMethodByName("prototype.__destroyById__accessTokens");
}

async function __registerUser(app, body, cb) {
  console.log(body.username);
  try {
    // Check User
    let _user = await app.models.AppUser.findOne({
      where: { and: [{ username: body.username }, { isDeleted: false }] },
    });
    if (_user !== null) {
      return cb({ statusCode: 400, message: "User Already register." });
    }

    let _email = await app.models.AppUser.findOne({
      where: { and: [{ email: body.email }, { isDeleted: false }] },
    });
    if (_email !== null) {
      return cb({ statusCode: 400, message: "Email Already register." });
    }

    if (typeof body.name === "undefined" || body.name === "") {
      return cb({ statusCode: 400, message: "Missing user fullname." });
    }

    if (typeof body.username === "undefined" || body.username === "") {
      return cb({ statusCode: 400, message: "Missing username." });
    }
    if (typeof body.password === "undefined" || body.password === "") {
      return cb({ statusCode: 400, message: "Missing password." });
    }

    // ------------------------------------------------------
    if (typeof body.email === "undefined" || body.email === "") {
      // create dummy email
      // body.email = body.username + Date.now() + '@appsystem.com'
      return cb({ statusCode: 400, message: "Missing email." });
    }
    // ------------------------------------------------------

    // if (typeof (body.picture) === 'undefined') {
    //     return cb({ statusCode: 400, message: 'Missing user picture.' })
    // }

    // Check Role
    let _role = await app.models.Role.findOne({ where: { name: body.role } });
    if (_role === null) {
      return cb({ statusCode: 400, message: "Missing role." });
    }

    // Create User
    _user = await app.models.AppUser.create(body);

    // Create Role Mapping
    await app.models.RoleMapping.create({
      principalType: app.models.RoleMapping.USER,
      principalId: _user.id,
      roleId: _role.id,
    });

    // cb(null, _user)
    cb(null, { status: "OK", id: _user.id });
  } catch (err) {
    cb(err);
  }
}

async function __listUserWithEmail(app, ctx, cb) {
  console.log("email2", ctx);
  var email = ctx;
  console.log(ctx);

  try {
    let _user = await app.models.AppUser.findOne({ where: { email: ctx } });
    console.log(_user);

    function makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
    var temppwd = makeid(15);
    console.log(temppwd);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      type: "smtp",
      host: "smtp.private.com",
      secure: false,
      port: 587,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: "triplem5917@gmail.com",
        pass: "innates.my",
      },
      //   auth: {
      //     user: 'triplem5917@gmail.com',
      //     pass: 'innates.my'
      //   }
    });
    var mailOptions = {
      from: "triplem5917@gmail.com",
      to: email,
      subject: "myJentera Monitoring System - Temporary Password",
      html:
        "<p>Your username is: <strong>" +
        _user.username +
        "</strong>" +
        "<p>Your new password is: <strong>" +
        temppwd +
        "</strong>" +
        "<p>For security purpose, Please do not share the username and password with anyone. You are advised to change your password after login at user profile page. If you did not initiate this action, please change your password immediately and contact our customer support team. " +
        "<br><br><h3>MyJentera Development Team</h3>" +
        "<p>This is an automated message, please do not reply.",
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        return Promise.reject({
          statusCode: 400,
          message: "Reset password is unsuccessful",
        });
      } else {
        app.models.AppUser.updateAll(
          { email: email },
          { password: app.models.AppUser.hashPassword(temppwd) }
        );
        console.log("Email sent: " + info.response);
      }
    });

    Promise.resolve(null, { status: "OK", email: _user.email });
  } catch (err) {
    Promise.reject(err);
  }
}

async function __listUser(app, role, cb) {
  // console.log(app)
  // console.log(cb)
  try {
    // Check Role
    let _role = await app.models.Role.findOne({ where: { name: role } });
    if (_role === null) {
      return cb({ statusCode: 400, message: "Missing role." });
    }

    // Get UserId from RoleMapping
    let _userId = await app.models.RoleMapping.find({
      where: { roleId: _role.id },
    });
    if (_userId.length < 1) {
      return cb(null, _userId);
    }
    // console.log(_userId)
    let _arrId = [];
    _userId.forEach((element) => {
      _arrId.push({ id: element.principalId });
    });

    let _users = await app.models.AppUser.find({
      fields: [
        "id",
        "username",
        "name",
        "email",
        "company",
        "contact",
        "lastLogin",
        "createdDate",
      ],
      where: { and: [{ isDeleted: false }, { or: _arrId }] },
    });
    for (let index = 0; index < _users.length; index++) {
      _users[index].role = role;
    }

    cb(null, _users);
  } catch (err) {
    cb(err);
  }
}

async function __listAllUser(app, role, cb) {
  // console.log(app)
  // console.log(cb)
  try {
    // Check Role
    let _role = await app.models.Role.find();
    if (_role === null) {
      return cb({ statusCode: 400, message: "Missing role." });
    }
    // console.log(_role)

    // Get UserId from RoleMapping
    let _userId = await app.models.RoleMapping.find({
      where: { roleId: _role.id },
    });
    if (_userId.length < 1) {
      return cb(null, _userId);
    }
    console.log(_userId);

    for (let index = 0; index < _userId.length; index++) {
      for (let a = 0; a < _role.length; a++) {
        if (_userId[index].roleId === _role[a].id) {
          _userId[index].roleName = _role[a].name;
        } else if (_userId[index].roleId === _role[a].id) {
          _userId[index].roleName = _role[a].name;
        }
      }
    }

    // console.log(_userId)
    let _arrId = [];
    _userId.forEach((element) => {
      _arrId.push({ id: element.principalId });
    });

    let _users = await app.models.AppUser.find({
      fields: [
        "id",
        "username",
        "name",
        "email",
        "company",
        "contact",
        "lastLogin",
        "createdDate",
      ],
      where: { and: [{ isDeleted: false }, { or: _arrId }] },
    });
    for (let index = 0; index < _users.length; index++) {
      _users[index].role = _userId[index].roleName;
    }

    cb(null, _users);
  } catch (err) {
    cb(err);
  }
}
