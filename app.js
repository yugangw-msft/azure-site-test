/**
 * Copyright (c) Microsoft Corporation
 *  All Rights Reserved
 *  Apache License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @flow
 */

'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var util = require('util');
var bunyan = require('bunyan');
var config = require('./config');

// Start QuickStart here 
// 
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

// Add some logging
var log = bunyan.createLogger({
  name: 'Microsoft OIDC Example Web Application'
});


// Passport session setup (section 2)

//   To support persistent login sessions, Passport needs to be able to
//   serialize users into, and deserialize users out of, the session. Typically,
//   this is as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
  done(null, user.displayName);
});

passport.deserializeUser(function (id, done) {
  findByDisplayName(id, function (err, user) {
    done(err, user);
  });
});

// Array to hold signed-in users
var users = [];

var findByDisplayName = function (displayName, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    log.info('we are using user: ', user);
    if (user.displayName === displayName) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

// Use the OIDCStrategy within Passport (section 2)
//
//   Strategies in Passport require a `validate` function. The function accepts
//   credentials (in this case, an OpenID identifier), and invokes a callback
//   with a user object.
passport.use(new OIDCStrategy({
  redirectUrl: config.creds.returnURL,
  realm: config.creds.realm,
  clientID: config.creds.clientID,
  allowHttpForRedirectUrl:true,
  clientSecret: config.creds.clientSecret,
  oidcIssuer: config.creds.issuer,
  identityMetadata: config.creds.identityMetadata,
  responseType: config.creds.responseType,
  responseMode: config.creds.responseMode,
  skipUserProfile: config.creds.skipUserProfile,
  scope: config.creds.scope,
  validateIssuer: false
},
  function (iss, sub, profile, accessToken, refreshToken, done) {
    log.info('Example: display name we received was: ', profile.displayName);
    // Asynchronous verification, for effect...
    process.nextTick(function () {
      findByDisplayName(profile.displayName, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          // "Auto-registration"
          users.push(profile);
          return done(null, profile);
        }
        return done(null, user);
      });
    });
  }
));


// Set up Express (section 2)

var app = express();

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(cookieParser());
  app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
  app.use(bodyParser.urlencoded({ extended: true }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});
//Routes (section 4)

app.get('/', function (req, res) {
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function (req, res) {
  res.render('account', { user: req.user });
});

app.get('/login',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function (req, res) {
    log.info('Login was called in the sample');
    res.redirect('/');
  });

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// Auth routes (section 3)

// GET /auth/openid
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in OpenID authentication involves redirecting
//   the user to the user's OpenID provider. After authenticating, the OpenID
//   provider redirects the user back to this application at
//   /auth/openid/return.

app.get('/auth/openid',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function (req, res) {
    log.info('Authentication was called in the sample');
    res.redirect('/');
  });

// GET /auth/openid/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user is redirected back to the
//   sign-in page. Otherwise, the primary route function is called.
//   In this example, it redirects the user to the home page.
app.get('/auth/openid/return',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function (req, res) {

    res.redirect('/');
  });

// POST /auth/openid/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user is redirected back to the
//   sign-in page. Otherwise, the primary route function is called. 
//   In this example, it redirects the user to the home page.

app.post('/auth/openid/return',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function (req, res) {

    res.redirect('/');
  });

// Route middleware to ensure the user is authenticated (section 4)

//   Use this route middleware on any resource that needs to be protected. If
//   the request is authenticated (typically via a persistent login session),
//   the request proceeds. Otherwise, the user is redirected to the
//   sign-in page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.listen(3000);


// Simple route middleware to ensure user is authenticated. (Section 4)
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.


