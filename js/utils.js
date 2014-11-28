// 
//  utils.js
//  Global
//  
//  Created by Dowsy on 2013-06-20.
//  Copyright 2013 Dowsy. All rights reserved.
// 

'use strict';

/**
 * Creates a function-constructor, that has parent as a prototpe
 * properties -- prototype's methods and fields
 * initfn -- function, that runs as a constructor (this can be used within it)
 */
function inherit(parent, properties, initfn) {
	
	if (properties != null && typeof properties !== "object")
		throw "Not an object";

	if (initfn != null && typeof initfn !== "function")
		throw "Not a function";

	var result = function() {
		if (this==null)
			throw 'This function is a constructor';
		
		if (initfn != null)
			initfn.apply(this, arguments);//call init funtion relative to new object, passing it all arguments
	};

	parent = parent || {};
 	if  (typeof parent === "object")
		result.prototype = Object.create(parent);
	
	if  (typeof parent === "function")
		result.prototype = parent.prototype;
		
	Object.defineProperty(result.prototype, "constructor", {
		value : result
	});

	if (properties != null) {
		var propnames = Object.getOwnPropertyNames(properties), name;
		for (var p in propnames) {
			name = propnames[p];
			result.prototype[name] = properties[name];
		}
	};

	return result;
}

/**
 * Extends object with all own props of exteder object 
 */
function extend(object, extender){
	throw 'not implemented';
}
