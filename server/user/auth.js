const User = require(__dirname+'/schema.js');
const mongoose = require('mongoose');
const passport = require('passport');
const passportSocketIo = require("passport.socketio");
// var Recaptcha = require('express-recaptcha').Recaptcha;
// var recaptcha = new Recaptcha('6Lf4nUsUAAAAAMtjSbr2Nfj0iDrc3RSlkEzepIcN', '6Lf4nUsUAAAAANR6Vmkafh82L2Gf08AREuRicHS7');
module.exports = function(sd) {
	const router = sd.router('/api/user');
	sd.app.use(passport.initialize());
	sd.app.use(passport.session());
	sd.io.use(passportSocketIo.authorize({
		passport: passport,
		cookieParser: sd.cookieParser,
		key: 'express.sid.'+sd.config.prefix,
		secret: 'thisIsCoolSecretFromWaWFramework'+sd.config.prefix,
		store: sd.store,
		success: function(data, accept) {
			accept();
		}, fail: function(data, message, error, accept) {
			accept();
		}
	}));
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	router.get("/me", function(req, res) {
		var json = {};
		if(req.user){
			sd.User.schema.eachPath(function(path) {
				path = path.split('.')[0];
				if(path=='password'||path=='__v'||json[path]) return;
				json[path] = req.user[path];
			});
		}
		res.json(json);
	});
	router.post("/changePassword", sd.ensure, function(req, res) {
		if (req.user.validPassword(req.body.oldPass)){
			req.user.password = req.user.generateHash(req.body.newPass);
			req.user.save(function(){
				res.json(true);
			});
		}else res.json(false);
	});
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect(sd.config.passport.local.successRedirect);
	});
	var LocalStrategy = require('passport-local').Strategy;
	router.post('/login', passport.authenticate('local-login', {
		successRedirect: sd.config.passport.local.successRedirect,
		failureRedirect: sd.config.passport.local.failureRedirect
	}));
	passport.use('local-login', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, username, password, done) {
		User.findOne({
			'email' :  username.toLowerCase()
		}, function(err, user) {
			if (err) return done(err);
			if (!user) return done(null, false);
			if (!user.validPassword(password)) return done(null, false);
			return done(null, user);
		});
	}));
	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: sd.config.passport.local.successRedirect,
		failureRedirect: sd.config.passport.local.failureRedirect
	}));
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, username, password, done) {
		//recaptcha.verify(req, function(error) {
			User.findOne({
				'email': username.toLowerCase()
			}, function(err, user) {
				if (err) return done(err);
				if (user) return done(null, false);
				else {
					var newUser = new User();
					newUser.is = {
						admin: false
					};
					newUser.email = username.toLowerCase();
					newUser.password = newUser.generateHash(password);
					newUser.save(function(err) {
						if (err) throw err;
						return done(null, newUser);
					});
				}
			});
		//});
	}));
	// Google
	if (sd.config.passport.google) {
		var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
		router.get('/google', passport.authenticate('google', {
			scope: ['profile', 'email']
		}));
		router.get('/google/callback', passport.authenticate('google', {
			successRedirect: '/',
			failureRedirect: '/'
		}));
		passport.use('google', new GoogleStrategy({
			clientID: sd.config.passport.google.clientID,
			clientSecret: sd.config.passport.google.clientSecret,
			callbackURL: sd.config.passport.google.callbackURL,
			passReqToCallback: true
		}, function(req, token, refreshToken, profile, done) {
			User.findOne({
				_id: req.user._id
			}, function(err, user) {
				if (err) return done(err);
				if (user) {
					var google = {};
					google.id = profile.id;
					google.url = profile._json.url;
					req.user.saveGoogle(google, function() {});
					return done(null, user);
				}
			});
		}));
	}
	// Instagram
	if(sd.config.passport.instagram){
		var InstagramStrategy= require('passport-instagram').Strategy;
		router.get('/instagram',
			passport.authenticate('instagram')
		);
		router.get('/instagram/callback', passport.authenticate('instagram', {
			failureRedirect: '/login'
		}), function(req, res) {
			res.redirect('/');
		});
		passport.use('instagram',new InstagramStrategy({
			clientID : sd.config.passport.instagram.clientID,
			clientSecret : sd.config.passport.instagram.clientSecret,
			callbackURL : sd.config.passport.instagram.callbackURL,
			passReqToCallback:true
		}, function (req, accessToken, refreshToken, profile, done) {
			User.findOne({
				_id: req.user._id
			}, function(err, user) {
				if (err) return done(err);
				if (user) {
					var instagram = {};
					instagram.id = profile.id;
					instagram.username = profile.username;
					req.user.saveInstagram(instagram, function() {});
					return done(null, user);
				}
			});
		}));
	}
	// Facebook
	if(sd.config.passport.facebook){
		var FacebookStrategy = require('passport-facebook').Strategy;
		router.get('/facebook', passport.authenticate('facebook', {
			display: 'page',
			scope: 'email'
		}));
		router.get('/facebook/callback', passport.authenticate('facebook', {
			failureRedirect: '/login'
		}), function(req, res) {
			res.redirect('/');
		});
		passport.use('facebook',new FacebookStrategy({
			clientID: sd.config.passport.facebook.clientID,
			clientSecret: sd.config.passport.facebook.clientSecret,
			callbackURL: sd.config.passport.facebook.callbackURL,
			profileFields: ['id', 'profileUrl'],
			passReqToCallback:true
		}, function (req,token, refreshToken, profile, done) {
			User.findOne({
				 _id:req.user._id
			 },
			  function (err, user) {
				if (err)return done(err);
				if (user) {
					var facebook={};
					facebook.profileUrl=profile.profileUrl;
					facebook.id=profile.id;
					req.user.saveFacebook(facebook,function(){
					});
					return done(null, user);
				}
			});
		}));
	}
	// Twitter
	if(sd.config.passport.twitter){
		var TwitterStrategy = require('passport-twitter').Strategy;
		passport.use(new TwitterStrategy({
			consumerKey: sd.config.passport.twitter.consumerKey,
			consumerSecret: sd.config.passport.twitter.consumerSecret,
			callbackURL: sd.config.passport.twitter.callbackURL
		},function(token, tokenSecret, profile, done) {
			process.nextTick(function() {
				User.findOne({
					'twitter.id': profile.id
				}, function(err, user) {
					if (err) return done(err);
					else if (user) return done(null, user);
					else {
						var newUser = new User();
						newUser.twitter = {
							displayName : profile.displayName,
							username : profile.username,
							id : profile.id,
							token : token,
						}
						newUser.save(function(err) {
							if (err) throw err;
							return done(null, newUser);
						});
					}
				});
			});
		}));
		router.get('/twitter', passport.authenticate('twitter'));
		router.get('/twitter/callback', passport.authenticate('twitter', {
			successRedirect: sd.config.passport.twitter.successRedirect,
			failureRedirect: sd.config.passport.twitter.failureRedirect
		}),function(req, res) {
			res.redirect(sd.config.passport.twitter.successRedirect);
		});
	}
	// End of Crud
};