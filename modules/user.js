var USER = 'server.user';

var USER_REGISTRY = 'server.user.registry';

var USER_OPTIONS = 'server.user.options';

var USER_SPACE = 'server.user.space';

var USER_ROLE_PREFIX = 'private_';

/**
 * Initializes the user environment for the specified tenant. If it is already initialized, then will be skipped.
 */
var init = function (options) {
    var event = require('/modules/event.js');
    event.on('tenantCreate', function (tenantId) {
        var role, roles,
            server = require('/modules/server.js'),
            um = server.userManager(tenantId),
            options = server.options();
        roles = options.roles;
        for (role in roles) {
            if (roles.hasOwnProperty(role)) {
                if (um.roleExists(role)) {
                    um.authorizeRole(role, roles[role]);
                } else {
                    um.addRole(role, [], roles[role]);
                }
            }
        }
        /*user = um.getUser(options.user.username);
         if (!user.hasRoles(options.userRoles)) {
         user.addRoles(options.userRoles);
         }*/
        //application.put(key, options);
    });

    event.on('tenantLoad', function (tenantId) {

    });

    event.on('tenantUnload', function (tenantId) {

    });

    event.on('login', function (tenantId, user, session) {
        var space, um, perms,
            log = new Log(),
            server = require('/modules/server.js'),
            carbon = require('carbon'),
            registry = server.systemRegistry(tenantId);
        session.put(USER, user);
        session.put(USER_REGISTRY, new carbon.registry.Registry(server.server(), {
            username: user.username,
            tenantId: tenantId
        }));
        space = userSpace(user.username);
        session.put(USER_SPACE, space);
        if (!registry.exists(space)) {
            registry.put(space, {
                collection: true
            });
            if (log.isDebugEnabled()) {
                log.debug('user space was created for user : ' + user.username + ' at ' + space);
            }
        }
        if (!user.isAuthorized(space, carbon.registry.actions.PUT)) {
            um = server.userManager(tenantId);
            perms = {};
            perms[space] = [carbon.registry.actions.GET, carbon.registry.actions.PUT, carbon.registry.actions.DELETE];
            um.authorizeRole(privateRole(user.username), perms);
            if (log.isDebugEnabled()) {
                log.debug('user role ' + privateRole(user.username) + ' was authorized to access user space ' + space);
            }
        }
    });

    event.on('logout', function (tenantId, user, session) {
        session.remove(USER);
        session.remove(USER_SPACE);
        session.remove(USER_REGISTRY);
    });
};

/**
 * Returns user options of the tenant.
 * @return {Object}
 */
var options = function (tenantId) {
    var server = require('/modules/server.js');
    return server.configs(tenantId)[USER_OPTIONS];
};

/**
 * Logs in a user to the store. Username might contains the domain part in case of MT mode.
 * @param username ruchira or ruchira@ruchira.com
 * @param password
 * @param session
 * @return {boolean}
 */
var login = function (username, password, session) {
    var carbon = require('carbon'),
        event = require('/modules/event.js'),
        server = require('/modules/server.js'),
        serv = server.server();
    if (!serv.authenticate(username, password)) {
        return false;
    }
    return permitted(username, session);
};

var permitted = function (username, session) {
    //load the tenant if it hasn't been loaded yet.
    var opts, um, user, perms, perm, actions, length, i,
        authorized = false,
        carbon = require('carbon'),
        server = require('/modules/server.js'),
        event = require('/modules/event.js'),
        usr = carbon.server.tenantUser(username);
    if (!server.configs(usr.tenantId)) {
        event.emit('tenantCreate', usr.tenantId);
    }
    if (!server.configs(usr.tenantId)[USER_OPTIONS]) {
        event.emit('tenantLoad', usr.tenantId);
    }

    opts = options(usr.tenantId);
    //log.info(usr.tenantId);
    um = server.userManager(usr.tenantId);
    user = um.getUser(usr.username);
    perms = opts.permissions.login;
    L1:
        for (perm in perms) {
            if (perms.hasOwnProperty(perm)) {
                actions = perms[perm];
                length = actions.length;
                for (i = 0; i < length; i++) {
                    if (user.isAuthorized(perm, actions[i])) {
                        authorized = true;
                        break L1;
                    }
                }
            }
        }
    if (!authorized) {
        return false;
    }
    event.emit('login', usr.tenantId, user, session);
    //TODO: ??
    if (opts.login) {
        opts.login(user, password, session);
    }
    return true;
};

/**
 * Checks whether the logged in user has permission to the specified action.
 * @param user
 * @param permission
 * @param action
 * @return {*}
 */
var isAuthorized = function (user, permission, action) {
    var server = require('/modules/server.js'),
        um = server.userManager(user.tenantId);
    return um.getUser(user.username).isAuthorized(permission, action);
};

/**
 * Returns the user's registry space. This should be called once with the username,
 * then can be called without the username.
 * @param username ruchira
 * @return {*}
 */
var userSpace = function (username) {
    try {
        return require('/modules/server.js').options().userSpace.store + '/' + username;
    } catch (e) {
        return null;
    }
};

/**
 * Get the registry instance belongs to logged in user.
 * @return {*}
 */
