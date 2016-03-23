var mootools = require ('mootools'),
	path = require ('path'),
	util = require('util'),
	winston = require('winston');

module.exports = new Class({
  Implements: [Options, Events],
  
  logger: null,
  
  initialize: function(app, options){
	
// 	console.log(util.inspect(server,{depth: 10}));
	
	this.setOptions(options);
// 	
// 	this.logger = new (winston.Logger)({
// 	  transports: [
// // 		new (winston.transports.Console)(),
// 		new (winston.transports.File)( {
// 		  filename: path.resolve(options.path) + '/all_log',
// // 		  handleExceptions: true
// 		}),
// 	  ],
// 	  exitOnError: false
// 	});
	
// 	this.logger.add('error', {
// 	  file: {
// 		filename: path.resolve(options.path) + '/error_log',
// 	  },
// 	  
// 	});
// 
	this.logger = winston;
// 	this.logger.exitOnError = false;
	
// 	console.log('logger');
// 	console.log(this);
// 	
// 	
	this.logger.loggers.options.transports = [
	  new (winston.transports.File)( {
		filename: path.resolve(options.path) + '/all_log',
// 		handleExceptions: true,
	  }),
	];

	
// 	this.logger.loggers.add('error', {
// 	  file: {
// 		filename: path.resolve(options.path) + '/error_log',
// 	  },
// 	  
// 	});
	this.logger.loggers.add('error', {
	  transports: [
		new (winston.transports.File)( {
		  filename: path.resolve(options.path) + '/error_log',
  // 		handleExceptions: true,
		}),
	  ]
	  
	});

// 	this.logger.loggers.add('access', {
// 	  file: {
// 		filename: path.resolve(options.path) + '/access_log'
// 	  }
// 	});
	
	this.logger.loggers.add('access', {
	  transports: [
		new (winston.transports.File)( {
		  filename: path.resolve(options.path) + '/access_log',
  // 		handleExceptions: true,
		}),
	  ]
	  
	});
	
// 	this.logger.loggers.add('profiling', {
// 	  file: {
// 		filename: path.resolve(options.path) + '/profile'
// 	  }
// 	});
	this.logger.loggers.add('profiling', {
	  transports: [
		new (winston.transports.File)( {
		  filename: path.resolve(options.path) + '/profiling_log',
  // 		handleExceptions: true,
		}),
	  ]
	  
	});
	
	this.extend_app(app);
	app.addEvent(app.ON_LOAD_APP, this.extend_app.bind(this));
	
	
	
// 	console.log(server);
  },
  extend_app: function(app){
	//console.log('extend app');
	//console.log(app);
	
	var profile = function(string){
	  this.logger.loggers.get('profiling').profile(string);
	}.bind(this);
	
	var log = function(name, type, string){
	  
// 	  console.log(this.logger.loggers.get('access'));
	  
	  if(!this.logger.loggers[name])
		this.logger.loggers.add(name, {
		  transports: [
			new (winston.transports.File)( {
			  filename: path.resolve(this.options.path) + '/' + name + '_log'
			}),
		  ]
		});
		
	  this.logger.loggers.get(name).log(type, string);
	}.bind(this);
		
	if(typeof(app) == 'function'){
		app.implement({
			profile: profile,
			log: log
		});
	}
	else{
		app['profile'] = profile;
		
		app['log'] = log;
	}
  },
  //express middleware
  access: function(){
	return function access(req, res, next) {
	  this.logger.loggers.get('access').log('info', req.method + ' ' + req.url  + ' - HTTP ' + req.httpVersion);
	  return next();
	}.bind(this);
  }

});

