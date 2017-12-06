var mootools = require ('mootools'),
	path = require ('path'),
	util = require('util'),
	winston = require('winston');

module.exports = new Class({
  Implements: [Options, Events],
  
  logger: null,
  
  //options : {
		//error: 
		//access:
		//profile:
		//path: 
	//},
	
	initialize: function(app, options){
		
		this.setOptions(options);
		throw new Error('logger');
		//this.logger = winston;
		//this.logger = winston.createLogger(); //winston@3.0.0-rc1
	
		//this.logger.loggers.options.transports = [
			//new (winston.transports.File)({
				//filename: path.resolve(options.path) + '/all.log',
				////handleExceptions: true,
			//}),
		//];
		
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
  extend_app: function(app){
		
		var profile = function(string){
			//this.logger.loggers.get('profiling').profile(string);
		}.bind(this);
		
		var log = function(name, type, string){
			
			//if(!this.logger.loggers[name])
				//this.logger.loggers.add(name, {
					//transports: [
						//new (winston.transports.File)( {
							//filename: path.resolve(this.options.path) + '/' + name + '.log'
						//}),
					//]
				//});
			
			//this.logger.loggers.get(name).log(type, string);
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
			//this.logger.loggers.get('access').log('info', req.method + ' ' + req.url  + ' - HTTP ' + req.httpVersion);
			return next();
		}.bind(this);
  }

});