var userRegistry = function (session) {
    try {
        return session.get(USER_REGISTRY);
    } catch (e) {
        return null;
    }
};

/**
 * Logs out the currently logged in user.
 */
var logout = function () {
    var user = current(session),
        event = require('/modules/event.js'),
        opts = options(user.tenantId);
    if (opts.logout) {
        opts.logout(user, session);
    }
    event.emit('logout', user.tenantId, user, session);
};

/**
 * Checks whether the specified username already exists.
 * @param username ruchira@ruchira.com(multi-tenanted) or ruchira
 * @return {*}
 */
var userExists = function (username) {
    var server = require('/modules/server.js'),
        carbon = require('carbon'),
        usr = carbon.server.tenantUser(username);
    return server.userManager(usr.tenantId).userExists(usr.username);
};

var privateRole = function (username) {
    return USER_ROLE_PREFIX + username;
};

/*
 The function is used to fill the permissions object. The permissions are applied
 to the users space e.g. username= test , and the gadget collection in the /_system/governance
 then the permissions will be applicable to
 /_system/governance/gadget/test.
 @username: The username of the account to which the permissions will be attached
 @permissions: An object of permissions which will be assigned to the newly created user role
 */
var buildPermissionsList=function(username,permissions,server){
    log.info('Entered buildPermissionsList');

    //Obtain the accessible collections
    var accessible=options().userSpace.accessible;
    log.info(stringify(accessible));

    var id;
    var accessibleContext;
    var accessibleCollections;
    var context;
    var actions;
    var collection;
    var sysRegistry=server.systemRegistry();;

    //Go through all of the accessible directives
    for(var index in accessible){

        accessibleContext=accessible[index];

        accessibleCollections=accessibleContext.collections;

        context=accessibleContext.context;     //e.g. /_system/governance/
        actions=accessibleContext.actions;     //read,write

        //Go through all of the collections
        for(var colIndex in accessibleCollections){

            collection=accessibleCollections[colIndex];

            //Create the id used for the permissions
            id=context+'/'+collection+'/'+username;


            //Check if a collection exists
            var col=sysRegistry.get(id);

            //Only add permissions if the path  does not exist
            if(col==undefined){
                log.info('collection: '+id+' does not exist.');
                //Assign the actions to the id
                permissions[id]=actions;

                //Create a dummy collection, as once permissions are
                //the user will be unable to create assets in the
                //parent collection.
                //Thus we create a user collection.
                sysRegistry=server.systemRegistry();

                //Create a new collection if a new one does not exist
                sysRegistry.put(id,{
                    collection:true
                });
            }
            else{
                log.info('collection: '+id+'is present.');
            }
        }

    }

    return permissions;
};

/*
 The function is used to configure a user that is about to login
 It performs the following;
 1. Add permissions for the accessible collections
 2. Assign a set of default roles (private_username and publisher)
 3. Check if a collection exists,if not create a new one.
 */

var configureUser=function(username){

    //Ignore adding permissions for the admin
    if(username=='admin'){
        return;
    }

    var server=require('/modules/server.js');
    var um=server.userManager();
    var opts=options();
    var user=um.getUser(username);
    var perms={};
    var role=privateRole(username);
    var defaultRoles=opts.userRoles;

    log.info('Starting configuringUser.');

    //Create the permissions in the options configuration file
    perms=buildPermissionsList(username,perms,server);

    //Only add the role if permissions are present

    if(!checkIfEmpty(perms)){

        //log.info('length: '+perms.length);

        //Register the role
        //We assume that the private_role is already present
        //TODO: This needs to be replaced.
        um.authorizeRole(role,perms);

        //log.info('after add role');

        //user.addRoles(role);
    }

};

var checkIfEmpty=function(object){
    for(var index in object){
        if(object.hasOwnProperty(index)){
            return false;
        }
    }

    return true;
}

var register = function (username, password) {
    var user, role, id, perms, r, p,
        server = require('/modules/server.js'),
        carbon = require('carbon'),
        event = require('/modules/event.js'),
        usr = carbon.server.tenantUser(username),
        um = server.userManager(usr.tenantId),
        opts = options(usr.tenantId);
    um.addUser(usr.username, password, opts.userRoles);
    user = um.getUser(usr.username);
    role = privateRole(usr.username);
    id = userSpace(usr.username);
    perms = {};
    perms[id] = [
        'http://www.wso2.org/projects/registry/actions/get',
        'http://www.wso2.org/projects/registry/actions/add',
        'http://www.wso2.org/projects/registry/actions/delete',
        'authorize'
    ];
    p = opts.permissions.login;
    for (r in p) {
        if (p.hasOwnProperty(r)) {
            perms[r] = p[r];
        }
    }
    um.addRole(role, [], perms);
    user.addRoles([role]);
    if (opts.register) {
        opts.register(user, password, session);
    }
    event.emit('userRegister', usr.tenantId, user);
    login(username, password);
};

/**
 * Returns the currently logged in user
 */
var current = function (session) {
    try {
        return session.get(USER);
    } catch (e) {
        return null;
    }
};

var loginWithSAML = function (username) {
    return permitted(username, session);
};
