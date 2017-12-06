var mootools = require ('mootools'),
	path = require ('path'),
	util = require('util'),
	winston = require('winston');

module.exports = new Class({
  Implements: [Options, Events],
  
  logger: winston,
  id: '',
  
  options : {
		loggers: {
			error: {
				level: 'error',
				transports: [
					{ transport: winston.transports.Console, options: {} },
					{ transport: winston.transports.File, options: {filename: 'error.log'} }
				]
			},
			access: {
				level: 'info',
				transports: [
					{ transport: winston.transports.Console, options: {} },
					{ transport: winston.transports.File, options: {filename: 'access.log'} }
				]
			},
			profiling: {
				//level: 'info',
				transports: [
					{ transport: winston.transports.File, options: {filename: 'profiling.log'} }
				]
			},
		},
		path: '',
		//{ emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7 }
		//console_level: 'error',
		//default_level: 'info',
		default: {
			level: 'info',
			transports: [
				{ transport: winston.transports.Console, options: {} },
				{ transport: winston.transports.File, options: {filename: null} }
			]
		},
	},
	
	initialize: function(app, options){
		//const mount = app.app.mountpath || app.options.path;
		//console.log(app);
			//throw new Error();
		options.id = options.id || app.options.path.replace("/", "").replace(/\//g, ".");
		
		this.logger.setLevels(winston.config.syslog.levels);
		
		this.setOptions(options);
		
		console.log('this.name: '+this.options.id);
		
		//throw new Error('logger');
		//this.logger = winston;
		//this.logger = winston.createLogger(); //winston@3.0.0-rc1
	
		//this.logger.loggers.options.transports = [
			//new (winston.transports.File)({
				//filename: path.resolve(options.path) + '/all.log',
				////handleExceptions: true,
			//}),
		//];
		if(this.options.loggers){
			Object.each(this.options.loggers, function(logger, type){
				console.log(type);
				console.log(typeof(logger));
				console.log(typeof(winston.transports.Console));
				
				//if(logger && logger !== null){
					//this.logger.loggers.add(type, logger);
				//}
				//else{
					////console.log(path.resolve(this.options.path) + '/' + type + '.log');
					//this.logger.loggers.add(type, this.create_default_logger(type));

				//}
			}.bind(this));
		}
		//this.logger.loggers.add('error', {
			//transports: [
				//new (winston.transports.File)( {
					//filename: path.resolve(options.path) + '/error.log',
			 		////handleExceptions: true,
				//}),
			//]
			
		//});

		//this.logger.loggers.add('access', {
			//transports: [
				//new (winston.transports.File)( {
					//filename: path.resolve(options.path) + '/access.log',
				//}),
			//]
			
		//});
		
		//this.logger.loggers.add('profiling', {
			//transports: [
				//new (winston.transports.File)( {
					//filename: path.resolve(options.path) + '/profiling.log',
					////handleExceptions: true,
				//}),
			//]
			
		//});
		
		this.extend_app(app);
		
		app.addEvent(app.ON_LOAD_APP, this.extend_app.bind(this));
		
  },
  create_default_logger: function(name){
		var self = this;
		
		var console_level = this.options.console_level;
		//var default_level = this.options.default_level;
		
		var options = Object.clone(self.options.default_logger.options);
		
		if(process.env.LOG_ENV)
			console_level = options.level = process.env.LOG_ENV;
			
		filename = path.resolve(self.options.path) + '/' + name + '.log';
		if(
			self.options.default_logger.transport == winston.transports.File && 
			options.filename == null
		){
			options.filename = path.resolve(self.options.path) + '/' + name + '.log';
		}
		
		return logger = {
			transports: [
				new (winston.transports.Console)({ level: console_level }),
				new (self.options.default_logger.transport)(options),
			]
		};
		
		
	},
  extend_app: function(app){
		
		var profile = function(string){
			this.logger.loggers.get('profiling').profile(string);
		}.bind(this);
		
		var log = function(name, type, string){
			
			if(!this.logger.loggers[name])
				this.logger.loggers.add(name, this.create_default_logger(name));
			
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
  },
  /*error: function(){
		return function error(req, res, next) {
			console.log('---res.statusCode--');
			console.log(res.statusCode);
			//this.logger.loggers.get('access').log('info', req.method + ' ' + req.url  + ' - HTTP ' + req.httpVersion);
			return next();
		}.bind(this);
  }*/

});

