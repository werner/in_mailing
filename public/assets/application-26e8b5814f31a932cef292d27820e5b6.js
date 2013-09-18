/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /^[^{]+\{\s*\[native code/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		while ( (elem = this[i++]) ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self,
			len = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.hover = function( fnOver, fnOut ) {
	return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					isSuccess = true;
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
	var conv2, current, conv, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var value, name, index, easing, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var prop, index, length,
		value, dataShow, toggle,
		tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number if issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  var alreadyInitialized = function() {
    var events = $._data(document, 'events');
    return events && events.click && $.grep(events.click, function(e) { return e.namespace === 'rails'; }).length;
  }

  if ( alreadyInitialized() ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($(document), 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        // If browser does not support submit bubbling, then this live-binding will be called before direct
        // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
        if (!$.support.submitBubbles && $().jquery < '1.7' && rails.callFormSubmitBindings(form, e) === false) return rails.stopEverything(e);

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(window.jQuery);
/*

Holder - 2.0 - client side image placeholders
(c) 2012-2013 Ivan Malopinsky / http://imsky.co

Provided under the Apache 2.0 License: http://www.apache.org/licenses/LICENSE-2.0
Commercial use requires attribution.

*/


var Holder = Holder || {};
(function (app, win) {

var preempted = false,
fallback = false,
canvas = document.createElement('canvas');

//getElementsByClassName polyfill
document.getElementsByClassName||(document.getElementsByClassName=function(e){var t=document,n,r,i,s=[];if(t.querySelectorAll)return t.querySelectorAll("."+e);if(t.evaluate){r=".//*[contains(concat(' ', @class, ' '), ' "+e+" ')]",n=t.evaluate(r,t,null,0,null);while(i=n.iterateNext())s.push(i)}else{n=t.getElementsByTagName("*"),r=new RegExp("(^|\\s)"+e+"(\\s|$)");for(i=0;i<n.length;i++)r.test(n[i].className)&&s.push(n[i])}return s})

//getComputedStyle polyfill
window.getComputedStyle||(window.getComputedStyle=function(e,t){return this.el=e,this.getPropertyValue=function(t){var n=/(\-([a-z]){1})/g;return t=="float"&&(t="styleFloat"),n.test(t)&&(t=t.replace(n,function(){return arguments[2].toUpperCase()})),e.currentStyle[t]?e.currentStyle[t]:null},this})

//http://javascript.nwbox.com/ContentLoaded by Diego Perini with modifications
function contentLoaded(n,t){var l="complete",s="readystatechange",u=!1,h=u,c=!0,i=n.document,a=i.documentElement,e=i.addEventListener?"addEventListener":"attachEvent",v=i.addEventListener?"removeEventListener":"detachEvent",f=i.addEventListener?"":"on",r=function(e){(e.type!=s||i.readyState==l)&&((e.type=="load"?n:i)[v](f+e.type,r,u),!h&&(h=!0)&&t.call(n,null))},o=function(){try{a.doScroll("left")}catch(n){setTimeout(o,50);return}r("poll")};if(i.readyState==l)t.call(n,"lazy");else{if(i.createEventObject&&a.doScroll){try{c=!n.frameElement}catch(y){}c&&o()}i[e](f+"DOMContentLoaded",r,u),i[e](f+s,r,u),n[e](f+"load",r,u)}};

//https://gist.github.com/991057 by Jed Schmidt with modifications
function selector(a){
	a=a.match(/^(\W)?(.*)/);var b=document["getElement"+(a[1]?a[1]=="#"?"ById":"sByClassName":"sByTagName")](a[2]);
	var ret=[];	b!=null&&(b.length?ret=b:b.length==0?ret=b:ret=[b]);	return ret;
}

//shallow object property extend
function extend(a,b){var c={};for(var d in a)c[d]=a[d];for(var e in b)c[e]=b[e];return c}

//hasOwnProperty polyfill
if (!Object.prototype.hasOwnProperty)
	Object.prototype.hasOwnProperty = function(prop) {
		var proto = this.__proto__ || this.constructor.prototype;
		return (prop in this) && (!(prop in proto) || proto[prop] !== this[prop]);
	}

function text_size(width, height, template) {
	height = parseInt(height,10);
	width = parseInt(width,10);
	var bigSide = Math.max(height, width)
	var smallSide = Math.min(height, width)
	var scale = 1 / 12;
	var newHeight = Math.min(smallSide * 0.75, 0.75 * bigSide * scale);
	return {
		height: Math.round(Math.max(template.size, newHeight))
	}
}

function draw(ctx, dimensions, template, ratio) {
	var ts = text_size(dimensions.width, dimensions.height, template);
	var text_height = ts.height;
	var width = dimensions.width * ratio,
		height = dimensions.height * ratio;
	var font = template.font ? template.font : "sans-serif";
	canvas.width = width;
	canvas.height = height;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = template.background;
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = template.foreground;
	ctx.font = "bold " + text_height + "px " + font;
	var text = template.text ? template.text : (Math.floor(dimensions.width) + "x" + Math.floor(dimensions.height));
	var text_width = ctx.measureText(text).width;
	if (text_width / width >= 0.75) {
		text_height = Math.floor(text_height * 0.75 * (width/text_width));
	}
	//Resetting font size if necessary
	ctx.font = "bold " + (text_height * ratio) + "px " + font;
	ctx.fillText(text, (width / 2), (height / 2), width);
	return canvas.toDataURL("image/png");
}

function render(mode, el, holder, src) {
	var dimensions = holder.dimensions,
		theme = holder.theme,
		text = holder.text ? decodeURIComponent(holder.text) : holder.text;
	var dimensions_caption = dimensions.width + "x" + dimensions.height;
	theme = (text ? extend(theme, {
		text: text
	}) : theme);
	theme = (holder.font ? extend(theme, {
		font: holder.font
	}) : theme);
	if (mode == "image") {
		el.setAttribute("data-src", src);
		el.setAttribute("alt", text ? text : theme.text ? theme.text + " [" + dimensions_caption + "]" : dimensions_caption);
		if (fallback || !holder.auto) {
			el.style.width = dimensions.width + "px";
			el.style.height = dimensions.height + "px";
		}
		if (fallback) {
			el.style.backgroundColor = theme.background;
		} else {
			el.setAttribute("src", draw(ctx, dimensions, theme, ratio));
		}
	} else if (mode == "background") {
		if (!fallback) {
			el.style.backgroundImage = "url(" + draw(ctx, dimensions, theme, ratio) + ")";
			el.style.backgroundSize = dimensions.width + "px " + dimensions.height + "px";
		}
	} else if (mode == "fluid") {
		el.setAttribute("data-src", src);
		el.setAttribute("alt", text ? text : theme.text ? theme.text + " [" + dimensions_caption + "]" : dimensions_caption);
		if (dimensions.height.substr(-1) == "%") {
			el.style.height = dimensions.height
		} else {
			el.style.height = dimensions.height + "px"
		}
		if (dimensions.width.substr(-1) == "%") {
			el.style.width = dimensions.width
		} else {
			el.style.width = dimensions.width + "px"
		}
		if (el.style.display == "inline" || el.style.display == "") {
			el.style.display = "block";
		}
		if (fallback) {
			el.style.backgroundColor = theme.background;
		} else {
			el.holderData = holder;
			fluid_images.push(el);
			fluid_update(el);
		}
	}
};

function fluid_update(element) {
	var images;
	if (element.nodeType == null) {
		images = fluid_images;
	} else {
		images = [element]
	}
	for (i in images) {
		var el = images[i]
		if (el.holderData) {
			var holder = el.holderData;
			el.setAttribute("src", draw(ctx, {
				height: el.clientHeight,
				width: el.clientWidth
			}, holder.theme, ratio));
		}
	}
}

function parse_flags(flags, options) {

	var ret = {
		theme: settings.themes.gray
	}, render = false;

	for (sl = flags.length, j = 0; j < sl; j++) {
		var flag = flags[j];
		if (app.flags.dimensions.match(flag)) {
			render = true;
			ret.dimensions = app.flags.dimensions.output(flag);
		} else if (app.flags.fluid.match(flag)) {
			render = true;
			ret.dimensions = app.flags.fluid.output(flag);
			ret.fluid = true;
		} else if (app.flags.colors.match(flag)) {
			ret.theme = app.flags.colors.output(flag);
		} else if (options.themes[flag]) {
			//If a theme is specified, it will override custom colors
			ret.theme = options.themes[flag];
		} else if (app.flags.text.match(flag)) {
			ret.text = app.flags.text.output(flag);
		} else if (app.flags.font.match(flag)) {
			ret.font = app.flags.font.output(flag);
		} else if (app.flags.auto.match(flag)) {
			ret.auto = true;
		}
	}

	return render ? ret : false;

};



if (!canvas.getContext) {
	fallback = true;
} else {
	if (canvas.toDataURL("image/png")
		.indexOf("data:image/png") < 0) {
		//Android doesn't support data URI
		fallback = true;
	} else {
		var ctx = canvas.getContext("2d");
	}
}

var dpr = 1, bsr = 1;

if(!fallback){
    dpr = window.devicePixelRatio || 1,
    bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
}

var ratio = dpr / bsr;

var fluid_images = [];

var settings = {
	domain: "holder.js",
	images: "img",
	bgnodes: ".holderjs",
	themes: {
		"gray": {
			background: "#eee",
			foreground: "#aaa",
			size: 12
		},
		"social": {
			background: "#3a5a97",
			foreground: "#fff",
			size: 12
		},
		"industrial": {
			background: "#434A52",
			foreground: "#C2F200",
			size: 12
		}
	},
	stylesheet: ".holderjs-fluid {font-size:16px;font-weight:bold;text-align:center;font-family:sans-serif;margin:0}"
};


app.flags = {
	dimensions: {
		regex: /^(\d+)x(\d+)$/,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				width: +exec[1],
				height: +exec[2]
			}
		}
	},
	fluid: {
		regex: /^([0-9%]+)x([0-9%]+)$/,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				width: exec[1],
				height: exec[2]
			}
		}
	},
	colors: {
		regex: /#([0-9a-f]{3,})\:#([0-9a-f]{3,})/i,
		output: function (val) {
			var exec = this.regex.exec(val);
			return {
				size: settings.themes.gray.size,
				foreground: "#" + exec[2],
				background: "#" + exec[1]
			}
		}
	},
	text: {
		regex: /text\:(.*)/,
		output: function (val) {
			return this.regex.exec(val)[1];
		}
	},
	font: {
		regex: /font\:(.*)/,
		output: function (val) {
			return this.regex.exec(val)[1];
		}
	},
	auto: {
		regex: /^auto$/
	}
}

for (var flag in app.flags) {
	if (!app.flags.hasOwnProperty(flag)) continue;
	app.flags[flag].match = function (val) {
		return val.match(this.regex)
	}
}

app.add_theme = function (name, theme) {
	name != null && theme != null && (settings.themes[name] = theme);
	return app;
};

app.add_image = function (src, el) {
	var node = selector(el);
	if (node.length) {
		for (var i = 0, l = node.length; i < l; i++) {
			var img = document.createElement("img")
			img.setAttribute("data-src", src);
			node[i].appendChild(img);
		}
	}
	return app;
};

app.run = function (o) {
	var options = extend(settings, o),
	    images = [], imageNodes = [], bgnodes = [];

	if(typeof(options.images) == "string"){
	    imageNodes = selector(options.images);
	}
	else if (window.NodeList && options.images instanceof window.NodeList) {
		imageNodes = options.images;
	} else if (window.Node && options.images instanceof window.Node) {
		imageNodes = [options.images];
	}

	if(typeof(options.bgnodes) == "string"){
	    bgnodes = selector(options.bgnodes);
	} else if (window.NodeList && options.elements instanceof window.NodeList) {
		bgnodes = options.bgnodes;
	} else if (window.Node && options.bgnodes instanceof window.Node) {
		bgnodes = [options.bgnodes];
	}

	preempted = true;

	for (i = 0, l = imageNodes.length; i < l; i++) images.push(imageNodes[i]);

	var holdercss = document.getElementById("holderjs-style");
	if (!holdercss) {
		holdercss = document.createElement("style");
		holdercss.setAttribute("id", "holderjs-style");
		holdercss.type = "text/css";
		document.getElementsByTagName("head")[0].appendChild(holdercss);
	}

	if (!options.nocss) {
	    if (holdercss.styleSheet) {
		    holdercss.styleSheet.cssText += options.stylesheet;
	    } else {
		    holdercss.appendChild(document.createTextNode(options.stylesheet));
	    }
	}

	var cssregex = new RegExp(options.domain + "\/(.*?)\"?\\)");

	for (var l = bgnodes.length, i = 0; i < l; i++) {
		var src = window.getComputedStyle(bgnodes[i], null)
			.getPropertyValue("background-image");
		var flags = src.match(cssregex);
		var bgsrc = bgnodes[i].getAttribute("data-background-src");

		if (flags) {
			var holder = parse_flags(flags[1].split("/"), options);
			if (holder) {
				render("background", bgnodes[i], holder, src);
			}
		}
		else if(bgsrc != null){
		    var holder = parse_flags(bgsrc.substr(bgsrc.lastIndexOf(options.domain) + options.domain.length + 1)
				.split("/"), options);
		    if(holder){
			render("background", bgnodes[i], holder, src);
		    }
		}
	}

	for (l = images.length, i = 0; i < l; i++) {

		var attr_src = attr_data_src = src = null;

		try{
		    attr_src = images[i].getAttribute("src");
		    attr_datasrc = images[i].getAttribute("data-src");
		}catch(e){}

		if (attr_datasrc == null && !! attr_src && attr_src.indexOf(options.domain) >= 0) {
			src = attr_src;
		} else if ( !! attr_datasrc && attr_datasrc.indexOf(options.domain) >= 0) {
			src = attr_datasrc;
		}

		if (src) {
			var holder = parse_flags(src.substr(src.lastIndexOf(options.domain) + options.domain.length + 1)
				.split("/"), options);
			if (holder) {
				if (holder.fluid) {
					render("fluid", images[i], holder, src)
				} else {
					render("image", images[i], holder, src);
				}
			}
		}
	}
	return app;
};

contentLoaded(win, function () {
	if (window.addEventListener) {
		window.addEventListener("resize", fluid_update, false);
		window.addEventListener("orientationchange", fluid_update, false);
	} else {
		window.attachEvent("onresize", fluid_update)
	}
	preempted || app.run();
});

if (typeof define === "function" && define.amd) {
	define("Holder", [], function () {
		return app;
	});
}

})(Holder, window);













// Generated by CoffeeScript 1.3.3

/*
  jquery.turbolinks.js ~ v0.2.1 ~ https://github.com/kossnocorp/jquery.turbolinks

  jQuery plugin for drop-in fix binded events problem caused by Turbolinks

  The MIT License

  Copyright (c) 2012 Sasha Koss
*/



(function() {
  var $, callbacks, ready;

  $ = (typeof require === "function" ? require('jquery') : void 0) || window.jQuery;

  callbacks = [];

  ready = function() {
    var callback, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
      callback = callbacks[_i];
      _results.push(callback($));
    }
    return _results;
  };

  $(ready);

  $.fn.ready = function(callback) {
    return callbacks.push(callback);
  };

  $.setReadyEvent = function(event) {
    return $(document).off('.turbolinks').on(event + '.turbolinks', ready);
  };

  $.setReadyEvent('page:load');

}).call(this);
// Chosen, a Select Box Enhancer for jQuery and Protoype
// by Patrick Filler for Harvest, http://getharvest.com
//
// Version 0.9.12
// Full source at https://github.com/harvesthq/chosen
// Copyright (c) 2011 Harvest http://getharvest.com

// MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
// This file is generated by `cake build`, do not edit it by hand.
(function(){var e;e=function(){function e(){this.options_index=0,this.parsed=[]}return e.prototype.add_node=function(e){return e.nodeName.toUpperCase()==="OPTGROUP"?this.add_group(e):this.add_option(e)},e.prototype.add_group=function(e){var t,n,r,i,s,o;t=this.parsed.length,this.parsed.push({array_index:t,group:!0,label:e.label,children:0,disabled:e.disabled}),s=e.childNodes,o=[];for(r=0,i=s.length;r<i;r++)n=s[r],o.push(this.add_option(n,t,e.disabled));return o},e.prototype.add_option=function(e,t,n){if(e.nodeName.toUpperCase()==="OPTION")return e.text!==""?(t!=null&&(this.parsed[t].children+=1),this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,value:e.value,text:e.text,html:e.innerHTML,selected:e.selected,disabled:n===!0?n:e.disabled,group_array_index:t,classes:e.className,style:e.style.cssText})):this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,empty:!0}),this.options_index+=1},e}(),e.select_to_array=function(t){var n,r,i,s,o;r=new e,o=t.childNodes;for(i=0,s=o.length;i<s;i++)n=o[i],r.add_node(n);return r.parsed},this.SelectParser=e}).call(this),function(){var e,t;t=this,e=function(){function e(e,t){this.form_field=e,this.options=t!=null?t:{},this.is_multiple=this.form_field.multiple,this.set_default_text(),this.set_default_values(),this.setup(),this.set_up_html(),this.register_observers(),this.finish_setup()}return e.prototype.set_default_values=function(){var e=this;return this.click_test_action=function(t){return e.test_active_click(t)},this.activate_action=function(t){return e.activate_field(t)},this.active_field=!1,this.mouse_on_container=!1,this.results_showing=!1,this.result_highlighted=null,this.result_single_selected=null,this.allow_single_deselect=this.options.allow_single_deselect!=null&&this.form_field.options[0]!=null&&this.form_field.options[0].text===""?this.options.allow_single_deselect:!1,this.disable_search_threshold=this.options.disable_search_threshold||0,this.disable_search=this.options.disable_search||!1,this.enable_split_word_search=this.options.enable_split_word_search!=null?this.options.enable_split_word_search:!0,this.search_contains=this.options.search_contains||!1,this.choices=0,this.single_backstroke_delete=this.options.single_backstroke_delete||!1,this.max_selected_options=this.options.max_selected_options||Infinity,this.inherit_select_classes=this.options.inherit_select_classes||!1},e.prototype.set_default_text=function(){return this.form_field.getAttribute("data-placeholder")?this.default_text=this.form_field.getAttribute("data-placeholder"):this.is_multiple?this.default_text=this.options.placeholder_text_multiple||this.options.placeholder_text||"Select Some Options":this.default_text=this.options.placeholder_text_single||this.options.placeholder_text||"Select an Option",this.results_none_found=this.form_field.getAttribute("data-no_results_text")||this.options.no_results_text||"No results match"},e.prototype.mouse_enter=function(){return this.mouse_on_container=!0},e.prototype.mouse_leave=function(){return this.mouse_on_container=!1},e.prototype.input_focus=function(e){var t=this;if(this.is_multiple){if(!this.active_field)return setTimeout(function(){return t.container_mousedown()},50)}else if(!this.active_field)return this.activate_field()},e.prototype.input_blur=function(e){var t=this;if(!this.mouse_on_container)return this.active_field=!1,setTimeout(function(){return t.blur_test()},100)},e.prototype.result_add_option=function(e){var t,n;return e.disabled?"":(e.dom_id=this.container_id+"_o_"+e.array_index,t=e.selected&&this.is_multiple?[]:["active-result"],e.selected&&t.push("result-selected"),e.group_array_index!=null&&t.push("group-option"),e.classes!==""&&t.push(e.classes),n=e.style.cssText!==""?' style="'+e.style+'"':"",'<li id="'+e.dom_id+'" class="'+t.join(" ")+'"'+n+">"+e.html+"</li>")},e.prototype.results_update_field=function(){return this.set_default_text(),this.is_multiple||this.results_reset_cleanup(),this.result_clear_highlight(),this.result_single_selected=null,this.results_build()},e.prototype.results_toggle=function(){return this.results_showing?this.results_hide():this.results_show()},e.prototype.results_search=function(e){return this.results_showing?this.winnow_results():this.results_show()},e.prototype.keyup_checker=function(e){var t,n;t=(n=e.which)!=null?n:e.keyCode,this.search_field_scale();switch(t){case 8:if(this.is_multiple&&this.backstroke_length<1&&this.choices>0)return this.keydown_backstroke();if(!this.pending_backstroke)return this.result_clear_highlight(),this.results_search();break;case 13:e.preventDefault();if(this.results_showing)return this.result_select(e);break;case 27:return this.results_showing&&this.results_hide(),!0;case 9:case 38:case 40:case 16:case 91:case 17:break;default:return this.results_search()}},e.prototype.generate_field_id=function(){var e;return e=this.generate_random_id(),this.form_field.id=e,e},e.prototype.generate_random_char=function(){var e,t,n;return e="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",n=Math.floor(Math.random()*e.length),t=e.substring(n,n+1)},e}(),t.AbstractChosen=e}.call(this),function(){var e,t,n,r,i={}.hasOwnProperty,s=function(e,t){function r(){this.constructor=e}for(var n in t)i.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e};r=this,e=jQuery,e.fn.extend({chosen:function(n){var r,i,s;return s=navigator.userAgent.toLowerCase(),i=/(msie) ([\w.]+)/.exec(s)||[],r={name:i[1]||"",version:i[2]||"0"},r.name==="msie"&&(r.version==="6.0"||r.version==="7.0"&&document.documentMode===7)?this:this.each(function(r){var i;i=e(this);if(!i.hasClass("chzn-done"))return i.data("chosen",new t(this,n))})}}),t=function(t){function i(){return i.__super__.constructor.apply(this,arguments)}return s(i,t),i.prototype.setup=function(){return this.form_field_jq=e(this.form_field),this.current_value=this.form_field_jq.val(),this.is_rtl=this.form_field_jq.hasClass("chzn-rtl")},i.prototype.finish_setup=function(){return this.form_field_jq.addClass("chzn-done")},i.prototype.set_up_html=function(){var t,r,i,s,o,u;return this.container_id=this.form_field.id.length?this.form_field.id.replace(/[^\w]/g,"_"):this.generate_field_id(),this.container_id+="_chzn",t=["chzn-container"],t.push("chzn-container-"+(this.is_multiple?"multi":"single")),this.inherit_select_classes&&this.form_field.className&&t.push(this.form_field.className),this.is_rtl&&t.push("chzn-rtl"),this.f_width=this.form_field_jq.outerWidth(),i={id:this.container_id,"class":t.join(" "),style:"width: "+this.f_width+"px;",title:this.form_field.title},r=e("<div />",i),this.is_multiple?r.html('<ul class="chzn-choices"><li class="search-field"><input type="text" value="'+this.default_text+'" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop" style="left:-9000px;"><ul class="chzn-results"></ul></div>'):r.html('<a href="javascript:void(0)" class="chzn-single chzn-default" tabindex="-1"><span>'+this.default_text+'</span><div><b></b></div></a><div class="chzn-drop" style="left:-9000px;"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>'),this.form_field_jq.hide().after(r),this.container=e("#"+this.container_id),this.dropdown=this.container.find("div.chzn-drop").first(),s=this.container.height(),o=this.f_width-n(this.dropdown),this.dropdown.css({width:o+"px",top:s+"px"}),this.search_field=this.container.find("input").first(),this.search_results=this.container.find("ul.chzn-results").first(),this.search_field_scale(),this.search_no_results=this.container.find("li.no-results").first(),this.is_multiple?(this.search_choices=this.container.find("ul.chzn-choices").first(),this.search_container=this.container.find("li.search-field").first()):(this.search_container=this.container.find("div.chzn-search").first(),this.selected_item=this.container.find(".chzn-single").first(),u=o-n(this.search_container)-n(this.search_field),this.search_field.css({width:u+"px"})),this.results_build(),this.set_tab_index(),this.form_field_jq.trigger("liszt:ready",{chosen:this})},i.prototype.register_observers=function(){var e=this;return this.container.mousedown(function(t){e.container_mousedown(t)}),this.container.mouseup(function(t){e.container_mouseup(t)}),this.container.mouseenter(function(t){e.mouse_enter(t)}),this.container.mouseleave(function(t){e.mouse_leave(t)}),this.search_results.mouseup(function(t){e.search_results_mouseup(t)}),this.search_results.mouseover(function(t){e.search_results_mouseover(t)}),this.search_results.mouseout(function(t){e.search_results_mouseout(t)}),this.form_field_jq.bind("liszt:updated",function(t){e.results_update_field(t)}),this.form_field_jq.bind("liszt:activate",function(t){e.activate_field(t)}),this.form_field_jq.bind("liszt:open",function(t){e.container_mousedown(t)}),this.search_field.blur(function(t){e.input_blur(t)}),this.search_field.keyup(function(t){e.keyup_checker(t)}),this.search_field.keydown(function(t){e.keydown_checker(t)}),this.search_field.focus(function(t){e.input_focus(t)}),this.is_multiple?this.search_choices.click(function(t){e.choices_click(t)}):this.container.click(function(e){e.preventDefault()})},i.prototype.search_field_disabled=function(){this.is_disabled=this.form_field_jq[0].disabled;if(this.is_disabled)return this.container.addClass("chzn-disabled"),this.search_field[0].disabled=!0,this.is_multiple||this.selected_item.unbind("focus",this.activate_action),this.close_field();this.container.removeClass("chzn-disabled"),this.search_field[0].disabled=!1;if(!this.is_multiple)return this.selected_item.bind("focus",this.activate_action)},i.prototype.container_mousedown=function(t){var n;if(!this.is_disabled)return n=t!=null?e(t.target).hasClass("search-choice-close"):!1,t&&t.type==="mousedown"&&!this.results_showing&&t.preventDefault(),!this.pending_destroy_click&&!n?(this.active_field?!this.is_multiple&&t&&(e(t.target)[0]===this.selected_item[0]||e(t.target).parents("a.chzn-single").length)&&(t.preventDefault(),this.results_toggle()):(this.is_multiple&&this.search_field.val(""),e(document).click(this.click_test_action),this.results_show()),this.activate_field()):this.pending_destroy_click=!1},i.prototype.container_mouseup=function(e){if(e.target.nodeName==="ABBR"&&!this.is_disabled)return this.results_reset(e)},i.prototype.blur_test=function(e){if(!this.active_field&&this.container.hasClass("chzn-container-active"))return this.close_field()},i.prototype.close_field=function(){return e(document).unbind("click",this.click_test_action),this.active_field=!1,this.results_hide(),this.container.removeClass("chzn-container-active"),this.winnow_results_clear(),this.clear_backstroke(),this.show_search_field_default(),this.search_field_scale()},i.prototype.activate_field=function(){return this.container.addClass("chzn-container-active"),this.active_field=!0,this.search_field.val(this.search_field.val()),this.search_field.focus()},i.prototype.test_active_click=function(t){return e(t.target).parents("#"+this.container_id).length?this.active_field=!0:this.close_field()},i.prototype.results_build=function(){var e,t,n,i,s;this.parsing=!0,this.results_data=r.SelectParser.select_to_array(this.form_field),this.is_multiple&&this.choices>0?(this.search_choices.find("li.search-choice").remove(),this.choices=0):this.is_multiple||(this.selected_item.addClass("chzn-default").find("span").text(this.default_text),this.disable_search||this.form_field.options.length<=this.disable_search_threshold?this.container.addClass("chzn-container-single-nosearch"):this.container.removeClass("chzn-container-single-nosearch")),e="",s=this.results_data;for(n=0,i=s.length;n<i;n++)t=s[n],t.group?e+=this.result_add_group(t):t.empty||(e+=this.result_add_option(t),t.selected&&this.is_multiple?this.choice_build(t):t.selected&&!this.is_multiple&&(this.selected_item.removeClass("chzn-default").find("span").text(t.text),this.allow_single_deselect&&this.single_deselect_control_build()));return this.search_field_disabled(),this.show_search_field_default(),this.search_field_scale(),this.search_results.html(e),this.parsing=!1},i.prototype.result_add_group=function(t){return t.disabled?"":(t.dom_id=this.container_id+"_g_"+t.array_index,'<li id="'+t.dom_id+'" class="group-result">'+e("<div />").text(t.label).html()+"</li>")},i.prototype.result_do_highlight=function(e){var t,n,r,i,s;if(e.length){this.result_clear_highlight(),this.result_highlight=e,this.result_highlight.addClass("highlighted"),r=parseInt(this.search_results.css("maxHeight"),10),s=this.search_results.scrollTop(),i=r+s,n=this.result_highlight.position().top+this.search_results.scrollTop(),t=n+this.result_highlight.outerHeight();if(t>=i)return this.search_results.scrollTop(t-r>0?t-r:0);if(n<s)return this.search_results.scrollTop(n)}},i.prototype.result_clear_highlight=function(){return this.result_highlight&&this.result_highlight.removeClass("highlighted"),this.result_highlight=null},i.prototype.results_show=function(){var e;if(!this.is_multiple)this.selected_item.addClass("chzn-single-with-drop"),this.result_single_selected&&this.result_do_highlight(this.result_single_selected);else if(this.max_selected_options<=this.choices)return this.form_field_jq.trigger("liszt:maxselected",{chosen:this}),!1;return e=this.is_multiple?this.container.height():this.container.height()-1,this.form_field_jq.trigger("liszt:showing_dropdown",{chosen:this}),this.dropdown.css({top:e+"px",left:0}),this.results_showing=!0,this.search_field.focus(),this.search_field.val(this.search_field.val()),this.winnow_results()},i.prototype.results_hide=function(){return this.is_multiple||this.selected_item.removeClass("chzn-single-with-drop"),this.result_clear_highlight(),this.form_field_jq.trigger("liszt:hiding_dropdown",{chosen:this}),this.dropdown.css({left:"-9000px"}),this.results_showing=!1},i.prototype.set_tab_index=function(e){var t;if(this.form_field_jq.attr("tabindex"))return t=this.form_field_jq.attr("tabindex"),this.form_field_jq.attr("tabindex",-1),this.search_field.attr("tabindex",t)},i.prototype.show_search_field_default=function(){return this.is_multiple&&this.choices<1&&!this.active_field?(this.search_field.val(this.default_text),this.search_field.addClass("default")):(this.search_field.val(""),this.search_field.removeClass("default"))},i.prototype.search_results_mouseup=function(t){var n;n=e(t.target).hasClass("active-result")?e(t.target):e(t.target).parents(".active-result").first();if(n.length)return this.result_highlight=n,this.result_select(t),this.search_field.focus()},i.prototype.search_results_mouseover=function(t){var n;n=e(t.target).hasClass("active-result")?e(t.target):e(t.target).parents(".active-result").first();if(n)return this.result_do_highlight(n)},i.prototype.search_results_mouseout=function(t){if(e(t.target).hasClass("active-result"))return this.result_clear_highlight()},i.prototype.choices_click=function(t){t.preventDefault();if(this.active_field&&!e(t.target).hasClass("search-choice")&&!this.results_showing)return this.results_show()},i.prototype.choice_build=function(t){var n,r,i,s=this;return this.is_multiple&&this.max_selected_options<=this.choices?(this.form_field_jq.trigger("liszt:maxselected",{chosen:this}),!1):(n=this.container_id+"_c_"+t.array_index,this.choices+=1,t.disabled?r='<li class="search-choice search-choice-disabled" id="'+n+'"><span>'+t.html+"</span></li>":r='<li class="search-choice" id="'+n+'"><span>'+t.html+'</span><a href="javascript:void(0)" class="search-choice-close" rel="'+t.array_index+'"></a></li>',this.search_container.before(r),i=e("#"+n).find("a").first(),i.click(function(e){return s.choice_destroy_link_click(e)}))},i.prototype.choice_destroy_link_click=function(t){return t.preventDefault(),this.is_disabled?t.stopPropagation:(this.pending_destroy_click=!0,this.choice_destroy(e(t.target)))},i.prototype.choice_destroy=function(e){if(this.result_deselect(e.attr("rel")))return this.choices-=1,this.show_search_field_default(),this.is_multiple&&this.choices>0&&this.search_field.val().length<1&&this.results_hide(),e.parents("li").first().remove(),this.search_field_scale()},i.prototype.results_reset=function(){this.form_field.options[0].selected=!0,this.selected_item.find("span").text(this.default_text),this.is_multiple||this.selected_item.addClass("chzn-default"),this.show_search_field_default(),this.results_reset_cleanup(),this.form_field_jq.trigger("change");if(this.active_field)return this.results_hide()},i.prototype.results_reset_cleanup=function(){return this.current_value=this.form_field_jq.val(),this.selected_item.find("abbr").remove()},i.prototype.result_select=function(e){var t,n,r,i;if(this.result_highlight)return t=this.result_highlight,n=t.attr("id"),this.result_clear_highlight(),this.is_multiple?this.result_deactivate(t):(this.search_results.find(".result-selected").removeClass("result-selected"),this.result_single_selected=t,this.selected_item.removeClass("chzn-default")),t.addClass("result-selected"),i=n.substr(n.lastIndexOf("_")+1),r=this.results_data[i],r.selected=!0,this.form_field.options[r.options_index].selected=!0,this.is_multiple?this.choice_build(r):(this.selected_item.find("span").first().text(r.text),this.allow_single_deselect&&this.single_deselect_control_build()),(!e.metaKey&&!e.ctrlKey||!this.is_multiple)&&this.results_hide(),this.search_field.val(""),(this.is_multiple||this.form_field_jq.val()!==this.current_value)&&this.form_field_jq.trigger("change",{selected:this.form_field.options[r.options_index].value}),this.current_value=this.form_field_jq.val(),this.search_field_scale()},i.prototype.result_activate=function(e){return e.addClass("active-result")},i.prototype.result_deactivate=function(e){return e.removeClass("active-result")},i.prototype.result_deselect=function(t){var n,r;return r=this.results_data[t],this.form_field.options[r.options_index].disabled?!1:(r.selected=!1,this.form_field.options[r.options_index].selected=!1,n=e("#"+this.container_id+"_o_"+t),n.removeClass("result-selected").addClass("active-result").show(),this.result_clear_highlight(),this.winnow_results(),this.form_field_jq.trigger("change",{deselected:this.form_field.options[r.options_index].value}),this.search_field_scale(),!0)},i.prototype.single_deselect_control_build=function(){if(this.allow_single_deselect&&this.selected_item.find("abbr").length<1)return this.selected_item.find("span").first().after('<abbr class="search-choice-close"></abbr>')},i.prototype.winnow_results=function(){var t,n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y;this.no_results_clear(),f=0,l=this.search_field.val()===this.default_text?"":e("<div/>").text(e.trim(this.search_field.val())).html(),o=this.search_contains?"":"^",s=new RegExp(o+l.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),"i"),p=new RegExp(l.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),"i"),y=this.results_data;for(d=0,m=y.length;d<m;d++){n=y[d];if(!n.disabled&&!n.empty)if(n.group)e("#"+n.dom_id).css("display","none");else if(!this.is_multiple||!n.selected){t=!1,a=n.dom_id,u=e("#"+a);if(s.test(n.html))t=!0,f+=1;else if(this.enable_split_word_search&&(n.html.indexOf(" ")>=0||n.html.indexOf("[")===0)){i=n.html.replace(/\[|\]/g,"").split(" ");if(i.length)for(v=0,g=i.length;v<g;v++)r=i[v],s.test(r)&&(t=!0,f+=1)}t?(l.length?(c=n.html.search(p),h=n.html.substr(0,c+l.length)+"</em>"+n.html.substr(c+l.length),h=h.substr(0,c)+"<em>"+h.substr(c)):h=n.html,u.html(h),this.result_activate(u),n.group_array_index!=null&&e("#"+this.results_data[n.group_array_index].dom_id).css("display","list-item")):(this.result_highlight&&a===this.result_highlight.attr("id")&&this.result_clear_highlight(),this.result_deactivate(u))}}return f<1&&l.length?this.no_results(l):this.winnow_results_set_highlight()},i.prototype.winnow_results_clear=function(){var t,n,r,i,s;this.search_field.val(""),n=this.search_results.find("li"),s=[];for(r=0,i=n.length;r<i;r++)t=n[r],t=e(t),t.hasClass("group-result")?s.push(t.css("display","auto")):!this.is_multiple||!t.hasClass("result-selected")?s.push(this.result_activate(t)):s.push(void 0);return s},i.prototype.winnow_results_set_highlight=function(){var e,t;if(!this.result_highlight){t=this.is_multiple?[]:this.search_results.find(".result-selected.active-result"),e=t.length?t.first():this.search_results.find(".active-result").first();if(e!=null)return this.result_do_highlight(e)}},i.prototype.no_results=function(t){var n;return n=e('<li class="no-results">'+this.results_none_found+' "<span></span>"</li>'),n.find("span").first().html(t),this.search_results.append(n)},i.prototype.no_results_clear=function(){return this.search_results.find(".no-results").remove()},i.prototype.keydown_arrow=function(){var t,n;this.result_highlight?this.results_showing&&(n=this.result_highlight.nextAll("li.active-result").first(),n&&this.result_do_highlight(n)):(t=this.search_results.find("li.active-result").first(),t&&this.result_do_highlight(e(t)));if(!this.results_showing)return this.results_show()},i.prototype.keyup_arrow=function(){var e;if(!this.results_showing&&!this.is_multiple)return this.results_show();if(this.result_highlight)return e=this.result_highlight.prevAll("li.active-result"),e.length?this.result_do_highlight(e.first()):(this.choices>0&&this.results_hide(),this.result_clear_highlight())},i.prototype.keydown_backstroke=function(){var e;if(this.pending_backstroke)return this.choice_destroy(this.pending_backstroke.find("a").first()),this.clear_backstroke();e=this.search_container.siblings("li.search-choice").last();if(e.length&&!e.hasClass("search-choice-disabled"))return this.pending_backstroke=e,this.single_backstroke_delete?this.keydown_backstroke():this.pending_backstroke.addClass("search-choice-focus")},i.prototype.clear_backstroke=function(){return this.pending_backstroke&&this.pending_backstroke.removeClass("search-choice-focus"),this.pending_backstroke=null},i.prototype.keydown_checker=function(e){var t,n;t=(n=e.which)!=null?n:e.keyCode,this.search_field_scale(),t!==8&&this.pending_backstroke&&this.clear_backstroke();switch(t){case 8:this.backstroke_length=this.search_field.val().length;break;case 9:this.results_showing&&!this.is_multiple&&this.result_select(e),this.mouse_on_container=!1;break;case 13:e.preventDefault();break;case 38:e.preventDefault(),this.keyup_arrow();break;case 40:this.keydown_arrow()}},i.prototype.search_field_scale=function(){var t,n,r,i,s,o,u,a,f;if(this.is_multiple){r=0,u=0,s="position:absolute; left: -1000px; top: -1000px; display:none;",o=["font-size","font-style","font-weight","font-family","line-height","text-transform","letter-spacing"];for(a=0,f=o.length;a<f;a++)i=o[a],s+=i+":"+this.search_field.css(i)+";";return n=e("<div />",{style:s}),n.text(this.search_field.val()),e("body").append(n),u=n.width()+25,n.remove(),u>this.f_width-10&&(u=this.f_width-10),this.search_field.css({width:u+"px"}),t=this.container.height(),this.dropdown.css({top:t+"px"})}},i.prototype.generate_random_id=function(){var t;t="sel"+this.generate_random_char()+this.generate_random_char()+this.generate_random_char();while(e("#"+t).length>0)t+=this.generate_random_char();return t},i}(AbstractChosen),r.Chosen=t,n=function(e){var t;return t=e.outerWidth()-e.width()},r.get_side_border_padding=n}.call(this);
(function(e){var a=/^\s*|\s*$/g,b,d="B".replace(/A(.)|B/,"$1")==="$1";var c={majorVersion:"3",minorVersion:"5.8",releaseDate:"2012-11-20",_init:function(){var s=this,q=document,o=navigator,g=o.userAgent,m,f,l,k,j,r;s.isOpera=e.opera&&opera.buildNumber;s.isWebKit=/WebKit/.test(g);s.isIE=!s.isWebKit&&!s.isOpera&&(/MSIE/gi).test(g)&&(/Explorer/gi).test(o.appName);s.isIE6=s.isIE&&/MSIE [56]/.test(g);s.isIE7=s.isIE&&/MSIE [7]/.test(g);s.isIE8=s.isIE&&/MSIE [8]/.test(g);s.isIE9=s.isIE&&/MSIE [9]/.test(g);s.isGecko=!s.isWebKit&&/Gecko/.test(g);s.isMac=g.indexOf("Mac")!=-1;s.isAir=/adobeair/i.test(g);s.isIDevice=/(iPad|iPhone)/.test(g);s.isIOS5=s.isIDevice&&g.match(/AppleWebKit\/(\d*)/)[1]>=534;if(e.tinyMCEPreInit){s.suffix=tinyMCEPreInit.suffix;s.baseURL=tinyMCEPreInit.base;s.query=tinyMCEPreInit.query;return}s.suffix="";f=q.getElementsByTagName("base");for(m=0;m<f.length;m++){r=f[m].href;if(r){if(/^https?:\/\/[^\/]+$/.test(r)){r+="/"}k=r?r.match(/.*\//)[0]:""}}function h(i){if(i.src&&/tiny_mce(|_gzip|_jquery|_prototype|_full)(_dev|_src)?.js/.test(i.src)){if(/_(src|dev)\.js/g.test(i.src)){s.suffix="_src"}if((j=i.src.indexOf("?"))!=-1){s.query=i.src.substring(j+1)}s.baseURL=i.src.substring(0,i.src.lastIndexOf("/"));if(k&&s.baseURL.indexOf("://")==-1&&s.baseURL.indexOf("/")!==0){s.baseURL=k+s.baseURL}return s.baseURL}return null}f=q.getElementsByTagName("script");for(m=0;m<f.length;m++){if(h(f[m])){return}}l=q.getElementsByTagName("head")[0];if(l){f=l.getElementsByTagName("script");for(m=0;m<f.length;m++){if(h(f[m])){return}}}return},is:function(g,f){if(!f){return g!==b}if(f=="array"&&c.isArray(g)){return true}return typeof(g)==f},isArray:Array.isArray||function(f){return Object.prototype.toString.call(f)==="[object Array]"},makeMap:function(f,j,h){var g;f=f||[];j=j||",";if(typeof(f)=="string"){f=f.split(j)}h=h||{};g=f.length;while(g--){h[f[g]]={}}return h},each:function(i,f,h){var j,g;if(!i){return 0}h=h||i;if(i.length!==b){for(j=0,g=i.length;j<g;j++){if(f.call(h,i[j],j,i)===false){return 0}}}else{for(j in i){if(i.hasOwnProperty(j)){if(f.call(h,i[j],j,i)===false){return 0}}}}return 1},map:function(g,h){var i=[];c.each(g,function(f){i.push(h(f))});return i},grep:function(g,h){var i=[];c.each(g,function(f){if(!h||h(f)){i.push(f)}});return i},inArray:function(g,h){var j,f;if(g){for(j=0,f=g.length;j<f;j++){if(g[j]===h){return j}}}return -1},extend:function(n,k){var j,f,h,g=arguments,m;for(j=1,f=g.length;j<f;j++){k=g[j];for(h in k){if(k.hasOwnProperty(h)){m=k[h];if(m!==b){n[h]=m}}}}return n},trim:function(f){return(f?""+f:"").replace(a,"")},create:function(o,f,j){var n=this,g,i,k,l,h,m=0;o=/^((static) )?([\w.]+)(:([\w.]+))?/.exec(o);k=o[3].match(/(^|\.)(\w+)$/i)[2];i=n.createNS(o[3].replace(/\.\w+$/,""),j);if(i[k]){return}if(o[2]=="static"){i[k]=f;if(this.onCreate){this.onCreate(o[2],o[3],i[k])}return}if(!f[k]){f[k]=function(){};m=1}i[k]=f[k];n.extend(i[k].prototype,f);if(o[5]){g=n.resolve(o[5]).prototype;l=o[5].match(/\.(\w+)$/i)[1];h=i[k];if(m){i[k]=function(){return g[l].apply(this,arguments)}}else{i[k]=function(){this.parent=g[l];return h.apply(this,arguments)}}i[k].prototype[k]=i[k];n.each(g,function(p,q){i[k].prototype[q]=g[q]});n.each(f,function(p,q){if(g[q]){i[k].prototype[q]=function(){this.parent=g[q];return p.apply(this,arguments)}}else{if(q!=k){i[k].prototype[q]=p}}})}n.each(f["static"],function(p,q){i[k][q]=p});if(this.onCreate){this.onCreate(o[2],o[3],i[k].prototype)}},walk:function(i,h,j,g){g=g||this;if(i){if(j){i=i[j]}c.each(i,function(k,f){if(h.call(g,k,f,j)===false){return false}c.walk(k,h,j,g)})}},createNS:function(j,h){var g,f;h=h||e;j=j.split(".");for(g=0;g<j.length;g++){f=j[g];if(!h[f]){h[f]={}}h=h[f]}return h},resolve:function(j,h){var g,f;h=h||e;j=j.split(".");for(g=0,f=j.length;g<f;g++){h=h[j[g]];if(!h){break}}return h},addUnload:function(j,i){var h=this,g;g=function(){var f=h.unloads,l,m;if(f){for(m in f){l=f[m];if(l&&l.func){l.func.call(l.scope,1)}}if(e.detachEvent){e.detachEvent("onbeforeunload",k);e.detachEvent("onunload",g)}else{if(e.removeEventListener){e.removeEventListener("unload",g,false)}}h.unloads=l=f=w=g=0;if(e.CollectGarbage){CollectGarbage()}}};function k(){var l=document;function f(){l.detachEvent("onstop",f);if(g){g()}l=0}if(l.readyState=="interactive"){if(l){l.attachEvent("onstop",f)}e.setTimeout(function(){if(l){l.detachEvent("onstop",f)}},0)}}j={func:j,scope:i||this};if(!h.unloads){if(e.attachEvent){e.attachEvent("onunload",g);e.attachEvent("onbeforeunload",k)}else{if(e.addEventListener){e.addEventListener("unload",g,false)}}h.unloads=[j]}else{h.unloads.push(j)}return j},removeUnload:function(i){var g=this.unloads,h=null;c.each(g,function(j,f){if(j&&j.func==i){g.splice(f,1);h=i;return false}});return h},explode:function(f,g){if(!f||c.is(f,"array")){return f}return c.map(f.split(g||","),c.trim)},_addVer:function(g){var f;if(!this.query){return g}f=(g.indexOf("?")==-1?"?":"&")+this.query;if(g.indexOf("#")==-1){return g+f}return g.replace("#",f+"#")},_replace:function(h,f,g){if(d){return g.replace(h,function(){var l=f,j=arguments,k;for(k=0;k<j.length-2;k++){if(j[k]===b){l=l.replace(new RegExp("\\$"+k,"g"),"")}else{l=l.replace(new RegExp("\\$"+k,"g"),j[k])}}return l})}return g.replace(h,f)}};c._init();e.tinymce=e.tinyMCE=c})(window);tinymce.create("tinymce.util.Dispatcher",{scope:null,listeners:null,inDispatch:false,Dispatcher:function(a){this.scope=a||this;this.listeners=[]},add:function(b,a){this.listeners.push({cb:b,scope:a||this.scope});return b},addToTop:function(d,b){var a=this,c={cb:d,scope:b||a.scope};if(a.inDispatch){a.listeners=[c].concat(a.listeners)}else{a.listeners.unshift(c)}return d},remove:function(c){var b=this.listeners,a=null;tinymce.each(b,function(e,d){if(c==e.cb){a=e;b.splice(d,1);return false}});return a},dispatch:function(){var a=this,e,b=arguments,c,d=a.listeners,f;a.inDispatch=true;for(c=0;c<d.length;c++){f=d[c];e=f.cb.apply(f.scope,b.length>0?b:[f.scope]);if(e===false){break}}a.inDispatch=false;return e}});(function(){var a=tinymce.each;tinymce.create("tinymce.util.URI",{URI:function(e,g){var f=this,i,d,c,h;e=tinymce.trim(e);g=f.settings=g||{};if(/^([\w\-]+):([^\/]{2})/i.test(e)||/^\s*#/.test(e)){f.source=e;return}if(e.indexOf("/")===0&&e.indexOf("//")!==0){e=(g.base_uri?g.base_uri.protocol||"http":"http")+"://mce_host"+e}if(!/^[\w\-]*:?\/\//.test(e)){h=g.base_uri?g.base_uri.path:new tinymce.util.URI(location.href).directory;e=((g.base_uri&&g.base_uri.protocol)||"http")+"://mce_host"+f.toAbsPath(h,e)}e=e.replace(/@@/g,"(mce_at)");e=/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(e);a(["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],function(b,j){var k=e[j];if(k){k=k.replace(/\(mce_at\)/g,"@@")}f[b]=k});c=g.base_uri;if(c){if(!f.protocol){f.protocol=c.protocol}if(!f.userInfo){f.userInfo=c.userInfo}if(!f.port&&f.host==="mce_host"){f.port=c.port}if(!f.host||f.host==="mce_host"){f.host=c.host}f.source=""}},setPath:function(c){var b=this;c=/^(.*?)\/?(\w+)?$/.exec(c);b.path=c[0];b.directory=c[1];b.file=c[2];b.source="";b.getURI()},toRelative:function(b){var d=this,f;if(b==="./"){return b}b=new tinymce.util.URI(b,{base_uri:d});if((b.host!="mce_host"&&d.host!=b.host&&b.host)||d.port!=b.port||d.protocol!=b.protocol){return b.getURI()}var c=d.getURI(),e=b.getURI();if(c==e||(c.charAt(c.length-1)=="/"&&c.substr(0,c.length-1)==e)){return c}f=d.toRelPath(d.path,b.path);if(b.query){f+="?"+b.query}if(b.anchor){f+="#"+b.anchor}return f},toAbsolute:function(b,c){b=new tinymce.util.URI(b,{base_uri:this});return b.getURI(this.host==b.host&&this.protocol==b.protocol?c:0)},toRelPath:function(g,h){var c,f=0,d="",e,b;g=g.substring(0,g.lastIndexOf("/"));g=g.split("/");c=h.split("/");if(g.length>=c.length){for(e=0,b=g.length;e<b;e++){if(e>=c.length||g[e]!=c[e]){f=e+1;break}}}if(g.length<c.length){for(e=0,b=c.length;e<b;e++){if(e>=g.length||g[e]!=c[e]){f=e+1;break}}}if(f===1){return h}for(e=0,b=g.length-(f-1);e<b;e++){d+="../"}for(e=f-1,b=c.length;e<b;e++){if(e!=f-1){d+="/"+c[e]}else{d+=c[e]}}return d},toAbsPath:function(e,f){var c,b=0,h=[],d,g;d=/\/$/.test(f)?"/":"";e=e.split("/");f=f.split("/");a(e,function(i){if(i){h.push(i)}});e=h;for(c=f.length-1,h=[];c>=0;c--){if(f[c].length===0||f[c]==="."){continue}if(f[c]===".."){b++;continue}if(b>0){b--;continue}h.push(f[c])}c=e.length-b;if(c<=0){g=h.reverse().join("/")}else{g=e.slice(0,c).join("/")+"/"+h.reverse().join("/")}if(g.indexOf("/")!==0){g="/"+g}if(d&&g.lastIndexOf("/")!==g.length-1){g+=d}return g},getURI:function(d){var c,b=this;if(!b.source||d){c="";if(!d){if(b.protocol){c+=b.protocol+"://"}if(b.userInfo){c+=b.userInfo+"@"}if(b.host){c+=b.host}if(b.port){c+=":"+b.port}}if(b.path){c+=b.path}if(b.query){c+="?"+b.query}if(b.anchor){c+="#"+b.anchor}b.source=c}return b.source}})})();(function(){var a=tinymce.each;tinymce.create("static tinymce.util.Cookie",{getHash:function(d){var b=this.get(d),c;if(b){a(b.split("&"),function(e){e=e.split("=");c=c||{};c[unescape(e[0])]=unescape(e[1])})}return c},setHash:function(j,b,g,f,i,c){var h="";a(b,function(e,d){h+=(!h?"":"&")+escape(d)+"="+escape(e)});this.set(j,h,g,f,i,c)},get:function(i){var h=document.cookie,g,f=i+"=",d;if(!h){return}d=h.indexOf("; "+f);if(d==-1){d=h.indexOf(f);if(d!==0){return null}}else{d+=2}g=h.indexOf(";",d);if(g==-1){g=h.length}return unescape(h.substring(d+f.length,g))},set:function(i,b,g,f,h,c){document.cookie=i+"="+escape(b)+((g)?"; expires="+g.toGMTString():"")+((f)?"; path="+escape(f):"")+((h)?"; domain="+h:"")+((c)?"; secure":"")},remove:function(c,e,d){var b=new Date();b.setTime(b.getTime()-1000);this.set(c,"",b,e,d)}})})();(function(){function serialize(o,quote){var i,v,t,name;quote=quote||'"';if(o==null){return"null"}t=typeof o;if(t=="string"){v="\bb\tt\nn\ff\rr\"\"''\\\\";return quote+o.replace(/([\u0080-\uFFFF\x00-\x1f\"\'\\])/g,function(a,b){if(quote==='"'&&a==="'"){return a}i=v.indexOf(b);if(i+1){return"\\"+v.charAt(i+1)}a=b.charCodeAt().toString(16);return"\\u"+"0000".substring(a.length)+a})+quote}if(t=="object"){if(o.hasOwnProperty&&Object.prototype.toString.call(o)==="[object Array]"){for(i=0,v="[";i<o.length;i++){v+=(i>0?",":"")+serialize(o[i],quote)}return v+"]"}v="{";for(name in o){if(o.hasOwnProperty(name)){v+=typeof o[name]!="function"?(v.length>1?","+quote:quote)+name+quote+":"+serialize(o[name],quote):""}}return v+"}"}return""+o}tinymce.util.JSON={serialize:serialize,parse:function(s){try{return eval("("+s+")")}catch(ex){}}}})();tinymce.create("static tinymce.util.XHR",{send:function(g){var a,e,b=window,h=0;function f(){if(!g.async||a.readyState==4||h++>10000){if(g.success&&h<10000&&a.status==200){g.success.call(g.success_scope,""+a.responseText,a,g)}else{if(g.error){g.error.call(g.error_scope,h>10000?"TIMED_OUT":"GENERAL",a,g)}}a=null}else{b.setTimeout(f,10)}}g.scope=g.scope||this;g.success_scope=g.success_scope||g.scope;g.error_scope=g.error_scope||g.scope;g.async=g.async===false?false:true;g.data=g.data||"";function d(i){a=0;try{a=new ActiveXObject(i)}catch(c){}return a}a=b.XMLHttpRequest?new XMLHttpRequest():d("Microsoft.XMLHTTP")||d("Msxml2.XMLHTTP");if(a){if(a.overrideMimeType){a.overrideMimeType(g.content_type)}a.open(g.type||(g.data?"POST":"GET"),g.url,g.async);if(g.content_type){a.setRequestHeader("Content-Type",g.content_type)}a.setRequestHeader("X-Requested-With","XMLHttpRequest");a.send(g.data);if(!g.async){return f()}e=b.setTimeout(f,10)}}});(function(){var c=tinymce.extend,b=tinymce.util.JSON,a=tinymce.util.XHR;tinymce.create("tinymce.util.JSONRequest",{JSONRequest:function(d){this.settings=c({},d);this.count=0},send:function(f){var e=f.error,d=f.success;f=c(this.settings,f);f.success=function(h,g){h=b.parse(h);if(typeof(h)=="undefined"){h={error:"JSON Parse error."}}if(h.error){e.call(f.error_scope||f.scope,h.error,g)}else{d.call(f.success_scope||f.scope,h.result)}};f.error=function(h,g){if(e){e.call(f.error_scope||f.scope,h,g)}};f.data=b.serialize({id:f.id||"c"+(this.count++),method:f.method,params:f.params});f.content_type="application/json";a.send(f)},"static":{sendRPC:function(d){return new tinymce.util.JSONRequest().send(d)}}})}());(function(a){a.VK={BACKSPACE:8,DELETE:46,DOWN:40,ENTER:13,LEFT:37,RIGHT:39,SPACEBAR:32,TAB:9,UP:38,modifierPressed:function(b){return b.shiftKey||b.ctrlKey||b.altKey},metaKeyPressed:function(b){return a.isMac?b.metaKey:b.ctrlKey&&!b.altKey}}})(tinymce);tinymce.util.Quirks=function(a){var j=tinymce.VK,f=j.BACKSPACE,k=j.DELETE,e=a.dom,l=a.selection,H=a.settings,v=a.parser,o=a.serializer,E=tinymce.each;function A(N,M){try{a.getDoc().execCommand(N,false,M)}catch(L){}}function n(){var L=a.getDoc().documentMode;return L?L:6}function z(L){return L.isDefaultPrevented()}function J(){function L(O){var M,Q,N,P;M=l.getRng();Q=e.getParent(M.startContainer,e.isBlock);if(O){Q=e.getNext(Q,e.isBlock)}if(Q){N=Q.firstChild;while(N&&N.nodeType==3&&N.nodeValue.length===0){N=N.nextSibling}if(N&&N.nodeName==="SPAN"){P=N.cloneNode(false)}}E(e.select("span",Q),function(R){R.setAttribute("data-mce-mark","1")});a.getDoc().execCommand(O?"ForwardDelete":"Delete",false,null);Q=e.getParent(M.startContainer,e.isBlock);E(e.select("span",Q),function(R){var S=l.getBookmark();if(P){e.replace(P.cloneNode(false),R,true)}else{if(!R.getAttribute("data-mce-mark")){e.remove(R,true)}else{R.removeAttribute("data-mce-mark")}}l.moveToBookmark(S)})}a.onKeyDown.add(function(M,O){var N;N=O.keyCode==k;if(!z(O)&&(N||O.keyCode==f)&&!j.modifierPressed(O)){O.preventDefault();L(N)}});a.addCommand("Delete",function(){L()})}function q(){function L(O){var N=e.create("body");var P=O.cloneContents();N.appendChild(P);return l.serializer.serialize(N,{format:"html"})}function M(N){var P=L(N);var Q=e.createRng();Q.selectNode(a.getBody());var O=L(Q);return P===O}a.onKeyDown.add(function(O,Q){var P=Q.keyCode,N;if(!z(Q)&&(P==k||P==f)){N=O.selection.isCollapsed();if(N&&!e.isEmpty(O.getBody())){return}if(tinymce.isIE&&!N){return}if(!N&&!M(O.selection.getRng())){return}O.setContent("");O.selection.setCursorLocation(O.getBody(),0);O.nodeChanged()}})}function I(){a.onKeyDown.add(function(L,M){if(!z(M)&&M.keyCode==65&&j.metaKeyPressed(M)){M.preventDefault();L.execCommand("SelectAll")}})}function K(){if(!a.settings.content_editable){e.bind(a.getDoc(),"focusin",function(L){l.setRng(l.getRng())});e.bind(a.getDoc(),"mousedown",function(L){if(L.target==a.getDoc().documentElement){a.getWin().focus();l.setRng(l.getRng())}})}}function B(){a.onKeyDown.add(function(L,O){if(!z(O)&&O.keyCode===f){if(l.isCollapsed()&&l.getRng(true).startOffset===0){var N=l.getNode();var M=N.previousSibling;if(M&&M.nodeName&&M.nodeName.toLowerCase()==="hr"){e.remove(M);tinymce.dom.Event.cancel(O)}}}})}function y(){if(!Range.prototype.getClientRects){a.onMouseDown.add(function(M,N){if(!z(N)&&N.target.nodeName==="HTML"){var L=M.getBody();L.blur();setTimeout(function(){L.focus()},0)}})}}function h(){a.onClick.add(function(L,M){M=M.target;if(/^(IMG|HR)$/.test(M.nodeName)){l.getSel().setBaseAndExtent(M,0,M,1)}if(M.nodeName=="A"&&e.hasClass(M,"mceItemAnchor")){l.select(M)}L.nodeChanged()})}function c(){function M(){var O=e.getAttribs(l.getStart().cloneNode(false));return function(){var P=l.getStart();if(P!==a.getBody()){e.setAttrib(P,"style",null);E(O,function(Q){P.setAttributeNode(Q.cloneNode(true))})}}}function L(){return !l.isCollapsed()&&e.getParent(l.getStart(),e.isBlock)!=e.getParent(l.getEnd(),e.isBlock)}function N(O,P){P.preventDefault();return false}a.onKeyPress.add(function(O,Q){var P;if(!z(Q)&&(Q.keyCode==8||Q.keyCode==46)&&L()){P=M();O.getDoc().execCommand("delete",false,null);P();Q.preventDefault();return false}});e.bind(a.getDoc(),"cut",function(P){var O;if(!z(P)&&L()){O=M();a.onKeyUp.addToTop(N);setTimeout(function(){O();a.onKeyUp.remove(N)},0)}})}function b(){var M,L;e.bind(a.getDoc(),"selectionchange",function(){if(L){clearTimeout(L);L=0}L=window.setTimeout(function(){var N=l.getRng();if(!M||!tinymce.dom.RangeUtils.compareRanges(N,M)){a.nodeChanged();M=N}},50)})}function x(){document.body.setAttribute("role","application")}function t(){a.onKeyDown.add(function(L,N){if(!z(N)&&N.keyCode===f){if(l.isCollapsed()&&l.getRng(true).startOffset===0){var M=l.getNode().previousSibling;if(M&&M.nodeName&&M.nodeName.toLowerCase()==="table"){return tinymce.dom.Event.cancel(N)}}}})}function C(){if(n()>7){return}A("RespectVisibilityInDesign",true);a.contentStyles.push(".mceHideBrInPre pre br {display: none}");e.addClass(a.getBody(),"mceHideBrInPre");v.addNodeFilter("pre",function(L,N){var O=L.length,Q,M,R,P;while(O--){Q=L[O].getAll("br");M=Q.length;while(M--){R=Q[M];P=R.prev;if(P&&P.type===3&&P.value.charAt(P.value-1)!="\n"){P.value+="\n"}else{R.parent.insert(new tinymce.html.Node("#text",3),R,true).value="\n"}}}});o.addNodeFilter("pre",function(L,N){var O=L.length,Q,M,R,P;while(O--){Q=L[O].getAll("br");M=Q.length;while(M--){R=Q[M];P=R.prev;if(P&&P.type==3){P.value=P.value.replace(/\r?\n$/,"")}}}})}function g(){e.bind(a.getBody(),"mouseup",function(N){var M,L=l.getNode();if(L.nodeName=="IMG"){if(M=e.getStyle(L,"width")){e.setAttrib(L,"width",M.replace(/[^0-9%]+/g,""));e.setStyle(L,"width","")}if(M=e.getStyle(L,"height")){e.setAttrib(L,"height",M.replace(/[^0-9%]+/g,""));e.setStyle(L,"height","")}}})}function d(){a.onKeyDown.add(function(R,S){var Q,L,M,O,P,T,N;Q=S.keyCode==k;if(!z(S)&&(Q||S.keyCode==f)&&!j.modifierPressed(S)){L=l.getRng();M=L.startContainer;O=L.startOffset;N=L.collapsed;if(M.nodeType==3&&M.nodeValue.length>0&&((O===0&&!N)||(N&&O===(Q?0:1)))){nonEmptyElements=R.schema.getNonEmptyElements();S.preventDefault();P=e.create("br",{id:"__tmp"});M.parentNode.insertBefore(P,M);R.getDoc().execCommand(Q?"ForwardDelete":"Delete",false,null);M=l.getRng().startContainer;T=M.previousSibling;if(T&&T.nodeType==1&&!e.isBlock(T)&&e.isEmpty(T)&&!nonEmptyElements[T.nodeName.toLowerCase()]){e.remove(T)}e.remove("__tmp")}}})}function G(){a.onKeyDown.add(function(P,Q){var N,M,R,L,O;if(z(Q)||Q.keyCode!=j.BACKSPACE){return}N=l.getRng();M=N.startContainer;R=N.startOffset;L=e.getRoot();O=M;if(!N.collapsed||R!==0){return}while(O&&O.parentNode&&O.parentNode.firstChild==O&&O.parentNode!=L){O=O.parentNode}if(O.tagName==="BLOCKQUOTE"){P.formatter.toggle("blockquote",null,O);N=e.createRng();N.setStart(M,0);N.setEnd(M,0);l.setRng(N)}})}function F(){function L(){a._refreshContentEditable();A("StyleWithCSS",false);A("enableInlineTableEditing",false);if(!H.object_resizing){A("enableObjectResizing",false)}}if(!H.readonly){a.onBeforeExecCommand.add(L);a.onMouseDown.add(L)}}function s(){function L(M,N){E(e.select("a"),function(Q){var O=Q.parentNode,P=e.getRoot();if(O.lastChild===Q){while(O&&!e.isBlock(O)){if(O.parentNode.lastChild!==O||O===P){return}O=O.parentNode}e.add(O,"br",{"data-mce-bogus":1})}})}a.onExecCommand.add(function(M,N){if(N==="CreateLink"){L(M)}});a.onSetContent.add(l.onSetContent.add(L))}function m(){if(H.forced_root_block){a.onInit.add(function(){A("DefaultParagraphSeparator",H.forced_root_block)})}}function p(){function L(N,M){if(!N||!M.initial){a.execCommand("mceRepaint")}}a.onUndo.add(L);a.onRedo.add(L);a.onSetContent.add(L)}function i(){a.onKeyDown.add(function(M,N){var L;if(!z(N)&&N.keyCode==f){L=M.getDoc().selection.createRange();if(L&&L.item){N.preventDefault();M.undoManager.beforeChange();e.remove(L.item(0));M.undoManager.add()}}})}function r(){var L;if(n()>=10){L="";E("p div h1 h2 h3 h4 h5 h6".split(" "),function(M,N){L+=(N>0?",":"")+M+":empty"});a.contentStyles.push(L+"{padding-right: 1px !important}")}}function u(){var N,M,ad,L,Y,ab,Z,ac,O,P,aa,W,V,X=document,T=a.getDoc();if(!H.object_resizing||H.webkit_fake_resize===false){return}A("enableObjectResizing",false);aa={n:[0.5,0,0,-1],e:[1,0.5,1,0],s:[0.5,1,0,1],w:[0,0.5,-1,0],nw:[0,0,-1,-1],ne:[1,0,1,-1],se:[1,1,1,1],sw:[0,1,-1,1]};function R(ah){var ag,af;ag=ah.screenX-ab;af=ah.screenY-Z;W=ag*Y[2]+ac;V=af*Y[3]+O;W=W<5?5:W;V=V<5?5:V;if(j.modifierPressed(ah)||(ad.nodeName=="IMG"&&Y[2]*Y[3]!==0)){W=Math.round(V/P);V=Math.round(W*P)}e.setStyles(L,{width:W,height:V});if(Y[2]<0&&L.clientWidth<=W){e.setStyle(L,"left",N+(ac-W))}if(Y[3]<0&&L.clientHeight<=V){e.setStyle(L,"top",M+(O-V))}}function ae(){function af(ag,ah){if(ah){if(ad.style[ag]||!a.schema.isValid(ad.nodeName.toLowerCase(),ag)){e.setStyle(ad,ag,ah)}else{e.setAttrib(ad,ag,ah)}}}af("width",W);af("height",V);e.unbind(T,"mousemove",R);e.unbind(T,"mouseup",ae);if(X!=T){e.unbind(X,"mousemove",R);e.unbind(X,"mouseup",ae)}e.remove(L);Q(ad)}function Q(ai){var ag,ah,af;S();ag=e.getPos(ai);N=ag.x;M=ag.y;ah=ai.offsetWidth;af=ai.offsetHeight;if(ad!=ai){ad=ai;W=V=0}E(aa,function(al,aj){var ak;ak=e.get("mceResizeHandle"+aj);if(!ak){ak=e.add(T.documentElement,"div",{id:"mceResizeHandle"+aj,"class":"mceResizeHandle",style:"cursor:"+aj+"-resize; margin:0; padding:0"});e.bind(ak,"mousedown",function(am){am.preventDefault();ae();ab=am.screenX;Z=am.screenY;ac=ad.clientWidth;O=ad.clientHeight;P=O/ac;Y=al;L=ad.cloneNode(true);e.addClass(L,"mceClonedResizable");e.setStyles(L,{left:N,top:M,margin:0});T.documentElement.appendChild(L);e.bind(T,"mousemove",R);e.bind(T,"mouseup",ae);if(X!=T){e.bind(X,"mousemove",R);e.bind(X,"mouseup",ae)}})}else{e.show(ak)}e.setStyles(ak,{left:(ah*al[0]+N)-(ak.offsetWidth/2),top:(af*al[1]+M)-(ak.offsetHeight/2)})});if(!tinymce.isOpera&&ad.nodeName=="IMG"){ad.setAttribute("data-mce-selected","1")}}function S(){if(ad){ad.removeAttribute("data-mce-selected")}for(var af in aa){e.hide("mceResizeHandle"+af)}}a.contentStyles.push(".mceResizeHandle {position: absolute;border: 1px solid black;background: #FFF;width: 5px;height: 5px;z-index: 10000}.mceResizeHandle:hover {background: #000}img[data-mce-selected] {outline: 1px solid black}img.mceClonedResizable, table.mceClonedResizable {position: absolute;outline: 1px dashed black;opacity: .5;z-index: 10000}");function U(){var af=e.getParent(l.getNode(),"table,img");E(e.select("img[data-mce-selected]"),function(ag){ag.removeAttribute("data-mce-selected")});if(af){Q(af)}else{S()}}a.onNodeChange.add(U);e.bind(T,"selectionchange",U);a.serializer.addAttributeFilter("data-mce-selected",function(af,ag){var ah=af.length;while(ah--){af[ah].attr(ag,null)}})}function D(){if(n()<9){v.addNodeFilter("noscript",function(L){var M=L.length,N,O;while(M--){N=L[M];O=N.firstChild;if(O){N.attr("data-mce-innertext",O.value)}}});o.addNodeFilter("noscript",function(L){var M=L.length,N,P,O;while(M--){N=L[M];P=L[M].firstChild;if(P){P.value=tinymce.html.Entities.decode(P.value)}else{O=N.attributes.map["data-mce-innertext"];if(O){N.attr("data-mce-innertext",null);P=new tinymce.html.Node("#text",3);P.value=O;P.raw=true;N.append(P)}}}})}}t();G();q();if(tinymce.isWebKit){d();J();K();h();m();if(tinymce.isIDevice){b()}else{u();I()}}if(tinymce.isIE){B();x();C();g();i();r();D()}if(tinymce.isGecko){B();y();c();F();s();p()}if(tinymce.isOpera){u()}};(function(j){var a,g,d,k=/[&<>\"\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g,b=/[<>&\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g,f=/[<>&\"\']/g,c=/&(#x|#)?([\w]+);/g,i={128:"\u20AC",130:"\u201A",131:"\u0192",132:"\u201E",133:"\u2026",134:"\u2020",135:"\u2021",136:"\u02C6",137:"\u2030",138:"\u0160",139:"\u2039",140:"\u0152",142:"\u017D",145:"\u2018",146:"\u2019",147:"\u201C",148:"\u201D",149:"\u2022",150:"\u2013",151:"\u2014",152:"\u02DC",153:"\u2122",154:"\u0161",155:"\u203A",156:"\u0153",158:"\u017E",159:"\u0178"};g={'"':"&quot;","'":"&#39;","<":"&lt;",">":"&gt;","&":"&amp;"};d={"&lt;":"<","&gt;":">","&amp;":"&","&quot;":'"',"&apos;":"'"};function h(l){var m;m=document.createElement("div");m.innerHTML=l;return m.textContent||m.innerText||l}function e(m,p){var n,o,l,q={};if(m){m=m.split(",");p=p||10;for(n=0;n<m.length;n+=2){o=String.fromCharCode(parseInt(m[n],p));if(!g[o]){l="&"+m[n+1]+";";q[o]=l;q[l]=o}}return q}}a=e("50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,t9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro",32);j.html=j.html||{};j.html.Entities={encodeRaw:function(m,l){return m.replace(l?k:b,function(n){return g[n]||n})},encodeAllRaw:function(l){return(""+l).replace(f,function(m){return g[m]||m})},encodeNumeric:function(m,l){return m.replace(l?k:b,function(n){if(n.length>1){return"&#"+(((n.charCodeAt(0)-55296)*1024)+(n.charCodeAt(1)-56320)+65536)+";"}return g[n]||"&#"+n.charCodeAt(0)+";"})},encodeNamed:function(n,l,m){m=m||a;return n.replace(l?k:b,function(o){return g[o]||m[o]||o})},getEncodeFunc:function(l,o){var p=j.html.Entities;o=e(o)||a;function m(r,q){return r.replace(q?k:b,function(s){return g[s]||o[s]||"&#"+s.charCodeAt(0)+";"||s})}function n(r,q){return p.encodeNamed(r,q,o)}l=j.makeMap(l.replace(/\+/g,","));if(l.named&&l.numeric){return m}if(l.named){if(o){return n}return p.encodeNamed}if(l.numeric){return p.encodeNumeric}return p.encodeRaw},decode:function(l){return l.replace(c,function(n,m,o){if(m){o=parseInt(o,m.length===2?16:10);if(o>65535){o-=65536;return String.fromCharCode(55296+(o>>10),56320+(o&1023))}else{return i[o]||String.fromCharCode(o)}}return d[n]||a[n]||h(n)})}}})(tinymce);tinymce.html.Styles=function(d,f){var k=/rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/gi,h=/(?:url(?:(?:\(\s*\"([^\"]+)\"\s*\))|(?:\(\s*\'([^\']+)\'\s*\))|(?:\(\s*([^)\s]+)\s*\))))|(?:\'([^\']+)\')|(?:\"([^\"]+)\")/gi,b=/\s*([^:]+):\s*([^;]+);?/g,l=/\s+$/,m=/rgb/,e,g,a={},j;d=d||{};j="\\\" \\' \\; \\: ; : \uFEFF".split(" ");for(g=0;g<j.length;g++){a[j[g]]="\uFEFF"+g;a["\uFEFF"+g]=j[g]}function c(n,q,p,i){function o(r){r=parseInt(r).toString(16);return r.length>1?r:"0"+r}return"#"+o(q)+o(p)+o(i)}return{toHex:function(i){return i.replace(k,c)},parse:function(s){var z={},q,n,x,r,v=d.url_converter,y=d.url_converter_scope||this;function p(D,G){var F,C,B,E;F=z[D+"-top"+G];if(!F){return}C=z[D+"-right"+G];if(F!=C){return}B=z[D+"-bottom"+G];if(C!=B){return}E=z[D+"-left"+G];if(B!=E){return}z[D+G]=E;delete z[D+"-top"+G];delete z[D+"-right"+G];delete z[D+"-bottom"+G];delete z[D+"-left"+G]}function u(C){var D=z[C],B;if(!D||D.indexOf(" ")<0){return}D=D.split(" ");B=D.length;while(B--){if(D[B]!==D[0]){return false}}z[C]=D[0];return true}function A(D,C,B,E){if(!u(C)){return}if(!u(B)){return}if(!u(E)){return}z[D]=z[C]+" "+z[B]+" "+z[E];delete z[C];delete z[B];delete z[E]}function t(B){r=true;return a[B]}function i(C,B){if(r){C=C.replace(/\uFEFF[0-9]/g,function(D){return a[D]})}if(!B){C=C.replace(/\\([\'\";:])/g,"$1")}return C}function o(C,B,F,E,G,D){G=G||D;if(G){G=i(G);return"'"+G.replace(/\'/g,"\\'")+"'"}B=i(B||F||E);if(v){B=v.call(y,B,"style")}return"url('"+B.replace(/\'/g,"\\'")+"')"}if(s){s=s.replace(/\\[\"\';:\uFEFF]/g,t).replace(/\"[^\"]+\"|\'[^\']+\'/g,function(B){return B.replace(/[;:]/g,t)});while(q=b.exec(s)){n=q[1].replace(l,"").toLowerCase();x=q[2].replace(l,"");if(n&&x.length>0){if(n==="font-weight"&&x==="700"){x="bold"}else{if(n==="color"||n==="background-color"){x=x.toLowerCase()}}x=x.replace(k,c);x=x.replace(h,o);z[n]=r?i(x,true):x}b.lastIndex=q.index+q[0].length}p("border","");p("border","-width");p("border","-color");p("border","-style");p("padding","");p("margin","");A("border","border-width","border-style","border-color");if(z.border==="medium none"){delete z.border}}return z},serialize:function(p,r){var o="",n,q;function i(t){var x,u,s,v;x=f.styles[t];if(x){for(u=0,s=x.length;u<s;u++){t=x[u];v=p[t];if(v!==e&&v.length>0){o+=(o.length>0?" ":"")+t+": "+v+";"}}}}if(r&&f&&f.styles){i("*");i(r)}else{for(n in p){q=p[n];if(q!==e&&q.length>0){o+=(o.length>0?" ":"")+n+": "+q+";"}}}return o}}};(function(f){var a={},e=f.makeMap,g=f.each;function d(j,i){return j.split(i||",")}function h(m,l){var j,k={};function i(n){return n.replace(/[A-Z]+/g,function(o){return i(m[o])})}for(j in m){if(m.hasOwnProperty(j)){m[j]=i(m[j])}}i(l).replace(/#/g,"#text").replace(/(\w+)\[([^\]]+)\]\[([^\]]*)\]/g,function(q,o,n,p){n=d(n,"|");k[o]={attributes:e(n),attributesOrder:n,children:e(p,"|",{"#comment":{}})}});return k}function b(){var i=a.html5;if(!i){i=a.html5=h({A:"id|accesskey|class|dir|draggable|item|hidden|itemprop|role|spellcheck|style|subject|title|onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup",B:"#|a|abbr|area|audio|b|bdo|br|button|canvas|cite|code|command|datalist|del|dfn|em|embed|i|iframe|img|input|ins|kbd|keygen|label|link|map|mark|meta|meter|noscript|object|output|progress|q|ruby|samp|script|select|small|span|strong|sub|sup|svg|textarea|time|var|video|wbr",C:"#|a|abbr|area|address|article|aside|audio|b|bdo|blockquote|br|button|canvas|cite|code|command|datalist|del|details|dfn|dialog|div|dl|em|embed|fieldset|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hgroup|hr|i|iframe|img|input|ins|kbd|keygen|label|link|map|mark|menu|meta|meter|nav|noscript|ol|object|output|p|pre|progress|q|ruby|samp|script|section|select|small|span|strong|style|sub|sup|svg|table|textarea|time|ul|var|video"},"html[A|manifest][body|head]head[A][base|command|link|meta|noscript|script|style|title]title[A][#]base[A|href|target][]link[A|href|rel|media|type|sizes][]meta[A|http-equiv|name|content|charset][]style[A|type|media|scoped][#]script[A|charset|type|src|defer|async][#]noscript[A][C]body[A][C]section[A][C]nav[A][C]article[A][C]aside[A][C]h1[A][B]h2[A][B]h3[A][B]h4[A][B]h5[A][B]h6[A][B]hgroup[A][h1|h2|h3|h4|h5|h6]header[A][C]footer[A][C]address[A][C]p[A][B]br[A][]pre[A][B]dialog[A][dd|dt]blockquote[A|cite][C]ol[A|start|reversed][li]ul[A][li]li[A|value][C]dl[A][dd|dt]dt[A][B]dd[A][C]a[A|href|target|ping|rel|media|type][B]em[A][B]strong[A][B]small[A][B]cite[A][B]q[A|cite][B]dfn[A][B]abbr[A][B]code[A][B]var[A][B]samp[A][B]kbd[A][B]sub[A][B]sup[A][B]i[A][B]b[A][B]mark[A][B]progress[A|value|max][B]meter[A|value|min|max|low|high|optimum][B]time[A|datetime][B]ruby[A][B|rt|rp]rt[A][B]rp[A][B]bdo[A][B]span[A][B]ins[A|cite|datetime][B]del[A|cite|datetime][B]figure[A][C|legend|figcaption]figcaption[A][C]img[A|alt|src|height|width|usemap|ismap][]iframe[A|name|src|height|width|sandbox|seamless][]embed[A|src|height|width|type][]object[A|data|type|height|width|usemap|name|form|classid][param]param[A|name|value][]details[A|open][C|legend]command[A|type|label|icon|disabled|checked|radiogroup][]menu[A|type|label][C|li]legend[A][C|B]div[A][C]source[A|src|type|media][]audio[A|src|autobuffer|autoplay|loop|controls][source]video[A|src|autobuffer|autoplay|loop|controls|width|height|poster][source]hr[A][]form[A|accept-charset|action|autocomplete|enctype|method|name|novalidate|target][C]fieldset[A|disabled|form|name][C|legend]label[A|form|for][B]input[A|type|accept|alt|autocomplete|autofocus|checked|disabled|form|formaction|formenctype|formmethod|formnovalidate|formtarget|height|list|max|maxlength|min|multiple|pattern|placeholder|readonly|required|size|src|step|width|files|value|name][]button[A|autofocus|disabled|form|formaction|formenctype|formmethod|formnovalidate|formtarget|name|value|type][B]select[A|autofocus|disabled|form|multiple|name|size][option|optgroup]datalist[A][B|option]optgroup[A|disabled|label][option]option[A|disabled|selected|label|value][]textarea[A|autofocus|disabled|form|maxlength|name|placeholder|readonly|required|rows|cols|wrap][]keygen[A|autofocus|challenge|disabled|form|keytype|name][]output[A|for|form|name][B]canvas[A|width|height][]map[A|name][B|C]area[A|shape|coords|href|alt|target|media|rel|ping|type][]mathml[A][]svg[A][]table[A|border][caption|colgroup|thead|tfoot|tbody|tr]caption[A][C]colgroup[A|span][col]col[A|span][]thead[A][tr]tfoot[A][tr]tbody[A][tr]tr[A][th|td]th[A|headers|rowspan|colspan|scope][B]td[A|headers|rowspan|colspan][C]wbr[A][]")}return i}function c(){var i=a.html4;if(!i){i=a.html4=h({Z:"H|K|N|O|P",Y:"X|form|R|Q",ZG:"E|span|width|align|char|charoff|valign",X:"p|T|div|U|W|isindex|fieldset|table",ZF:"E|align|char|charoff|valign",W:"pre|hr|blockquote|address|center|noframes",ZE:"abbr|axis|headers|scope|rowspan|colspan|align|char|charoff|valign|nowrap|bgcolor|width|height",ZD:"[E][S]",U:"ul|ol|dl|menu|dir",ZC:"p|Y|div|U|W|table|br|span|bdo|object|applet|img|map|K|N|Q",T:"h1|h2|h3|h4|h5|h6",ZB:"X|S|Q",S:"R|P",ZA:"a|G|J|M|O|P",R:"a|H|K|N|O",Q:"noscript|P",P:"ins|del|script",O:"input|select|textarea|label|button",N:"M|L",M:"em|strong|dfn|code|q|samp|kbd|var|cite|abbr|acronym",L:"sub|sup",K:"J|I",J:"tt|i|b|u|s|strike",I:"big|small|font|basefont",H:"G|F",G:"br|span|bdo",F:"object|applet|img|map|iframe",E:"A|B|C",D:"accesskey|tabindex|onfocus|onblur",C:"onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup",B:"lang|xml:lang|dir",A:"id|class|style|title"},"script[id|charset|type|language|src|defer|xml:space][]style[B|id|type|media|title|xml:space][]object[E|declare|classid|codebase|data|type|codetype|archive|standby|width|height|usemap|name|tabindex|align|border|hspace|vspace][#|param|Y]param[id|name|value|valuetype|type][]p[E|align][#|S]a[E|D|charset|type|name|href|hreflang|rel|rev|shape|coords|target][#|Z]br[A|clear][]span[E][#|S]bdo[A|C|B][#|S]applet[A|codebase|archive|code|object|alt|name|width|height|align|hspace|vspace][#|param|Y]h1[E|align][#|S]img[E|src|alt|name|longdesc|width|height|usemap|ismap|align|border|hspace|vspace][]map[B|C|A|name][X|form|Q|area]h2[E|align][#|S]iframe[A|longdesc|name|src|frameborder|marginwidth|marginheight|scrolling|align|width|height][#|Y]h3[E|align][#|S]tt[E][#|S]i[E][#|S]b[E][#|S]u[E][#|S]s[E][#|S]strike[E][#|S]big[E][#|S]small[E][#|S]font[A|B|size|color|face][#|S]basefont[id|size|color|face][]em[E][#|S]strong[E][#|S]dfn[E][#|S]code[E][#|S]q[E|cite][#|S]samp[E][#|S]kbd[E][#|S]var[E][#|S]cite[E][#|S]abbr[E][#|S]acronym[E][#|S]sub[E][#|S]sup[E][#|S]input[E|D|type|name|value|checked|disabled|readonly|size|maxlength|src|alt|usemap|onselect|onchange|accept|align][]select[E|name|size|multiple|disabled|tabindex|onfocus|onblur|onchange][optgroup|option]optgroup[E|disabled|label][option]option[E|selected|disabled|label|value][]textarea[E|D|name|rows|cols|disabled|readonly|onselect|onchange][]label[E|for|accesskey|onfocus|onblur][#|S]button[E|D|name|value|type|disabled][#|p|T|div|U|W|table|G|object|applet|img|map|K|N|Q]h4[E|align][#|S]ins[E|cite|datetime][#|Y]h5[E|align][#|S]del[E|cite|datetime][#|Y]h6[E|align][#|S]div[E|align][#|Y]ul[E|type|compact][li]li[E|type|value][#|Y]ol[E|type|compact|start][li]dl[E|compact][dt|dd]dt[E][#|S]dd[E][#|Y]menu[E|compact][li]dir[E|compact][li]pre[E|width|xml:space][#|ZA]hr[E|align|noshade|size|width][]blockquote[E|cite][#|Y]address[E][#|S|p]center[E][#|Y]noframes[E][#|Y]isindex[A|B|prompt][]fieldset[E][#|legend|Y]legend[E|accesskey|align][#|S]table[E|summary|width|border|frame|rules|cellspacing|cellpadding|align|bgcolor][caption|col|colgroup|thead|tfoot|tbody|tr]caption[E|align][#|S]col[ZG][]colgroup[ZG][col]thead[ZF][tr]tr[ZF|bgcolor][th|td]th[E|ZE][#|Y]form[E|action|method|name|enctype|onsubmit|onreset|accept|accept-charset|target][#|X|R|Q]noscript[E][#|Y]td[E|ZE][#|Y]tfoot[ZF][tr]tbody[ZF][tr]area[E|D|shape|coords|href|nohref|alt|target][]base[id|href|target][]body[E|onload|onunload|background|bgcolor|text|link|vlink|alink][#|Y]")}return i}f.html.Schema=function(A){var u=this,s={},k={},j=[],D,y;var o,q,z,r,v,n,p={};function m(F,E,H){var G=A[F];if(!G){G=a[F];if(!G){G=e(E," ",e(E.toUpperCase()," "));G=f.extend(G,H);a[F]=G}}else{G=e(G,",",e(G.toUpperCase()," "))}return G}A=A||{};y=A.schema=="html5"?b():c();if(A.verify_html===false){A.valid_elements="*[*]"}if(A.valid_styles){D={};g(A.valid_styles,function(F,E){D[E]=f.explode(F)})}o=m("whitespace_elements","pre script noscript style textarea");q=m("self_closing_elements","colgroup dd dt li option p td tfoot th thead tr");z=m("short_ended_elements","area base basefont br col frame hr img input isindex link meta param embed source wbr");r=m("boolean_attributes","checked compact declare defer disabled ismap multiple nohref noresize noshade nowrap readonly selected autoplay loop controls");n=m("non_empty_elements","td th iframe video audio object",z);textBlockElementsMap=m("text_block_elements","h1 h2 h3 h4 h5 h6 p div address pre form blockquote center dir fieldset header footer article section hgroup aside nav figure");v=m("block_elements","hr table tbody thead tfoot th tr td li ol ul caption dl dt dd noscript menu isindex samp option datalist select optgroup",textBlockElementsMap);function i(E){return new RegExp("^"+E.replace(/([?+*])/g,".$1")+"$")}function C(L){var K,G,Z,V,aa,F,I,U,X,Q,Y,ac,O,J,W,E,S,H,ab,ad,P,T,N=/^([#+\-])?([^\[\/]+)(?:\/([^\[]+))?(?:\[([^\]]+)\])?$/,R=/^([!\-])?(\w+::\w+|[^=:<]+)?(?:([=:<])(.*))?$/,M=/[*?+]/;if(L){L=d(L);if(s["@"]){S=s["@"].attributes;H=s["@"].attributesOrder}for(K=0,G=L.length;K<G;K++){F=N.exec(L[K]);if(F){W=F[1];Q=F[2];E=F[3];X=F[4];O={};J=[];I={attributes:O,attributesOrder:J};if(W==="#"){I.paddEmpty=true}if(W==="-"){I.removeEmpty=true}if(S){for(ad in S){O[ad]=S[ad]}J.push.apply(J,H)}if(X){X=d(X,"|");for(Z=0,V=X.length;Z<V;Z++){F=R.exec(X[Z]);if(F){U={};ac=F[1];Y=F[2].replace(/::/g,":");W=F[3];T=F[4];if(ac==="!"){I.attributesRequired=I.attributesRequired||[];I.attributesRequired.push(Y);U.required=true}if(ac==="-"){delete O[Y];J.splice(f.inArray(J,Y),1);continue}if(W){if(W==="="){I.attributesDefault=I.attributesDefault||[];I.attributesDefault.push({name:Y,value:T});U.defaultValue=T}if(W===":"){I.attributesForced=I.attributesForced||[];I.attributesForced.push({name:Y,value:T});U.forcedValue=T}if(W==="<"){U.validValues=e(T,"?")}}if(M.test(Y)){I.attributePatterns=I.attributePatterns||[];U.pattern=i(Y);I.attributePatterns.push(U)}else{if(!O[Y]){J.push(Y)}O[Y]=U}}}}if(!S&&Q=="@"){S=O;H=J}if(E){I.outputName=Q;s[E]=I}if(M.test(Q)){I.pattern=i(Q);j.push(I)}else{s[Q]=I}}}}}function t(E){s={};j=[];C(E);g(y,function(G,F){k[F]=G.children})}function l(F){var E=/^(~)?(.+)$/;if(F){g(d(F),function(J){var H=E.exec(J),I=H[1]==="~",K=I?"span":"div",G=H[2];k[G]=k[K];p[G]=K;if(!I){v[G.toUpperCase()]={};v[G]={}}if(!s[G]){s[G]=s[K]}g(k,function(L,M){if(L[K]){L[G]=L[K]}})})}}function x(F){var E=/^([+\-]?)(\w+)\[([^\]]+)\]$/;if(F){g(d(F),function(J){var I=E.exec(J),G,H;if(I){H=I[1];if(H){G=k[I[2]]}else{G=k[I[2]]={"#comment":{}}}G=k[I[2]];g(d(I[3],"|"),function(K){if(H==="-"){delete G[K]}else{G[K]={}}})}})}}function B(E){var G=s[E],F;if(G){return G}F=j.length;while(F--){G=j[F];if(G.pattern.test(E)){return G}}}if(!A.valid_elements){g(y,function(F,E){s[E]={attributes:F.attributes,attributesOrder:F.attributesOrder};k[E]=F.children});if(A.schema!="html5"){g(d("strong/b,em/i"),function(E){E=d(E,"/");s[E[1]].outputName=E[0]})}s.img.attributesDefault=[{name:"alt",value:""}];g(d("ol,ul,sub,sup,blockquote,span,font,a,table,tbody,tr,strong,em,b,i"),function(E){if(s[E]){s[E].removeEmpty=true}});g(d("p,h1,h2,h3,h4,h5,h6,th,td,pre,div,address,caption"),function(E){s[E].paddEmpty=true})}else{t(A.valid_elements)}l(A.custom_elements);x(A.valid_children);C(A.extended_valid_elements);x("+ol[ul|ol],+ul[ul|ol]");if(A.invalid_elements){f.each(f.explode(A.invalid_elements),function(E){if(s[E]){delete s[E]}})}if(!B("span")){C("span[!data-mce-type|*]")}u.children=k;u.styles=D;u.getBoolAttrs=function(){return r};u.getBlockElements=function(){return v};u.getTextBlockElements=function(){return textBlockElementsMap};u.getShortEndedElements=function(){return z};u.getSelfClosingElements=function(){return q};u.getNonEmptyElements=function(){return n};u.getWhiteSpaceElements=function(){return o};u.isValidChild=function(E,G){var F=k[E];return !!(F&&F[G])};u.isValid=function(F,E){var H,G,I=B(F);if(I){if(E){if(I.attributes[E]){return true}H=I.attributePatterns;if(H){G=H.length;while(G--){if(H[G].pattern.test(F)){return true}}}}else{return true}}return false};u.getElementRule=B;u.getCustomElements=function(){return p};u.addValidElements=C;u.setValidElements=t;u.addCustomElements=l;u.addValidChildren=x;u.elements=s}})(tinymce);(function(a){a.html.SaxParser=function(c,e){var b=this,d=function(){};c=c||{};b.schema=e=e||new a.html.Schema();if(c.fix_self_closing!==false){c.fix_self_closing=true}a.each("comment cdata text start end pi doctype".split(" "),function(f){if(f){b[f]=c[f]||d}});b.parse=function(E){var n=this,g,G=0,I,B,A=[],N,Q,C,r,z,s,M,H,O,v,m,k,t,R,o,P,F,S,L,f,J,l,D,K,h,x=0,j=a.html.Entities.decode,y,q;function u(T){var V,U;V=A.length;while(V--){if(A[V].name===T){break}}if(V>=0){for(U=A.length-1;U>=V;U--){T=A[U];if(T.valid){n.end(T.name)}}A.length=V}}function p(U,T,Y,X,W){var Z,V;T=T.toLowerCase();Y=T in H?T:j(Y||X||W||"");if(v&&!z&&T.indexOf("data-")!==0){Z=P[T];if(!Z&&F){V=F.length;while(V--){Z=F[V];if(Z.pattern.test(T)){break}}if(V===-1){Z=null}}if(!Z){return}if(Z.validValues&&!(Y in Z.validValues)){return}}N.map[T]=Y;N.push({name:T,value:Y})}l=new RegExp("<(?:(?:!--([\\w\\W]*?)-->)|(?:!\\[CDATA\\[([\\w\\W]*?)\\]\\]>)|(?:!DOCTYPE([\\w\\W]*?)>)|(?:\\?([^\\s\\/<>]+) ?([\\w\\W]*?)[?/]>)|(?:\\/([^>]+)>)|(?:([A-Za-z0-9\\-\\:\\.]+)((?:\\s+[^\"'>]+(?:(?:\"[^\"]*\")|(?:'[^']*')|[^>]*))*|\\/|\\s+)>))","g");D=/([\w:\-]+)(?:\s*=\s*(?:(?:\"((?:[^\"])*)\")|(?:\'((?:[^\'])*)\')|([^>\s]+)))?/g;K={script:/<\/script[^>]*>/gi,style:/<\/style[^>]*>/gi,noscript:/<\/noscript[^>]*>/gi};M=e.getShortEndedElements();J=c.self_closing_elements||e.getSelfClosingElements();H=e.getBoolAttrs();v=c.validate;s=c.remove_internals;y=c.fix_self_closing;q=a.isIE;o=/^:/;while(g=l.exec(E)){if(G<g.index){n.text(j(E.substr(G,g.index-G)))}if(I=g[6]){I=I.toLowerCase();if(q&&o.test(I)){I=I.substr(1)}u(I)}else{if(I=g[7]){I=I.toLowerCase();if(q&&o.test(I)){I=I.substr(1)}O=I in M;if(y&&J[I]&&A.length>0&&A[A.length-1].name===I){u(I)}if(!v||(m=e.getElementRule(I))){k=true;if(v){P=m.attributes;F=m.attributePatterns}if(R=g[8]){z=R.indexOf("data-mce-type")!==-1;if(z&&s){k=false}N=[];N.map={};R.replace(D,p)}else{N=[];N.map={}}if(v&&!z){S=m.attributesRequired;L=m.attributesDefault;f=m.attributesForced;if(f){Q=f.length;while(Q--){t=f[Q];r=t.name;h=t.value;if(h==="{$uid}"){h="mce_"+x++}N.map[r]=h;N.push({name:r,value:h})}}if(L){Q=L.length;while(Q--){t=L[Q];r=t.name;if(!(r in N.map)){h=t.value;if(h==="{$uid}"){h="mce_"+x++}N.map[r]=h;N.push({name:r,value:h})}}}if(S){Q=S.length;while(Q--){if(S[Q] in N.map){break}}if(Q===-1){k=false}}if(N.map["data-mce-bogus"]){k=false}}if(k){n.start(I,N,O)}}else{k=false}if(B=K[I]){B.lastIndex=G=g.index+g[0].length;if(g=B.exec(E)){if(k){C=E.substr(G,g.index-G)}G=g.index+g[0].length}else{C=E.substr(G);G=E.length}if(k&&C.length>0){n.text(C,true)}if(k){n.end(I)}l.lastIndex=G;continue}if(!O){if(!R||R.indexOf("/")!=R.length-1){A.push({name:I,valid:k})}else{if(k){n.end(I)}}}}else{if(I=g[1]){n.comment(I)}else{if(I=g[2]){n.cdata(I)}else{if(I=g[3]){n.doctype(I)}else{if(I=g[4]){n.pi(I,g[5])}}}}}}G=g.index+g[0].length}if(G<E.length){n.text(j(E.substr(G)))}for(Q=A.length-1;Q>=0;Q--){I=A[Q];if(I.valid){n.end(I.name)}}}}})(tinymce);(function(d){var c=/^[ \t\r\n]*$/,e={"#text":3,"#comment":8,"#cdata":4,"#pi":7,"#doctype":10,"#document-fragment":11};function a(k,l,j){var i,h,f=j?"lastChild":"firstChild",g=j?"prev":"next";if(k[f]){return k[f]}if(k!==l){i=k[g];if(i){return i}for(h=k.parent;h&&h!==l;h=h.parent){i=h[g];if(i){return i}}}}function b(f,g){this.name=f;this.type=g;if(g===1){this.attributes=[];this.attributes.map={}}}d.extend(b.prototype,{replace:function(g){var f=this;if(g.parent){g.remove()}f.insert(g,f);f.remove();return f},attr:function(h,l){var f=this,g,j,k;if(typeof h!=="string"){for(j in h){f.attr(j,h[j])}return f}if(g=f.attributes){if(l!==k){if(l===null){if(h in g.map){delete g.map[h];j=g.length;while(j--){if(g[j].name===h){g=g.splice(j,1);return f}}}return f}if(h in g.map){j=g.length;while(j--){if(g[j].name===h){g[j].value=l;break}}}else{g.push({name:h,value:l})}g.map[h]=l;return f}else{return g.map[h]}}},clone:function(){var g=this,n=new b(g.name,g.type),h,f,m,j,k;if(m=g.attributes){k=[];k.map={};for(h=0,f=m.length;h<f;h++){j=m[h];if(j.name!=="id"){k[k.length]={name:j.name,value:j.value};k.map[j.name]=j.value}}n.attributes=k}n.value=g.value;n.shortEnded=g.shortEnded;return n},wrap:function(g){var f=this;f.parent.insert(g,f);g.append(f);return f},unwrap:function(){var f=this,h,g;for(h=f.firstChild;h;){g=h.next;f.insert(h,f,true);h=g}f.remove()},remove:function(){var f=this,h=f.parent,g=f.next,i=f.prev;if(h){if(h.firstChild===f){h.firstChild=g;if(g){g.prev=null}}else{i.next=g}if(h.lastChild===f){h.lastChild=i;if(i){i.next=null}}else{g.prev=i}f.parent=f.next=f.prev=null}return f},append:function(h){var f=this,g;if(h.parent){h.remove()}g=f.lastChild;if(g){g.next=h;h.prev=g;f.lastChild=h}else{f.lastChild=f.firstChild=h}h.parent=f;return h},insert:function(h,f,i){var g;if(h.parent){h.remove()}g=f.parent||this;if(i){if(f===g.firstChild){g.firstChild=h}else{f.prev.next=h}h.prev=f.prev;h.next=f;f.prev=h}else{if(f===g.lastChild){g.lastChild=h}else{f.next.prev=h}h.next=f.next;h.prev=f;f.next=h}h.parent=g;return h},getAll:function(g){var f=this,h,i=[];for(h=f.firstChild;h;h=a(h,f)){if(h.name===g){i.push(h)}}return i},empty:function(){var g=this,f,h,j;if(g.firstChild){f=[];for(j=g.firstChild;j;j=a(j,g)){f.push(j)}h=f.length;while(h--){j=f[h];j.parent=j.firstChild=j.lastChild=j.next=j.prev=null}}g.firstChild=g.lastChild=null;return g},isEmpty:function(k){var f=this,j=f.firstChild,h,g;if(j){do{if(j.type===1){if(j.attributes.map["data-mce-bogus"]){continue}if(k[j.name]){return false}h=j.attributes.length;while(h--){g=j.attributes[h].name;if(g==="name"||g.indexOf("data-mce-")===0){return false}}}if(j.type===8){return false}if((j.type===3&&!c.test(j.value))){return false}}while(j=a(j,f))}return true},walk:function(f){return a(this,null,f)}});d.extend(b,{create:function(g,f){var i,h;i=new b(g,e[g]||1);if(f){for(h in f){i.attr(h,f[h])}}return i}});d.html.Node=b})(tinymce);(function(b){var a=b.html.Node;b.html.DomParser=function(g,h){var f=this,e={},d=[],i={},c={};g=g||{};g.validate="validate" in g?g.validate:true;g.root_name=g.root_name||"body";f.schema=h=h||new b.html.Schema();function j(n){var p,q,y,x,A,o,r,l,u,v,k,t,m,z,s;t=b.makeMap("tr,td,th,tbody,thead,tfoot,table");k=h.getNonEmptyElements();m=h.getTextBlockElements();for(p=0;p<n.length;p++){q=n[p];if(!q.parent||q.fixed){continue}if(m[q.name]&&q.parent.name=="li"){z=q.next;while(z){if(m[z.name]){z.name="li";z.fixed=true;q.parent.insert(z,q.parent)}else{break}z=z.next}q.unwrap(q);continue}x=[q];for(y=q.parent;y&&!h.isValidChild(y.name,q.name)&&!t[y.name];y=y.parent){x.push(y)}if(y&&x.length>1){x.reverse();A=o=f.filterNode(x[0].clone());for(u=0;u<x.length-1;u++){if(h.isValidChild(o.name,x[u].name)){r=f.filterNode(x[u].clone());o.append(r)}else{r=o}for(l=x[u].firstChild;l&&l!=x[u+1];){s=l.next;r.append(l);l=s}o=r}if(!A.isEmpty(k)){y.insert(A,x[0],true);y.insert(q,A)}else{y.insert(q,x[0],true)}y=x[0];if(y.isEmpty(k)||y.firstChild===y.lastChild&&y.firstChild.name==="br"){y.empty().remove()}}else{if(q.parent){if(q.name==="li"){z=q.prev;if(z&&(z.name==="ul"||z.name==="ul")){z.append(q);continue}z=q.next;if(z&&(z.name==="ul"||z.name==="ul")){z.insert(q,z.firstChild,true);continue}q.wrap(f.filterNode(new a("ul",1)));continue}if(h.isValidChild(q.parent.name,"div")&&h.isValidChild("div",q.name)){q.wrap(f.filterNode(new a("div",1)))}else{if(q.name==="style"||q.name==="script"){q.empty().remove()}else{q.unwrap()}}}}}}f.filterNode=function(m){var l,k,n;if(k in e){n=i[k];if(n){n.push(m)}else{i[k]=[m]}}l=d.length;while(l--){k=d[l].name;if(k in m.attributes.map){n=c[k];if(n){n.push(m)}else{c[k]=[m]}}}return m};f.addNodeFilter=function(k,l){b.each(b.explode(k),function(m){var n=e[m];if(!n){e[m]=n=[]}n.push(l)})};f.addAttributeFilter=function(k,l){b.each(b.explode(k),function(m){var n;for(n=0;n<d.length;n++){if(d[n].name===m){d[n].callbacks.push(l);return}}d.push({name:m,callbacks:[l]})})};f.parse=function(v,m){var n,J,B,A,D,C,x,r,F,N,z,o,E,M=[],L,t,k,y,s,p,u,q;m=m||{};i={};c={};o=b.extend(b.makeMap("script,style,head,html,body,title,meta,param"),h.getBlockElements());u=h.getNonEmptyElements();p=h.children;z=g.validate;q="forced_root_block" in m?m.forced_root_block:g.forced_root_block;s=h.getWhiteSpaceElements();E=/^[ \t\r\n]+/;t=/[ \t\r\n]+$/;k=/[ \t\r\n]+/g;y=/^[ \t\r\n]+$/;function G(){var O=J.firstChild,l,P;while(O){l=O.next;if(O.type==3||(O.type==1&&O.name!=="p"&&!o[O.name]&&!O.attr("data-mce-type"))){if(!P){P=K(q,1);J.insert(P,O);P.append(O)}else{P.append(O)}}else{P=null}O=l}}function K(l,O){var P=new a(l,O),Q;if(l in e){Q=i[l];if(Q){Q.push(P)}else{i[l]=[P]}}return P}function I(P){var Q,l,O;for(Q=P.prev;Q&&Q.type===3;){l=Q.value.replace(t,"");if(l.length>0){Q.value=l;Q=Q.prev}else{O=Q.prev;Q.remove();Q=O}}}function H(O){var P,l={};for(P in O){if(P!=="li"&&P!="p"){l[P]=O[P]}}return l}n=new b.html.SaxParser({validate:z,self_closing_elements:H(h.getSelfClosingElements()),cdata:function(l){B.append(K("#cdata",4)).value=l},text:function(P,l){var O;if(!L){P=P.replace(k," ");if(B.lastChild&&o[B.lastChild.name]){P=P.replace(E,"")}}if(P.length!==0){O=K("#text",3);O.raw=!!l;B.append(O).value=P}},comment:function(l){B.append(K("#comment",8)).value=l},pi:function(l,O){B.append(K(l,7)).value=O;I(B)},doctype:function(O){var l;l=B.append(K("#doctype",10));l.value=O;I(B)},start:function(l,W,P){var U,R,Q,O,S,X,V,T;Q=z?h.getElementRule(l):{};if(Q){U=K(Q.outputName||l,1);U.attributes=W;U.shortEnded=P;B.append(U);T=p[B.name];if(T&&p[U.name]&&!T[U.name]){M.push(U)}R=d.length;while(R--){S=d[R].name;if(S in W.map){F=c[S];if(F){F.push(U)}else{c[S]=[U]}}}if(o[l]){I(U)}if(!P){B=U}if(!L&&s[l]){L=true}}},end:function(l){var S,P,R,O,Q;P=z?h.getElementRule(l):{};if(P){if(o[l]){if(!L){S=B.firstChild;if(S&&S.type===3){R=S.value.replace(E,"");if(R.length>0){S.value=R;S=S.next}else{O=S.next;S.remove();S=O}while(S&&S.type===3){R=S.value;O=S.next;if(R.length===0||y.test(R)){S.remove();S=O}S=O}}S=B.lastChild;if(S&&S.type===3){R=S.value.replace(t,"");if(R.length>0){S.value=R;S=S.prev}else{O=S.prev;S.remove();S=O}while(S&&S.type===3){R=S.value;O=S.prev;if(R.length===0||y.test(R)){S.remove();S=O}S=O}}}}if(L&&s[l]){L=false}if(P.removeEmpty||P.paddEmpty){if(B.isEmpty(u)){if(P.paddEmpty){B.empty().append(new a("#text","3")).value="\u00a0"}else{if(!B.attributes.map.name&&!B.attributes.map.id){Q=B.parent;B.empty().remove();B=Q;return}}}}B=B.parent}}},h);J=B=new a(m.context||g.root_name,11);n.parse(v);if(z&&M.length){if(!m.context){j(M)}else{m.invalid=true}}if(q&&J.name=="body"){G()}if(!m.invalid){for(N in i){F=e[N];A=i[N];x=A.length;while(x--){if(!A[x].parent){A.splice(x,1)}}for(D=0,C=F.length;D<C;D++){F[D](A,N,m)}}for(D=0,C=d.length;D<C;D++){F=d[D];if(F.name in c){A=c[F.name];x=A.length;while(x--){if(!A[x].parent){A.splice(x,1)}}for(x=0,r=F.callbacks.length;x<r;x++){F.callbacks[x](A,F.name,m)}}}}return J};if(g.remove_trailing_brs){f.addNodeFilter("br",function(n,m){var r,q=n.length,o,v=b.extend({},h.getBlockElements()),k=h.getNonEmptyElements(),t,s,p,u;v.body=1;for(r=0;r<q;r++){o=n[r];t=o.parent;if(v[o.parent.name]&&o===t.lastChild){p=o.prev;while(p){u=p.name;if(u!=="span"||p.attr("data-mce-type")!=="bookmark"){if(u!=="br"){break}if(u==="br"){o=null;break}}p=p.prev}if(o){o.remove();if(t.isEmpty(k)){elementRule=h.getElementRule(t.name);if(elementRule){if(elementRule.removeEmpty){t.remove()}else{if(elementRule.paddEmpty){t.empty().append(new b.html.Node("#text",3)).value="\u00a0"}}}}}}else{s=o;while(t.firstChild===s&&t.lastChild===s){s=t;if(v[t.name]){break}t=t.parent}if(s===t){textNode=new b.html.Node("#text",3);textNode.value="\u00a0";o.replace(textNode)}}}})}if(!g.allow_html_in_named_anchor){f.addAttributeFilter("id,name",function(k,l){var n=k.length,p,m,o,q;while(n--){q=k[n];if(q.name==="a"&&q.firstChild&&!q.attr("href")){o=q.parent;p=q.lastChild;do{m=p.prev;o.insert(p,q);p=m}while(p)}}})}}})(tinymce);tinymce.html.Writer=function(e){var c=[],a,b,d,f,g;e=e||{};a=e.indent;b=tinymce.makeMap(e.indent_before||"");d=tinymce.makeMap(e.indent_after||"");f=tinymce.html.Entities.getEncodeFunc(e.entity_encoding||"raw",e.entities);g=e.element_format=="html";return{start:function(m,k,p){var n,j,h,o;if(a&&b[m]&&c.length>0){o=c[c.length-1];if(o.length>0&&o!=="\n"){c.push("\n")}}c.push("<",m);if(k){for(n=0,j=k.length;n<j;n++){h=k[n];c.push(" ",h.name,'="',f(h.value,true),'"')}}if(!p||g){c[c.length]=">"}else{c[c.length]=" />"}if(p&&a&&d[m]&&c.length>0){o=c[c.length-1];if(o.length>0&&o!=="\n"){c.push("\n")}}},end:function(h){var i;c.push("</",h,">");if(a&&d[h]&&c.length>0){i=c[c.length-1];if(i.length>0&&i!=="\n"){c.push("\n")}}},text:function(i,h){if(i.length>0){c[c.length]=h?i:f(i)}},cdata:function(h){c.push("<![CDATA[",h,"]]>")},comment:function(h){c.push("<!--",h,"-->")},pi:function(h,i){if(i){c.push("<?",h," ",i,"?>")}else{c.push("<?",h,"?>")}if(a){c.push("\n")}},doctype:function(h){c.push("<!DOCTYPE",h,">",a?"\n":"")},reset:function(){c.length=0},getContent:function(){return c.join("").replace(/\n$/,"")}}};(function(a){a.html.Serializer=function(c,d){var b=this,e=new a.html.Writer(c);c=c||{};c.validate="validate" in c?c.validate:true;b.schema=d=d||new a.html.Schema();b.writer=e;b.serialize=function(h){var g,i;i=c.validate;g={3:function(k,j){e.text(k.value,k.raw)},8:function(j){e.comment(j.value)},7:function(j){e.pi(j.name,j.value)},10:function(j){e.doctype(j.value)},4:function(j){e.cdata(j.value)},11:function(j){if((j=j.firstChild)){do{f(j)}while(j=j.next)}}};e.reset();function f(k){var t=g[k.type],j,o,s,r,p,u,n,m,q;if(!t){j=k.name;o=k.shortEnded;s=k.attributes;if(i&&s&&s.length>1){u=[];u.map={};q=d.getElementRule(k.name);for(n=0,m=q.attributesOrder.length;n<m;n++){r=q.attributesOrder[n];if(r in s.map){p=s.map[r];u.map[r]=p;u.push({name:r,value:p})}}for(n=0,m=s.length;n<m;n++){r=s[n].name;if(!(r in u.map)){p=s.map[r];u.map[r]=p;u.push({name:r,value:p})}}s=u}e.start(k.name,s,o);if(!o){if((k=k.firstChild)){do{f(k)}while(k=k.next)}e.end(j)}}else{t(k)}}if(h.type==1&&!c.inner){f(h)}else{g[11](h)}return e.getContent()}}})(tinymce);tinymce.dom={};(function(b,h){var g=!!document.addEventListener;function c(k,j,l,i){if(k.addEventListener){k.addEventListener(j,l,i||false)}else{if(k.attachEvent){k.attachEvent("on"+j,l)}}}function e(k,j,l,i){if(k.removeEventListener){k.removeEventListener(j,l,i||false)}else{if(k.detachEvent){k.detachEvent("on"+j,l)}}}function a(n,l){var i,k=l||{};function j(){return false}function m(){return true}for(i in n){if(i!=="layerX"&&i!=="layerY"){k[i]=n[i]}}if(!k.target){k.target=k.srcElement||document}k.preventDefault=function(){k.isDefaultPrevented=m;if(n){if(n.preventDefault){n.preventDefault()}else{n.returnValue=false}}};k.stopPropagation=function(){k.isPropagationStopped=m;if(n){if(n.stopPropagation){n.stopPropagation()}else{n.cancelBubble=true}}};k.stopImmediatePropagation=function(){k.isImmediatePropagationStopped=m;k.stopPropagation()};if(!k.isDefaultPrevented){k.isDefaultPrevented=j;k.isPropagationStopped=j;k.isImmediatePropagationStopped=j}return k}function d(m,n,l){var k=m.document,j={type:"ready"};function i(){if(!l.domLoaded){l.domLoaded=true;n(j)}}if(k.readyState=="complete"){i();return}if(g){c(m,"DOMContentLoaded",i)}else{c(k,"readystatechange",function(){if(k.readyState==="complete"){e(k,"readystatechange",arguments.callee);i()}});if(k.documentElement.doScroll&&m===m.top){(function(){try{k.documentElement.doScroll("left")}catch(o){setTimeout(arguments.callee,0);return}i()})()}}c(m,"load",i)}function f(k){var q=this,p={},i,o,n,m,l;m="onmouseenter" in document.documentElement;n="onfocusin" in document.documentElement;l={mouseenter:"mouseover",mouseleave:"mouseout"};i=1;q.domLoaded=false;q.events=p;function j(t,x){var s,u,r,v;s=p[x][t.type];if(s){for(u=0,r=s.length;u<r;u++){v=s[u];if(v&&v.func.call(v.scope,t)===false){t.preventDefault()}if(t.isImmediatePropagationStopped()){return}}}}q.bind=function(x,A,D,E){var s,t,u,r,B,z,C,v=window;function y(F){j(a(F||v.event),s)}if(!x||x.nodeType===3||x.nodeType===8){return}if(!x[h]){s=i++;x[h]=s;p[s]={}}else{s=x[h];if(!p[s]){p[s]={}}}E=E||x;A=A.split(" ");u=A.length;while(u--){r=A[u];z=y;B=C=false;if(r==="DOMContentLoaded"){r="ready"}if((q.domLoaded||x.readyState=="complete")&&r==="ready"){q.domLoaded=true;D.call(E,a({type:r}));continue}if(!m){B=l[r];if(B){z=function(F){var H,G;H=F.currentTarget;G=F.relatedTarget;if(G&&H.contains){G=H.contains(G)}else{while(G&&G!==H){G=G.parentNode}}if(!G){F=a(F||v.event);F.type=F.type==="mouseout"?"mouseleave":"mouseenter";F.target=H;j(F,s)}}}}if(!n&&(r==="focusin"||r==="focusout")){C=true;B=r==="focusin"?"focus":"blur";z=function(F){F=a(F||v.event);F.type=F.type==="focus"?"focusin":"focusout";j(F,s)}}t=p[s][r];if(!t){p[s][r]=t=[{func:D,scope:E}];t.fakeName=B;t.capture=C;t.nativeHandler=z;if(!g){t.proxyHandler=k(s)}if(r==="ready"){d(x,z,q)}else{c(x,B||r,g?z:t.proxyHandler,C)}}else{t.push({func:D,scope:E})}}x=t=0;return D};q.unbind=function(x,z,A){var s,u,v,B,r,t;if(!x||x.nodeType===3||x.nodeType===8){return q}s=x[h];if(s){t=p[s];if(z){z=z.split(" ");v=z.length;while(v--){r=z[v];u=t[r];if(u){if(A){B=u.length;while(B--){if(u[B].func===A){u.splice(B,1)}}}if(!A||u.length===0){delete t[r];e(x,u.fakeName||r,g?u.nativeHandler:u.proxyHandler,u.capture)}}}}else{for(r in t){u=t[r];e(x,u.fakeName||r,g?u.nativeHandler:u.proxyHandler,u.capture)}t={}}for(r in t){return q}delete p[s];try{delete x[h]}catch(y){x[h]=null}}return q};q.fire=function(u,s,r){var v,t;if(!u||u.nodeType===3||u.nodeType===8){return q}t=a(null,r);t.type=s;do{v=u[h];if(v){j(t,v)}u=u.parentNode||u.ownerDocument||u.defaultView||u.parentWindow}while(u&&!t.isPropagationStopped());return q};q.clean=function(u){var s,r,t=q.unbind;if(!u||u.nodeType===3||u.nodeType===8){return q}if(u[h]){t(u)}if(!u.getElementsByTagName){u=u.document}if(u&&u.getElementsByTagName){t(u);r=u.getElementsByTagName("*");s=r.length;while(s--){u=r[s];if(u[h]){t(u)}}}return q};q.callNativeHandler=function(s,r){if(p){p[s][r.type].nativeHandler(r)}};q.destory=function(){p={}};q.add=function(v,s,u,t){if(typeof(v)==="string"){v=document.getElementById(v)}if(v&&v instanceof Array){var r=v.length;while(r--){q.add(v[r],s,u,t)}return}if(s==="init"){s="ready"}return q.bind(v,s instanceof Array?s.join(" "):s,u,t)};q.remove=function(v,s,u,t){if(!v){return q}if(typeof(v)==="string"){v=document.getElementById(v)}if(v instanceof Array){var r=v.length;while(r--){q.remove(v[r],s,u,t)}return q}return q.unbind(v,s instanceof Array?s.join(" "):s,u)};q.clear=function(r){if(typeof(r)==="string"){r=document.getElementById(r)}return q.clean(r)};q.cancel=function(r){if(r){q.prevent(r);q.stop(r)}return false};q.prevent=function(r){if(!r.preventDefault){r=a(r)}r.preventDefault();return false};q.stop=function(r){if(!r.stopPropagation){r=a(r)}r.stopPropagation();return false}}b.EventUtils=f;b.Event=new f(function(i){return function(j){tinymce.dom.Event.callNativeHandler(i,j)}});b.Event.bind(window,"ready",function(){});b=0})(tinymce.dom,"data-mce-expando");tinymce.dom.TreeWalker=function(a,c){var b=a;function d(i,f,e,j){var h,g;if(i){if(!j&&i[f]){return i[f]}if(i!=c){h=i[e];if(h){return h}for(g=i.parentNode;g&&g!=c;g=g.parentNode){h=g[e];if(h){return h}}}}}this.current=function(){return b};this.next=function(e){return(b=d(b,"firstChild","nextSibling",e))};this.prev=function(e){return(b=d(b,"lastChild","previousSibling",e))}};(function(e){var g=e.each,d=e.is,f=e.isWebKit,b=e.isIE,h=e.html.Entities,c=/^([a-z0-9],?)+$/i,a=/^[ \t\r\n]*$/;e.create("tinymce.dom.DOMUtils",{doc:null,root:null,files:null,pixelStyles:/^(top|left|bottom|right|width|height|borderWidth)$/,props:{"for":"htmlFor","class":"className",className:"className",checked:"checked",disabled:"disabled",maxlength:"maxLength",readonly:"readOnly",selected:"selected",value:"value",id:"id",name:"name",type:"type"},DOMUtils:function(o,l){var k=this,i,j,n;k.doc=o;k.win=window;k.files={};k.cssFlicker=false;k.counter=0;k.stdMode=!e.isIE||o.documentMode>=8;k.boxModel=!e.isIE||o.compatMode=="CSS1Compat"||k.stdMode;k.hasOuterHTML="outerHTML" in o.createElement("a");k.settings=l=e.extend({keep_values:false,hex_colors:1},l);k.schema=l.schema;k.styles=new e.html.Styles({url_converter:l.url_converter,url_converter_scope:l.url_converter_scope},l.schema);if(e.isIE6){try{o.execCommand("BackgroundImageCache",false,true)}catch(m){k.cssFlicker=true}}k.fixDoc(o);k.events=l.ownEvents?new e.dom.EventUtils(l.proxy):e.dom.Event;e.addUnload(k.destroy,k);n=l.schema?l.schema.getBlockElements():{};k.isBlock=function(q){if(!q){return false}var p=q.nodeType;if(p){return !!(p===1&&n[q.nodeName])}return !!n[q]}},fixDoc:function(k){var j=this.settings,i;if(b&&j.schema){("abbr article aside audio canvas details figcaption figure footer header hgroup mark menu meter nav output progress section summary time video").replace(/\w+/g,function(l){k.createElement(l)});for(i in j.schema.getCustomElements()){k.createElement(i)}}},clone:function(k,i){var j=this,m,l;if(!b||k.nodeType!==1||i){return k.cloneNode(i)}l=j.doc;if(!i){m=l.createElement(k.nodeName);g(j.getAttribs(k),function(n){j.setAttrib(m,n.nodeName,j.getAttrib(k,n.nodeName))});return m}return m.firstChild},getRoot:function(){var i=this,j=i.settings;return(j&&i.get(j.root_element))||i.doc.body},getViewPort:function(j){var k,i;j=!j?this.win:j;k=j.document;i=this.boxModel?k.documentElement:k.body;return{x:j.pageXOffset||i.scrollLeft,y:j.pageYOffset||i.scrollTop,w:j.innerWidth||i.clientWidth,h:j.innerHeight||i.clientHeight}},getRect:function(l){var k,i=this,j;l=i.get(l);k=i.getPos(l);j=i.getSize(l);return{x:k.x,y:k.y,w:j.w,h:j.h}},getSize:function(l){var j=this,i,k;l=j.get(l);i=j.getStyle(l,"width");k=j.getStyle(l,"height");if(i.indexOf("px")===-1){i=0}if(k.indexOf("px")===-1){k=0}return{w:parseInt(i,10)||l.offsetWidth||l.clientWidth,h:parseInt(k,10)||l.offsetHeight||l.clientHeight}},getParent:function(k,j,i){return this.getParents(k,j,i,false)},getParents:function(s,m,k,q){var j=this,i,l=j.settings,p=[];s=j.get(s);q=q===undefined;if(l.strict_root){k=k||j.getRoot()}if(d(m,"string")){i=m;if(m==="*"){m=function(o){return o.nodeType==1}}else{m=function(o){return j.is(o,i)}}}while(s){if(s==k||!s.nodeType||s.nodeType===9){break}if(!m||m(s)){if(q){p.push(s)}else{return s}}s=s.parentNode}return q?p:null},get:function(i){var j;if(i&&this.doc&&typeof(i)=="string"){j=i;i=this.doc.getElementById(i);if(i&&i.id!==j){return this.doc.getElementsByName(j)[1]}}return i},getNext:function(j,i){return this._findSib(j,i,"nextSibling")},getPrev:function(j,i){return this._findSib(j,i,"previousSibling")},select:function(k,j){var i=this;return e.dom.Sizzle(k,i.get(j)||i.get(i.settings.root_element)||i.doc,[])},is:function(l,j){var k;if(l.length===undefined){if(j==="*"){return l.nodeType==1}if(c.test(j)){j=j.toLowerCase().split(/,/);l=l.nodeName.toLowerCase();for(k=j.length-1;k>=0;k--){if(j[k]==l){return true}}return false}}return e.dom.Sizzle.matches(j,l.nodeType?[l]:l).length>0},add:function(l,o,i,k,m){var j=this;return this.run(l,function(r){var q,n;q=d(o,"string")?j.doc.createElement(o):o;j.setAttribs(q,i);if(k){if(k.nodeType){q.appendChild(k)}else{j.setHTML(q,k)}}return !m?r.appendChild(q):q})},create:function(k,i,j){return this.add(this.doc.createElement(k),k,i,j,1)},createHTML:function(q,i,m){var p="",l=this,j;p+="<"+q;for(j in i){if(i.hasOwnProperty(j)){p+=" "+j+'="'+l.encode(i[j])+'"'}}if(typeof(m)!="undefined"){return p+">"+m+"</"+q+">"}return p+" />"},remove:function(i,j){return this.run(i,function(l){var m,k=l.parentNode;if(!k){return null}if(j){while(m=l.firstChild){if(!e.isIE||m.nodeType!==3||m.nodeValue){k.insertBefore(m,l)}else{l.removeChild(m)}}}return k.removeChild(l)})},setStyle:function(l,i,j){var k=this;return k.run(l,function(o){var n,m;n=o.style;i=i.replace(/-(\D)/g,function(q,p){return p.toUpperCase()});if(k.pixelStyles.test(i)&&(e.is(j,"number")||/^[\-0-9\.]+$/.test(j))){j+="px"}switch(i){case"opacity":if(b){n.filter=j===""?"":"alpha(opacity="+(j*100)+")";if(!l.currentStyle||!l.currentStyle.hasLayout){n.display="inline-block"}}n[i]=n["-moz-opacity"]=n["-khtml-opacity"]=j||"";break;case"float":b?n.styleFloat=j:n.cssFloat=j;break;default:n[i]=j||""}if(k.settings.update_styles){k.setAttrib(o,"data-mce-style")}})},getStyle:function(l,i,k){l=this.get(l);if(!l){return}if(this.doc.defaultView&&k){i=i.replace(/[A-Z]/g,function(m){return"-"+m});try{return this.doc.defaultView.getComputedStyle(l,null).getPropertyValue(i)}catch(j){return null}}i=i.replace(/-(\D)/g,function(n,m){return m.toUpperCase()});if(i=="float"){i=b?"styleFloat":"cssFloat"}if(l.currentStyle&&k){return l.currentStyle[i]}return l.style?l.style[i]:undefined},setStyles:function(l,m){var j=this,k=j.settings,i;i=k.update_styles;k.update_styles=0;g(m,function(o,p){j.setStyle(l,p,o)});k.update_styles=i;if(k.update_styles){j.setAttrib(l,k.cssText)}},removeAllAttribs:function(i){return this.run(i,function(l){var k,j=l.attributes;for(k=j.length-1;k>=0;k--){l.removeAttributeNode(j.item(k))}})},setAttrib:function(k,l,i){var j=this;if(!k||!l){return}if(j.settings.strict){l=l.toLowerCase()}return this.run(k,function(p){var o=j.settings;var m=p.getAttribute(l);if(i!==null){switch(l){case"style":if(!d(i,"string")){g(i,function(q,r){j.setStyle(p,r,q)});return}if(o.keep_values){if(i&&!j._isRes(i)){p.setAttribute("data-mce-style",i,2)}else{p.removeAttribute("data-mce-style",2)}}p.style.cssText=i;break;case"class":p.className=i||"";break;case"src":case"href":if(o.keep_values){if(o.url_converter){i=o.url_converter.call(o.url_converter_scope||j,i,l,p)}j.setAttrib(p,"data-mce-"+l,i,2)}break;case"shape":p.setAttribute("data-mce-style",i);break}}if(d(i)&&i!==null&&i.length!==0){p.setAttribute(l,""+i,2)}else{p.removeAttribute(l,2)}if(tinyMCE.activeEditor&&m!=i){var n=tinyMCE.activeEditor;n.onSetAttrib.dispatch(n,p,l,i)}})},setAttribs:function(j,k){var i=this;return this.run(j,function(l){g(k,function(m,o){i.setAttrib(l,o,m)})})},getAttrib:function(m,o,k){var i,j=this,l;m=j.get(m);if(!m||m.nodeType!==1){return k===l?false:k}if(!d(k)){k=""}if(/^(src|href|style|coords|shape)$/.test(o)){i=m.getAttribute("data-mce-"+o);if(i){return i}}if(b&&j.props[o]){i=m[j.props[o]];i=i&&i.nodeValue?i.nodeValue:i}if(!i){i=m.getAttribute(o,2)}if(/^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noshade|nowrap|readonly|selected)$/.test(o)){if(m[j.props[o]]===true&&i===""){return o}return i?o:""}if(m.nodeName==="FORM"&&m.getAttributeNode(o)){return m.getAttributeNode(o).nodeValue}if(o==="style"){i=i||m.style.cssText;if(i){i=j.serializeStyle(j.parseStyle(i),m.nodeName);if(j.settings.keep_values&&!j._isRes(i)){m.setAttribute("data-mce-style",i)}}}if(f&&o==="class"&&i){i=i.replace(/(apple|webkit)\-[a-z\-]+/gi,"")}if(b){switch(o){case"rowspan":case"colspan":if(i===1){i=""}break;case"size":if(i==="+0"||i===20||i===0){i=""}break;case"width":case"height":case"vspace":case"checked":case"disabled":case"readonly":if(i===0){i=""}break;case"hspace":if(i===-1){i=""}break;case"maxlength":case"tabindex":if(i===32768||i===2147483647||i==="32768"){i=""}break;case"multiple":case"compact":case"noshade":case"nowrap":if(i===65535){return o}return k;case"shape":i=i.toLowerCase();break;default:if(o.indexOf("on")===0&&i){i=e._replace(/^function\s+\w+\(\)\s+\{\s+(.*)\s+\}$/,"$1",""+i)}}}return(i!==l&&i!==null&&i!=="")?""+i:k},getPos:function(q,l){var j=this,i=0,p=0,m,o=j.doc,k;q=j.get(q);l=l||o.body;if(q){if(q.getBoundingClientRect){q=q.getBoundingClientRect();m=j.boxModel?o.documentElement:o.body;i=q.left+(o.documentElement.scrollLeft||o.body.scrollLeft)-m.clientTop;p=q.top+(o.documentElement.scrollTop||o.body.scrollTop)-m.clientLeft;return{x:i,y:p}}k=q;while(k&&k!=l&&k.nodeType){i+=k.offsetLeft||0;p+=k.offsetTop||0;k=k.offsetParent}k=q.parentNode;while(k&&k!=l&&k.nodeType){i-=k.scrollLeft||0;p-=k.scrollTop||0;k=k.parentNode}}return{x:i,y:p}},parseStyle:function(i){return this.styles.parse(i)},serializeStyle:function(j,i){return this.styles.serialize(j,i)},addStyle:function(j){var k=this.doc,i;styleElm=k.getElementById("mceDefaultStyles");if(!styleElm){styleElm=k.createElement("style"),styleElm.id="mceDefaultStyles";styleElm.type="text/css";i=k.getElementsByTagName("head")[0];if(i.firstChild){i.insertBefore(styleElm,i.firstChild)}else{i.appendChild(styleElm)}}if(styleElm.styleSheet){styleElm.styleSheet.cssText+=j}else{styleElm.appendChild(k.createTextNode(j))}},loadCSS:function(i){var k=this,l=k.doc,j;if(!i){i=""}j=l.getElementsByTagName("head")[0];g(i.split(","),function(m){var n;if(k.files[m]){return}k.files[m]=true;n=k.create("link",{rel:"stylesheet",href:e._addVer(m)});if(b&&l.documentMode&&l.recalc){n.onload=function(){if(l.recalc){l.recalc()}n.onload=null}}j.appendChild(n)})},addClass:function(i,j){return this.run(i,function(k){var l;if(!j){return 0}if(this.hasClass(k,j)){return k.className}l=this.removeClass(k,j);return k.className=(l!=""?(l+" "):"")+j})},removeClass:function(k,l){var i=this,j;return i.run(k,function(n){var m;if(i.hasClass(n,l)){if(!j){j=new RegExp("(^|\\s+)"+l+"(\\s+|$)","g")}m=n.className.replace(j," ");m=e.trim(m!=" "?m:"");n.className=m;if(!m){n.removeAttribute("class");n.removeAttribute("className")}return m}return n.className})},hasClass:function(j,i){j=this.get(j);if(!j||!i){return false}return(" "+j.className+" ").indexOf(" "+i+" ")!==-1},show:function(i){return this.setStyle(i,"display","block")},hide:function(i){return this.setStyle(i,"display","none")},isHidden:function(i){i=this.get(i);return !i||i.style.display=="none"||this.getStyle(i,"display")=="none"},uniqueId:function(i){return(!i?"mce_":i)+(this.counter++)},setHTML:function(k,j){var i=this;return i.run(k,function(m){if(b){while(m.firstChild){m.removeChild(m.firstChild)}try{m.innerHTML="<br />"+j;m.removeChild(m.firstChild)}catch(l){var n=i.create("div");n.innerHTML="<br />"+j;g(e.grep(n.childNodes),function(p,o){if(o&&m.canHaveHTML){m.appendChild(p)}})}}else{m.innerHTML=j}return j})},getOuterHTML:function(k){var j,i=this;k=i.get(k);if(!k){return null}if(k.nodeType===1&&i.hasOuterHTML){return k.outerHTML}j=(k.ownerDocument||i.doc).createElement("body");j.appendChild(k.cloneNode(true));return j.innerHTML},setOuterHTML:function(l,j,m){var i=this;function k(p,o,r){var s,q;q=r.createElement("body");q.innerHTML=o;s=q.lastChild;while(s){i.insertAfter(s.cloneNode(true),p);s=s.previousSibling}i.remove(p)}return this.run(l,function(o){o=i.get(o);if(o.nodeType==1){m=m||o.ownerDocument||i.doc;if(b){try{if(b&&o.nodeType==1){o.outerHTML=j}else{k(o,j,m)}}catch(n){k(o,j,m)}}else{k(o,j,m)}}})},decode:h.decode,encode:h.encodeAllRaw,insertAfter:function(i,j){j=this.get(j);return this.run(i,function(l){var k,m;k=j.parentNode;m=j.nextSibling;if(m){k.insertBefore(l,m)}else{k.appendChild(l)}return l})},replace:function(m,l,i){var j=this;if(d(l,"array")){m=m.cloneNode(true)}return j.run(l,function(k){if(i){g(e.grep(k.childNodes),function(n){m.appendChild(n)})}return k.parentNode.replaceChild(m,k)})},rename:function(l,i){var k=this,j;if(l.nodeName!=i.toUpperCase()){j=k.create(i);g(k.getAttribs(l),function(m){k.setAttrib(j,m.nodeName,k.getAttrib(l,m.nodeName))});k.replace(j,l,1)}return j||l},findCommonAncestor:function(k,i){var l=k,j;while(l){j=i;while(j&&l!=j){j=j.parentNode}if(l==j){break}l=l.parentNode}if(!l&&k.ownerDocument){return k.ownerDocument.documentElement}return l},toHex:function(i){var k=/^\s*rgb\s*?\(\s*?([0-9]+)\s*?,\s*?([0-9]+)\s*?,\s*?([0-9]+)\s*?\)\s*$/i.exec(i);function j(l){l=parseInt(l,10).toString(16);return l.length>1?l:"0"+l}if(k){i="#"+j(k[1])+j(k[2])+j(k[3]);return i}return i},getClasses:function(){var n=this,j=[],m,o={},p=n.settings.class_filter,l;if(n.classes){return n.classes}function q(i){g(i.imports,function(s){q(s)});g(i.cssRules||i.rules,function(s){switch(s.type||1){case 1:if(s.selectorText){g(s.selectorText.split(","),function(r){r=r.replace(/^\s*|\s*$|^\s\./g,"");if(/\.mce/.test(r)||!/\.[\w\-]+$/.test(r)){return}l=r;r=e._replace(/.*\.([a-z0-9_\-]+).*/i,"$1",r);if(p&&!(r=p(r,l))){return}if(!o[r]){j.push({"class":r});o[r]=1}})}break;case 3:q(s.styleSheet);break}})}try{g(n.doc.styleSheets,q)}catch(k){}if(j.length>0){n.classes=j}return j},run:function(l,k,j){var i=this,m;if(i.doc&&typeof(l)==="string"){l=i.get(l)}if(!l){return false}j=j||this;if(!l.nodeType&&(l.length||l.length===0)){m=[];g(l,function(o,n){if(o){if(typeof(o)=="string"){o=i.doc.getElementById(o)}m.push(k.call(j,o,n))}});return m}return k.call(j,l)},getAttribs:function(j){var i;j=this.get(j);if(!j){return[]}if(b){i=[];if(j.nodeName=="OBJECT"){return j.attributes}if(j.nodeName==="OPTION"&&this.getAttrib(j,"selected")){i.push({specified:1,nodeName:"selected"})}j.cloneNode(false).outerHTML.replace(/<\/?[\w:\-]+ ?|=[\"][^\"]+\"|=\'[^\']+\'|=[\w\-]+|>/gi,"").replace(/[\w:\-]+/gi,function(k){i.push({specified:1,nodeName:k})});return i}return j.attributes},isEmpty:function(m,k){var r=this,o,n,q,j,l,p=0;m=m.firstChild;if(m){j=new e.dom.TreeWalker(m,m.parentNode);k=k||r.schema?r.schema.getNonEmptyElements():null;do{q=m.nodeType;if(q===1){if(m.getAttribute("data-mce-bogus")){continue}l=m.nodeName.toLowerCase();if(k&&k[l]){if(l==="br"){p++;continue}return false}n=r.getAttribs(m);o=m.attributes.length;while(o--){l=m.attributes[o].nodeName;if(l==="name"||l==="data-mce-bookmark"){return false}}}if(q==8){return false}if((q===3&&!a.test(m.nodeValue))){return false}}while(m=j.next())}return p<=1},destroy:function(j){var i=this;i.win=i.doc=i.root=i.events=i.frag=null;if(!j){e.removeUnload(i.destroy)}},createRng:function(){var i=this.doc;return i.createRange?i.createRange():new e.dom.Range(this)},nodeIndex:function(m,n){var i=0,k,l,j;if(m){for(k=m.nodeType,m=m.previousSibling,l=m;m;m=m.previousSibling){j=m.nodeType;if(n&&j==3){if(j==k||!m.nodeValue.length){continue}}i++;k=j}}return i},split:function(m,l,p){var q=this,i=q.createRng(),n,k,o;function j(v){var t,s=v.childNodes,u=v.nodeType;function x(A){var z=A.previousSibling&&A.previousSibling.nodeName=="SPAN";var y=A.nextSibling&&A.nextSibling.nodeName=="SPAN";return z&&y}if(u==1&&v.getAttribute("data-mce-type")=="bookmark"){return}for(t=s.length-1;t>=0;t--){j(s[t])}if(u!=9){if(u==3&&v.nodeValue.length>0){var r=e.trim(v.nodeValue).length;if(!q.isBlock(v.parentNode)||r>0||r===0&&x(v)){return}}else{if(u==1){s=v.childNodes;if(s.length==1&&s[0]&&s[0].nodeType==1&&s[0].getAttribute("data-mce-type")=="bookmark"){v.parentNode.insertBefore(s[0],v)}if(s.length||/^(br|hr|input|img)$/i.test(v.nodeName)){return}}}q.remove(v)}return v}if(m&&l){i.setStart(m.parentNode,q.nodeIndex(m));i.setEnd(l.parentNode,q.nodeIndex(l));n=i.extractContents();i=q.createRng();i.setStart(l.parentNode,q.nodeIndex(l)+1);i.setEnd(m.parentNode,q.nodeIndex(m)+1);k=i.extractContents();o=m.parentNode;o.insertBefore(j(n),m);if(p){o.replaceChild(p,l)}else{o.insertBefore(l,m)}o.insertBefore(j(k),m);q.remove(m);return p||l}},bind:function(l,i,k,j){return this.events.add(l,i,k,j||this)},unbind:function(k,i,j){return this.events.remove(k,i,j)},fire:function(k,j,i){return this.events.fire(k,j,i)},getContentEditable:function(j){var i;if(j.nodeType!=1){return null}i=j.getAttribute("data-mce-contenteditable");if(i&&i!=="inherit"){return i}return j.contentEditable!=="inherit"?j.contentEditable:null},_findSib:function(l,i,j){var k=this,m=i;if(l){if(d(m,"string")){m=function(n){return k.is(n,i)}}for(l=l[j];l;l=l[j]){if(m(l)){return l}}}return null},_isRes:function(i){return/^(top|left|bottom|right|width|height)/i.test(i)||/;\s*(top|left|bottom|right|width|height)/i.test(i)}});e.DOM=new e.dom.DOMUtils(document,{process_html:0})})(tinymce);(function(a){function b(c){var O=this,e=c.doc,U=0,F=1,j=2,E=true,S=false,W="startOffset",h="startContainer",Q="endContainer",A="endOffset",k=tinymce.extend,n=c.nodeIndex;k(O,{startContainer:e,startOffset:0,endContainer:e,endOffset:0,collapsed:E,commonAncestorContainer:e,START_TO_START:0,START_TO_END:1,END_TO_END:2,END_TO_START:3,setStart:q,setEnd:s,setStartBefore:g,setStartAfter:J,setEndBefore:K,setEndAfter:u,collapse:B,selectNode:y,selectNodeContents:G,compareBoundaryPoints:v,deleteContents:p,extractContents:I,cloneContents:d,insertNode:D,surroundContents:N,cloneRange:L,toStringIE:T});function x(){return e.createDocumentFragment()}function q(X,t){C(E,X,t)}function s(X,t){C(S,X,t)}function g(t){q(t.parentNode,n(t))}function J(t){q(t.parentNode,n(t)+1)}function K(t){s(t.parentNode,n(t))}function u(t){s(t.parentNode,n(t)+1)}function B(t){if(t){O[Q]=O[h];O[A]=O[W]}else{O[h]=O[Q];O[W]=O[A]}O.collapsed=E}function y(t){g(t);u(t)}function G(t){q(t,0);s(t,t.nodeType===1?t.childNodes.length:t.nodeValue.length)}function v(aa,t){var ad=O[h],Y=O[W],ac=O[Q],X=O[A],ab=t.startContainer,af=t.startOffset,Z=t.endContainer,ae=t.endOffset;if(aa===0){return H(ad,Y,ab,af)}if(aa===1){return H(ac,X,ab,af)}if(aa===2){return H(ac,X,Z,ae)}if(aa===3){return H(ad,Y,Z,ae)}}function p(){l(j)}function I(){return l(U)}function d(){return l(F)}function D(aa){var X=this[h],t=this[W],Z,Y;if((X.nodeType===3||X.nodeType===4)&&X.nodeValue){if(!t){X.parentNode.insertBefore(aa,X)}else{if(t>=X.nodeValue.length){c.insertAfter(aa,X)}else{Z=X.splitText(t);X.parentNode.insertBefore(aa,Z)}}}else{if(X.childNodes.length>0){Y=X.childNodes[t]}if(Y){X.insertBefore(aa,Y)}else{X.appendChild(aa)}}}function N(X){var t=O.extractContents();O.insertNode(X);X.appendChild(t);O.selectNode(X)}function L(){return k(new b(c),{startContainer:O[h],startOffset:O[W],endContainer:O[Q],endOffset:O[A],collapsed:O.collapsed,commonAncestorContainer:O.commonAncestorContainer})}function P(t,X){var Y;if(t.nodeType==3){return t}if(X<0){return t}Y=t.firstChild;while(Y&&X>0){--X;Y=Y.nextSibling}if(Y){return Y}return t}function m(){return(O[h]==O[Q]&&O[W]==O[A])}function H(Z,ab,X,aa){var ac,Y,t,ad,af,ae;if(Z==X){if(ab==aa){return 0}if(ab<aa){return -1}return 1}ac=X;while(ac&&ac.parentNode!=Z){ac=ac.parentNode}if(ac){Y=0;t=Z.firstChild;while(t!=ac&&Y<ab){Y++;t=t.nextSibling}if(ab<=Y){return -1}return 1}ac=Z;while(ac&&ac.parentNode!=X){ac=ac.parentNode}if(ac){Y=0;t=X.firstChild;while(t!=ac&&Y<aa){Y++;t=t.nextSibling}if(Y<aa){return -1}return 1}ad=c.findCommonAncestor(Z,X);af=Z;while(af&&af.parentNode!=ad){af=af.parentNode}if(!af){af=ad}ae=X;while(ae&&ae.parentNode!=ad){ae=ae.parentNode}if(!ae){ae=ad}if(af==ae){return 0}t=ad.firstChild;while(t){if(t==af){return -1}if(t==ae){return 1}t=t.nextSibling}}function C(X,aa,Z){var t,Y;if(X){O[h]=aa;O[W]=Z}else{O[Q]=aa;O[A]=Z}t=O[Q];while(t.parentNode){t=t.parentNode}Y=O[h];while(Y.parentNode){Y=Y.parentNode}if(Y==t){if(H(O[h],O[W],O[Q],O[A])>0){O.collapse(X)}}else{O.collapse(X)}O.collapsed=m();O.commonAncestorContainer=c.findCommonAncestor(O[h],O[Q])}function l(ad){var ac,Z=0,af=0,X,ab,Y,aa,t,ae;if(O[h]==O[Q]){return f(ad)}for(ac=O[Q],X=ac.parentNode;X;ac=X,X=X.parentNode){if(X==O[h]){return r(ac,ad)}++Z}for(ac=O[h],X=ac.parentNode;X;ac=X,X=X.parentNode){if(X==O[Q]){return V(ac,ad)}++af}ab=af-Z;Y=O[h];while(ab>0){Y=Y.parentNode;ab--}aa=O[Q];while(ab<0){aa=aa.parentNode;ab++}for(t=Y.parentNode,ae=aa.parentNode;t!=ae;t=t.parentNode,ae=ae.parentNode){Y=t;aa=ae}return o(Y,aa,ad)}function f(ac){var ae,af,t,Y,Z,ad,aa,X,ab;if(ac!=j){ae=x()}if(O[W]==O[A]){return ae}if(O[h].nodeType==3){af=O[h].nodeValue;t=af.substring(O[W],O[A]);if(ac!=F){Y=O[h];X=O[W];ab=O[A]-O[W];if(X===0&&ab>=Y.nodeValue.length-1){Y.parentNode.removeChild(Y)}else{Y.deleteData(X,ab)}O.collapse(E)}if(ac==j){return}if(t.length>0){ae.appendChild(e.createTextNode(t))}return ae}Y=P(O[h],O[W]);Z=O[A]-O[W];while(Y&&Z>0){ad=Y.nextSibling;aa=z(Y,ac);if(ae){ae.appendChild(aa)}--Z;Y=ad}if(ac!=F){O.collapse(E)}return ae}function r(ad,aa){var ac,ab,X,t,Z,Y;if(aa!=j){ac=x()}ab=i(ad,aa);if(ac){ac.appendChild(ab)}X=n(ad);t=X-O[W];if(t<=0){if(aa!=F){O.setEndBefore(ad);O.collapse(S)}return ac}ab=ad.previousSibling;while(t>0){Z=ab.previousSibling;Y=z(ab,aa);if(ac){ac.insertBefore(Y,ac.firstChild)}--t;ab=Z}if(aa!=F){O.setEndBefore(ad);O.collapse(S)}return ac}function V(ab,aa){var ad,X,ac,t,Z,Y;if(aa!=j){ad=x()}ac=R(ab,aa);if(ad){ad.appendChild(ac)}X=n(ab);++X;t=O[A]-X;ac=ab.nextSibling;while(ac&&t>0){Z=ac.nextSibling;Y=z(ac,aa);if(ad){ad.appendChild(Y)}--t;ac=Z}if(aa!=F){O.setStartAfter(ab);O.collapse(E)}return ad}function o(ab,t,ae){var Y,ag,aa,ac,ad,X,af,Z;if(ae!=j){ag=x()}Y=R(ab,ae);if(ag){ag.appendChild(Y)}aa=ab.parentNode;ac=n(ab);ad=n(t);++ac;X=ad-ac;af=ab.nextSibling;while(X>0){Z=af.nextSibling;Y=z(af,ae);if(ag){ag.appendChild(Y)}af=Z;--X}Y=i(t,ae);if(ag){ag.appendChild(Y)}if(ae!=F){O.setStartAfter(ab);O.collapse(E)}return ag}function i(ac,ad){var Y=P(O[Q],O[A]-1),ae,ab,aa,t,X,Z=Y!=O[Q];if(Y==ac){return M(Y,Z,S,ad)}ae=Y.parentNode;ab=M(ae,S,S,ad);while(ae){while(Y){aa=Y.previousSibling;t=M(Y,Z,S,ad);if(ad!=j){ab.insertBefore(t,ab.firstChild)}Z=E;Y=aa}if(ae==ac){return ab}Y=ae.previousSibling;ae=ae.parentNode;X=M(ae,S,S,ad);if(ad!=j){X.appendChild(ab)}ab=X}}function R(ac,ad){var Z=P(O[h],O[W]),aa=Z!=O[h],ae,ab,Y,t,X;if(Z==ac){return M(Z,aa,E,ad)}ae=Z.parentNode;ab=M(ae,S,E,ad);while(ae){while(Z){Y=Z.nextSibling;t=M(Z,aa,E,ad);if(ad!=j){ab.appendChild(t)}aa=E;Z=Y}if(ae==ac){return ab}Z=ae.nextSibling;ae=ae.parentNode;X=M(ae,S,E,ad);if(ad!=j){X.appendChild(ab)}ab=X}}function M(t,aa,ad,ae){var Z,Y,ab,X,ac;if(aa){return z(t,ae)}if(t.nodeType==3){Z=t.nodeValue;if(ad){X=O[W];Y=Z.substring(X);ab=Z.substring(0,X)}else{X=O[A];Y=Z.substring(0,X);ab=Z.substring(X)}if(ae!=F){t.nodeValue=ab}if(ae==j){return}ac=c.clone(t,S);ac.nodeValue=Y;return ac}if(ae==j){return}return c.clone(t,S)}function z(X,t){if(t!=j){return t==F?c.clone(X,E):X}X.parentNode.removeChild(X)}function T(){return c.create("body",null,d()).outerText}return O}a.Range=b;b.prototype.toString=function(){return this.toStringIE()}})(tinymce.dom);(function(){function a(d){var b=this,h=d.dom,c=true,f=false;function e(i,j){var k,t=0,q,n,m,l,o,r,p=-1,s;k=i.duplicate();k.collapse(j);s=k.parentElement();if(s.ownerDocument!==d.dom.doc){return}while(s.contentEditable==="false"){s=s.parentNode}if(!s.hasChildNodes()){return{node:s,inside:1}}m=s.children;q=m.length-1;while(t<=q){r=Math.floor((t+q)/2);l=m[r];k.moveToElementText(l);p=k.compareEndPoints(j?"StartToStart":"EndToEnd",i);if(p>0){q=r-1}else{if(p<0){t=r+1}else{return{node:l}}}}if(p<0){if(!l){k.moveToElementText(s);k.collapse(true);l=s;n=true}else{k.collapse(false)}o=0;while(k.compareEndPoints(j?"StartToStart":"StartToEnd",i)!==0){if(k.move("character",1)===0||s!=k.parentElement()){break}o++}}else{k.collapse(true);o=0;while(k.compareEndPoints(j?"StartToStart":"StartToEnd",i)!==0){if(k.move("character",-1)===0||s!=k.parentElement()){break}o++}}return{node:l,position:p,offset:o,inside:n}}function g(){var i=d.getRng(),r=h.createRng(),l,k,p,q,m,j;l=i.item?i.item(0):i.parentElement();if(l.ownerDocument!=h.doc){return r}k=d.isCollapsed();if(i.item){r.setStart(l.parentNode,h.nodeIndex(l));r.setEnd(r.startContainer,r.startOffset+1);return r}function o(A){var u=e(i,A),s,y,z=0,x,v,t;s=u.node;y=u.offset;if(u.inside&&!s.hasChildNodes()){r[A?"setStart":"setEnd"](s,0);return}if(y===v){r[A?"setStartBefore":"setEndAfter"](s);return}if(u.position<0){x=u.inside?s.firstChild:s.nextSibling;if(!x){r[A?"setStartAfter":"setEndAfter"](s);return}if(!y){if(x.nodeType==3){r[A?"setStart":"setEnd"](x,0)}else{r[A?"setStartBefore":"setEndBefore"](x)}return}while(x){t=x.nodeValue;z+=t.length;if(z>=y){s=x;z-=y;z=t.length-z;break}x=x.nextSibling}}else{x=s.previousSibling;if(!x){return r[A?"setStartBefore":"setEndBefore"](s)}if(!y){if(s.nodeType==3){r[A?"setStart":"setEnd"](x,s.nodeValue.length)}else{r[A?"setStartAfter":"setEndAfter"](x)}return}while(x){z+=x.nodeValue.length;if(z>=y){s=x;z-=y;break}x=x.previousSibling}}r[A?"setStart":"setEnd"](s,z)}try{o(true);if(!k){o()}}catch(n){if(n.number==-2147024809){m=b.getBookmark(2);p=i.duplicate();p.collapse(true);l=p.parentElement();if(!k){p=i.duplicate();p.collapse(false);q=p.parentElement();q.innerHTML=q.innerHTML}l.innerHTML=l.innerHTML;b.moveToBookmark(m);i=d.getRng();o(true);if(!k){o()}}else{throw n}}return r}this.getBookmark=function(m){var j=d.getRng(),o,i,l={};function n(u){var t,p,s,r,q=[];t=u.parentNode;p=h.getRoot().parentNode;while(t!=p&&t.nodeType!==9){s=t.children;r=s.length;while(r--){if(u===s[r]){q.push(r);break}}u=t;t=t.parentNode}return q}function k(q){var p;p=e(j,q);if(p){return{position:p.position,offset:p.offset,indexes:n(p.node),inside:p.inside}}}if(m===2){if(!j.item){l.start=k(true);if(!d.isCollapsed()){l.end=k()}}else{l.start={ctrl:true,indexes:n(j.item(0))}}}return l};this.moveToBookmark=function(k){var j,i=h.doc.body;function m(o){var r,q,n,p;r=h.getRoot();for(q=o.length-1;q>=0;q--){p=r.children;n=o[q];if(n<=p.length-1){r=p[n]}}return r}function l(r){var n=k[r?"start":"end"],q,p,o;if(n){q=n.position>0;p=i.createTextRange();p.moveToElementText(m(n.indexes));offset=n.offset;if(offset!==o){p.collapse(n.inside||q);p.moveStart("character",q?-offset:offset)}else{p.collapse(r)}j.setEndPoint(r?"StartToStart":"EndToStart",p);if(r){j.collapse(true)}}}if(k.start){if(k.start.ctrl){j=i.createControlRange();j.addElement(m(k.start.indexes));j.select()}else{j=i.createTextRange();l(true);l();j.select()}}};this.addRange=function(i){var n,l,k,p,v,q,t,s=d.dom.doc,m=s.body,r,u;function j(C){var y,B,x,A,z;x=h.create("a");y=C?k:v;B=C?p:q;A=n.duplicate();if(y==s||y==s.documentElement){y=m;B=0}if(y.nodeType==3){y.parentNode.insertBefore(x,y);A.moveToElementText(x);A.moveStart("character",B);h.remove(x);n.setEndPoint(C?"StartToStart":"EndToEnd",A)}else{z=y.childNodes;if(z.length){if(B>=z.length){h.insertAfter(x,z[z.length-1])}else{y.insertBefore(x,z[B])}A.moveToElementText(x)}else{if(y.canHaveHTML){y.innerHTML="<span>\uFEFF</span>";x=y.firstChild;A.moveToElementText(x);A.collapse(f)}}n.setEndPoint(C?"StartToStart":"EndToEnd",A);h.remove(x)}}k=i.startContainer;p=i.startOffset;v=i.endContainer;q=i.endOffset;n=m.createTextRange();if(k==v&&k.nodeType==1){if(p==q&&!k.hasChildNodes()){if(k.canHaveHTML){t=k.previousSibling;if(t&&!t.hasChildNodes()&&h.isBlock(t)){t.innerHTML="\uFEFF"}else{t=null}k.innerHTML="<span>\uFEFF</span><span>\uFEFF</span>";n.moveToElementText(k.lastChild);n.select();h.doc.selection.clear();k.innerHTML="";if(t){t.innerHTML=""}return}else{p=h.nodeIndex(k);k=k.parentNode}}if(p==q-1){try{u=k.childNodes[p];l=m.createControlRange();l.addElement(u);l.select();r=d.getRng();if(r.item&&u===r.item(0)){return}}catch(o){}}}j(true);j();n.select()};this.getRangeAt=g}tinymce.dom.TridentSelection=a})();(function(){var n=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,i="sizcache",o=0,r=Object.prototype.toString,h=false,g=true,q=/\\/g,u=/\r\n/g,x=/\W/;[0,0].sort(function(){g=false;return 0});var d=function(C,e,F,G){F=F||[];e=e||document;var I=e;if(e.nodeType!==1&&e.nodeType!==9){return[]}if(!C||typeof C!=="string"){return F}var z,K,N,y,J,M,L,E,B=true,A=d.isXML(e),D=[],H=C;do{n.exec("");z=n.exec(H);if(z){H=z[3];D.push(z[1]);if(z[2]){y=z[3];break}}}while(z);if(D.length>1&&j.exec(C)){if(D.length===2&&k.relative[D[0]]){K=s(D[0]+D[1],e,G)}else{K=k.relative[D[0]]?[e]:d(D.shift(),e);while(D.length){C=D.shift();if(k.relative[C]){C+=D.shift()}K=s(C,K,G)}}}else{if(!G&&D.length>1&&e.nodeType===9&&!A&&k.match.ID.test(D[0])&&!k.match.ID.test(D[D.length-1])){J=d.find(D.shift(),e,A);e=J.expr?d.filter(J.expr,J.set)[0]:J.set[0]}if(e){J=G?{expr:D.pop(),set:l(G)}:d.find(D.pop(),D.length===1&&(D[0]==="~"||D[0]==="+")&&e.parentNode?e.parentNode:e,A);K=J.expr?d.filter(J.expr,J.set):J.set;if(D.length>0){N=l(K)}else{B=false}while(D.length){M=D.pop();L=M;if(!k.relative[M]){M=""}else{L=D.pop()}if(L==null){L=e}k.relative[M](N,L,A)}}else{N=D=[]}}if(!N){N=K}if(!N){d.error(M||C)}if(r.call(N)==="[object Array]"){if(!B){F.push.apply(F,N)}else{if(e&&e.nodeType===1){for(E=0;N[E]!=null;E++){if(N[E]&&(N[E]===true||N[E].nodeType===1&&d.contains(e,N[E]))){F.push(K[E])}}}else{for(E=0;N[E]!=null;E++){if(N[E]&&N[E].nodeType===1){F.push(K[E])}}}}}else{l(N,F)}if(y){d(y,I,F,G);d.uniqueSort(F)}return F};d.uniqueSort=function(y){if(p){h=g;y.sort(p);if(h){for(var e=1;e<y.length;e++){if(y[e]===y[e-1]){y.splice(e--,1)}}}}return y};d.matches=function(e,y){return d(e,null,null,y)};d.matchesSelector=function(e,y){return d(y,null,null,[e]).length>0};d.find=function(E,e,F){var D,z,B,A,C,y;if(!E){return[]}for(z=0,B=k.order.length;z<B;z++){C=k.order[z];if((A=k.leftMatch[C].exec(E))){y=A[1];A.splice(1,1);if(y.substr(y.length-1)!=="\\"){A[1]=(A[1]||"").replace(q,"");D=k.find[C](A,e,F);if(D!=null){E=E.replace(k.match[C],"");break}}}}if(!D){D=typeof e.getElementsByTagName!=="undefined"?e.getElementsByTagName("*"):[]}return{set:D,expr:E}};d.filter=function(I,H,L,B){var D,e,G,N,K,y,A,C,J,z=I,M=[],F=H,E=H&&H[0]&&d.isXML(H[0]);while(I&&H.length){for(G in k.filter){if((D=k.leftMatch[G].exec(I))!=null&&D[2]){y=k.filter[G];A=D[1];e=false;D.splice(1,1);if(A.substr(A.length-1)==="\\"){continue}if(F===M){M=[]}if(k.preFilter[G]){D=k.preFilter[G](D,F,L,M,B,E);if(!D){e=N=true}else{if(D===true){continue}}}if(D){for(C=0;(K=F[C])!=null;C++){if(K){N=y(K,D,C,F);J=B^N;if(L&&N!=null){if(J){e=true}else{F[C]=false}}else{if(J){M.push(K);e=true}}}}}if(N!==undefined){if(!L){F=M}I=I.replace(k.match[G],"");if(!e){return[]}break}}}if(I===z){if(e==null){d.error(I)}else{break}}z=I}return F};d.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)};var b=d.getText=function(B){var z,A,e=B.nodeType,y="";if(e){if(e===1||e===9||e===11){if(typeof B.textContent==="string"){return B.textContent}else{if(typeof B.innerText==="string"){return B.innerText.replace(u,"")}else{for(B=B.firstChild;B;B=B.nextSibling){y+=b(B)}}}}else{if(e===3||e===4){return B.nodeValue}}}else{for(z=0;(A=B[z]);z++){if(A.nodeType!==8){y+=b(A)}}}return y};var k=d.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(e){return e.getAttribute("href")},type:function(e){return e.getAttribute("type")}},relative:{"+":function(D,y){var A=typeof y==="string",C=A&&!x.test(y),E=A&&!C;if(C){y=y.toLowerCase()}for(var z=0,e=D.length,B;z<e;z++){if((B=D[z])){while((B=B.previousSibling)&&B.nodeType!==1){}D[z]=E||B&&B.nodeName.toLowerCase()===y?B||false:B===y}}if(E){d.filter(y,D,true)}},">":function(D,y){var C,B=typeof y==="string",z=0,e=D.length;if(B&&!x.test(y)){y=y.toLowerCase();for(;z<e;z++){C=D[z];if(C){var A=C.parentNode;D[z]=A.nodeName.toLowerCase()===y?A:false}}}else{for(;z<e;z++){C=D[z];if(C){D[z]=B?C.parentNode:C.parentNode===y}}if(B){d.filter(y,D,true)}}},"":function(A,y,C){var B,z=o++,e=t;if(typeof y==="string"&&!x.test(y)){y=y.toLowerCase();B=y;e=a}e("parentNode",y,z,A,B,C)},"~":function(A,y,C){var B,z=o++,e=t;if(typeof y==="string"&&!x.test(y)){y=y.toLowerCase();B=y;e=a}e("previousSibling",y,z,A,B,C)}},find:{ID:function(y,z,A){if(typeof z.getElementById!=="undefined"&&!A){var e=z.getElementById(y[1]);return e&&e.parentNode?[e]:[]}},NAME:function(z,C){if(typeof C.getElementsByName!=="undefined"){var y=[],B=C.getElementsByName(z[1]);for(var A=0,e=B.length;A<e;A++){if(B[A].getAttribute("name")===z[1]){y.push(B[A])}}return y.length===0?null:y}},TAG:function(e,y){if(typeof y.getElementsByTagName!=="undefined"){return y.getElementsByTagName(e[1])}}},preFilter:{CLASS:function(A,y,z,e,D,E){A=" "+A[1].replace(q,"")+" ";if(E){return A}for(var B=0,C;(C=y[B])!=null;B++){if(C){if(D^(C.className&&(" "+C.className+" ").replace(/[\t\n\r]/g," ").indexOf(A)>=0)){if(!z){e.push(C)}}else{if(z){y[B]=false}}}}return false},ID:function(e){return e[1].replace(q,"")},TAG:function(y,e){return y[1].replace(q,"").toLowerCase()},CHILD:function(e){if(e[1]==="nth"){if(!e[2]){d.error(e[0])}e[2]=e[2].replace(/^\+|\s*/g,"");var y=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(e[2]==="even"&&"2n"||e[2]==="odd"&&"2n+1"||!/\D/.test(e[2])&&"0n+"+e[2]||e[2]);e[2]=(y[1]+(y[2]||1))-0;e[3]=y[3]-0}else{if(e[2]){d.error(e[0])}}e[0]=o++;return e},ATTR:function(B,y,z,e,C,D){var A=B[1]=B[1].replace(q,"");if(!D&&k.attrMap[A]){B[1]=k.attrMap[A]}B[4]=(B[4]||B[5]||"").replace(q,"");if(B[2]==="~="){B[4]=" "+B[4]+" "}return B},PSEUDO:function(B,y,z,e,C){if(B[1]==="not"){if((n.exec(B[3])||"").length>1||/^\w/.test(B[3])){B[3]=d(B[3],null,null,y)}else{var A=d.filter(B[3],y,z,true^C);if(!z){e.push.apply(e,A)}return false}}else{if(k.match.POS.test(B[0])||k.match.CHILD.test(B[0])){return true}}return B},POS:function(e){e.unshift(true);return e}},filters:{enabled:function(e){return e.disabled===false&&e.type!=="hidden"},disabled:function(e){return e.disabled===true},checked:function(e){return e.checked===true},selected:function(e){if(e.parentNode){e.parentNode.selectedIndex}return e.selected===true},parent:function(e){return !!e.firstChild},empty:function(e){return !e.firstChild},has:function(z,y,e){return !!d(e[3],z).length},header:function(e){return(/h\d/i).test(e.nodeName)},text:function(z){var e=z.getAttribute("type"),y=z.type;return z.nodeName.toLowerCase()==="input"&&"text"===y&&(e===y||e===null)},radio:function(e){return e.nodeName.toLowerCase()==="input"&&"radio"===e.type},checkbox:function(e){return e.nodeName.toLowerCase()==="input"&&"checkbox"===e.type},file:function(e){return e.nodeName.toLowerCase()==="input"&&"file"===e.type},password:function(e){return e.nodeName.toLowerCase()==="input"&&"password"===e.type},submit:function(y){var e=y.nodeName.toLowerCase();return(e==="input"||e==="button")&&"submit"===y.type},image:function(e){return e.nodeName.toLowerCase()==="input"&&"image"===e.type},reset:function(y){var e=y.nodeName.toLowerCase();return(e==="input"||e==="button")&&"reset"===y.type},button:function(y){var e=y.nodeName.toLowerCase();return e==="input"&&"button"===y.type||e==="button"},input:function(e){return(/input|select|textarea|button/i).test(e.nodeName)},focus:function(e){return e===e.ownerDocument.activeElement}},setFilters:{first:function(y,e){return e===0},last:function(z,y,e,A){return y===A.length-1},even:function(y,e){return e%2===0},odd:function(y,e){return e%2===1},lt:function(z,y,e){return y<e[3]-0},gt:function(z,y,e){return y>e[3]-0},nth:function(z,y,e){return e[3]-0===y},eq:function(z,y,e){return e[3]-0===y}},filter:{PSEUDO:function(z,E,D,F){var e=E[1],y=k.filters[e];if(y){return y(z,D,E,F)}else{if(e==="contains"){return(z.textContent||z.innerText||b([z])||"").indexOf(E[3])>=0}else{if(e==="not"){var A=E[3];for(var C=0,B=A.length;C<B;C++){if(A[C]===z){return false}}return true}else{d.error(e)}}}},CHILD:function(z,B){var A,H,D,G,e,C,F,E=B[1],y=z;switch(E){case"only":case"first":while((y=y.previousSibling)){if(y.nodeType===1){return false}}if(E==="first"){return true}y=z;case"last":while((y=y.nextSibling)){if(y.nodeType===1){return false}}return true;case"nth":A=B[2];H=B[3];if(A===1&&H===0){return true}D=B[0];G=z.parentNode;if(G&&(G[i]!==D||!z.nodeIndex)){C=0;for(y=G.firstChild;y;y=y.nextSibling){if(y.nodeType===1){y.nodeIndex=++C}}G[i]=D}F=z.nodeIndex-H;if(A===0){return F===0}else{return(F%A===0&&F/A>=0)}}},ID:function(y,e){return y.nodeType===1&&y.getAttribute("id")===e},TAG:function(y,e){return(e==="*"&&y.nodeType===1)||!!y.nodeName&&y.nodeName.toLowerCase()===e},CLASS:function(y,e){return(" "+(y.className||y.getAttribute("class"))+" ").indexOf(e)>-1},ATTR:function(C,A){var z=A[1],e=d.attr?d.attr(C,z):k.attrHandle[z]?k.attrHandle[z](C):C[z]!=null?C[z]:C.getAttribute(z),D=e+"",B=A[2],y=A[4];return e==null?B==="!=":!B&&d.attr?e!=null:B==="="?D===y:B==="*="?D.indexOf(y)>=0:B==="~="?(" "+D+" ").indexOf(y)>=0:!y?D&&e!==false:B==="!="?D!==y:B==="^="?D.indexOf(y)===0:B==="$="?D.substr(D.length-y.length)===y:B==="|="?D===y||D.substr(0,y.length+1)===y+"-":false},POS:function(B,y,z,C){var e=y[2],A=k.setFilters[e];if(A){return A(B,z,y,C)}}}};var j=k.match.POS,c=function(y,e){return"\\"+(e-0+1)};for(var f in k.match){k.match[f]=new RegExp(k.match[f].source+(/(?![^\[]*\])(?![^\(]*\))/.source));k.leftMatch[f]=new RegExp(/(^(?:.|\r|\n)*?)/.source+k.match[f].source.replace(/\\(\d+)/g,c))}k.match.globalPOS=j;var l=function(y,e){y=Array.prototype.slice.call(y,0);if(e){e.push.apply(e,y);return e}return y};try{Array.prototype.slice.call(document.documentElement.childNodes,0)[0].nodeType}catch(v){l=function(B,A){var z=0,y=A||[];if(r.call(B)==="[object Array]"){Array.prototype.push.apply(y,B)}else{if(typeof B.length==="number"){for(var e=B.length;z<e;z++){y.push(B[z])}}else{for(;B[z];z++){y.push(B[z])}}}return y}}var p,m;if(document.documentElement.compareDocumentPosition){p=function(y,e){if(y===e){h=true;return 0}if(!y.compareDocumentPosition||!e.compareDocumentPosition){return y.compareDocumentPosition?-1:1}return y.compareDocumentPosition(e)&4?-1:1}}else{p=function(F,E){if(F===E){h=true;return 0}else{if(F.sourceIndex&&E.sourceIndex){return F.sourceIndex-E.sourceIndex}}var C,y,z=[],e=[],B=F.parentNode,D=E.parentNode,G=B;if(B===D){return m(F,E)}else{if(!B){return -1}else{if(!D){return 1}}}while(G){z.unshift(G);G=G.parentNode}G=D;while(G){e.unshift(G);G=G.parentNode}C=z.length;y=e.length;for(var A=0;A<C&&A<y;A++){if(z[A]!==e[A]){return m(z[A],e[A])}}return A===C?m(F,e[A],-1):m(z[A],E,1)};m=function(y,e,z){if(y===e){return z}var A=y.nextSibling;while(A){if(A===e){return -1}A=A.nextSibling}return 1}}(function(){var y=document.createElement("div"),z="script"+(new Date()).getTime(),e=document.documentElement;y.innerHTML="<a name='"+z+"'/>";e.insertBefore(y,e.firstChild);if(document.getElementById(z)){k.find.ID=function(B,C,D){if(typeof C.getElementById!=="undefined"&&!D){var A=C.getElementById(B[1]);return A?A.id===B[1]||typeof A.getAttributeNode!=="undefined"&&A.getAttributeNode("id").nodeValue===B[1]?[A]:undefined:[]}};k.filter.ID=function(C,A){var B=typeof C.getAttributeNode!=="undefined"&&C.getAttributeNode("id");return C.nodeType===1&&B&&B.nodeValue===A}}e.removeChild(y);e=y=null})();(function(){var e=document.createElement("div");e.appendChild(document.createComment(""));if(e.getElementsByTagName("*").length>0){k.find.TAG=function(y,C){var B=C.getElementsByTagName(y[1]);if(y[1]==="*"){var A=[];for(var z=0;B[z];z++){if(B[z].nodeType===1){A.push(B[z])}}B=A}return B}}e.innerHTML="<a href='#'></a>";if(e.firstChild&&typeof e.firstChild.getAttribute!=="undefined"&&e.firstChild.getAttribute("href")!=="#"){k.attrHandle.href=function(y){return y.getAttribute("href",2)}}e=null})();if(document.querySelectorAll){(function(){var e=d,A=document.createElement("div"),z="__sizzle__";A.innerHTML="<p class='TEST'></p>";if(A.querySelectorAll&&A.querySelectorAll(".TEST").length===0){return}d=function(L,C,G,K){C=C||document;if(!K&&!d.isXML(C)){var J=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(L);if(J&&(C.nodeType===1||C.nodeType===9)){if(J[1]){return l(C.getElementsByTagName(L),G)}else{if(J[2]&&k.find.CLASS&&C.getElementsByClassName){return l(C.getElementsByClassName(J[2]),G)}}}if(C.nodeType===9){if(L==="body"&&C.body){return l([C.body],G)}else{if(J&&J[3]){var F=C.getElementById(J[3]);if(F&&F.parentNode){if(F.id===J[3]){return l([F],G)}}else{return l([],G)}}}try{return l(C.querySelectorAll(L),G)}catch(H){}}else{if(C.nodeType===1&&C.nodeName.toLowerCase()!=="object"){var D=C,E=C.getAttribute("id"),B=E||z,N=C.parentNode,M=/^\s*[+~]/.test(L);if(!E){C.setAttribute("id",B)}else{B=B.replace(/'/g,"\\$&")}if(M&&N){C=C.parentNode}try{if(!M||N){return l(C.querySelectorAll("[id='"+B+"'] "+L),G)}}catch(I){}finally{if(!E){D.removeAttribute("id")}}}}}return e(L,C,G,K)};for(var y in e){d[y]=e[y]}A=null})()}(function(){var e=document.documentElement,z=e.matchesSelector||e.mozMatchesSelector||e.webkitMatchesSelector||e.msMatchesSelector;if(z){var B=!z.call(document.createElement("div"),"div"),y=false;try{z.call(document.documentElement,"[test!='']:sizzle")}catch(A){y=true}d.matchesSelector=function(D,F){F=F.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!d.isXML(D)){try{if(y||!k.match.PSEUDO.test(F)&&!/!=/.test(F)){var C=z.call(D,F);if(C||!B||D.document&&D.document.nodeType!==11){return C}}}catch(E){}}return d(F,null,null,[D]).length>0}}})();(function(){var e=document.createElement("div");e.innerHTML="<div class='test e'></div><div class='test'></div>";if(!e.getElementsByClassName||e.getElementsByClassName("e").length===0){return}e.lastChild.className="e";if(e.getElementsByClassName("e").length===1){return}k.order.splice(1,0,"CLASS");k.find.CLASS=function(y,z,A){if(typeof z.getElementsByClassName!=="undefined"&&!A){return z.getElementsByClassName(y[1])}};e=null})();function a(y,D,C,G,E,F){for(var A=0,z=G.length;A<z;A++){var e=G[A];if(e){var B=false;e=e[y];while(e){if(e[i]===C){B=G[e.sizset];break}if(e.nodeType===1&&!F){e[i]=C;e.sizset=A}if(e.nodeName.toLowerCase()===D){B=e;break}e=e[y]}G[A]=B}}}function t(y,D,C,G,E,F){for(var A=0,z=G.length;A<z;A++){var e=G[A];if(e){var B=false;e=e[y];while(e){if(e[i]===C){B=G[e.sizset];break}if(e.nodeType===1){if(!F){e[i]=C;e.sizset=A}if(typeof D!=="string"){if(e===D){B=true;break}}else{if(d.filter(D,[e]).length>0){B=e;break}}}e=e[y]}G[A]=B}}}if(document.documentElement.contains){d.contains=function(y,e){return y!==e&&(y.contains?y.contains(e):true)}}else{if(document.documentElement.compareDocumentPosition){d.contains=function(y,e){return !!(y.compareDocumentPosition(e)&16)}}else{d.contains=function(){return false}}}d.isXML=function(e){var y=(e?e.ownerDocument||e:0).documentElement;return y?y.nodeName!=="HTML":false};var s=function(z,e,D){var C,E=[],B="",F=e.nodeType?[e]:e;while((C=k.match.PSEUDO.exec(z))){B+=C[0];z=z.replace(k.match.PSEUDO,"")}z=k.relative[z]?z+"*":z;for(var A=0,y=F.length;A<y;A++){d(z,F[A],E,D)}return d.filter(B,E)};window.tinymce.dom.Sizzle=d})();(function(a){a.dom.Element=function(f,d){var b=this,e,c;b.settings=d=d||{};b.id=f;b.dom=e=d.dom||a.DOM;if(!a.isIE){c=e.get(b.id)}a.each(("getPos,getRect,getParent,add,setStyle,getStyle,setStyles,setAttrib,setAttribs,getAttrib,addClass,removeClass,hasClass,getOuterHTML,setOuterHTML,remove,show,hide,isHidden,setHTML,get").split(/,/),function(g){b[g]=function(){var h=[f],j;for(j=0;j<arguments.length;j++){h.push(arguments[j])}h=e[g].apply(e,h);b.update(g);return h}});a.extend(b,{on:function(i,h,g){return a.dom.Event.add(b.id,i,h,g)},getXY:function(){return{x:parseInt(b.getStyle("left")),y:parseInt(b.getStyle("top"))}},getSize:function(){var g=e.get(b.id);return{w:parseInt(b.getStyle("width")||g.clientWidth),h:parseInt(b.getStyle("height")||g.clientHeight)}},moveTo:function(g,h){b.setStyles({left:g,top:h})},moveBy:function(g,i){var h=b.getXY();b.moveTo(h.x+g,h.y+i)},resizeTo:function(g,i){b.setStyles({width:g,height:i})},resizeBy:function(g,j){var i=b.getSize();b.resizeTo(i.w+g,i.h+j)},update:function(h){var g;if(a.isIE6&&d.blocker){h=h||"";if(h.indexOf("get")===0||h.indexOf("has")===0||h.indexOf("is")===0){return}if(h=="remove"){e.remove(b.blocker);return}if(!b.blocker){b.blocker=e.uniqueId();g=e.add(d.container||e.getRoot(),"iframe",{id:b.blocker,style:"position:absolute;",frameBorder:0,src:'javascript:""'});e.setStyle(g,"opacity",0)}else{g=e.get(b.blocker)}e.setStyles(g,{left:b.getStyle("left",1),top:b.getStyle("top",1),width:b.getStyle("width",1),height:b.getStyle("height",1),display:b.getStyle("display",1),zIndex:parseInt(b.getStyle("zIndex",1)||0)-1})}}})}})(tinymce);(function(d){function f(g){return g.replace(/[\n\r]+/g,"")}var c=d.is,b=d.isIE,e=d.each,a=d.dom.TreeWalker;d.create("tinymce.dom.Selection",{Selection:function(k,j,i,h){var g=this;g.dom=k;g.win=j;g.serializer=i;g.editor=h;e(["onBeforeSetContent","onBeforeGetContent","onSetContent","onGetContent"],function(l){g[l]=new d.util.Dispatcher(g)});if(!g.win.getSelection){g.tridentSel=new d.dom.TridentSelection(g)}if(d.isIE&&k.boxModel){this._fixIESelection()}d.addUnload(g.destroy,g)},setCursorLocation:function(i,j){var g=this;var h=g.dom.createRng();h.setStart(i,j);h.setEnd(i,j);g.setRng(h);g.collapse(false)},getContent:function(h){var g=this,i=g.getRng(),m=g.dom.create("body"),k=g.getSel(),j,l,o;h=h||{};j=l="";h.get=true;h.format=h.format||"html";h.forced_root_block="";g.onBeforeGetContent.dispatch(g,h);if(h.format=="text"){return g.isCollapsed()?"":(i.text||(k.toString?k.toString():""))}if(i.cloneContents){o=i.cloneContents();if(o){m.appendChild(o)}}else{if(c(i.item)||c(i.htmlText)){m.innerHTML="<br>"+(i.item?i.item(0).outerHTML:i.htmlText);m.removeChild(m.firstChild)}else{m.innerHTML=i.toString()}}if(/^\s/.test(m.innerHTML)){j=" "}if(/\s+$/.test(m.innerHTML)){l=" "}h.getInner=true;h.content=g.isCollapsed()?"":j+g.serializer.serialize(m,h)+l;g.onGetContent.dispatch(g,h);return h.content},setContent:function(h,j){var o=this,g=o.getRng(),k,l=o.win.document,n,m;j=j||{format:"html"};j.set=true;h=j.content=h;if(!j.no_events){o.onBeforeSetContent.dispatch(o,j)}h=j.content;if(g.insertNode){h+='<span id="__caret">_</span>';if(g.startContainer==l&&g.endContainer==l){l.body.innerHTML=h}else{g.deleteContents();if(l.body.childNodes.length===0){l.body.innerHTML=h}else{if(g.createContextualFragment){g.insertNode(g.createContextualFragment(h))}else{n=l.createDocumentFragment();m=l.createElement("div");n.appendChild(m);m.outerHTML=h;g.insertNode(n)}}}k=o.dom.get("__caret");g=l.createRange();g.setStartBefore(k);g.setEndBefore(k);o.setRng(g);o.dom.remove("__caret");try{o.setRng(g)}catch(i){}}else{if(g.item){l.execCommand("Delete",false,null);g=o.getRng()}if(/^\s+/.test(h)){g.pasteHTML('<span id="__mce_tmp">_</span>'+h);o.dom.remove("__mce_tmp")}else{g.pasteHTML(h)}}if(!j.no_events){o.onSetContent.dispatch(o,j)}},getStart:function(){var i=this,h=i.getRng(),j,g,l,k;if(h.duplicate||h.item){if(h.item){return h.item(0)}l=h.duplicate();l.collapse(1);j=l.parentElement();if(j.ownerDocument!==i.dom.doc){j=i.dom.getRoot()}g=k=h.parentElement();while(k=k.parentNode){if(k==j){j=g;break}}return j}else{j=h.startContainer;if(j.nodeType==1&&j.hasChildNodes()){j=j.childNodes[Math.min(j.childNodes.length-1,h.startOffset)]}if(j&&j.nodeType==3){return j.parentNode}return j}},getEnd:function(){var h=this,g=h.getRng(),j,i;if(g.duplicate||g.item){if(g.item){return g.item(0)}g=g.duplicate();g.collapse(0);j=g.parentElement();if(j.ownerDocument!==h.dom.doc){j=h.dom.getRoot()}if(j&&j.nodeName=="BODY"){return j.lastChild||j}return j}else{j=g.endContainer;i=g.endOffset;if(j.nodeType==1&&j.hasChildNodes()){j=j.childNodes[i>0?i-1:i]}if(j&&j.nodeType==3){return j.parentNode}return j}},getBookmark:function(s,v){var y=this,n=y.dom,h,k,j,o,i,p,q,m="\uFEFF",x;function g(z,A){var t=0;e(n.select(z),function(C,B){if(C==A){t=B}});return t}function u(t){function z(E){var A,D,C,B=E?"start":"end";A=t[B+"Container"];D=t[B+"Offset"];if(A.nodeType==1&&A.nodeName=="TR"){C=A.childNodes;A=C[Math.min(E?D:D-1,C.length-1)];if(A){D=E?0:A.childNodes.length;t["set"+(E?"Start":"End")](A,D)}}}z(true);z();return t}function l(){var z=y.getRng(true),t=n.getRoot(),A={};function B(E,J){var D=E[J?"startContainer":"endContainer"],I=E[J?"startOffset":"endOffset"],C=[],F,H,G=0;if(D.nodeType==3){if(v){for(F=D.previousSibling;F&&F.nodeType==3;F=F.previousSibling){I+=F.nodeValue.length}}C.push(I)}else{H=D.childNodes;if(I>=H.length&&H.length){G=1;I=Math.max(0,H.length-1)}C.push(y.dom.nodeIndex(H[I],v)+G)}for(;D&&D!=t;D=D.parentNode){C.push(y.dom.nodeIndex(D,v))}return C}A.start=B(z,true);if(!y.isCollapsed()){A.end=B(z)}return A}if(s==2){if(y.tridentSel){return y.tridentSel.getBookmark(s)}return l()}if(s){return{rng:y.getRng()}}h=y.getRng();j=n.uniqueId();o=tinyMCE.activeEditor.selection.isCollapsed();x="overflow:hidden;line-height:0px";if(h.duplicate||h.item){if(!h.item){k=h.duplicate();try{h.collapse();h.pasteHTML('<span data-mce-type="bookmark" id="'+j+'_start" style="'+x+'">'+m+"</span>");if(!o){k.collapse(false);h.moveToElementText(k.parentElement());if(h.compareEndPoints("StartToEnd",k)===0){k.move("character",-1)}k.pasteHTML('<span data-mce-type="bookmark" id="'+j+'_end" style="'+x+'">'+m+"</span>")}}catch(r){return null}}else{p=h.item(0);i=p.nodeName;return{name:i,index:g(i,p)}}}else{p=y.getNode();i=p.nodeName;if(i=="IMG"){return{name:i,index:g(i,p)}}k=u(h.cloneRange());if(!o){k.collapse(false);k.insertNode(n.create("span",{"data-mce-type":"bookmark",id:j+"_end",style:x},m))}h=u(h);h.collapse(true);h.insertNode(n.create("span",{"data-mce-type":"bookmark",id:j+"_start",style:x},m))}y.moveToBookmark({id:j,keep:1});return{id:j}},moveToBookmark:function(o){var s=this,m=s.dom,j,i,g,r,k,u,p,q;function h(A){var t=o[A?"start":"end"],x,y,z,v;if(t){z=t[0];for(y=r,x=t.length-1;x>=1;x--){v=y.childNodes;if(t[x]>v.length-1){return}y=v[t[x]]}if(y.nodeType===3){z=Math.min(t[0],y.nodeValue.length)}if(y.nodeType===1){z=Math.min(t[0],y.childNodes.length)}if(A){g.setStart(y,z)}else{g.setEnd(y,z)}}return true}function l(B){var v=m.get(o.id+"_"+B),A,t,y,z,x=o.keep;if(v){A=v.parentNode;if(B=="start"){if(!x){t=m.nodeIndex(v)}else{A=v.firstChild;t=1}k=u=A;p=q=t}else{if(!x){t=m.nodeIndex(v)}else{A=v.firstChild;t=1}u=A;q=t}if(!x){z=v.previousSibling;y=v.nextSibling;e(d.grep(v.childNodes),function(C){if(C.nodeType==3){C.nodeValue=C.nodeValue.replace(/\uFEFF/g,"")}});while(v=m.get(o.id+"_"+B)){m.remove(v,1)}if(z&&y&&z.nodeType==y.nodeType&&z.nodeType==3&&!d.isOpera){t=z.nodeValue.length;z.appendData(y.nodeValue);m.remove(y);if(B=="start"){k=u=z;p=q=t}else{u=z;q=t}}}}}function n(t){if(m.isBlock(t)&&!t.innerHTML&&!b){t.innerHTML='<br data-mce-bogus="1" />'}return t}if(o){if(o.start){g=m.createRng();r=m.getRoot();if(s.tridentSel){return s.tridentSel.moveToBookmark(o)}if(h(true)&&h()){s.setRng(g)}}else{if(o.id){l("start");l("end");if(k){g=m.createRng();g.setStart(n(k),p);g.setEnd(n(u),q);s.setRng(g)}}else{if(o.name){s.select(m.select(o.name)[o.index])}else{if(o.rng){s.setRng(o.rng)}}}}}},select:function(l,k){var j=this,m=j.dom,h=m.createRng(),g;function i(n,p){var o=new a(n,n);do{if(n.nodeType==3&&d.trim(n.nodeValue).length!==0){if(p){h.setStart(n,0)}else{h.setEnd(n,n.nodeValue.length)}return}if(n.nodeName=="BR"){if(p){h.setStartBefore(n)}else{h.setEndBefore(n)}return}}while(n=(p?o.next():o.prev()))}if(l){g=m.nodeIndex(l);h.setStart(l.parentNode,g);h.setEnd(l.parentNode,g+1);if(k){i(l,1);i(l)}j.setRng(h)}return l},isCollapsed:function(){var g=this,i=g.getRng(),h=g.getSel();if(!i||i.item){return false}if(i.compareEndPoints){return i.compareEndPoints("StartToEnd",i)===0}return !h||i.collapsed},collapse:function(g){var i=this,h=i.getRng(),j;if(h.item){j=h.item(0);h=i.win.document.body.createTextRange();h.moveToElementText(j)}h.collapse(!!g);i.setRng(h)},getSel:function(){var h=this,g=this.win;return g.getSelection?g.getSelection():g.document.selection},getRng:function(m){var h=this,j,g,l,k=h.win.document;if(m&&h.tridentSel){return h.tridentSel.getRangeAt(0)}try{if(j=h.getSel()){g=j.rangeCount>0?j.getRangeAt(0):(j.createRange?j.createRange():k.createRange())}}catch(i){}if(d.isIE&&g&&g.setStart&&k.selection.createRange().item){l=k.selection.createRange().item(0);g=k.createRange();g.setStartBefore(l);g.setEndAfter(l)}if(!g){g=k.createRange?k.createRange():k.body.createTextRange()}if(g.setStart&&g.startContainer.nodeType===9&&g.collapsed){l=h.dom.getRoot();g.setStart(l,0);g.setEnd(l,0)}if(h.selectedRange&&h.explicitRange){if(g.compareBoundaryPoints(g.START_TO_START,h.selectedRange)===0&&g.compareBoundaryPoints(g.END_TO_END,h.selectedRange)===0){g=h.explicitRange}else{h.selectedRange=null;h.explicitRange=null}}return g},setRng:function(k,g){var j,i=this;if(!i.tridentSel){j=i.getSel();if(j){i.explicitRange=k;try{j.removeAllRanges()}catch(h){}j.addRange(k);if(g===false&&j.extend){j.collapse(k.endContainer,k.endOffset);j.extend(k.startContainer,k.startOffset)}i.selectedRange=j.rangeCount>0?j.getRangeAt(0):null}}else{if(k.cloneRange){try{i.tridentSel.addRange(k);return}catch(h){}}try{k.select()}catch(h){}}},setNode:function(h){var g=this;g.setContent(g.dom.getOuterHTML(h));return h},getNode:function(){var i=this,h=i.getRng(),j=i.getSel(),m,l=h.startContainer,g=h.endContainer;function k(q,o){var p=q;while(q&&q.nodeType===3&&q.length===0){q=o?q.nextSibling:q.previousSibling}return q||p}if(!h){return i.dom.getRoot()}if(h.setStart){m=h.commonAncestorContainer;if(!h.collapsed){if(h.startContainer==h.endContainer){if(h.endOffset-h.startOffset<2){if(h.startContainer.hasChildNodes()){m=h.startContainer.childNodes[h.startOffset]}}}if(l.nodeType===3&&g.nodeType===3){if(l.length===h.startOffset){l=k(l.nextSibling,true)}else{l=l.parentNode}if(h.endOffset===0){g=k(g.previousSibling,false)}else{g=g.parentNode}if(l&&l===g){return l}}}if(m&&m.nodeType==3){return m.parentNode}return m}return h.item?h.item(0):h.parentElement()},getSelectedBlocks:function(p,h){var o=this,k=o.dom,m,l,i,j=[];m=k.getParent(p||o.getStart(),k.isBlock);l=k.getParent(h||o.getEnd(),k.isBlock);if(m){j.push(m)}if(m&&l&&m!=l){i=m;var g=new a(m,k.getRoot());while((i=g.next())&&i!=l){if(k.isBlock(i)){j.push(i)}}}if(l&&m!=l){j.push(l)}return j},isForward:function(){var i=this.dom,g=this.getSel(),j,h;if(!g||g.anchorNode==null||g.focusNode==null){return true}j=i.createRng();j.setStart(g.anchorNode,g.anchorOffset);j.collapse(true);h=i.createRng();h.setStart(g.focusNode,g.focusOffset);h.collapse(true);return j.compareBoundaryPoints(j.START_TO_START,h)<=0},normalize:function(){var h=this,g,m,l,j,i;function k(p){var o,r,n,s=h.dom,u=s.getRoot(),q,t,v;function y(z,A){var B=new a(z,s.getParent(z.parentNode,s.isBlock)||u);while(z=B[A?"prev":"next"]()){if(z.nodeName==="BR"){return true}}}function x(B,z){var C,A;z=z||o;C=new a(z,s.getParent(z.parentNode,s.isBlock)||u);while(q=C[B?"prev":"next"]()){if(q.nodeType===3&&q.nodeValue.length>0){o=q;r=B?q.nodeValue.length:0;m=true;return}if(s.isBlock(q)||t[q.nodeName.toLowerCase()]){return}A=q}if(l&&A){o=A;m=true;r=0}}o=g[(p?"start":"end")+"Container"];r=g[(p?"start":"end")+"Offset"];t=s.schema.getNonEmptyElements();if(o.nodeType===9){o=s.getRoot();r=0}if(o===u){if(p){q=o.childNodes[r>0?r-1:0];if(q){v=q.nodeName.toLowerCase();if(t[q.nodeName]||q.nodeName=="TABLE"){return}}}if(o.hasChildNodes()){o=o.childNodes[Math.min(!p&&r>0?r-1:r,o.childNodes.length-1)];r=0;if(o.hasChildNodes()&&!/TABLE/.test(o.nodeName)){q=o;n=new a(o,u);do{if(q.nodeType===3&&q.nodeValue.length>0){r=p?0:q.nodeValue.length;o=q;m=true;break}if(t[q.nodeName.toLowerCase()]){r=s.nodeIndex(q);o=q.parentNode;if(q.nodeName=="IMG"&&!p){r++}m=true;break}}while(q=(p?n.next():n.prev()))}}}if(l){if(o.nodeType===3&&r===0){x(true)}if(o.nodeType===1){q=o.childNodes[r];if(q&&q.nodeName==="BR"&&!y(q)&&!y(q,true)){x(true,o.childNodes[r])}}}if(p&&!l&&o.nodeType===3&&r===o.nodeValue.length){x(false)}if(m){g["set"+(p?"Start":"End")](o,r)}}if(d.isIE){return}g=h.getRng();l=g.collapsed;k(true);if(!l){k()}if(m){if(l){g.collapse(true)}h.setRng(g,h.isForward())}},selectorChanged:function(g,j){var h=this,i;if(!h.selectorChangedData){h.selectorChangedData={};i={};h.editor.onNodeChange.addToTop(function(l,k,o){var p=h.dom,m=p.getParents(o,null,p.getRoot()),n={};e(h.selectorChangedData,function(r,q){e(m,function(s){if(p.is(s,q)){if(!i[q]){e(r,function(t){t(true,{node:s,selector:q,parents:m})});i[q]=r}n[q]=r;return false}})});e(i,function(r,q){if(!n[q]){delete i[q];e(r,function(s){s(false,{node:o,selector:q,parents:m})})}})})}if(!h.selectorChangedData[g]){h.selectorChangedData[g]=[]}h.selectorChangedData[g].push(j);return h},scrollIntoView:function(k){var j,h,g=this,i=g.dom;h=i.getViewPort(g.editor.getWin());j=i.getPos(k).y;if(j<h.y||j+25>h.y+h.h){g.editor.getWin().scrollTo(0,j<h.y?j:j-h.h+25)}},destroy:function(h){var g=this;g.win=null;if(!h){d.removeUnload(g.destroy)}},_fixIESelection:function(){var h=this.dom,n=h.doc,i=n.body,k,o,g;function j(p,s){var q=i.createTextRange();try{q.moveToPoint(p,s)}catch(r){q=null}return q}function m(q){var p;if(q.button){p=j(q.x,q.y);if(p){if(p.compareEndPoints("StartToStart",o)>0){p.setEndPoint("StartToStart",o)}else{p.setEndPoint("EndToEnd",o)}p.select()}}else{l()}}function l(){var p=n.selection.createRange();if(o&&!p.item&&p.compareEndPoints("StartToEnd",p)===0){o.select()}h.unbind(n,"mouseup",l);h.unbind(n,"mousemove",m);o=k=0}n.documentElement.unselectable=true;h.bind(n,["mousedown","contextmenu"],function(p){if(p.target.nodeName==="HTML"){if(k){l()}g=n.documentElement;if(g.scrollHeight>g.clientHeight){return}k=1;o=j(p.x,p.y);if(o){h.bind(n,"mouseup",l);h.bind(n,"mousemove",m);h.win.focus();o.select()}}})}})})(tinymce);(function(a){a.dom.Serializer=function(e,i,f){var h,b,d=a.isIE,g=a.each,c;if(!e.apply_source_formatting){e.indent=false}i=i||a.DOM;f=f||new a.html.Schema(e);e.entity_encoding=e.entity_encoding||"named";e.remove_trailing_brs="remove_trailing_brs" in e?e.remove_trailing_brs:true;h=new a.util.Dispatcher(self);b=new a.util.Dispatcher(self);c=new a.html.DomParser(e,f);c.addAttributeFilter("src,href,style",function(k,j){var o=k.length,l,q,n="data-mce-"+j,p=e.url_converter,r=e.url_converter_scope,m;while(o--){l=k[o];q=l.attributes.map[n];if(q!==m){l.attr(j,q.length>0?q:null);l.attr(n,null)}else{q=l.attributes.map[j];if(j==="style"){q=i.serializeStyle(i.parseStyle(q),l.name)}else{if(p){q=p.call(r,q,j,l.name)}}l.attr(j,q.length>0?q:null)}}});c.addAttributeFilter("class",function(j,k){var l=j.length,m,n;while(l--){m=j[l];n=m.attr("class").replace(/(?:^|\s)mce(Item\w+|Selected)(?!\S)/g,"");m.attr("class",n.length>0?n:null)}});c.addAttributeFilter("data-mce-type",function(j,l,k){var m=j.length,n;while(m--){n=j[m];if(n.attributes.map["data-mce-type"]==="bookmark"&&!k.cleanup){n.remove()}}});c.addAttributeFilter("data-mce-expando",function(j,l,k){var m=j.length;while(m--){j[m].attr(l,null)}});c.addNodeFilter("noscript",function(j){var k=j.length,l;while(k--){l=j[k].firstChild;if(l){l.value=a.html.Entities.decode(l.value)}}});c.addNodeFilter("script,style",function(k,l){var m=k.length,n,o;function j(p){return p.replace(/(<!--\[CDATA\[|\]\]-->)/g,"\n").replace(/^[\r\n]*|[\r\n]*$/g,"").replace(/^\s*((<!--)?(\s*\/\/)?\s*<!\[CDATA\[|(<!--\s*)?\/\*\s*<!\[CDATA\[\s*\*\/|(\/\/)?\s*<!--|\/\*\s*<!--\s*\*\/)\s*[\r\n]*/gi,"").replace(/\s*(\/\*\s*\]\]>\s*\*\/(-->)?|\s*\/\/\s*\]\]>(-->)?|\/\/\s*(-->)?|\]\]>|\/\*\s*-->\s*\*\/|\s*-->\s*)\s*$/g,"")}while(m--){n=k[m];o=n.firstChild?n.firstChild.value:"";if(l==="script"){n.attr("type",(n.attr("type")||"text/javascript").replace(/^mce\-/,""));if(o.length>0){n.firstChild.value="// <![CDATA[\n"+j(o)+"\n// ]]>"}}else{if(o.length>0){n.firstChild.value="<!--\n"+j(o)+"\n-->"}}}});c.addNodeFilter("#comment",function(j,k){var l=j.length,m;while(l--){m=j[l];if(m.value.indexOf("[CDATA[")===0){m.name="#cdata";m.type=4;m.value=m.value.replace(/^\[CDATA\[|\]\]$/g,"")}else{if(m.value.indexOf("mce:protected ")===0){m.name="#text";m.type=3;m.raw=true;m.value=unescape(m.value).substr(14)}}}});c.addNodeFilter("xml:namespace,input",function(j,k){var l=j.length,m;while(l--){m=j[l];if(m.type===7){m.remove()}else{if(m.type===1){if(k==="input"&&!("type" in m.attributes.map)){m.attr("type","text")}}}}});if(e.fix_list_elements){c.addNodeFilter("ul,ol",function(k,l){var m=k.length,n,j;while(m--){n=k[m];j=n.parent;if(j.name==="ul"||j.name==="ol"){if(n.prev&&n.prev.name==="li"){n.prev.append(n)}}}})}c.addAttributeFilter("data-mce-src,data-mce-href,data-mce-style",function(j,k){var l=j.length;while(l--){j[l].attr(k,null)}});return{schema:f,addNodeFilter:c.addNodeFilter,addAttributeFilter:c.addAttributeFilter,onPreProcess:h,onPostProcess:b,serialize:function(o,m){var l,p,k,j,n;if(d&&i.select("script,style,select,map").length>0){n=o.innerHTML;o=o.cloneNode(false);i.setHTML(o,n)}else{o=o.cloneNode(true)}l=o.ownerDocument.implementation;if(l.createHTMLDocument){p=l.createHTMLDocument("");g(o.nodeName=="BODY"?o.childNodes:[o],function(q){p.body.appendChild(p.importNode(q,true))});if(o.nodeName!="BODY"){o=p.body.firstChild}else{o=p.body}k=i.doc;i.doc=p}m=m||{};m.format=m.format||"html";if(!m.no_events){m.node=o;h.dispatch(self,m)}j=new a.html.Serializer(e,f);m.content=j.serialize(c.parse(a.trim(m.getInner?o.innerHTML:i.getOuterHTML(o)),m));if(!m.cleanup){m.content=m.content.replace(/\uFEFF/g,"")}if(!m.no_events){b.dispatch(self,m)}if(k){i.doc=k}m.node=null;return m.content},addRules:function(j){f.addValidElements(j)},setRules:function(j){f.setValidElements(j)}}}})(tinymce);(function(a){a.dom.ScriptLoader=function(h){var c=0,k=1,i=2,l={},j=[],e={},d=[],g=0,f;function b(m,v){var x=this,q=a.DOM,s,o,r,n;function p(){q.remove(n);if(s){s.onreadystatechange=s.onload=s=null}v()}function u(){if(typeof(console)!=="undefined"&&console.log){console.log("Failed to load: "+m)}}n=q.uniqueId();if(a.isIE6){o=new a.util.URI(m);r=location;if(o.host==r.hostname&&o.port==r.port&&(o.protocol+":")==r.protocol&&o.protocol.toLowerCase()!="file"){a.util.XHR.send({url:a._addVer(o.getURI()),success:function(y){var t=q.create("script",{type:"text/javascript"});t.text=y;document.getElementsByTagName("head")[0].appendChild(t);q.remove(t);p()},error:u});return}}s=document.createElement("script");s.id=n;s.type="text/javascript";s.src=a._addVer(m);if(!a.isIE){s.onload=p}s.onerror=u;if(!a.isOpera){s.onreadystatechange=function(){var t=s.readyState;if(t=="complete"||t=="loaded"){p()}}}(document.getElementsByTagName("head")[0]||document.body).appendChild(s)}this.isDone=function(m){return l[m]==i};this.markDone=function(m){l[m]=i};this.add=this.load=function(m,q,n){var o,p=l[m];if(p==f){j.push(m);l[m]=c}if(q){if(!e[m]){e[m]=[]}e[m].push({func:q,scope:n||this})}};this.loadQueue=function(n,m){this.loadScripts(j,n,m)};this.loadScripts=function(m,q,p){var o;function n(r){a.each(e[r],function(s){s.func.call(s.scope)});e[r]=f}d.push({func:q,scope:p||this});o=function(){var r=a.grep(m);m.length=0;a.each(r,function(s){if(l[s]==i){n(s);return}if(l[s]!=k){l[s]=k;g++;b(s,function(){l[s]=i;g--;n(s);o()})}});if(!g){a.each(d,function(s){s.func.call(s.scope)});d.length=0}};o()}};a.ScriptLoader=new a.dom.ScriptLoader()})(tinymce);(function(a){a.dom.RangeUtils=function(c){var b="\uFEFF";this.walk=function(d,s){var i=d.startContainer,l=d.startOffset,t=d.endContainer,m=d.endOffset,j,g,o,h,r,q,e;e=c.select("td.mceSelected,th.mceSelected");if(e.length>0){a.each(e,function(u){s([u])});return}function f(u){var v;v=u[0];if(v.nodeType===3&&v===i&&l>=v.nodeValue.length){u.splice(0,1)}v=u[u.length-1];if(m===0&&u.length>0&&v===t&&v.nodeType===3){u.splice(u.length-1,1)}return u}function p(x,v,u){var y=[];for(;x&&x!=u;x=x[v]){y.push(x)}return y}function n(v,u){do{if(v.parentNode==u){return v}v=v.parentNode}while(v)}function k(x,v,y){var u=y?"nextSibling":"previousSibling";for(h=x,r=h.parentNode;h&&h!=v;h=r){r=h.parentNode;q=p(h==x?h:h[u],u);if(q.length){if(!y){q.reverse()}s(f(q))}}}if(i.nodeType==1&&i.hasChildNodes()){i=i.childNodes[l]}if(t.nodeType==1&&t.hasChildNodes()){t=t.childNodes[Math.min(m-1,t.childNodes.length-1)]}if(i==t){return s(f([i]))}j=c.findCommonAncestor(i,t);for(h=i;h;h=h.parentNode){if(h===t){return k(i,j,true)}if(h===j){break}}for(h=t;h;h=h.parentNode){if(h===i){return k(t,j)}if(h===j){break}}g=n(i,j)||i;o=n(t,j)||t;k(i,g,true);q=p(g==i?g:g.nextSibling,"nextSibling",o==t?o.nextSibling:o);if(q.length){s(f(q))}k(t,o)};this.split=function(e){var h=e.startContainer,d=e.startOffset,i=e.endContainer,g=e.endOffset;function f(j,k){return j.splitText(k)}if(h==i&&h.nodeType==3){if(d>0&&d<h.nodeValue.length){i=f(h,d);h=i.previousSibling;if(g>d){g=g-d;h=i=f(i,g).previousSibling;g=i.nodeValue.length;d=0}else{g=0}}}else{if(h.nodeType==3&&d>0&&d<h.nodeValue.length){h=f(h,d);d=0}if(i.nodeType==3&&g>0&&g<i.nodeValue.length){i=f(i,g).previousSibling;g=i.nodeValue.length}}return{startContainer:h,startOffset:d,endContainer:i,endOffset:g}}};a.dom.RangeUtils.compareRanges=function(c,b){if(c&&b){if(c.item||c.duplicate){if(c.item&&b.item&&c.item(0)===b.item(0)){return true}if(c.isEqual&&b.isEqual&&b.isEqual(c)){return true}}else{return c.startContainer==b.startContainer&&c.startOffset==b.startOffset}}return false}})(tinymce);(function(b){var a=b.dom.Event,c=b.each;b.create("tinymce.ui.KeyboardNavigation",{KeyboardNavigation:function(e,f){var q=this,n=e.root,m=e.items,o=e.enableUpDown,i=e.enableLeftRight||!e.enableUpDown,l=e.excludeFromTabOrder,k,h,p,d,g;f=f||b.DOM;k=function(r){g=r.target.id};h=function(r){f.setAttrib(r.target.id,"tabindex","-1")};d=function(r){var s=f.get(g);f.setAttrib(s,"tabindex","0");s.focus()};q.focus=function(){f.get(g).focus()};q.destroy=function(){c(m,function(s){var t=f.get(s.id);f.unbind(t,"focus",k);f.unbind(t,"blur",h)});var r=f.get(n);f.unbind(r,"focus",d);f.unbind(r,"keydown",p);m=f=n=q.focus=k=h=p=d=null;q.destroy=function(){}};q.moveFocus=function(v,s){var r=-1,u=q.controls,t;if(!g){return}c(m,function(y,x){if(y.id===g){r=x;return false}});r+=v;if(r<0){r=m.length-1}else{if(r>=m.length){r=0}}t=m[r];f.setAttrib(g,"tabindex","-1");f.setAttrib(t.id,"tabindex","0");f.get(t.id).focus();if(e.actOnFocus){e.onAction(t.id)}if(s){a.cancel(s)}};p=function(z){var v=37,u=39,y=38,A=40,r=27,t=14,s=13,x=32;switch(z.keyCode){case v:if(i){q.moveFocus(-1)}break;case u:if(i){q.moveFocus(1)}break;case y:if(o){q.moveFocus(-1)}break;case A:if(o){q.moveFocus(1)}break;case r:if(e.onCancel){e.onCancel();a.cancel(z)}break;case t:case s:case x:if(e.onAction){e.onAction(g);a.cancel(z)}break}};c(m,function(t,r){var s,u;if(!t.id){t.id=f.uniqueId("_mce_item_")}u=f.get(t.id);if(l){f.bind(u,"blur",h);s="-1"}else{s=(r===0?"0":"-1")}u.setAttribute("tabindex",s);f.bind(u,"focus",k)});if(m[0]){g=m[0].id}f.setAttrib(n,"tabindex","-1");var j=f.get(n);f.bind(j,"focus",d);f.bind(j,"keydown",p)}})})(tinymce);(function(c){var b=c.DOM,a=c.is;c.create("tinymce.ui.Control",{Control:function(f,e,d){this.id=f;this.settings=e=e||{};this.rendered=false;this.onRender=new c.util.Dispatcher(this);this.classPrefix="";this.scope=e.scope||this;this.disabled=0;this.active=0;this.editor=d},setAriaProperty:function(f,e){var d=b.get(this.id+"_aria")||b.get(this.id);if(d){b.setAttrib(d,"aria-"+f,!!e)}},focus:function(){b.get(this.id).focus()},setDisabled:function(d){if(d!=this.disabled){this.setAriaProperty("disabled",d);this.setState("Disabled",d);this.setState("Enabled",!d);this.disabled=d}},isDisabled:function(){return this.disabled},setActive:function(d){if(d!=this.active){this.setState("Active",d);this.active=d;this.setAriaProperty("pressed",d)}},isActive:function(){return this.active},setState:function(f,d){var e=b.get(this.id);f=this.classPrefix+f;if(d){b.addClass(e,f)}else{b.removeClass(e,f)}},isRendered:function(){return this.rendered},renderHTML:function(){},renderTo:function(d){b.setHTML(d,this.renderHTML())},postRender:function(){var e=this,d;if(a(e.disabled)){d=e.disabled;e.disabled=-1;e.setDisabled(d)}if(a(e.active)){d=e.active;e.active=-1;e.setActive(d)}},remove:function(){b.remove(this.id);this.destroy()},destroy:function(){c.dom.Event.clear(this.id)}})})(tinymce);tinymce.create("tinymce.ui.Container:tinymce.ui.Control",{Container:function(c,b,a){this.parent(c,b,a);this.controls=[];this.lookup={}},add:function(a){this.lookup[a.id]=a;this.controls.push(a);return a},get:function(a){return this.lookup[a]}});tinymce.create("tinymce.ui.Separator:tinymce.ui.Control",{Separator:function(b,a){this.parent(b,a);this.classPrefix="mceSeparator";this.setDisabled(true)},renderHTML:function(){return tinymce.DOM.createHTML("span",{"class":this.classPrefix,role:"separator","aria-orientation":"vertical",tabindex:"-1"})}});(function(d){var c=d.is,b=d.DOM,e=d.each,a=d.walk;d.create("tinymce.ui.MenuItem:tinymce.ui.Control",{MenuItem:function(g,f){this.parent(g,f);this.classPrefix="mceMenuItem"},setSelected:function(f){this.setState("Selected",f);this.setAriaProperty("checked",!!f);this.selected=f},isSelected:function(){return this.selected},postRender:function(){var f=this;f.parent();if(c(f.selected)){f.setSelected(f.selected)}}})})(tinymce);(function(d){var c=d.is,b=d.DOM,e=d.each,a=d.walk;d.create("tinymce.ui.Menu:tinymce.ui.MenuItem",{Menu:function(h,g){var f=this;f.parent(h,g);f.items={};f.collapsed=false;f.menuCount=0;f.onAddItem=new d.util.Dispatcher(this)},expand:function(g){var f=this;if(g){a(f,function(h){if(h.expand){h.expand()}},"items",f)}f.collapsed=false},collapse:function(g){var f=this;if(g){a(f,function(h){if(h.collapse){h.collapse()}},"items",f)}f.collapsed=true},isCollapsed:function(){return this.collapsed},add:function(f){if(!f.settings){f=new d.ui.MenuItem(f.id||b.uniqueId(),f)}this.onAddItem.dispatch(this,f);return this.items[f.id]=f},addSeparator:function(){return this.add({separator:true})},addMenu:function(f){if(!f.collapse){f=this.createMenu(f)}this.menuCount++;return this.add(f)},hasMenus:function(){return this.menuCount!==0},remove:function(f){delete this.items[f.id]},removeAll:function(){var f=this;a(f,function(g){if(g.removeAll){g.removeAll()}else{g.remove()}g.destroy()},"items",f);f.items={}},createMenu:function(g){var f=new d.ui.Menu(g.id||b.uniqueId(),g);f.onAddItem.add(this.onAddItem.dispatch,this.onAddItem);return f}})})(tinymce);(function(e){var d=e.is,c=e.DOM,f=e.each,a=e.dom.Event,b=e.dom.Element;e.create("tinymce.ui.DropMenu:tinymce.ui.Menu",{DropMenu:function(h,g){g=g||{};g.container=g.container||c.doc.body;g.offset_x=g.offset_x||0;g.offset_y=g.offset_y||0;g.vp_offset_x=g.vp_offset_x||0;g.vp_offset_y=g.vp_offset_y||0;if(d(g.icons)&&!g.icons){g["class"]+=" mceNoIcons"}this.parent(h,g);this.onShowMenu=new e.util.Dispatcher(this);this.onHideMenu=new e.util.Dispatcher(this);this.classPrefix="mceMenu"},createMenu:function(j){var h=this,i=h.settings,g;j.container=j.container||i.container;j.parent=h;j.constrain=j.constrain||i.constrain;j["class"]=j["class"]||i["class"];j.vp_offset_x=j.vp_offset_x||i.vp_offset_x;j.vp_offset_y=j.vp_offset_y||i.vp_offset_y;j.keyboard_focus=i.keyboard_focus;g=new e.ui.DropMenu(j.id||c.uniqueId(),j);g.onAddItem.add(h.onAddItem.dispatch,h.onAddItem);return g},focus:function(){var g=this;if(g.keyboardNav){g.keyboardNav.focus()}},update:function(){var i=this,j=i.settings,g=c.get("menu_"+i.id+"_tbl"),l=c.get("menu_"+i.id+"_co"),h,k;h=j.max_width?Math.min(g.offsetWidth,j.max_width):g.offsetWidth;k=j.max_height?Math.min(g.offsetHeight,j.max_height):g.offsetHeight;if(!c.boxModel){i.element.setStyles({width:h+2,height:k+2})}else{i.element.setStyles({width:h,height:k})}if(j.max_width){c.setStyle(l,"width",h)}if(j.max_height){c.setStyle(l,"height",k);if(g.clientHeight<j.max_height){c.setStyle(l,"overflow","hidden")}}},showMenu:function(p,n,r){var z=this,A=z.settings,o,g=c.getViewPort(),u,l,v,q,i=2,k,j,m=z.classPrefix;z.collapse(1);if(z.isMenuVisible){return}if(!z.rendered){o=c.add(z.settings.container,z.renderNode());f(z.items,function(h){h.postRender()});z.element=new b("menu_"+z.id,{blocker:1,container:A.container})}else{o=c.get("menu_"+z.id)}if(!e.isOpera){c.setStyles(o,{left:-65535,top:-65535})}c.show(o);z.update();p+=A.offset_x||0;n+=A.offset_y||0;g.w-=4;g.h-=4;if(A.constrain){u=o.clientWidth-i;l=o.clientHeight-i;v=g.x+g.w;q=g.y+g.h;if((p+A.vp_offset_x+u)>v){p=r?r-u:Math.max(0,(v-A.vp_offset_x)-u)}if((n+A.vp_offset_y+l)>q){n=Math.max(0,(q-A.vp_offset_y)-l)}}c.setStyles(o,{left:p,top:n});z.element.update();z.isMenuVisible=1;z.mouseClickFunc=a.add(o,"click",function(s){var h;s=s.target;if(s&&(s=c.getParent(s,"tr"))&&!c.hasClass(s,m+"ItemSub")){h=z.items[s.id];if(h.isDisabled()){return}k=z;while(k){if(k.hideMenu){k.hideMenu()}k=k.settings.parent}if(h.settings.onclick){h.settings.onclick(s)}return false}});if(z.hasMenus()){z.mouseOverFunc=a.add(o,"mouseover",function(x){var h,t,s;x=x.target;if(x&&(x=c.getParent(x,"tr"))){h=z.items[x.id];if(z.lastMenu){z.lastMenu.collapse(1)}if(h.isDisabled()){return}if(x&&c.hasClass(x,m+"ItemSub")){t=c.getRect(x);h.showMenu((t.x+t.w-i),t.y-i,t.x);z.lastMenu=h;c.addClass(c.get(h.id).firstChild,m+"ItemActive")}}})}a.add(o,"keydown",z._keyHandler,z);z.onShowMenu.dispatch(z);if(A.keyboard_focus){z._setupKeyboardNav()}},hideMenu:function(j){var g=this,i=c.get("menu_"+g.id),h;if(!g.isMenuVisible){return}if(g.keyboardNav){g.keyboardNav.destroy()}a.remove(i,"mouseover",g.mouseOverFunc);a.remove(i,"click",g.mouseClickFunc);a.remove(i,"keydown",g._keyHandler);c.hide(i);g.isMenuVisible=0;if(!j){g.collapse(1)}if(g.element){g.element.hide()}if(h=c.get(g.id)){c.removeClass(h.firstChild,g.classPrefix+"ItemActive")}g.onHideMenu.dispatch(g)},add:function(i){var g=this,h;i=g.parent(i);if(g.isRendered&&(h=c.get("menu_"+g.id))){g._add(c.select("tbody",h)[0],i)}return i},collapse:function(g){this.parent(g);this.hideMenu(1)},remove:function(g){c.remove(g.id);this.destroy();return this.parent(g)},destroy:function(){var g=this,h=c.get("menu_"+g.id);if(g.keyboardNav){g.keyboardNav.destroy()}a.remove(h,"mouseover",g.mouseOverFunc);a.remove(c.select("a",h),"focus",g.mouseOverFunc);a.remove(h,"click",g.mouseClickFunc);a.remove(h,"keydown",g._keyHandler);if(g.element){g.element.remove()}c.remove(h)},renderNode:function(){var i=this,j=i.settings,l,h,k,g;g=c.create("div",{role:"listbox",id:"menu_"+i.id,"class":j["class"],style:"position:absolute;left:0;top:0;z-index:200000;outline:0"});if(i.settings.parent){c.setAttrib(g,"aria-parent","menu_"+i.settings.parent.id)}k=c.add(g,"div",{role:"presentation",id:"menu_"+i.id+"_co","class":i.classPrefix+(j["class"]?" "+j["class"]:"")});i.element=new b("menu_"+i.id,{blocker:1,container:j.container});if(j.menu_line){c.add(k,"span",{"class":i.classPrefix+"Line"})}l=c.add(k,"table",{role:"presentation",id:"menu_"+i.id+"_tbl",border:0,cellPadding:0,cellSpacing:0});h=c.add(l,"tbody");f(i.items,function(m){i._add(h,m)});i.rendered=true;return g},_setupKeyboardNav:function(){var i,h,g=this;i=c.get("menu_"+g.id);h=c.select("a[role=option]","menu_"+g.id);h.splice(0,0,i);g.keyboardNav=new e.ui.KeyboardNavigation({root:"menu_"+g.id,items:h,onCancel:function(){g.hideMenu()},enableUpDown:true});i.focus()},_keyHandler:function(g){var h=this,i;switch(g.keyCode){case 37:if(h.settings.parent){h.hideMenu();h.settings.parent.focus();a.cancel(g)}break;case 39:if(h.mouseOverFunc){h.mouseOverFunc(g)}break}},_add:function(j,h){var i,q=h.settings,p,l,k,m=this.classPrefix,g;if(q.separator){l=c.add(j,"tr",{id:h.id,"class":m+"ItemSeparator"});c.add(l,"td",{"class":m+"ItemSeparator"});if(i=l.previousSibling){c.addClass(i,"mceLast")}return}i=l=c.add(j,"tr",{id:h.id,"class":m+"Item "+m+"ItemEnabled"});i=k=c.add(i,q.titleItem?"th":"td");i=p=c.add(i,"a",{id:h.id+"_aria",role:q.titleItem?"presentation":"option",href:"javascript:;",onclick:"return false;",onmousedown:"return false;"});if(q.parent){c.setAttrib(p,"aria-haspopup","true");c.setAttrib(p,"aria-owns","menu_"+h.id)}c.addClass(k,q["class"]);g=c.add(i,"span",{"class":"mceIcon"+(q.icon?" mce_"+q.icon:"")});if(q.icon_src){c.add(g,"img",{src:q.icon_src})}i=c.add(i,q.element||"span",{"class":"mceText",title:h.settings.title},h.settings.title);if(h.settings.style){if(typeof h.settings.style=="function"){h.settings.style=h.settings.style()}c.setAttrib(i,"style",h.settings.style)}if(j.childNodes.length==1){c.addClass(l,"mceFirst")}if((i=l.previousSibling)&&c.hasClass(i,m+"ItemSeparator")){c.addClass(l,"mceFirst")}if(h.collapse){c.addClass(l,m+"ItemSub")}if(i=l.previousSibling){c.removeClass(i,"mceLast")}c.addClass(l,"mceLast")}})})(tinymce);(function(b){var a=b.DOM;b.create("tinymce.ui.Button:tinymce.ui.Control",{Button:function(e,d,c){this.parent(e,d,c);this.classPrefix="mceButton"},renderHTML:function(){var f=this.classPrefix,e=this.settings,d,c;c=a.encode(e.label||"");d='<a role="button" id="'+this.id+'" href="javascript:;" class="'+f+" "+f+"Enabled "+e["class"]+(c?" "+f+"Labeled":"")+'" onmousedown="return false;" onclick="return false;" aria-labelledby="'+this.id+'_voice" title="'+a.encode(e.title)+'">';if(e.image&&!(this.editor&&this.editor.forcedHighContrastMode)){d+='<span class="mceIcon '+e["class"]+'"><img class="mceIcon" src="'+e.image+'" alt="'+a.encode(e.title)+'" /></span>'+(c?'<span class="'+f+'Label">'+c+"</span>":"")}else{d+='<span class="mceIcon '+e["class"]+'"></span>'+(c?'<span class="'+f+'Label">'+c+"</span>":"")}d+='<span class="mceVoiceLabel mceIconOnly" style="display: none;" id="'+this.id+'_voice">'+e.title+"</span>";d+="</a>";return d},postRender:function(){var d=this,e=d.settings,c;if(b.isIE&&d.editor){b.dom.Event.add(d.id,"mousedown",function(f){var g=d.editor.selection.getNode().nodeName;c=g==="IMG"?d.editor.selection.getBookmark():null})}b.dom.Event.add(d.id,"click",function(f){if(!d.isDisabled()){if(b.isIE&&d.editor&&c!==null){d.editor.selection.moveToBookmark(c)}return e.onclick.call(e.scope,f)}});b.dom.Event.add(d.id,"keyup",function(f){if(!d.isDisabled()&&f.keyCode==b.VK.SPACEBAR){return e.onclick.call(e.scope,f)}})}})})(tinymce);(function(e){var d=e.DOM,b=e.dom.Event,f=e.each,a=e.util.Dispatcher,c;e.create("tinymce.ui.ListBox:tinymce.ui.Control",{ListBox:function(j,i,g){var h=this;h.parent(j,i,g);h.items=[];h.onChange=new a(h);h.onPostRender=new a(h);h.onAdd=new a(h);h.onRenderMenu=new e.util.Dispatcher(this);h.classPrefix="mceListBox";h.marked={}},select:function(h){var g=this,j,i;g.marked={};if(h==c){return g.selectByIndex(-1)}if(h&&typeof(h)=="function"){i=h}else{i=function(k){return k==h}}if(h!=g.selectedValue){f(g.items,function(l,k){if(i(l.value)){j=1;g.selectByIndex(k);return false}});if(!j){g.selectByIndex(-1)}}},selectByIndex:function(g){var i=this,j,k,h;i.marked={};if(g!=i.selectedIndex){j=d.get(i.id+"_text");h=d.get(i.id+"_voiceDesc");k=i.items[g];if(k){i.selectedValue=k.value;i.selectedIndex=g;d.setHTML(j,d.encode(k.title));d.setHTML(h,i.settings.title+" - "+k.title);d.removeClass(j,"mceTitle");d.setAttrib(i.id,"aria-valuenow",k.title)}else{d.setHTML(j,d.encode(i.settings.title));d.setHTML(h,d.encode(i.settings.title));d.addClass(j,"mceTitle");i.selectedValue=i.selectedIndex=null;d.setAttrib(i.id,"aria-valuenow",i.settings.title)}j=0}},mark:function(g){this.marked[g]=true},add:function(j,g,i){var h=this;i=i||{};i=e.extend(i,{title:j,value:g});h.items.push(i);h.onAdd.dispatch(h,i)},getLength:function(){return this.items.length},renderHTML:function(){var j="",g=this,i=g.settings,k=g.classPrefix;j='<span role="listbox" aria-haspopup="true" aria-labelledby="'+g.id+'_voiceDesc" aria-describedby="'+g.id+'_voiceDesc"><table role="presentation" tabindex="0" id="'+g.id+'" cellpadding="0" cellspacing="0" class="'+k+" "+k+"Enabled"+(i["class"]?(" "+i["class"]):"")+'"><tbody><tr>';j+="<td>"+d.createHTML("span",{id:g.id+"_voiceDesc","class":"voiceLabel",style:"display:none;"},g.settings.title);j+=d.createHTML("a",{id:g.id+"_text",tabindex:-1,href:"javascript:;","class":"mceText",onclick:"return false;",onmousedown:"return false;"},d.encode(g.settings.title))+"</td>";j+="<td>"+d.createHTML("a",{id:g.id+"_open",tabindex:-1,href:"javascript:;","class":"mceOpen",onclick:"return false;",onmousedown:"return false;"},'<span><span style="display:none;" class="mceIconOnly" aria-hidden="true">\u25BC</span></span>')+"</td>";j+="</tr></tbody></table></span>";return j},showMenu:function(){var h=this,j,i=d.get(this.id),g;if(h.isDisabled()||h.items.length===0){return}if(h.menu&&h.menu.isMenuVisible){return h.hideMenu()}if(!h.isMenuRendered){h.renderMenu();h.isMenuRendered=true}j=d.getPos(i);g=h.menu;g.settings.offset_x=j.x;g.settings.offset_y=j.y;g.settings.keyboard_focus=!e.isOpera;f(h.items,function(k){if(g.items[k.id]){g.items[k.id].setSelected(0)}});f(h.items,function(k){if(g.items[k.id]&&h.marked[k.value]){g.items[k.id].setSelected(1)}if(k.value===h.selectedValue){g.items[k.id].setSelected(1)}});g.showMenu(0,i.clientHeight);b.add(d.doc,"mousedown",h.hideMenu,h);d.addClass(h.id,h.classPrefix+"Selected")},hideMenu:function(h){var g=this;if(g.menu&&g.menu.isMenuVisible){d.removeClass(g.id,g.classPrefix+"Selected");if(h&&h.type=="mousedown"&&(h.target.id==g.id+"_text"||h.target.id==g.id+"_open")){return}if(!h||!d.getParent(h.target,".mceMenu")){d.removeClass(g.id,g.classPrefix+"Selected");b.remove(d.doc,"mousedown",g.hideMenu,g);g.menu.hideMenu()}}},renderMenu:function(){var h=this,g;g=h.settings.control_manager.createDropMenu(h.id+"_menu",{menu_line:1,"class":h.classPrefix+"Menu mceNoIcons",max_width:250,max_height:150});g.onHideMenu.add(function(){h.hideMenu();h.focus()});g.add({title:h.settings.title,"class":"mceMenuItemTitle",onclick:function(){if(h.settings.onselect("")!==false){h.select("")}}});f(h.items,function(i){if(i.value===c){g.add({title:i.title,role:"option","class":"mceMenuItemTitle",onclick:function(){if(h.settings.onselect("")!==false){h.select("")}}})}else{i.id=d.uniqueId();i.role="option";i.onclick=function(){if(h.settings.onselect(i.value)!==false){h.select(i.value)}};g.add(i)}});h.onRenderMenu.dispatch(h,g);h.menu=g},postRender:function(){var g=this,h=g.classPrefix;b.add(g.id,"click",g.showMenu,g);b.add(g.id,"keydown",function(i){if(i.keyCode==32){g.showMenu(i);b.cancel(i)}});b.add(g.id,"focus",function(){if(!g._focused){g.keyDownHandler=b.add(g.id,"keydown",function(i){if(i.keyCode==40){g.showMenu();b.cancel(i)}});g.keyPressHandler=b.add(g.id,"keypress",function(j){var i;if(j.keyCode==13){i=g.selectedValue;g.selectedValue=null;b.cancel(j);g.settings.onselect(i)}})}g._focused=1});b.add(g.id,"blur",function(){b.remove(g.id,"keydown",g.keyDownHandler);b.remove(g.id,"keypress",g.keyPressHandler);g._focused=0});if(e.isIE6||!d.boxModel){b.add(g.id,"mouseover",function(){if(!d.hasClass(g.id,h+"Disabled")){d.addClass(g.id,h+"Hover")}});b.add(g.id,"mouseout",function(){if(!d.hasClass(g.id,h+"Disabled")){d.removeClass(g.id,h+"Hover")}})}g.onPostRender.dispatch(g,d.get(g.id))},destroy:function(){this.parent();b.clear(this.id+"_text");b.clear(this.id+"_open")}})})(tinymce);(function(e){var d=e.DOM,b=e.dom.Event,f=e.each,a=e.util.Dispatcher,c;e.create("tinymce.ui.NativeListBox:tinymce.ui.ListBox",{NativeListBox:function(h,g){this.parent(h,g);this.classPrefix="mceNativeListBox"},setDisabled:function(g){d.get(this.id).disabled=g;this.setAriaProperty("disabled",g)},isDisabled:function(){return d.get(this.id).disabled},select:function(h){var g=this,j,i;if(h==c){return g.selectByIndex(-1)}if(h&&typeof(h)=="function"){i=h}else{i=function(k){return k==h}}if(h!=g.selectedValue){f(g.items,function(l,k){if(i(l.value)){j=1;g.selectByIndex(k);return false}});if(!j){g.selectByIndex(-1)}}},selectByIndex:function(g){d.get(this.id).selectedIndex=g+1;this.selectedValue=this.items[g]?this.items[g].value:null},add:function(k,h,g){var j,i=this;g=g||{};g.value=h;if(i.isRendered()){d.add(d.get(this.id),"option",g,k)}j={title:k,value:h,attribs:g};i.items.push(j);i.onAdd.dispatch(i,j)},getLength:function(){return this.items.length},renderHTML:function(){var i,g=this;i=d.createHTML("option",{value:""},"-- "+g.settings.title+" --");f(g.items,function(h){i+=d.createHTML("option",{value:h.value},h.title)});i=d.createHTML("select",{id:g.id,"class":"mceNativeListBox","aria-labelledby":g.id+"_aria"},i);i+=d.createHTML("span",{id:g.id+"_aria",style:"display: none"},g.settings.title);return i},postRender:function(){var h=this,i,j=true;h.rendered=true;function g(l){var k=h.items[l.target.selectedIndex-1];if(k&&(k=k.value)){h.onChange.dispatch(h,k);if(h.settings.onselect){h.settings.onselect(k)}}}b.add(h.id,"change",g);b.add(h.id,"keydown",function(l){var k;b.remove(h.id,"change",i);j=false;k=b.add(h.id,"blur",function(){if(j){return}j=true;b.add(h.id,"change",g);b.remove(h.id,"blur",k)});if(e.isWebKit&&(l.keyCode==37||l.keyCode==39)){return b.prevent(l)}if(l.keyCode==13||l.keyCode==32){g(l);return b.cancel(l)}});h.onPostRender.dispatch(h,d.get(h.id))}})})(tinymce);(function(c){var b=c.DOM,a=c.dom.Event,d=c.each;c.create("tinymce.ui.MenuButton:tinymce.ui.Button",{MenuButton:function(g,f,e){this.parent(g,f,e);this.onRenderMenu=new c.util.Dispatcher(this);f.menu_container=f.menu_container||b.doc.body},showMenu:function(){var g=this,j,i,h=b.get(g.id),f;if(g.isDisabled()){return}if(!g.isMenuRendered){g.renderMenu();g.isMenuRendered=true}if(g.isMenuVisible){return g.hideMenu()}j=b.getPos(g.settings.menu_container);i=b.getPos(h);f=g.menu;f.settings.offset_x=i.x;f.settings.offset_y=i.y;f.settings.vp_offset_x=i.x;f.settings.vp_offset_y=i.y;f.settings.keyboard_focus=g._focused;f.showMenu(0,h.firstChild.clientHeight);a.add(b.doc,"mousedown",g.hideMenu,g);g.setState("Selected",1);g.isMenuVisible=1},renderMenu:function(){var f=this,e;e=f.settings.control_manager.createDropMenu(f.id+"_menu",{menu_line:1,"class":this.classPrefix+"Menu",icons:f.settings.icons});e.onHideMenu.add(function(){f.hideMenu();f.focus()});f.onRenderMenu.dispatch(f,e);f.menu=e},hideMenu:function(g){var f=this;if(g&&g.type=="mousedown"&&b.getParent(g.target,function(h){return h.id===f.id||h.id===f.id+"_open"})){return}if(!g||!b.getParent(g.target,".mceMenu")){f.setState("Selected",0);a.remove(b.doc,"mousedown",f.hideMenu,f);if(f.menu){f.menu.hideMenu()}}f.isMenuVisible=0},postRender:function(){var e=this,f=e.settings;a.add(e.id,"click",function(){if(!e.isDisabled()){if(f.onclick){f.onclick(e.value)}e.showMenu()}})}})})(tinymce);(function(c){var b=c.DOM,a=c.dom.Event,d=c.each;c.create("tinymce.ui.SplitButton:tinymce.ui.MenuButton",{SplitButton:function(g,f,e){this.parent(g,f,e);this.classPrefix="mceSplitButton"},renderHTML:function(){var i,f=this,g=f.settings,e;i="<tbody><tr>";if(g.image){e=b.createHTML("img ",{src:g.image,role:"presentation","class":"mceAction "+g["class"]})}else{e=b.createHTML("span",{"class":"mceAction "+g["class"]},"")}e+=b.createHTML("span",{"class":"mceVoiceLabel mceIconOnly",id:f.id+"_voice",style:"display:none;"},g.title);i+="<td >"+b.createHTML("a",{role:"button",id:f.id+"_action",tabindex:"-1",href:"javascript:;","class":"mceAction "+g["class"],onclick:"return false;",onmousedown:"return false;",title:g.title},e)+"</td>";e=b.createHTML("span",{"class":"mceOpen "+g["class"]},'<span style="display:none;" class="mceIconOnly" aria-hidden="true">\u25BC</span>');i+="<td >"+b.createHTML("a",{role:"button",id:f.id+"_open",tabindex:"-1",href:"javascript:;","class":"mceOpen "+g["class"],onclick:"return false;",onmousedown:"return false;",title:g.title},e)+"</td>";i+="</tr></tbody>";i=b.createHTML("table",{role:"presentation","class":"mceSplitButton mceSplitButtonEnabled "+g["class"],cellpadding:"0",cellspacing:"0",title:g.title},i);return b.createHTML("div",{id:f.id,role:"button",tabindex:"0","aria-labelledby":f.id+"_voice","aria-haspopup":"true"},i)},postRender:function(){var e=this,g=e.settings,f;if(g.onclick){f=function(h){if(!e.isDisabled()){g.onclick(e.value);a.cancel(h)}};a.add(e.id+"_action","click",f);a.add(e.id,["click","keydown"],function(h){var k=32,m=14,i=13,j=38,l=40;if((h.keyCode===32||h.keyCode===13||h.keyCode===14)&&!h.altKey&&!h.ctrlKey&&!h.metaKey){f();a.cancel(h)}else{if(h.type==="click"||h.keyCode===l){e.showMenu();a.cancel(h)}}})}a.add(e.id+"_open","click",function(h){e.showMenu();a.cancel(h)});a.add([e.id,e.id+"_open"],"focus",function(){e._focused=1});a.add([e.id,e.id+"_open"],"blur",function(){e._focused=0});if(c.isIE6||!b.boxModel){a.add(e.id,"mouseover",function(){if(!b.hasClass(e.id,"mceSplitButtonDisabled")){b.addClass(e.id,"mceSplitButtonHover")}});a.add(e.id,"mouseout",function(){if(!b.hasClass(e.id,"mceSplitButtonDisabled")){b.removeClass(e.id,"mceSplitButtonHover")}})}},destroy:function(){this.parent();a.clear(this.id+"_action");a.clear(this.id+"_open");a.clear(this.id)}})})(tinymce);(function(d){var c=d.DOM,a=d.dom.Event,b=d.is,e=d.each;d.create("tinymce.ui.ColorSplitButton:tinymce.ui.SplitButton",{ColorSplitButton:function(i,h,f){var g=this;g.parent(i,h,f);g.settings=h=d.extend({colors:"000000,993300,333300,003300,003366,000080,333399,333333,800000,FF6600,808000,008000,008080,0000FF,666699,808080,FF0000,FF9900,99CC00,339966,33CCCC,3366FF,800080,999999,FF00FF,FFCC00,FFFF00,00FF00,00FFFF,00CCFF,993366,C0C0C0,FF99CC,FFCC99,FFFF99,CCFFCC,CCFFFF,99CCFF,CC99FF,FFFFFF",grid_width:8,default_color:"#888888"},g.settings);g.onShowMenu=new d.util.Dispatcher(g);g.onHideMenu=new d.util.Dispatcher(g);g.value=h.default_color},showMenu:function(){var f=this,g,j,i,h;if(f.isDisabled()){return}if(!f.isMenuRendered){f.renderMenu();f.isMenuRendered=true}if(f.isMenuVisible){return f.hideMenu()}i=c.get(f.id);c.show(f.id+"_menu");c.addClass(i,"mceSplitButtonSelected");h=c.getPos(i);c.setStyles(f.id+"_menu",{left:h.x,top:h.y+i.firstChild.clientHeight,zIndex:200000});i=0;a.add(c.doc,"mousedown",f.hideMenu,f);f.onShowMenu.dispatch(f);if(f._focused){f._keyHandler=a.add(f.id+"_menu","keydown",function(k){if(k.keyCode==27){f.hideMenu()}});c.select("a",f.id+"_menu")[0].focus()}f.keyboardNav=new d.ui.KeyboardNavigation({root:f.id+"_menu",items:c.select("a",f.id+"_menu"),onCancel:function(){f.hideMenu();f.focus()}});f.keyboardNav.focus();f.isMenuVisible=1},hideMenu:function(g){var f=this;if(f.isMenuVisible){if(g&&g.type=="mousedown"&&c.getParent(g.target,function(h){return h.id===f.id+"_open"})){return}if(!g||!c.getParent(g.target,".mceSplitButtonMenu")){c.removeClass(f.id,"mceSplitButtonSelected");a.remove(c.doc,"mousedown",f.hideMenu,f);a.remove(f.id+"_menu","keydown",f._keyHandler);c.hide(f.id+"_menu")}f.isMenuVisible=0;f.onHideMenu.dispatch();f.keyboardNav.destroy()}},renderMenu:function(){var p=this,h,k=0,q=p.settings,g,j,l,o,f;o=c.add(q.menu_container,"div",{role:"listbox",id:p.id+"_menu","class":q.menu_class+" "+q["class"],style:"position:absolute;left:0;top:-1000px;"});h=c.add(o,"div",{"class":q["class"]+" mceSplitButtonMenu"});c.add(h,"span",{"class":"mceMenuLine"});g=c.add(h,"table",{role:"presentation","class":"mceColorSplitMenu"});j=c.add(g,"tbody");k=0;e(b(q.colors,"array")?q.colors:q.colors.split(","),function(m){m=m.replace(/^#/,"");if(!k--){l=c.add(j,"tr");k=q.grid_width-1}g=c.add(l,"td");var i={href:"javascript:;",style:{backgroundColor:"#"+m},title:p.editor.getLang("colors."+m,m),"data-mce-color":"#"+m};if(!d.isIE){i.role="option"}g=c.add(g,"a",i);if(p.editor.forcedHighContrastMode){g=c.add(g,"canvas",{width:16,height:16,"aria-hidden":"true"});if(g.getContext&&(f=g.getContext("2d"))){f.fillStyle="#"+m;f.fillRect(0,0,16,16)}else{c.remove(g)}}});if(q.more_colors_func){g=c.add(j,"tr");g=c.add(g,"td",{colspan:q.grid_width,"class":"mceMoreColors"});g=c.add(g,"a",{role:"option",id:p.id+"_more",href:"javascript:;",onclick:"return false;","class":"mceMoreColors"},q.more_colors_title);a.add(g,"click",function(i){q.more_colors_func.call(q.more_colors_scope||this);return a.cancel(i)})}c.addClass(h,"mceColorSplitMenu");a.add(p.id+"_menu","mousedown",function(i){return a.cancel(i)});a.add(p.id+"_menu","click",function(i){var m;i=c.getParent(i.target,"a",j);if(i&&i.nodeName.toLowerCase()=="a"&&(m=i.getAttribute("data-mce-color"))){p.setColor(m)}return false});return o},setColor:function(f){this.displayColor(f);this.hideMenu();this.settings.onselect(f)},displayColor:function(g){var f=this;c.setStyle(f.id+"_preview","backgroundColor",g);f.value=g},postRender:function(){var f=this,g=f.id;f.parent();c.add(g+"_action","div",{id:g+"_preview","class":"mceColorPreview"});c.setStyle(f.id+"_preview","backgroundColor",f.value)},destroy:function(){var f=this;f.parent();a.clear(f.id+"_menu");a.clear(f.id+"_more");c.remove(f.id+"_menu");if(f.keyboardNav){f.keyboardNav.destroy()}}})})(tinymce);(function(b){var d=b.DOM,c=b.each,a=b.dom.Event;b.create("tinymce.ui.ToolbarGroup:tinymce.ui.Container",{renderHTML:function(){var f=this,i=[],e=f.controls,j=b.each,g=f.settings;i.push('<div id="'+f.id+'" role="group" aria-labelledby="'+f.id+'_voice">');i.push("<span role='application'>");i.push('<span id="'+f.id+'_voice" class="mceVoiceLabel" style="display:none;">'+d.encode(g.name)+"</span>");j(e,function(h){i.push(h.renderHTML())});i.push("</span>");i.push("</div>");return i.join("")},focus:function(){var e=this;d.get(e.id).focus()},postRender:function(){var f=this,e=[];c(f.controls,function(g){c(g.controls,function(h){if(h.id){e.push(h)}})});f.keyNav=new b.ui.KeyboardNavigation({root:f.id,items:e,onCancel:function(){if(b.isWebKit){d.get(f.editor.id+"_ifr").focus()}f.editor.focus()},excludeFromTabOrder:!f.settings.tab_focus_toolbar})},destroy:function(){var e=this;e.parent();e.keyNav.destroy();a.clear(e.id)}})})(tinymce);(function(a){var c=a.DOM,b=a.each;a.create("tinymce.ui.Toolbar:tinymce.ui.Container",{renderHTML:function(){var m=this,f="",j,k,n=m.settings,e,d,g,l;l=m.controls;for(e=0;e<l.length;e++){k=l[e];d=l[e-1];g=l[e+1];if(e===0){j="mceToolbarStart";if(k.Button){j+=" mceToolbarStartButton"}else{if(k.SplitButton){j+=" mceToolbarStartSplitButton"}else{if(k.ListBox){j+=" mceToolbarStartListBox"}}}f+=c.createHTML("td",{"class":j},c.createHTML("span",null,"<!-- IE -->"))}if(d&&k.ListBox){if(d.Button||d.SplitButton){f+=c.createHTML("td",{"class":"mceToolbarEnd"},c.createHTML("span",null,"<!-- IE -->"))}}if(c.stdMode){f+='<td style="position: relative">'+k.renderHTML()+"</td>"}else{f+="<td>"+k.renderHTML()+"</td>"}if(g&&k.ListBox){if(g.Button||g.SplitButton){f+=c.createHTML("td",{"class":"mceToolbarStart"},c.createHTML("span",null,"<!-- IE -->"))}}}j="mceToolbarEnd";if(k.Button){j+=" mceToolbarEndButton"}else{if(k.SplitButton){j+=" mceToolbarEndSplitButton"}else{if(k.ListBox){j+=" mceToolbarEndListBox"}}}f+=c.createHTML("td",{"class":j},c.createHTML("span",null,"<!-- IE -->"));return c.createHTML("table",{id:m.id,"class":"mceToolbar"+(n["class"]?" "+n["class"]:""),cellpadding:"0",cellspacing:"0",align:m.settings.align||"",role:"presentation",tabindex:"-1"},"<tbody><tr>"+f+"</tr></tbody>")}})})(tinymce);(function(b){var a=b.util.Dispatcher,c=b.each;b.create("tinymce.AddOnManager",{AddOnManager:function(){var d=this;d.items=[];d.urls={};d.lookup={};d.onAdd=new a(d)},get:function(d){if(this.lookup[d]){return this.lookup[d].instance}else{return undefined}},dependencies:function(e){var d;if(this.lookup[e]){d=this.lookup[e].dependencies}return d||[]},requireLangPack:function(e){var d=b.settings;if(d&&d.language&&d.language_load!==false){b.ScriptLoader.add(this.urls[e]+"/langs/"+d.language+".js")}},add:function(f,e,d){this.items.push(e);this.lookup[f]={instance:e,dependencies:d};this.onAdd.dispatch(this,f,e);return e},createUrl:function(d,e){if(typeof e==="object"){return e}else{return{prefix:d.prefix,resource:e,suffix:d.suffix}}},addComponents:function(f,d){var e=this.urls[f];b.each(d,function(g){b.ScriptLoader.add(e+"/"+g)})},load:function(j,f,d,h){var g=this,e=f;function i(){var k=g.dependencies(j);b.each(k,function(m){var l=g.createUrl(f,m);g.load(l.resource,l,undefined,undefined)});if(d){if(h){d.call(h)}else{d.call(b.ScriptLoader)}}}if(g.urls[j]){return}if(typeof f==="object"){e=f.prefix+f.resource+f.suffix}if(e.indexOf("/")!==0&&e.indexOf("://")==-1){e=b.baseURL+"/"+e}g.urls[j]=e.substring(0,e.lastIndexOf("/"));if(g.lookup[j]){i()}else{b.ScriptLoader.add(e,i,h)}}});b.PluginManager=new b.AddOnManager();b.ThemeManager=new b.AddOnManager()}(tinymce));(function(j){var g=j.each,d=j.extend,k=j.DOM,i=j.dom.Event,f=j.ThemeManager,b=j.PluginManager,e=j.explode,h=j.util.Dispatcher,a,c=0;j.documentBaseURL=window.location.href.replace(/[\?#].*$/,"").replace(/[\/\\][^\/]+$/,"");if(!/[\/\\]$/.test(j.documentBaseURL)){j.documentBaseURL+="/"}j.baseURL=new j.util.URI(j.documentBaseURL).toAbsolute(j.baseURL);j.baseURI=new j.util.URI(j.baseURL);j.onBeforeUnload=new h(j);i.add(window,"beforeunload",function(l){j.onBeforeUnload.dispatch(j,l)});j.onAddEditor=new h(j);j.onRemoveEditor=new h(j);j.EditorManager=d(j,{editors:[],i18n:{},activeEditor:null,init:function(x){var v=this,o,n=j.ScriptLoader,u,l=[],r;function q(t){var s=t.id;if(!s){s=t.name;if(s&&!k.get(s)){s=t.name}else{s=k.uniqueId()}t.setAttribute("id",s)}return s}function m(z,A,t){var y=z[A];if(!y){return}if(j.is(y,"string")){t=y.replace(/\.\w+$/,"");t=t?j.resolve(t):0;y=j.resolve(y)}return y.apply(t||this,Array.prototype.slice.call(arguments,2))}function p(t,s){return s.constructor===RegExp?s.test(t.className):k.hasClass(t,s)}v.settings=x;i.bind(window,"ready",function(){var s,t;m(x,"onpageload");switch(x.mode){case"exact":s=x.elements||"";if(s.length>0){g(e(s),function(y){if(k.get(y)){r=new j.Editor(y,x);l.push(r);r.render(1)}else{g(document.forms,function(z){g(z.elements,function(A){if(A.name===y){y="mce_editor_"+c++;k.setAttrib(A,"id",y);r=new j.Editor(y,x);l.push(r);r.render(1)}})})}})}break;case"textareas":case"specific_textareas":g(k.select("textarea"),function(y){if(x.editor_deselector&&p(y,x.editor_deselector)){return}if(!x.editor_selector||p(y,x.editor_selector)){r=new j.Editor(q(y),x);l.push(r);r.render(1)}});break;default:if(x.types){g(x.types,function(y){g(k.select(y.selector),function(A){var z=new j.Editor(q(A),j.extend({},x,y));l.push(z);z.render(1)})})}else{if(x.selector){g(k.select(x.selector),function(z){var y=new j.Editor(q(z),x);l.push(y);y.render(1)})}}}if(x.oninit){s=t=0;g(l,function(y){t++;if(!y.initialized){y.onInit.add(function(){s++;if(s==t){m(x,"oninit")}})}else{s++}if(s==t){m(x,"oninit")}})}})},get:function(l){if(l===a){return this.editors}if(!this.editors.hasOwnProperty(l)){return a}return this.editors[l]},getInstanceById:function(l){return this.get(l)},add:function(m){var l=this,n=l.editors;n[m.id]=m;n.push(m);l._setActive(m);l.onAddEditor.dispatch(l,m);return m},remove:function(n){var m=this,l,o=m.editors;if(!o[n.id]){return null}delete o[n.id];for(l=0;l<o.length;l++){if(o[l]==n){o.splice(l,1);break}}if(m.activeEditor==n){m._setActive(o[0])}n.destroy();m.onRemoveEditor.dispatch(m,n);return n},execCommand:function(r,p,o){var q=this,n=q.get(o),l;function m(){n.destroy();l.detachEvent("onunload",m);l=l.tinyMCE=l.tinymce=null}switch(r){case"mceFocus":n.focus();return true;case"mceAddEditor":case"mceAddControl":if(!q.get(o)){new j.Editor(o,q.settings).render()}return true;case"mceAddFrameControl":l=o.window;l.tinyMCE=tinyMCE;l.tinymce=j;j.DOM.doc=l.document;j.DOM.win=l;n=new j.Editor(o.element_id,o);n.render();if(j.isIE){l.attachEvent("onunload",m)}o.page_window=null;return true;case"mceRemoveEditor":case"mceRemoveControl":if(n){n.remove()}return true;case"mceToggleEditor":if(!n){q.execCommand("mceAddControl",0,o);return true}if(n.isHidden()){n.show()}else{n.hide()}return true}if(q.activeEditor){return q.activeEditor.execCommand(r,p,o)}return false},execInstanceCommand:function(p,o,n,m){var l=this.get(p);if(l){return l.execCommand(o,n,m)}return false},triggerSave:function(){g(this.editors,function(l){l.save()})},addI18n:function(n,q){var l,m=this.i18n;if(!j.is(n,"string")){g(n,function(r,p){g(r,function(t,s){g(t,function(v,u){if(s==="common"){m[p+"."+u]=v}else{m[p+"."+s+"."+u]=v}})})})}else{g(q,function(r,p){m[n+"."+p]=r})}},_setActive:function(l){this.selectedInstance=this.activeEditor=l}})})(tinymce);(function(k){var l=k.DOM,j=k.dom.Event,f=k.extend,i=k.each,a=k.isGecko,b=k.isIE,e=k.isWebKit,d=k.is,h=k.ThemeManager,c=k.PluginManager,g=k.explode;k.create("tinymce.Editor",{Editor:function(p,o){var m=this,n=true;m.settings=o=f({id:p,language:"en",theme:"advanced",skin:"default",delta_width:0,delta_height:0,popup_css:"",plugins:"",document_base_url:k.documentBaseURL,add_form_submit_trigger:n,submit_patch:n,add_unload_trigger:n,convert_urls:n,relative_urls:n,remove_script_host:n,table_inline_editing:false,object_resizing:n,accessibility_focus:n,doctype:k.isIE6?'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">':"<!DOCTYPE>",visual:n,font_size_style_values:"xx-small,x-small,small,medium,large,x-large,xx-large",font_size_legacy_values:"xx-small,small,medium,large,x-large,xx-large,300%",apply_source_formatting:n,directionality:"ltr",forced_root_block:"p",hidden_input:n,padd_empty_editor:n,render_ui:n,indentation:"30px",fix_table_elements:n,inline_styles:n,convert_fonts_to_spans:n,indent:"simple",indent_before:"p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,ul,li,area,table,thead,tfoot,tbody,tr,section,article,hgroup,aside,figure,option,optgroup,datalist",indent_after:"p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,ul,li,area,table,thead,tfoot,tbody,tr,section,article,hgroup,aside,figure,option,optgroup,datalist",validate:n,entity_encoding:"named",url_converter:m.convertURL,url_converter_scope:m,ie7_compat:n},o);m.id=m.editorId=p;m.isNotDirty=false;m.plugins={};m.documentBaseURI=new k.util.URI(o.document_base_url||k.documentBaseURL,{base_uri:tinyMCE.baseURI});m.baseURI=k.baseURI;m.contentCSS=[];m.contentStyles=[];m.setupEvents();m.execCommands={};m.queryStateCommands={};m.queryValueCommands={};m.execCallback("setup",m)},render:function(o){var p=this,q=p.settings,r=p.id,m=k.ScriptLoader;if(!j.domLoaded){j.add(window,"ready",function(){p.render()});return}tinyMCE.settings=q;if(!p.getElement()){return}if(k.isIDevice&&!k.isIOS5){return}if(!/TEXTAREA|INPUT/i.test(p.getElement().nodeName)&&q.hidden_input&&l.getParent(r,"form")){l.insertAfter(l.create("input",{type:"hidden",name:r}),r)}if(!q.content_editable){p.orgVisibility=p.getElement().style.visibility;p.getElement().style.visibility="hidden"}if(k.WindowManager){p.windowManager=new k.WindowManager(p)}if(q.encoding=="xml"){p.onGetContent.add(function(s,t){if(t.save){t.content=l.encode(t.content)}})}if(q.add_form_submit_trigger){p.onSubmit.addToTop(function(){if(p.initialized){p.save();p.isNotDirty=1}})}if(q.add_unload_trigger){p._beforeUnload=tinyMCE.onBeforeUnload.add(function(){if(p.initialized&&!p.destroyed&&!p.isHidden()){p.save({format:"raw",no_events:true})}})}k.addUnload(p.destroy,p);if(q.submit_patch){p.onBeforeRenderUI.add(function(){var s=p.getElement().form;if(!s){return}if(s._mceOldSubmit){return}if(!s.submit.nodeType&&!s.submit.length){p.formElement=s;s._mceOldSubmit=s.submit;s.submit=function(){k.triggerSave();p.isNotDirty=1;return p.formElement._mceOldSubmit(p.formElement)}}s=null})}function n(){if(q.language&&q.language_load!==false){m.add(k.baseURL+"/langs/"+q.language+".js")}if(q.theme&&typeof q.theme!="function"&&q.theme.charAt(0)!="-"&&!h.urls[q.theme]){h.load(q.theme,"themes/"+q.theme+"/editor_template"+k.suffix+".js")}i(g(q.plugins),function(t){if(t&&!c.urls[t]){if(t.charAt(0)=="-"){t=t.substr(1,t.length);var s=c.dependencies(t);i(s,function(v){var u={prefix:"plugins/",resource:v,suffix:"/editor_plugin"+k.suffix+".js"};v=c.createUrl(u,v);c.load(v.resource,v)})}else{if(t=="safari"){return}c.load(t,{prefix:"plugins/",resource:t,suffix:"/editor_plugin"+k.suffix+".js"})}}});m.loadQueue(function(){if(!p.removed){p.init()}})}n()},init:function(){var q,G=this,H=G.settings,D,y,z,C=G.getElement(),p,m,E,v,B,F,x,r=[];k.add(G);H.aria_label=H.aria_label||l.getAttrib(C,"aria-label",G.getLang("aria.rich_text_area"));if(H.theme){if(typeof H.theme!="function"){H.theme=H.theme.replace(/-/,"");p=h.get(H.theme);G.theme=new p();if(G.theme.init){G.theme.init(G,h.urls[H.theme]||k.documentBaseURL.replace(/\/$/,""))}}else{G.theme=H.theme}}function A(s){var t=c.get(s),o=c.urls[s]||k.documentBaseURL.replace(/\/$/,""),n;if(t&&k.inArray(r,s)===-1){i(c.dependencies(s),function(u){A(u)});n=new t(G,o);G.plugins[s]=n;if(n.init){n.init(G,o);r.push(s)}}}i(g(H.plugins.replace(/\-/g,"")),A);if(H.popup_css!==false){if(H.popup_css){H.popup_css=G.documentBaseURI.toAbsolute(H.popup_css)}else{H.popup_css=G.baseURI.toAbsolute("themes/"+H.theme+"/skins/"+H.skin+"/dialog.css")}}if(H.popup_css_add){H.popup_css+=","+G.documentBaseURI.toAbsolute(H.popup_css_add)}G.controlManager=new k.ControlManager(G);G.onBeforeRenderUI.dispatch(G,G.controlManager);if(H.render_ui&&G.theme){G.orgDisplay=C.style.display;if(typeof H.theme!="function"){D=H.width||C.style.width||C.offsetWidth;y=H.height||C.style.height||C.offsetHeight;z=H.min_height||100;F=/^[0-9\.]+(|px)$/i;if(F.test(""+D)){D=Math.max(parseInt(D,10)+(p.deltaWidth||0),100)}if(F.test(""+y)){y=Math.max(parseInt(y,10)+(p.deltaHeight||0),z)}p=G.theme.renderUI({targetNode:C,width:D,height:y,deltaWidth:H.delta_width,deltaHeight:H.delta_height});l.setStyles(p.sizeContainer||p.editorContainer,{width:D,height:y});y=(p.iframeHeight||y)+(typeof(y)=="number"?(p.deltaHeight||0):"");if(y<z){y=z}}else{p=H.theme(G,C);if(p.editorContainer.nodeType){p.editorContainer=p.editorContainer.id=p.editorContainer.id||G.id+"_parent"}if(p.iframeContainer.nodeType){p.iframeContainer=p.iframeContainer.id=p.iframeContainer.id||G.id+"_iframecontainer"}y=p.iframeHeight||C.offsetHeight;if(b){G.onInit.add(function(n){n.dom.bind(n.getBody(),"beforedeactivate keydown",function(){n.lastIERng=n.selection.getRng()})})}}G.editorContainer=p.editorContainer}if(H.content_css){i(g(H.content_css),function(n){G.contentCSS.push(G.documentBaseURI.toAbsolute(n))})}if(H.content_style){G.contentStyles.push(H.content_style)}if(H.content_editable){C=q=p=null;return G.initContentBody()}if(document.domain&&location.hostname!=document.domain){k.relaxedDomain=document.domain}G.iframeHTML=H.doctype+'<html><head xmlns="http://www.w3.org/1999/xhtml">';if(H.document_base_url!=k.documentBaseURL){G.iframeHTML+='<base href="'+G.documentBaseURI.getURI()+'" />'}if(k.isIE8){if(H.ie7_compat){G.iframeHTML+='<meta http-equiv="X-UA-Compatible" content="IE=7" />'}else{G.iframeHTML+='<meta http-equiv="X-UA-Compatible" content="IE=edge" />'}}G.iframeHTML+='<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';for(x=0;x<G.contentCSS.length;x++){G.iframeHTML+='<link type="text/css" rel="stylesheet" href="'+G.contentCSS[x]+'" />'}G.contentCSS=[];v=H.body_id||"tinymce";if(v.indexOf("=")!=-1){v=G.getParam("body_id","","hash");v=v[G.id]||v}B=H.body_class||"";if(B.indexOf("=")!=-1){B=G.getParam("body_class","","hash");B=B[G.id]||""}G.iframeHTML+='</head><body id="'+v+'" class="mceContentBody '+B+'" onload="window.parent.tinyMCE.get(\''+G.id+"').onLoad.dispatch();\"><br></body></html>";if(k.relaxedDomain&&(b||(k.isOpera&&parseFloat(opera.version())<11))){E='javascript:(function(){document.open();document.domain="'+document.domain+'";var ed = window.parent.tinyMCE.get("'+G.id+'");document.write(ed.iframeHTML);document.close();ed.initContentBody();})()'}q=l.add(p.iframeContainer,"iframe",{id:G.id+"_ifr",src:E||'javascript:""',frameBorder:"0",allowTransparency:"true",title:H.aria_label,style:{width:"100%",height:y,display:"block"}});G.contentAreaContainer=p.iframeContainer;if(p.editorContainer){l.get(p.editorContainer).style.display=G.orgDisplay}C.style.visibility=G.orgVisibility;l.get(G.id).style.display="none";l.setAttrib(G.id,"aria-hidden",true);if(!k.relaxedDomain||!E){G.initContentBody()}C=q=p=null},initContentBody:function(){var n=this,p=n.settings,q=l.get(n.id),r=n.getDoc(),o,m,s;if((!b||!k.relaxedDomain)&&!p.content_editable){r.open();r.write(n.iframeHTML);r.close();if(k.relaxedDomain){r.domain=k.relaxedDomain}}if(p.content_editable){l.addClass(q,"mceContentBody");n.contentDocument=r=p.content_document||document;n.contentWindow=p.content_window||window;n.bodyElement=q;p.content_document=p.content_window=null}m=n.getBody();m.disabled=true;if(!p.readonly){m.contentEditable=n.getParam("content_editable_state",true)}m.disabled=false;n.schema=new k.html.Schema(p);n.dom=new k.dom.DOMUtils(r,{keep_values:true,url_converter:n.convertURL,url_converter_scope:n,hex_colors:p.force_hex_style_colors,class_filter:p.class_filter,update_styles:true,root_element:p.content_editable?n.id:null,schema:n.schema});n.parser=new k.html.DomParser(p,n.schema);n.parser.addAttributeFilter("src,href,style",function(t,u){var v=t.length,y,A=n.dom,z,x;while(v--){y=t[v];z=y.attr(u);x="data-mce-"+u;if(!y.attributes.map[x]){if(u==="style"){y.attr(x,A.serializeStyle(A.parseStyle(z),y.name))}else{y.attr(x,n.convertURL(z,u,y.name))}}}});n.parser.addNodeFilter("script",function(t,u){var v=t.length,x;while(v--){x=t[v];x.attr("type","mce-"+(x.attr("type")||"text/javascript"))}});n.parser.addNodeFilter("#cdata",function(t,u){var v=t.length,x;while(v--){x=t[v];x.type=8;x.name="#comment";x.value="[CDATA["+x.value+"]]"}});n.parser.addNodeFilter("p,h1,h2,h3,h4,h5,h6,div",function(u,v){var x=u.length,y,t=n.schema.getNonEmptyElements();while(x--){y=u[x];if(y.isEmpty(t)){y.empty().append(new k.html.Node("br",1)).shortEnded=true}}});n.serializer=new k.dom.Serializer(p,n.dom,n.schema);n.selection=new k.dom.Selection(n.dom,n.getWin(),n.serializer,n);n.formatter=new k.Formatter(n);n.undoManager=new k.UndoManager(n);n.forceBlocks=new k.ForceBlocks(n);n.enterKey=new k.EnterKey(n);n.editorCommands=new k.EditorCommands(n);n.onExecCommand.add(function(t,u){if(!/^(FontName|FontSize)$/.test(u)){n.nodeChanged()}});n.serializer.onPreProcess.add(function(t,u){return n.onPreProcess.dispatch(n,u,t)});n.serializer.onPostProcess.add(function(t,u){return n.onPostProcess.dispatch(n,u,t)});n.onPreInit.dispatch(n);if(!p.browser_spellcheck&&!p.gecko_spellcheck){r.body.spellcheck=false}if(!p.readonly){n.bindNativeEvents()}n.controlManager.onPostRender.dispatch(n,n.controlManager);n.onPostRender.dispatch(n);n.quirks=k.util.Quirks(n);if(p.directionality){m.dir=p.directionality}if(p.nowrap){m.style.whiteSpace="nowrap"}if(p.protect){n.onBeforeSetContent.add(function(t,u){i(p.protect,function(v){u.content=u.content.replace(v,function(x){return"<!--mce:protected "+escape(x)+"-->"})})})}n.onSetContent.add(function(){n.addVisual(n.getBody())});if(p.padd_empty_editor){n.onPostProcess.add(function(t,u){u.content=u.content.replace(/^(<p[^>]*>(&nbsp;|&#160;|\s|\u00a0|)<\/p>[\r\n]*|<br \/>[\r\n]*)$/,"")})}n.load({initial:true,format:"html"});n.startContent=n.getContent({format:"raw"});n.initialized=true;n.onInit.dispatch(n);n.execCallback("setupcontent_callback",n.id,m,r);n.execCallback("init_instance_callback",n);n.focus(true);n.nodeChanged({initial:true});if(n.contentStyles.length>0){s="";i(n.contentStyles,function(t){s+=t+"\r\n"});n.dom.addStyle(s)}i(n.contentCSS,function(t){n.dom.loadCSS(t)});if(p.auto_focus){setTimeout(function(){var t=k.get(p.auto_focus);t.selection.select(t.getBody(),1);t.selection.collapse(1);t.getBody().focus();t.getWin().focus()},100)}q=r=m=null},focus:function(p){var o,u=this,t=u.selection,q=u.settings.content_editable,n,r,s=u.getDoc(),m;if(!p){if(u.lastIERng){t.setRng(u.lastIERng)}n=t.getRng();if(n.item){r=n.item(0)}u._refreshContentEditable();if(!q){u.getWin().focus()}if(k.isGecko||q){m=u.getBody();if(m.setActive){m.setActive()}else{m.focus()}if(q){t.normalize()}}if(r&&r.ownerDocument==s){n=s.body.createControlRange();n.addElement(r);n.select()}}if(k.activeEditor!=u){if((o=k.activeEditor)!=null){o.onDeactivate.dispatch(o,u)}u.onActivate.dispatch(u,o)}k._setActive(u)},execCallback:function(q){var m=this,p=m.settings[q],o;if(!p){return}if(m.callbackLookup&&(o=m.callbackLookup[q])){p=o.func;o=o.scope}if(d(p,"string")){o=p.replace(/\.\w+$/,"");o=o?k.resolve(o):0;p=k.resolve(p);m.callbackLookup=m.callbackLookup||{};m.callbackLookup[q]={func:p,scope:o}}return p.apply(o||m,Array.prototype.slice.call(arguments,1))},translate:function(m){var o=this.settings.language||"en",n=k.i18n;if(!m){return""}return n[o+"."+m]||m.replace(/\{\#([^\}]+)\}/g,function(q,p){return n[o+"."+p]||"{#"+p+"}"})},getLang:function(o,m){return k.i18n[(this.settings.language||"en")+"."+o]||(d(m)?m:"{#"+o+"}")},getParam:function(t,q,m){var r=k.trim,p=d(this.settings[t])?this.settings[t]:q,s;if(m==="hash"){s={};if(d(p,"string")){i(p.indexOf("=")>0?p.split(/[;,](?![^=;,]*(?:[;,]|$))/):p.split(","),function(n){n=n.split("=");if(n.length>1){s[r(n[0])]=r(n[1])}else{s[r(n[0])]=r(n)}})}else{s=p}return s}return p},nodeChanged:function(q){var m=this,n=m.selection,p;if(m.initialized){q=q||{};p=n.getStart()||m.getBody();p=b&&p.ownerDocument!=m.getDoc()?m.getBody():p;q.parents=[];m.dom.getParent(p,function(o){if(o.nodeName=="BODY"){return true}q.parents.push(o)});m.onNodeChange.dispatch(m,q?q.controlManager||m.controlManager:m.controlManager,p,n.isCollapsed(),q)}},addButton:function(n,o){var m=this;m.buttons=m.buttons||{};m.buttons[n]=o},addCommand:function(m,o,n){this.execCommands[m]={func:o,scope:n||this}},addQueryStateHandler:function(m,o,n){this.queryStateCommands[m]={func:o,scope:n||this}},addQueryValueHandler:function(m,o,n){this.queryValueCommands[m]={func:o,scope:n||this}},addShortcut:function(o,q,m,p){var n=this,r;if(n.settings.custom_shortcuts===false){return false}n.shortcuts=n.shortcuts||{};if(d(m,"string")){r=m;m=function(){n.execCommand(r,false,null)}}if(d(m,"object")){r=m;m=function(){n.execCommand(r[0],r[1],r[2])}}i(g(o),function(s){var t={func:m,scope:p||this,desc:n.translate(q),alt:false,ctrl:false,shift:false};i(g(s,"+"),function(u){switch(u){case"alt":case"ctrl":case"shift":t[u]=true;break;default:t.charCode=u.charCodeAt(0);t.keyCode=u.toUpperCase().charCodeAt(0)}});n.shortcuts[(t.ctrl?"ctrl":"")+","+(t.alt?"alt":"")+","+(t.shift?"shift":"")+","+t.keyCode]=t});return true},execCommand:function(u,r,x,m){var p=this,q=0,v,n;if(!/^(mceAddUndoLevel|mceEndUndoLevel|mceBeginUndoLevel|mceRepaint|SelectAll)$/.test(u)&&(!m||!m.skip_focus)){p.focus()}m=f({},m);p.onBeforeExecCommand.dispatch(p,u,r,x,m);if(m.terminate){return false}if(p.execCallback("execcommand_callback",p.id,p.selection.getNode(),u,r,x)){p.onExecCommand.dispatch(p,u,r,x,m);return true}if(v=p.execCommands[u]){n=v.func.call(v.scope,r,x);if(n!==true){p.onExecCommand.dispatch(p,u,r,x,m);return n}}i(p.plugins,function(o){if(o.execCommand&&o.execCommand(u,r,x)){p.onExecCommand.dispatch(p,u,r,x,m);q=1;return false}});if(q){return true}if(p.theme&&p.theme.execCommand&&p.theme.execCommand(u,r,x)){p.onExecCommand.dispatch(p,u,r,x,m);return true}if(p.editorCommands.execCommand(u,r,x)){p.onExecCommand.dispatch(p,u,r,x,m);return true}p.getDoc().execCommand(u,r,x);p.onExecCommand.dispatch(p,u,r,x,m)},queryCommandState:function(q){var n=this,r,p;if(n._isHidden()){return}if(r=n.queryStateCommands[q]){p=r.func.call(r.scope);if(p!==true){return p}}r=n.editorCommands.queryCommandState(q);if(r!==-1){return r}try{return this.getDoc().queryCommandState(q)}catch(m){}},queryCommandValue:function(r){var n=this,q,p;if(n._isHidden()){return}if(q=n.queryValueCommands[r]){p=q.func.call(q.scope);if(p!==true){return p}}q=n.editorCommands.queryCommandValue(r);if(d(q)){return q}try{return this.getDoc().queryCommandValue(r)}catch(m){}},show:function(){var m=this;l.show(m.getContainer());l.hide(m.id);m.load()},hide:function(){var m=this,n=m.getDoc();if(b&&n){n.execCommand("SelectAll")}m.save();l.hide(m.getContainer());l.setStyle(m.id,"display",m.orgDisplay)},isHidden:function(){return !l.isHidden(this.id)},setProgressState:function(m,n,p){this.onSetProgressState.dispatch(this,m,n,p);return m},load:function(q){var m=this,p=m.getElement(),n;if(p){q=q||{};q.load=true;n=m.setContent(d(p.value)?p.value:p.innerHTML,q);q.element=p;if(!q.no_events){m.onLoadContent.dispatch(m,q)}q.element=p=null;return n}},save:function(r){var m=this,q=m.getElement(),n,p;if(!q||!m.initialized){return}r=r||{};r.save=true;r.element=q;n=r.content=m.getContent(r);if(!r.no_events){m.onSaveContent.dispatch(m,r)}n=r.content;if(!/TEXTAREA|INPUT/i.test(q.nodeName)){q.innerHTML=n;if(p=l.getParent(m.id,"form")){i(p.elements,function(o){if(o.name==m.id){o.value=n;return false}})}}else{q.value=n}r.element=q=null;return n},setContent:function(r,p){var o=this,n,m=o.getBody(),q;p=p||{};p.format=p.format||"html";p.set=true;p.content=r;if(!p.no_events){o.onBeforeSetContent.dispatch(o,p)}r=p.content;if(!k.isIE&&(r.length===0||/^\s+$/.test(r))){q=o.settings.forced_root_block;if(q){r="<"+q+'><br data-mce-bogus="1"></'+q+">"}else{r='<br data-mce-bogus="1">'}m.innerHTML=r;o.selection.select(m,true);o.selection.collapse(true);return}if(p.format!=="raw"){r=new k.html.Serializer({},o.schema).serialize(o.parser.parse(r))}p.content=k.trim(r);o.dom.setHTML(m,p.content);if(!p.no_events){o.onSetContent.dispatch(o,p)}if(!o.settings.content_editable||document.activeElement===o.getBody()){o.selection.normalize()}return p.content},getContent:function(o){var n=this,p,m=n.getBody();o=o||{};o.format=o.format||"html";o.get=true;o.getInner=true;if(!o.no_events){n.onBeforeGetContent.dispatch(n,o)}if(o.format=="raw"){p=m.innerHTML}else{if(o.format=="text"){p=m.innerText||m.textContent}else{p=n.serializer.serialize(m,o)}}if(o.format!="text"){o.content=k.trim(p)}else{o.content=p}if(!o.no_events){n.onGetContent.dispatch(n,o)}return o.content},isDirty:function(){var m=this;return k.trim(m.startContent)!=k.trim(m.getContent({format:"raw",no_events:1}))&&!m.isNotDirty},getContainer:function(){var m=this;if(!m.container){m.container=l.get(m.editorContainer||m.id+"_parent")}return m.container},getContentAreaContainer:function(){return this.contentAreaContainer},getElement:function(){return l.get(this.settings.content_element||this.id)},getWin:function(){var m=this,n;if(!m.contentWindow){n=l.get(m.id+"_ifr");if(n){m.contentWindow=n.contentWindow}}return m.contentWindow},getDoc:function(){var m=this,n;if(!m.contentDocument){n=m.getWin();if(n){m.contentDocument=n.document}}return m.contentDocument},getBody:function(){return this.bodyElement||this.getDoc().body},convertURL:function(o,n,q){var m=this,p=m.settings;if(p.urlconverter_callback){return m.execCallback("urlconverter_callback",o,q,true,n)}if(!p.convert_urls||(q&&q.nodeName=="LINK")||o.indexOf("file:")===0){return o}if(p.relative_urls){return m.documentBaseURI.toRelative(o)}o=m.documentBaseURI.toAbsolute(o,p.remove_script_host);return o},addVisual:function(q){var n=this,o=n.settings,p=n.dom,m;q=q||n.getBody();if(!d(n.hasVisual)){n.hasVisual=o.visual}i(p.select("table,a",q),function(s){var r;switch(s.nodeName){case"TABLE":m=o.visual_table_class||"mceItemTable";r=p.getAttrib(s,"border");if(!r||r=="0"){if(n.hasVisual){p.addClass(s,m)}else{p.removeClass(s,m)}}return;case"A":if(!p.getAttrib(s,"href",false)){r=p.getAttrib(s,"name")||s.id;m="mceItemAnchor";if(r){if(n.hasVisual){p.addClass(s,m)}else{p.removeClass(s,m)}}}return}});n.onVisualAid.dispatch(n,q,n.hasVisual)},remove:function(){var m=this,o=m.getContainer(),n=m.getDoc();if(!m.removed){m.removed=1;if(b&&n){n.execCommand("SelectAll")}m.save();l.setStyle(m.id,"display",m.orgDisplay);if(!m.settings.content_editable){j.unbind(m.getWin());j.unbind(m.getDoc())}j.unbind(m.getBody());j.clear(o);m.execCallback("remove_instance_callback",m);m.onRemove.dispatch(m);m.onExecCommand.listeners=[];k.remove(m);l.remove(o)}},destroy:function(n){var m=this;if(m.destroyed){return}if(a){j.unbind(m.getDoc());j.unbind(m.getWin());j.unbind(m.getBody())}if(!n){k.removeUnload(m.destroy);tinyMCE.onBeforeUnload.remove(m._beforeUnload);if(m.theme&&m.theme.destroy){m.theme.destroy()}m.controlManager.destroy();m.selection.destroy();m.dom.destroy()}if(m.formElement){m.formElement.submit=m.formElement._mceOldSubmit;m.formElement._mceOldSubmit=null}m.contentAreaContainer=m.formElement=m.container=m.settings.content_element=m.bodyElement=m.contentDocument=m.contentWindow=null;if(m.selection){m.selection=m.selection.win=m.selection.dom=m.selection.dom.doc=null}m.destroyed=1},_refreshContentEditable:function(){var n=this,m,o;if(n._isHidden()){m=n.getBody();o=m.parentNode;o.removeChild(m);o.appendChild(m);m.focus()}},_isHidden:function(){var m;if(!a){return 0}m=this.selection.getSel();return(!m||!m.rangeCount||m.rangeCount===0)}})})(tinymce);(function(a){var b=a.each;a.Editor.prototype.setupEvents=function(){var c=this,d=c.settings;b(["onPreInit","onBeforeRenderUI","onPostRender","onLoad","onInit","onRemove","onActivate","onDeactivate","onClick","onEvent","onMouseUp","onMouseDown","onDblClick","onKeyDown","onKeyUp","onKeyPress","onContextMenu","onSubmit","onReset","onPaste","onPreProcess","onPostProcess","onBeforeSetContent","onBeforeGetContent","onSetContent","onGetContent","onLoadContent","onSaveContent","onNodeChange","onChange","onBeforeExecCommand","onExecCommand","onUndo","onRedo","onVisualAid","onSetProgressState","onSetAttrib"],function(e){c[e]=new a.util.Dispatcher(c)});if(d.cleanup_callback){c.onBeforeSetContent.add(function(e,f){f.content=e.execCallback("cleanup_callback","insert_to_editor",f.content,f)});c.onPreProcess.add(function(e,f){if(f.set){e.execCallback("cleanup_callback","insert_to_editor_dom",f.node,f)}if(f.get){e.execCallback("cleanup_callback","get_from_editor_dom",f.node,f)}});c.onPostProcess.add(function(e,f){if(f.set){f.content=e.execCallback("cleanup_callback","insert_to_editor",f.content,f)}if(f.get){f.content=e.execCallback("cleanup_callback","get_from_editor",f.content,f)}})}if(d.save_callback){c.onGetContent.add(function(e,f){if(f.save){f.content=e.execCallback("save_callback",e.id,f.content,e.getBody())}})}if(d.handle_event_callback){c.onEvent.add(function(f,g,h){if(c.execCallback("handle_event_callback",g,f,h)===false){g.preventDefault();g.stopPropagation()}})}if(d.handle_node_change_callback){c.onNodeChange.add(function(f,e,g){f.execCallback("handle_node_change_callback",f.id,g,-1,-1,true,f.selection.isCollapsed())})}if(d.save_callback){c.onSaveContent.add(function(e,g){var f=e.execCallback("save_callback",e.id,g.content,e.getBody());if(f){g.content=f}})}if(d.onchange_callback){c.onChange.add(function(f,e){f.execCallback("onchange_callback",f,e)})}};a.Editor.prototype.bindNativeEvents=function(){var l=this,f,d=l.settings,e=l.dom,h;h={mouseup:"onMouseUp",mousedown:"onMouseDown",click:"onClick",keyup:"onKeyUp",keydown:"onKeyDown",keypress:"onKeyPress",submit:"onSubmit",reset:"onReset",contextmenu:"onContextMenu",dblclick:"onDblClick",paste:"onPaste"};function c(i,m){var n=i.type;if(l.removed){return}if(l.onEvent.dispatch(l,i,m)!==false){l[h[i.fakeType||i.type]].dispatch(l,i,m)}}function j(i){l.focus(true)}function k(i,m){if(m.keyCode!=65||!a.VK.metaKeyPressed(m)){l.selection.normalize()}l.nodeChanged()}b(h,function(m,n){var i=d.content_editable?l.getBody():l.getDoc();switch(n){case"contextmenu":e.bind(i,n,c);break;case"paste":e.bind(l.getBody(),n,c);break;case"submit":case"reset":e.bind(l.getElement().form||a.DOM.getParent(l.id,"form"),n,c);break;default:e.bind(i,n,c)}});e.bind(d.content_editable?l.getBody():(a.isGecko?l.getDoc():l.getWin()),"focus",function(i){l.focus(true)});if(d.content_editable&&a.isOpera){e.bind(l.getBody(),"click",j);e.bind(l.getBody(),"keydown",j)}l.onMouseUp.add(k);l.onKeyUp.add(function(i,n){var m=n.keyCode;if((m>=33&&m<=36)||(m>=37&&m<=40)||m==13||m==45||m==46||m==8||(a.isMac&&(m==91||m==93))||n.ctrlKey){k(i,n)}});l.onReset.add(function(){l.setContent(l.startContent,{format:"raw"})});function g(m,i){if(m.altKey||m.ctrlKey||m.metaKey){b(l.shortcuts,function(n){var o=a.isMac?m.metaKey:m.ctrlKey;if(n.ctrl!=o||n.alt!=m.altKey||n.shift!=m.shiftKey){return}if(m.keyCode==n.keyCode||(m.charCode&&m.charCode==n.charCode)){m.preventDefault();if(i){n.func.call(n.scope)}return true}})}}l.onKeyUp.add(function(i,m){g(m)});l.onKeyPress.add(function(i,m){g(m)});l.onKeyDown.add(function(i,m){g(m,true)});if(a.isOpera){l.onClick.add(function(i,m){m.preventDefault()})}}})(tinymce);(function(d){var e=d.each,b,a=true,c=false;d.EditorCommands=function(n){var m=n.dom,p=n.selection,j={state:{},exec:{},value:{}},k=n.settings,q=n.formatter,o;function r(z,y,x){var v;z=z.toLowerCase();if(v=j.exec[z]){v(z,y,x);return a}return c}function l(x){var v;x=x.toLowerCase();if(v=j.state[x]){return v(x)}return -1}function h(x){var v;x=x.toLowerCase();if(v=j.value[x]){return v(x)}return c}function u(v,x){x=x||"exec";e(v,function(z,y){e(y.toLowerCase().split(","),function(A){j[x][A]=z})})}d.extend(this,{execCommand:r,queryCommandState:l,queryCommandValue:h,addCommands:u});function f(y,x,v){if(x===b){x=c}if(v===b){v=null}return n.getDoc().execCommand(y,x,v)}function t(v){return q.match(v)}function s(v,x){q.toggle(v,x?{value:x}:b)}function i(v){o=p.getBookmark(v)}function g(){p.moveToBookmark(o)}u({"mceResetDesignMode,mceBeginUndoLevel":function(){},"mceEndUndoLevel,mceAddUndoLevel":function(){n.undoManager.add()},"Cut,Copy,Paste":function(z){var y=n.getDoc(),v;try{f(z)}catch(x){v=a}if(v||!y.queryCommandSupported(z)){if(d.isGecko){n.windowManager.confirm(n.getLang("clipboard_msg"),function(A){if(A){open("http://www.mozilla.org/editor/midasdemo/securityprefs.html","_blank")}})}else{n.windowManager.alert(n.getLang("clipboard_no_support"))}}},unlink:function(v){if(p.isCollapsed()){p.select(p.getNode())}f(v);p.collapse(c)},"JustifyLeft,JustifyCenter,JustifyRight,JustifyFull":function(v){var x=v.substring(7);e("left,center,right,full".split(","),function(y){if(x!=y){q.remove("align"+y)}});s("align"+x);r("mceRepaint")},"InsertUnorderedList,InsertOrderedList":function(y){var v,x;f(y);v=m.getParent(p.getNode(),"ol,ul");if(v){x=v.parentNode;if(/^(H[1-6]|P|ADDRESS|PRE)$/.test(x.nodeName)){i();m.split(x,v);g()}}},"Bold,Italic,Underline,Strikethrough,Superscript,Subscript":function(v){s(v)},"ForeColor,HiliteColor,FontName":function(y,x,v){s(y,v)},FontSize:function(z,y,x){var v,A;if(x>=1&&x<=7){A=d.explode(k.font_size_style_values);v=d.explode(k.font_size_classes);if(v){x=v[x-1]||x}else{x=A[x-1]||x}}s(z,x)},RemoveFormat:function(v){q.remove(v)},mceBlockQuote:function(v){s("blockquote")},FormatBlock:function(y,x,v){return s(v||"p")},mceCleanup:function(){var v=p.getBookmark();n.setContent(n.getContent({cleanup:a}),{cleanup:a});p.moveToBookmark(v)},mceRemoveNode:function(z,y,x){var v=x||p.getNode();if(v!=n.getBody()){i();n.dom.remove(v,a);g()}},mceSelectNodeDepth:function(z,y,x){var v=0;m.getParent(p.getNode(),function(A){if(A.nodeType==1&&v++==x){p.select(A);return c}},n.getBody())},mceSelectNode:function(y,x,v){p.select(v)},mceInsertContent:function(B,I,K){var y,J,E,z,F,G,D,C,L,x,A,M,v,H;y=n.parser;J=new d.html.Serializer({},n.schema);v='<span id="mce_marker" data-mce-type="bookmark">\uFEFF</span>';G={content:K,format:"html"};p.onBeforeSetContent.dispatch(p,G);K=G.content;if(K.indexOf("{$caret}")==-1){K+="{$caret}"}K=K.replace(/\{\$caret\}/,v);if(!p.isCollapsed()){n.getDoc().execCommand("Delete",false,null)}E=p.getNode();G={context:E.nodeName.toLowerCase()};F=y.parse(K,G);A=F.lastChild;if(A.attr("id")=="mce_marker"){D=A;for(A=A.prev;A;A=A.walk(true)){if(A.type==3||!m.isBlock(A.name)){A.parent.insert(D,A,A.name==="br");break}}}if(!G.invalid){K=J.serialize(F);A=E.firstChild;M=E.lastChild;if(!A||(A===M&&A.nodeName==="BR")){m.setHTML(E,K)}else{p.setContent(K)}}else{p.setContent(v);E=p.getNode();z=n.getBody();if(E.nodeType==9){E=A=z}else{A=E}while(A!==z){E=A;A=A.parentNode}K=E==z?z.innerHTML:m.getOuterHTML(E);K=J.serialize(y.parse(K.replace(/<span (id="mce_marker"|id=mce_marker).+?<\/span>/i,function(){return J.serialize(F)})));if(E==z){m.setHTML(z,K)}else{m.setOuterHTML(E,K)}}D=m.get("mce_marker");C=m.getRect(D);L=m.getViewPort(n.getWin());if((C.y+C.h>L.y+L.h||C.y<L.y)||(C.x>L.x+L.w||C.x<L.x)){H=d.isIE?n.getDoc().documentElement:n.getBody();H.scrollLeft=C.x;H.scrollTop=C.y-L.h+25}x=m.createRng();A=D.previousSibling;if(A&&A.nodeType==3){x.setStart(A,A.nodeValue.length)}else{x.setStartBefore(D);x.setEndBefore(D)}m.remove(D);p.setRng(x);p.onSetContent.dispatch(p,G);n.addVisual()},mceInsertRawHTML:function(y,x,v){p.setContent("tiny_mce_marker");n.setContent(n.getContent().replace(/tiny_mce_marker/g,function(){return v}))},mceToggleFormat:function(y,x,v){s(v)},mceSetContent:function(y,x,v){n.setContent(v)},"Indent,Outdent":function(z){var x,v,y;x=k.indentation;v=/[a-z%]+$/i.exec(x);x=parseInt(x);if(!l("InsertUnorderedList")&&!l("InsertOrderedList")){if(!k.forced_root_block&&!m.getParent(p.getNode(),m.isBlock)){q.apply("div")}e(p.getSelectedBlocks(),function(A){if(z=="outdent"){y=Math.max(0,parseInt(A.style.paddingLeft||0)-x);m.setStyle(A,"paddingLeft",y?y+v:"")}else{m.setStyle(A,"paddingLeft",(parseInt(A.style.paddingLeft||0)+x)+v)}})}else{f(z)}},mceRepaint:function(){var x;if(d.isGecko){try{i(a);if(p.getSel()){p.getSel().selectAllChildren(n.getBody())}p.collapse(a);g()}catch(v){}}},mceToggleFormat:function(y,x,v){q.toggle(v)},InsertHorizontalRule:function(){n.execCommand("mceInsertContent",false,"<hr />")},mceToggleVisualAid:function(){n.hasVisual=!n.hasVisual;n.addVisual()},mceReplaceContent:function(y,x,v){n.execCommand("mceInsertContent",false,v.replace(/\{\$selection\}/g,p.getContent({format:"text"})))},mceInsertLink:function(z,y,x){var v;if(typeof(x)=="string"){x={href:x}}v=m.getParent(p.getNode(),"a");x.href=x.href.replace(" ","%20");if(!v||!x.href){q.remove("link")}if(x.href){q.apply("link",x,v)}},selectAll:function(){var x=m.getRoot(),v=m.createRng();if(p.getRng().setStart){v.setStart(x,0);v.setEnd(x,x.childNodes.length);p.setRng(v)}else{f("SelectAll")}}});u({"JustifyLeft,JustifyCenter,JustifyRight,JustifyFull":function(z){var x="align"+z.substring(7);var v=p.isCollapsed()?[m.getParent(p.getNode(),m.isBlock)]:p.getSelectedBlocks();var y=d.map(v,function(A){return !!q.matchNode(A,x)});return d.inArray(y,a)!==-1},"Bold,Italic,Underline,Strikethrough,Superscript,Subscript":function(v){return t(v)},mceBlockQuote:function(){return t("blockquote")},Outdent:function(){var v;if(k.inline_styles){if((v=m.getParent(p.getStart(),m.isBlock))&&parseInt(v.style.paddingLeft)>0){return a}if((v=m.getParent(p.getEnd(),m.isBlock))&&parseInt(v.style.paddingLeft)>0){return a}}return l("InsertUnorderedList")||l("InsertOrderedList")||(!k.inline_styles&&!!m.getParent(p.getNode(),"BLOCKQUOTE"))},"InsertUnorderedList,InsertOrderedList":function(x){var v=m.getParent(p.getNode(),"ul,ol");return v&&(x==="insertunorderedlist"&&v.tagName==="UL"||x==="insertorderedlist"&&v.tagName==="OL")}},"state");u({"FontSize,FontName":function(y){var x=0,v;if(v=m.getParent(p.getNode(),"span")){if(y=="fontsize"){x=v.style.fontSize}else{x=v.style.fontFamily.replace(/, /g,",").replace(/[\'\"]/g,"").toLowerCase()}}return x}},"value");u({Undo:function(){n.undoManager.undo()},Redo:function(){n.undoManager.redo()}})}})(tinymce);(function(b){var a=b.util.Dispatcher;b.UndoManager=function(h){var l,i=0,e=[],g,k,j,f;function c(){return b.trim(h.getContent({format:"raw",no_events:1}).replace(/<span[^>]+data-mce-bogus[^>]+>[\u200B\uFEFF]+<\/span>/g,""))}function d(){l.typing=false;l.add()}onBeforeAdd=new a(l);k=new a(l);j=new a(l);f=new a(l);k.add(function(m,n){if(m.hasUndo()){return h.onChange.dispatch(h,n,m)}});j.add(function(m,n){return h.onUndo.dispatch(h,n,m)});f.add(function(m,n){return h.onRedo.dispatch(h,n,m)});h.onInit.add(function(){l.add()});h.onBeforeExecCommand.add(function(m,p,o,q,n){if(p!="Undo"&&p!="Redo"&&p!="mceRepaint"&&(!n||!n.skip_undo)){l.beforeChange()}});h.onExecCommand.add(function(m,p,o,q,n){if(p!="Undo"&&p!="Redo"&&p!="mceRepaint"&&(!n||!n.skip_undo)){l.add()}});h.onSaveContent.add(d);h.dom.bind(h.dom.getRoot(),"dragend",d);h.dom.bind(h.getBody(),"focusout",function(m){if(!h.removed&&l.typing){d()}});h.onKeyUp.add(function(m,o){var n=o.keyCode;if((n>=33&&n<=36)||(n>=37&&n<=40)||n==45||n==13||o.ctrlKey){d()}});h.onKeyDown.add(function(m,o){var n=o.keyCode;if((n>=33&&n<=36)||(n>=37&&n<=40)||n==45){if(l.typing){d()}return}if((n<16||n>20)&&n!=224&&n!=91&&!l.typing){l.beforeChange();l.typing=true;l.add()}});h.onMouseDown.add(function(m,n){if(l.typing){d()}});h.addShortcut("ctrl+z","undo_desc","Undo");h.addShortcut("ctrl+y","redo_desc","Redo");l={data:e,typing:false,onBeforeAdd:onBeforeAdd,onAdd:k,onUndo:j,onRedo:f,beforeChange:function(){g=h.selection.getBookmark(2,true)},add:function(p){var m,n=h.settings,o;p=p||{};p.content=c();l.onBeforeAdd.dispatch(l,p);o=e[i];if(o&&o.content==p.content){return null}if(e[i]){e[i].beforeBookmark=g}if(n.custom_undo_redo_levels){if(e.length>n.custom_undo_redo_levels){for(m=0;m<e.length-1;m++){e[m]=e[m+1]}e.length--;i=e.length}}p.bookmark=h.selection.getBookmark(2,true);if(i<e.length-1){e.length=i+1}e.push(p);i=e.length-1;l.onAdd.dispatch(l,p);h.isNotDirty=0;return p},undo:function(){var n,m;if(l.typing){l.add();l.typing=false}if(i>0){n=e[--i];h.setContent(n.content,{format:"raw"});h.selection.moveToBookmark(n.beforeBookmark);l.onUndo.dispatch(l,n)}return n},redo:function(){var m;if(i<e.length-1){m=e[++i];h.setContent(m.content,{format:"raw"});h.selection.moveToBookmark(m.bookmark);l.onRedo.dispatch(l,m)}return m},clear:function(){e=[];i=0;l.typing=false},hasUndo:function(){return i>0||this.typing},hasRedo:function(){return i<e.length-1&&!this.typing}};return l}})(tinymce);tinymce.ForceBlocks=function(c){var b=c.settings,e=c.dom,a=c.selection,d=c.schema.getBlockElements();function f(){var j=a.getStart(),h=c.getBody(),g,k,o,s,q,i,l,m=-16777215,p,r;if(!j||j.nodeType!==1||!b.forced_root_block){return}while(j&&j!=h){if(d[j.nodeName]){return}j=j.parentNode}g=a.getRng();if(g.setStart){k=g.startContainer;o=g.startOffset;s=g.endContainer;q=g.endOffset}else{if(g.item){j=g.item(0);g=c.getDoc().body.createTextRange();g.moveToElementText(j)}r=g.parentElement().ownerDocument===c.getDoc();tmpRng=g.duplicate();tmpRng.collapse(true);o=tmpRng.move("character",m)*-1;if(!tmpRng.collapsed){tmpRng=g.duplicate();tmpRng.collapse(false);q=(tmpRng.move("character",m)*-1)-o}}j=h.firstChild;while(j){if(j.nodeType===3||(j.nodeType==1&&!d[j.nodeName])){if(j.nodeType===3&&j.nodeValue.length==0){l=j;j=j.nextSibling;e.remove(l);continue}if(!i){i=e.create(b.forced_root_block);j.parentNode.insertBefore(i,j);p=true}l=j;j=j.nextSibling;i.appendChild(l)}else{i=null;j=j.nextSibling}}if(p){if(g.setStart){g.setStart(k,o);g.setEnd(s,q);a.setRng(g)}else{if(r){try{g=c.getDoc().body.createTextRange();g.moveToElementText(h);g.collapse(true);g.moveStart("character",o);if(q>0){g.moveEnd("character",q)}g.select()}catch(n){}}}c.nodeChanged()}}if(b.forced_root_block){c.onKeyUp.add(f);c.onNodeChange.add(f)}};(function(c){var b=c.DOM,a=c.dom.Event,d=c.each,e=c.extend;c.create("tinymce.ControlManager",{ControlManager:function(f,j){var h=this,g;j=j||{};h.editor=f;h.controls={};h.onAdd=new c.util.Dispatcher(h);h.onPostRender=new c.util.Dispatcher(h);h.prefix=j.prefix||f.id+"_";h._cls={};h.onPostRender.add(function(){d(h.controls,function(i){i.postRender()})})},get:function(f){return this.controls[this.prefix+f]||this.controls[f]},setActive:function(h,f){var g=null;if(g=this.get(h)){g.setActive(f)}return g},setDisabled:function(h,f){var g=null;if(g=this.get(h)){g.setDisabled(f)}return g},add:function(g){var f=this;if(g){f.controls[g.id]=g;f.onAdd.dispatch(g,f)}return g},createControl:function(j){var o,k,g,h=this,m=h.editor,n,f;if(!h.controlFactories){h.controlFactories=[];d(m.plugins,function(i){if(i.createControl){h.controlFactories.push(i)}})}n=h.controlFactories;for(k=0,g=n.length;k<g;k++){o=n[k].createControl(j,h);if(o){return h.add(o)}}if(j==="|"||j==="separator"){return h.createSeparator()}if(m.buttons&&(o=m.buttons[j])){return h.createButton(j,o)}return h.add(o)},createDropMenu:function(f,n,h){var m=this,i=m.editor,j,g,k,l;n=e({"class":"mceDropDown",constrain:i.settings.constrain_menus},n);n["class"]=n["class"]+" "+i.getParam("skin")+"Skin";if(k=i.getParam("skin_variant")){n["class"]+=" "+i.getParam("skin")+"Skin"+k.substring(0,1).toUpperCase()+k.substring(1)}n["class"]+=i.settings.directionality=="rtl"?" mceRtl":"";f=m.prefix+f;l=h||m._cls.dropmenu||c.ui.DropMenu;j=m.controls[f]=new l(f,n);j.onAddItem.add(function(r,q){var p=q.settings;p.title=i.getLang(p.title,p.title);if(!p.onclick){p.onclick=function(o){if(p.cmd){i.execCommand(p.cmd,p.ui||false,p.value)}}}});i.onRemove.add(function(){j.destroy()});if(c.isIE){j.onShowMenu.add(function(){i.focus();g=i.selection.getBookmark(1)});j.onHideMenu.add(function(){if(g){i.selection.moveToBookmark(g);g=0}})}return m.add(j)},createListBox:function(f,n,h){var l=this,j=l.editor,i,k,m;if(l.get(f)){return null}n.title=j.translate(n.title);n.scope=n.scope||j;if(!n.onselect){n.onselect=function(o){j.execCommand(n.cmd,n.ui||false,o||n.value)}}n=e({title:n.title,"class":"mce_"+f,scope:n.scope,control_manager:l},n);f=l.prefix+f;function g(o){return o.settings.use_accessible_selects&&!c.isGecko}if(j.settings.use_native_selects||g(j)){k=new c.ui.NativeListBox(f,n)}else{m=h||l._cls.listbox||c.ui.ListBox;k=new m(f,n,j)}l.controls[f]=k;if(c.isWebKit){k.onPostRender.add(function(p,o){a.add(o,"mousedown",function(){j.bookmark=j.selection.getBookmark(1)});a.add(o,"focus",function(){j.selection.moveToBookmark(j.bookmark);j.bookmark=null})})}if(k.hideMenu){j.onMouseDown.add(k.hideMenu,k)}return l.add(k)},createButton:function(m,i,l){var h=this,g=h.editor,j,k,f;if(h.get(m)){return null}i.title=g.translate(i.title);i.label=g.translate(i.label);i.scope=i.scope||g;if(!i.onclick&&!i.menu_button){i.onclick=function(){g.execCommand(i.cmd,i.ui||false,i.value)}}i=e({title:i.title,"class":"mce_"+m,unavailable_prefix:g.getLang("unavailable",""),scope:i.scope,control_manager:h},i);m=h.prefix+m;if(i.menu_button){f=l||h._cls.menubutton||c.ui.MenuButton;k=new f(m,i,g);g.onMouseDown.add(k.hideMenu,k)}else{f=h._cls.button||c.ui.Button;k=new f(m,i,g)}return h.add(k)},createMenuButton:function(h,f,g){f=f||{};f.menu_button=1;return this.createButton(h,f,g)},createSplitButton:function(m,i,l){var h=this,g=h.editor,j,k,f;if(h.get(m)){return null}i.title=g.translate(i.title);i.scope=i.scope||g;if(!i.onclick){i.onclick=function(n){g.execCommand(i.cmd,i.ui||false,n||i.value)}}if(!i.onselect){i.onselect=function(n){g.execCommand(i.cmd,i.ui||false,n||i.value)}}i=e({title:i.title,"class":"mce_"+m,scope:i.scope,control_manager:h},i);m=h.prefix+m;f=l||h._cls.splitbutton||c.ui.SplitButton;k=h.add(new f(m,i,g));g.onMouseDown.add(k.hideMenu,k);return k},createColorSplitButton:function(f,n,h){var l=this,j=l.editor,i,k,m,g;if(l.get(f)){return null}n.title=j.translate(n.title);n.scope=n.scope||j;if(!n.onclick){n.onclick=function(o){if(c.isIE){g=j.selection.getBookmark(1)}j.execCommand(n.cmd,n.ui||false,o||n.value)}}if(!n.onselect){n.onselect=function(o){j.execCommand(n.cmd,n.ui||false,o||n.value)}}n=e({title:n.title,"class":"mce_"+f,menu_class:j.getParam("skin")+"Skin",scope:n.scope,more_colors_title:j.getLang("more_colors")},n);f=l.prefix+f;m=h||l._cls.colorsplitbutton||c.ui.ColorSplitButton;k=new m(f,n,j);j.onMouseDown.add(k.hideMenu,k);j.onRemove.add(function(){k.destroy()});if(c.isIE){k.onShowMenu.add(function(){j.focus();g=j.selection.getBookmark(1)});k.onHideMenu.add(function(){if(g){j.selection.moveToBookmark(g);g=0}})}return l.add(k)},createToolbar:function(k,h,j){var i,g=this,f;k=g.prefix+k;f=j||g._cls.toolbar||c.ui.Toolbar;i=new f(k,h,g.editor);if(g.get(k)){return null}return g.add(i)},createToolbarGroup:function(k,h,j){var i,g=this,f;k=g.prefix+k;f=j||this._cls.toolbarGroup||c.ui.ToolbarGroup;i=new f(k,h,g.editor);if(g.get(k)){return null}return g.add(i)},createSeparator:function(g){var f=g||this._cls.separator||c.ui.Separator;return new f()},setControlType:function(g,f){return this._cls[g.toLowerCase()]=f},destroy:function(){d(this.controls,function(f){f.destroy()});this.controls=null}})})(tinymce);(function(d){var a=d.util.Dispatcher,e=d.each,c=d.isIE,b=d.isOpera;d.create("tinymce.WindowManager",{WindowManager:function(f){var g=this;g.editor=f;g.onOpen=new a(g);g.onClose=new a(g);g.params={};g.features={}},open:function(z,h){var v=this,k="",n,m,i=v.editor.settings.dialog_type=="modal",q,o,j,g=d.DOM.getViewPort(),r;z=z||{};h=h||{};o=b?g.w:screen.width;j=b?g.h:screen.height;z.name=z.name||"mc_"+new Date().getTime();z.width=parseInt(z.width||320);z.height=parseInt(z.height||240);z.resizable=true;z.left=z.left||parseInt(o/2)-(z.width/2);z.top=z.top||parseInt(j/2)-(z.height/2);h.inline=false;h.mce_width=z.width;h.mce_height=z.height;h.mce_auto_focus=z.auto_focus;if(i){if(c){z.center=true;z.help=false;z.dialogWidth=z.width+"px";z.dialogHeight=z.height+"px";z.scroll=z.scrollbars||false}}e(z,function(p,f){if(d.is(p,"boolean")){p=p?"yes":"no"}if(!/^(name|url)$/.test(f)){if(c&&i){k+=(k?";":"")+f+":"+p}else{k+=(k?",":"")+f+"="+p}}});v.features=z;v.params=h;v.onOpen.dispatch(v,z,h);r=z.url||z.file;r=d._addVer(r);try{if(c&&i){q=1;window.showModalDialog(r,window,k)}else{q=window.open(r,z.name,k)}}catch(l){}if(!q){alert(v.editor.getLang("popup_blocked"))}},close:function(f){f.close();this.onClose.dispatch(this)},createInstance:function(i,h,g,m,l,k){var j=d.resolve(i);return new j(h,g,m,l,k)},confirm:function(h,f,i,g){g=g||window;f.call(i||this,g.confirm(this._decode(this.editor.getLang(h,h))))},alert:function(h,f,j,g){var i=this;g=g||window;g.alert(i._decode(i.editor.getLang(h,h)));if(f){f.call(j||i)}},resizeBy:function(f,g,h){h.resizeBy(f,g)},_decode:function(f){return d.DOM.decode(f).replace(/\\n/g,"\n")}})}(tinymce));(function(a){a.Formatter=function(aa){var Q={},T=a.each,c=aa.dom,r=aa.selection,t=a.dom.TreeWalker,N=new a.dom.RangeUtils(c),d=aa.schema.isValidChild,A=a.isArray,H=c.isBlock,m=aa.settings.forced_root_block,s=c.nodeIndex,G="\uFEFF",e=/^(src|href|style)$/,X=false,C=true,P,D,x=c.getContentEditable;function I(ab){return !!aa.schema.getTextBlocks()[ab.toLowerCase()]}function n(ac,ab){return c.getParents(ac,ab,c.getRoot())}function b(ab){return ab.nodeType===1&&ab.id==="_mce_caret"}function j(){l({alignleft:[{selector:"figure,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",styles:{textAlign:"left"},defaultBlock:"div"},{selector:"img,table",collapsed:false,styles:{"float":"left"}}],aligncenter:[{selector:"figure,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",styles:{textAlign:"center"},defaultBlock:"div"},{selector:"img",collapsed:false,styles:{display:"block",marginLeft:"auto",marginRight:"auto"}},{selector:"table",collapsed:false,styles:{marginLeft:"auto",marginRight:"auto"}}],alignright:[{selector:"figure,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",styles:{textAlign:"right"},defaultBlock:"div"},{selector:"img,table",collapsed:false,styles:{"float":"right"}}],alignfull:[{selector:"figure,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",styles:{textAlign:"justify"},defaultBlock:"div"}],bold:[{inline:"strong",remove:"all"},{inline:"span",styles:{fontWeight:"bold"}},{inline:"b",remove:"all"}],italic:[{inline:"em",remove:"all"},{inline:"span",styles:{fontStyle:"italic"}},{inline:"i",remove:"all"}],underline:[{inline:"span",styles:{textDecoration:"underline"},exact:true},{inline:"u",remove:"all"}],strikethrough:[{inline:"span",styles:{textDecoration:"line-through"},exact:true},{inline:"strike",remove:"all"}],forecolor:{inline:"span",styles:{color:"%value"},wrap_links:false},hilitecolor:{inline:"span",styles:{backgroundColor:"%value"},wrap_links:false},fontname:{inline:"span",styles:{fontFamily:"%value"}},fontsize:{inline:"span",styles:{fontSize:"%value"}},fontsize_class:{inline:"span",attributes:{"class":"%value"}},blockquote:{block:"blockquote",wrapper:1,remove:"all"},subscript:{inline:"sub"},superscript:{inline:"sup"},link:{inline:"a",selector:"a",remove:"all",split:true,deep:true,onmatch:function(ab){return true},onformat:function(ad,ab,ac){T(ac,function(af,ae){c.setAttrib(ad,ae,af)})}},removeformat:[{selector:"b,strong,em,i,font,u,strike",remove:"all",split:true,expand:false,block_expand:true,deep:true},{selector:"span",attributes:["style","class"],remove:"empty",split:true,expand:false,deep:true},{selector:"*",attributes:["style","class"],split:false,expand:false,deep:true}]});T("p h1 h2 h3 h4 h5 h6 div address pre div code dt dd samp".split(/\s/),function(ab){l(ab,{block:ab,remove:"all"})});l(aa.settings.formats)}function W(){aa.addShortcut("ctrl+b","bold_desc","Bold");aa.addShortcut("ctrl+i","italic_desc","Italic");aa.addShortcut("ctrl+u","underline_desc","Underline");for(var ab=1;ab<=6;ab++){aa.addShortcut("ctrl+"+ab,"",["FormatBlock",false,"h"+ab])}aa.addShortcut("ctrl+7","",["FormatBlock",false,"p"]);aa.addShortcut("ctrl+8","",["FormatBlock",false,"div"]);aa.addShortcut("ctrl+9","",["FormatBlock",false,"address"])}function V(ab){return ab?Q[ab]:Q}function l(ab,ac){if(ab){if(typeof(ab)!=="string"){T(ab,function(ae,ad){l(ad,ae)})}else{ac=ac.length?ac:[ac];T(ac,function(ad){if(ad.deep===D){ad.deep=!ad.selector}if(ad.split===D){ad.split=!ad.selector||ad.inline}if(ad.remove===D&&ad.selector&&!ad.inline){ad.remove="none"}if(ad.selector&&ad.inline){ad.mixed=true;ad.block_expand=true}if(typeof(ad.classes)==="string"){ad.classes=ad.classes.split(/\s+/)}});Q[ab]=ac}}}var i=function(ac){var ab;aa.dom.getParent(ac,function(ad){ab=aa.dom.getStyle(ad,"text-decoration");return ab&&ab!=="none"});return ab};var L=function(ab){var ac;if(ab.nodeType===1&&ab.parentNode&&ab.parentNode.nodeType===1){ac=i(ab.parentNode);if(aa.dom.getStyle(ab,"color")&&ac){aa.dom.setStyle(ab,"text-decoration",ac)}else{if(aa.dom.getStyle(ab,"textdecoration")===ac){aa.dom.setStyle(ab,"text-decoration",null)}}}};function Y(ae,al,ag){var ah=V(ae),am=ah[0],ak,ac,aj,ai=r.isCollapsed();function ab(aq,ap){ap=ap||am;if(aq){if(ap.onformat){ap.onformat(aq,ap,al,ag)}T(ap.styles,function(at,ar){c.setStyle(aq,ar,q(at,al))});T(ap.attributes,function(at,ar){c.setAttrib(aq,ar,q(at,al))});T(ap.classes,function(ar){ar=q(ar,al);if(!c.hasClass(aq,ar)){c.addClass(aq,ar)}})}}function af(){function ar(ay,aw){var ax=new t(aw);for(ag=ax.current();ag;ag=ax.prev()){if(ag.childNodes.length>1||ag==ay||ag.tagName=="BR"){return ag}}}var aq=aa.selection.getRng();var av=aq.startContainer;var ap=aq.endContainer;if(av!=ap&&aq.endOffset===0){var au=ar(av,ap);var at=au.nodeType==3?au.length:au.childNodes.length;aq.setEnd(au,at)}return aq}function ad(at,ay,aw,av,aq){var ap=[],ar=-1,ax,aA=-1,au=-1,az;T(at.childNodes,function(aC,aB){if(aC.nodeName==="UL"||aC.nodeName==="OL"){ar=aB;ax=aC;return false}});T(at.childNodes,function(aC,aB){if(aC.nodeName==="SPAN"&&c.getAttrib(aC,"data-mce-type")=="bookmark"){if(aC.id==ay.id+"_start"){aA=aB}else{if(aC.id==ay.id+"_end"){au=aB}}}});if(ar<=0||(aA<ar&&au>ar)){T(a.grep(at.childNodes),aq);return 0}else{az=c.clone(aw,X);T(a.grep(at.childNodes),function(aC,aB){if((aA<ar&&aB<ar)||(aA>ar&&aB>ar)){ap.push(aC);aC.parentNode.removeChild(aC)}});if(aA<ar){at.insertBefore(az,ax)}else{if(aA>ar){at.insertBefore(az,ax.nextSibling)}}av.push(az);T(ap,function(aB){az.appendChild(aB)});return az}}function an(aq,at,aw){var ap=[],av,ar,au=true;av=am.inline||am.block;ar=c.create(av);ab(ar);N.walk(aq,function(ax){var ay;function az(aA){var aF,aD,aB,aC,aE;aE=au;aF=aA.nodeName.toLowerCase();aD=aA.parentNode.nodeName.toLowerCase();if(aA.nodeType===1&&x(aA)){aE=au;au=x(aA)==="true";aC=true}if(g(aF,"br")){ay=0;if(am.block){c.remove(aA)}return}if(am.wrapper&&y(aA,ae,al)){ay=0;return}if(au&&!aC&&am.block&&!am.wrapper&&I(aF)){aA=c.rename(aA,av);ab(aA);ap.push(aA);ay=0;return}if(am.selector){T(ah,function(aG){if("collapsed" in aG&&aG.collapsed!==ai){return}if(c.is(aA,aG.selector)&&!b(aA)){ab(aA,aG);aB=true}});if(!am.inline||aB){ay=0;return}}if(au&&!aC&&d(av,aF)&&d(aD,av)&&!(!aw&&aA.nodeType===3&&aA.nodeValue.length===1&&aA.nodeValue.charCodeAt(0)===65279)&&!b(aA)){if(!ay){ay=c.clone(ar,X);aA.parentNode.insertBefore(ay,aA);ap.push(ay)}ay.appendChild(aA)}else{if(aF=="li"&&at){ay=ad(aA,at,ar,ap,az)}else{ay=0;T(a.grep(aA.childNodes),az);if(aC){au=aE}ay=0}}}T(ax,az)});if(am.wrap_links===false){T(ap,function(ax){function ay(aC){var aB,aA,az;if(aC.nodeName==="A"){aA=c.clone(ar,X);ap.push(aA);az=a.grep(aC.childNodes);for(aB=0;aB<az.length;aB++){aA.appendChild(az[aB])}aC.appendChild(aA)}T(a.grep(aC.childNodes),ay)}ay(ax)})}T(ap,function(az){var ax;function aA(aC){var aB=0;T(aC.childNodes,function(aD){if(!f(aD)&&!K(aD)){aB++}});return aB}function ay(aB){var aD,aC;T(aB.childNodes,function(aE){if(aE.nodeType==1&&!K(aE)&&!b(aE)){aD=aE;return X}});if(aD&&h(aD,am)){aC=c.clone(aD,X);ab(aC);c.replace(aC,aB,C);c.remove(aD,1)}return aC||aB}ax=aA(az);if((ap.length>1||!H(az))&&ax===0){c.remove(az,1);return}if(am.inline||am.wrapper){if(!am.exact&&ax===1){az=ay(az)}T(ah,function(aB){T(c.select(aB.inline,az),function(aD){var aC;if(aB.wrap_links===false){aC=aD.parentNode;do{if(aC.nodeName==="A"){return}}while(aC=aC.parentNode)}Z(aB,al,aD,aB.exact?aD:null)})});if(y(az.parentNode,ae,al)){c.remove(az,1);az=0;return C}if(am.merge_with_parents){c.getParent(az.parentNode,function(aB){if(y(aB,ae,al)){c.remove(az,1);az=0;return C}})}if(az&&am.merge_siblings!==false){az=u(E(az),az);az=u(az,E(az,C))}}})}if(am){if(ag){if(ag.nodeType){ac=c.createRng();ac.setStartBefore(ag);ac.setEndAfter(ag);an(p(ac,ah),null,true)}else{an(ag,null,true)}}else{if(!ai||!am.inline||c.select("td.mceSelected,th.mceSelected").length){var ao=aa.selection.getNode();if(!m&&ah[0].defaultBlock&&!c.getParent(ao,c.isBlock)){Y(ah[0].defaultBlock)}aa.selection.setRng(af());ak=r.getBookmark();an(p(r.getRng(C),ah),ak);if(am.styles&&(am.styles.color||am.styles.textDecoration)){a.walk(ao,L,"childNodes");L(ao)}r.moveToBookmark(ak);R(r.getRng(C));aa.nodeChanged()}else{U("apply",ae,al)}}}}function B(ad,am,af){var ag=V(ad),ao=ag[0],ak,aj,ac,al=true;function ae(av){var au,at,ar,aq,ax,aw;if(av.nodeType===3){return}if(av.nodeType===1&&x(av)){ax=al;al=x(av)==="true";aw=true}au=a.grep(av.childNodes);if(al&&!aw){for(at=0,ar=ag.length;at<ar;at++){if(Z(ag[at],am,av,av)){break}}}if(ao.deep){if(au.length){for(at=0,ar=au.length;at<ar;at++){ae(au[at])}if(aw){al=ax}}}}function ah(aq){var ar;T(n(aq.parentNode).reverse(),function(at){var au;if(!ar&&at.id!="_start"&&at.id!="_end"){au=y(at,ad,am);if(au&&au.split!==false){ar=at}}});return ar}function ab(au,aq,aw,az){var aA,ay,ax,at,av,ar;if(au){ar=au.parentNode;for(aA=aq.parentNode;aA&&aA!=ar;aA=aA.parentNode){ay=c.clone(aA,X);for(av=0;av<ag.length;av++){if(Z(ag[av],am,ay,ay)){ay=0;break}}if(ay){if(ax){ay.appendChild(ax)}if(!at){at=ay}ax=ay}}if(az&&(!ao.mixed||!H(au))){aq=c.split(au,aq)}if(ax){aw.parentNode.insertBefore(ax,aw);at.appendChild(aw)}}return aq}function an(aq){return ab(ah(aq),aq,aq,true)}function ai(at){var ar=c.get(at?"_start":"_end"),aq=ar[at?"firstChild":"lastChild"];if(K(aq)){aq=aq[at?"firstChild":"lastChild"]}c.remove(ar,true);return aq}function ap(aq){var at,au,ar;aq=p(aq,ag,C);if(ao.split){at=M(aq,C);au=M(aq);if(at!=au){if(/^(TR|TD)$/.test(at.nodeName)&&at.firstChild){at=(at.nodeName=="TD"?at.firstChild:at.firstChild.firstChild)||at}at=S(at,"span",{id:"_start","data-mce-type":"bookmark"});au=S(au,"span",{id:"_end","data-mce-type":"bookmark"});an(at);an(au);at=ai(C);au=ai()}else{at=au=an(at)}aq.startContainer=at.parentNode;aq.startOffset=s(at);aq.endContainer=au.parentNode;aq.endOffset=s(au)+1}N.walk(aq,function(av){T(av,function(aw){ae(aw);if(aw.nodeType===1&&aa.dom.getStyle(aw,"text-decoration")==="underline"&&aw.parentNode&&i(aw.parentNode)==="underline"){Z({deep:false,exact:true,inline:"span",styles:{textDecoration:"underline"}},null,aw)}})})}if(af){if(af.nodeType){ac=c.createRng();ac.setStartBefore(af);ac.setEndAfter(af);ap(ac)}else{ap(af)}return}if(!r.isCollapsed()||!ao.inline||c.select("td.mceSelected,th.mceSelected").length){ak=r.getBookmark();ap(r.getRng(C));r.moveToBookmark(ak);if(ao.inline&&k(ad,am,r.getStart())){R(r.getRng(true))}aa.nodeChanged()}else{U("remove",ad,am)}}function F(ac,ae,ad){var ab=V(ac);if(k(ac,ae,ad)&&(!("toggle" in ab[0])||ab[0].toggle)){B(ac,ae,ad)}else{Y(ac,ae,ad)}}function y(ac,ab,ah,af){var ad=V(ab),ai,ag,ae;function aj(an,ap,aq){var am,ao,ak=ap[aq],al;if(ap.onmatch){return ap.onmatch(an,ap,aq)}if(ak){if(ak.length===D){for(am in ak){if(ak.hasOwnProperty(am)){if(aq==="attributes"){ao=c.getAttrib(an,am)}else{ao=O(an,am)}if(af&&!ao&&!ap.exact){return}if((!af||ap.exact)&&!g(ao,q(ak[am],ah))){return}}}}else{for(al=0;al<ak.length;al++){if(aq==="attributes"?c.getAttrib(an,ak[al]):O(an,ak[al])){return ap}}}}return ap}if(ad&&ac){for(ag=0;ag<ad.length;ag++){ai=ad[ag];if(h(ac,ai)&&aj(ac,ai,"attributes")&&aj(ac,ai,"styles")){if(ae=ai.classes){for(ag=0;ag<ae.length;ag++){if(!c.hasClass(ac,ae[ag])){return}}}return ai}}}}function k(ad,af,ae){var ac;function ab(ag){ag=c.getParent(ag,function(ah){return !!y(ah,ad,af,true)});return y(ag,ad,af)}if(ae){return ab(ae)}ae=r.getNode();if(ab(ae)){return C}ac=r.getStart();if(ac!=ae){if(ab(ac)){return C}}return X}function v(ai,ah){var af,ag=[],ae={},ad,ac,ab;af=r.getStart();c.getParent(af,function(al){var ak,aj;for(ak=0;ak<ai.length;ak++){aj=ai[ak];if(!ae[aj]&&y(al,aj,ah)){ae[aj]=true;ag.push(aj)}}},c.getRoot());return ag}function z(af){var ah=V(af),ae,ad,ag,ac,ab;if(ah){ae=r.getStart();ad=n(ae);for(ac=ah.length-1;ac>=0;ac--){ab=ah[ac].selector;if(!ab){return C}for(ag=ad.length-1;ag>=0;ag--){if(c.is(ad[ag],ab)){return C}}}}return X}function J(ab,ae,ac){var ad;if(!P){P={};ad={};aa.onNodeChange.addToTop(function(ag,af,ai){var ah=n(ai),aj={};T(P,function(ak,al){T(ah,function(am){if(y(am,al,{},ak.similar)){if(!ad[al]){T(ak,function(an){an(true,{node:am,format:al,parents:ah})});ad[al]=ak}aj[al]=ak;return false}})});T(ad,function(ak,al){if(!aj[al]){delete ad[al];T(ak,function(am){am(false,{node:ai,format:al,parents:ah})})}})})}T(ab.split(","),function(af){if(!P[af]){P[af]=[];P[af].similar=ac}P[af].push(ae)});return this}a.extend(this,{get:V,register:l,apply:Y,remove:B,toggle:F,match:k,matchAll:v,matchNode:y,canApply:z,formatChanged:J});j();W();function h(ab,ac){if(g(ab,ac.inline)){return C}if(g(ab,ac.block)){return C}if(ac.selector){return c.is(ab,ac.selector)}}function g(ac,ab){ac=ac||"";ab=ab||"";ac=""+(ac.nodeName||ac);ab=""+(ab.nodeName||ab);return ac.toLowerCase()==ab.toLowerCase()}function O(ac,ab){var ad=c.getStyle(ac,ab);if(ab=="color"||ab=="backgroundColor"){ad=c.toHex(ad)}if(ab=="fontWeight"&&ad==700){ad="bold"}return""+ad}function q(ab,ac){if(typeof(ab)!="string"){ab=ab(ac)}else{if(ac){ab=ab.replace(/%(\w+)/g,function(ae,ad){return ac[ad]||ae})}}return ab}function f(ab){return ab&&ab.nodeType===3&&/^([\t \r\n]+|)$/.test(ab.nodeValue)}function S(ad,ac,ab){var ae=c.create(ac,ab);ad.parentNode.insertBefore(ae,ad);ae.appendChild(ad);return ae}function p(ab,am,ae){var ap,an,ah,al,ad=ab.startContainer,ai=ab.startOffset,ar=ab.endContainer,ak=ab.endOffset;function ao(aA){var au,ax,az,aw,av,at;au=ax=aA?ad:ar;av=aA?"previousSibling":"nextSibling";at=c.getRoot();function ay(aB){return aB.nodeName=="BR"&&aB.getAttribute("data-mce-bogus")&&!aB.nextSibling}if(au.nodeType==3&&!f(au)){if(aA?ai>0:ak<au.nodeValue.length){return au}}for(;;){if(!am[0].block_expand&&H(ax)){return ax}for(aw=ax[av];aw;aw=aw[av]){if(!K(aw)&&!f(aw)&&!ay(aw)){return ax}}if(ax.parentNode==at){au=ax;break}ax=ax.parentNode}return au}function ag(at,au){if(au===D){au=at.nodeType===3?at.length:at.childNodes.length}while(at&&at.hasChildNodes()){at=at.childNodes[au];if(at){au=at.nodeType===3?at.length:at.childNodes.length}}return{node:at,offset:au}}if(ad.nodeType==1&&ad.hasChildNodes()){an=ad.childNodes.length-1;ad=ad.childNodes[ai>an?an:ai];if(ad.nodeType==3){ai=0}}if(ar.nodeType==1&&ar.hasChildNodes()){an=ar.childNodes.length-1;ar=ar.childNodes[ak>an?an:ak-1];if(ar.nodeType==3){ak=ar.nodeValue.length}}function aq(au){var at=au;while(at){if(at.nodeType===1&&x(at)){return x(at)==="false"?at:au}at=at.parentNode}return au}function aj(au,ay,aA){var ax,av,az,at;function aw(aC,aE){var aF,aB,aD=aC.nodeValue;if(typeof(aE)=="undefined"){aE=aA?aD.length:0}if(aA){aF=aD.lastIndexOf(" ",aE);aB=aD.lastIndexOf("\u00a0",aE);aF=aF>aB?aF:aB;if(aF!==-1&&!ae){aF++}}else{aF=aD.indexOf(" ",aE);aB=aD.indexOf("\u00a0",aE);aF=aF!==-1&&(aB===-1||aF<aB)?aF:aB}return aF}if(au.nodeType===3){az=aw(au,ay);if(az!==-1){return{container:au,offset:az}}at=au}ax=new t(au,c.getParent(au,H)||aa.getBody());while(av=ax[aA?"prev":"next"]()){if(av.nodeType===3){at=av;az=aw(av);if(az!==-1){return{container:av,offset:az}}}else{if(H(av)){break}}}if(at){if(aA){ay=0}else{ay=at.length}return{container:at,offset:ay}}}function af(au,at){var av,aw,ay,ax;if(au.nodeType==3&&au.nodeValue.length===0&&au[at]){au=au[at]}av=n(au);for(aw=0;aw<av.length;aw++){for(ay=0;ay<am.length;ay++){ax=am[ay];if("collapsed" in ax&&ax.collapsed!==ab.collapsed){continue}if(c.is(av[aw],ax.selector)){return av[aw]}}}return au}function ac(au,at,aw){var av;if(!am[0].wrapper){av=c.getParent(au,am[0].block)}if(!av){av=c.getParent(au.nodeType==3?au.parentNode:au,I)}if(av&&am[0].wrapper){av=n(av,"ul,ol").reverse()[0]||av}if(!av){av=au;while(av[at]&&!H(av[at])){av=av[at];if(g(av,"br")){break}}}return av||au}ad=aq(ad);ar=aq(ar);if(K(ad.parentNode)||K(ad)){ad=K(ad)?ad:ad.parentNode;ad=ad.nextSibling||ad;if(ad.nodeType==3){ai=0}}if(K(ar.parentNode)||K(ar)){ar=K(ar)?ar:ar.parentNode;ar=ar.previousSibling||ar;if(ar.nodeType==3){ak=ar.length}}if(am[0].inline){if(ab.collapsed){al=aj(ad,ai,true);if(al){ad=al.container;ai=al.offset}al=aj(ar,ak);if(al){ar=al.container;ak=al.offset}}ah=ag(ar,ak);if(ah.node){while(ah.node&&ah.offset===0&&ah.node.previousSibling){ah=ag(ah.node.previousSibling)}if(ah.node&&ah.offset>0&&ah.node.nodeType===3&&ah.node.nodeValue.charAt(ah.offset-1)===" "){if(ah.offset>1){ar=ah.node;ar.splitText(ah.offset-1)}}}}if(am[0].inline||am[0].block_expand){if(!am[0].inline||(ad.nodeType!=3||ai===0)){ad=ao(true)}if(!am[0].inline||(ar.nodeType!=3||ak===ar.nodeValue.length)){ar=ao()}}if(am[0].selector&&am[0].expand!==X&&!am[0].inline){ad=af(ad,"previousSibling");ar=af(ar,"nextSibling")}if(am[0].block||am[0].selector){ad=ac(ad,"previousSibling");ar=ac(ar,"nextSibling");if(am[0].block){if(!H(ad)){ad=ao(true)}if(!H(ar)){ar=ao()}}}if(ad.nodeType==1){ai=s(ad);ad=ad.parentNode}if(ar.nodeType==1){ak=s(ar)+1;ar=ar.parentNode}return{startContainer:ad,startOffset:ai,endContainer:ar,endOffset:ak}}function Z(ah,ag,ae,ab){var ad,ac,af;if(!h(ae,ah)){return X}if(ah.remove!="all"){T(ah.styles,function(aj,ai){aj=q(aj,ag);if(typeof(ai)==="number"){ai=aj;ab=0}if(!ab||g(O(ab,ai),aj)){c.setStyle(ae,ai,"")}af=1});if(af&&c.getAttrib(ae,"style")==""){ae.removeAttribute("style");ae.removeAttribute("data-mce-style")}T(ah.attributes,function(ak,ai){var aj;ak=q(ak,ag);if(typeof(ai)==="number"){ai=ak;ab=0}if(!ab||g(c.getAttrib(ab,ai),ak)){if(ai=="class"){ak=c.getAttrib(ae,ai);if(ak){aj="";T(ak.split(/\s+/),function(al){if(/mce\w+/.test(al)){aj+=(aj?" ":"")+al}});if(aj){c.setAttrib(ae,ai,aj);return}}}if(ai=="class"){ae.removeAttribute("className")}if(e.test(ai)){ae.removeAttribute("data-mce-"+ai)}ae.removeAttribute(ai)}});T(ah.classes,function(ai){ai=q(ai,ag);if(!ab||c.hasClass(ab,ai)){c.removeClass(ae,ai)}});ac=c.getAttribs(ae);for(ad=0;ad<ac.length;ad++){if(ac[ad].nodeName.indexOf("_")!==0){return X}}}if(ah.remove!="none"){o(ae,ah);return C}}function o(ad,ae){var ab=ad.parentNode,ac;function af(ah,ag,ai){ah=E(ah,ag,ai);return !ah||(ah.nodeName=="BR"||H(ah))}if(ae.block){if(!m){if(H(ad)&&!H(ab)){if(!af(ad,X)&&!af(ad.firstChild,C,1)){ad.insertBefore(c.create("br"),ad.firstChild)}if(!af(ad,C)&&!af(ad.lastChild,X,1)){ad.appendChild(c.create("br"))}}}else{if(ab==c.getRoot()){if(!ae.list_block||!g(ad,ae.list_block)){T(a.grep(ad.childNodes),function(ag){if(d(m,ag.nodeName.toLowerCase())){if(!ac){ac=S(ag,m)}else{ac.appendChild(ag)}}else{ac=0}})}}}}if(ae.selector&&ae.inline&&!g(ae.inline,ad)){return}c.remove(ad,1)}function E(ac,ab,ad){if(ac){ab=ab?"nextSibling":"previousSibling";for(ac=ad?ac:ac[ab];ac;ac=ac[ab]){if(ac.nodeType==1||!f(ac)){return ac}}}}function K(ab){return ab&&ab.nodeType==1&&ab.getAttribute("data-mce-type")=="bookmark"}function u(af,ae){var ab,ad,ac;function ah(ak,aj){if(ak.nodeName!=aj.nodeName){return X}function ai(am){var an={};T(c.getAttribs(am),function(ao){var ap=ao.nodeName.toLowerCase();if(ap.indexOf("_")!==0&&ap!=="style"){an[ap]=c.getAttrib(am,ap)}});return an}function al(ap,ao){var an,am;for(am in ap){if(ap.hasOwnProperty(am)){an=ao[am];if(an===D){return X}if(ap[am]!=an){return X}delete ao[am]}}for(am in ao){if(ao.hasOwnProperty(am)){return X}}return C}if(!al(ai(ak),ai(aj))){return X}if(!al(c.parseStyle(c.getAttrib(ak,"style")),c.parseStyle(c.getAttrib(aj,"style")))){return X}return C}function ag(aj,ai){for(ad=aj;ad;ad=ad[ai]){if(ad.nodeType==3&&ad.nodeValue.length!==0){return aj}if(ad.nodeType==1&&!K(ad)){return ad}}return aj}if(af&&ae){af=ag(af,"previousSibling");ae=ag(ae,"nextSibling");if(ah(af,ae)){for(ad=af.nextSibling;ad&&ad!=ae;){ac=ad;ad=ad.nextSibling;af.appendChild(ac)}c.remove(ae);T(a.grep(ae.childNodes),function(ai){af.appendChild(ai)});return af}}return ae}function I(ab){return/^(h[1-6]|p|div|pre|address|dl|dt|dd)$/.test(ab)}function M(ac,ag){var ab,af,ad,ae;ab=ac[ag?"startContainer":"endContainer"];af=ac[ag?"startOffset":"endOffset"];if(ab.nodeType==1){ad=ab.childNodes.length-1;if(!ag&&af){af--}ab=ab.childNodes[af>ad?ad:af]}if(ab.nodeType===3&&ag&&af>=ab.nodeValue.length){ab=new t(ab,aa.getBody()).next()||ab}if(ab.nodeType===3&&!ag&&af===0){ab=new t(ab,aa.getBody()).prev()||ab}return ab}function U(ak,ab,ai){var al="_mce_caret",ac=aa.settings.caret_debug;function ad(ap){var ao=c.create("span",{id:al,"data-mce-bogus":true,style:ac?"color:red":""});if(ap){ao.appendChild(aa.getDoc().createTextNode(G))}return ao}function aj(ap,ao){while(ap){if((ap.nodeType===3&&ap.nodeValue!==G)||ap.childNodes.length>1){return false}if(ao&&ap.nodeType===1){ao.push(ap)}ap=ap.firstChild}return true}function ag(ao){while(ao){if(ao.id===al){return ao}ao=ao.parentNode}}function af(ao){var ap;if(ao){ap=new t(ao,ao);for(ao=ap.current();ao;ao=ap.next()){if(ao.nodeType===3){return ao}}}}function ae(aq,ap){var ar,ao;if(!aq){aq=ag(r.getStart());if(!aq){while(aq=c.get(al)){ae(aq,false)}}}else{ao=r.getRng(true);if(aj(aq)){if(ap!==false){ao.setStartBefore(aq);ao.setEndBefore(aq)}c.remove(aq)}else{ar=af(aq);if(ar.nodeValue.charAt(0)===G){ar=ar.deleteData(0,1)}c.remove(aq,1)}r.setRng(ao)}}function ah(){var aq,ao,av,au,ar,ap,at;aq=r.getRng(true);au=aq.startOffset;ap=aq.startContainer;at=ap.nodeValue;ao=ag(r.getStart());if(ao){av=af(ao)}if(at&&au>0&&au<at.length&&/\w/.test(at.charAt(au))&&/\w/.test(at.charAt(au-1))){ar=r.getBookmark();aq.collapse(true);aq=p(aq,V(ab));aq=N.split(aq);Y(ab,ai,aq);r.moveToBookmark(ar)}else{if(!ao||av.nodeValue!==G){ao=ad(true);av=ao.firstChild;aq.insertNode(ao);au=1;Y(ab,ai,ao)}else{Y(ab,ai,ao)}r.setCursorLocation(av,au)}}function am(){var ao=r.getRng(true),ap,ar,av,au,aq,ay,ax=[],at,aw;ap=ao.startContainer;ar=ao.startOffset;aq=ap;if(ap.nodeType==3){if(ar!=ap.nodeValue.length||ap.nodeValue===G){au=true}aq=aq.parentNode}while(aq){if(y(aq,ab,ai)){ay=aq;break}if(aq.nextSibling){au=true}ax.push(aq);aq=aq.parentNode}if(!ay){return}if(au){av=r.getBookmark();ao.collapse(true);ao=p(ao,V(ab),true);ao=N.split(ao);B(ab,ai,ao);r.moveToBookmark(av)}else{aw=ad();aq=aw;for(at=ax.length-1;at>=0;at--){aq.appendChild(c.clone(ax[at],false));aq=aq.firstChild}aq.appendChild(c.doc.createTextNode(G));aq=aq.firstChild;c.insertAfter(aw,ay);r.setCursorLocation(aq,1)}}function an(){var ap,ao,aq;ao=ag(r.getStart());if(ao&&!c.isEmpty(ao)){a.walk(ao,function(ar){if(ar.nodeType==1&&ar.id!==al&&!c.isEmpty(ar)){c.setAttrib(ar,"data-mce-bogus",null)}},"childNodes")}}if(!self._hasCaretEvents){aa.onBeforeGetContent.addToTop(function(){var ao=[],ap;if(aj(ag(r.getStart()),ao)){ap=ao.length;while(ap--){c.setAttrib(ao[ap],"data-mce-bogus","1")}}});a.each("onMouseUp onKeyUp".split(" "),function(ao){aa[ao].addToTop(function(){ae();an()})});aa.onKeyDown.addToTop(function(ao,aq){var ap=aq.keyCode;if(ap==8||ap==37||ap==39){ae(ag(r.getStart()))}an()});r.onSetContent.add(an);self._hasCaretEvents=true}if(ak=="apply"){ah()}else{am()}}function R(ac){var ab=ac.startContainer,ai=ac.startOffset,ae,ah,ag,ad,af;if(ab.nodeType==3&&ai>=ab.nodeValue.length){ai=s(ab);ab=ab.parentNode;ae=true}if(ab.nodeType==1){ad=ab.childNodes;ab=ad[Math.min(ai,ad.length-1)];ah=new t(ab,c.getParent(ab,c.isBlock));if(ai>ad.length-1||ae){ah.next()}for(ag=ah.current();ag;ag=ah.next()){if(ag.nodeType==3&&!f(ag)){af=c.create("a",null,G);ag.parentNode.insertBefore(af,ag);ac.setStart(ag,0);r.setRng(ac);c.remove(af);return}}}}}})(tinymce);tinymce.onAddEditor.add(function(e,a){var d,h,g,c=a.settings;function b(j,i){e.each(i,function(l,k){if(l){g.setStyle(j,k,l)}});g.rename(j,"span")}function f(i,j){g=i.dom;if(c.convert_fonts_to_spans){e.each(g.select("font,u,strike",j.node),function(k){d[k.nodeName.toLowerCase()](a.dom,k)})}}if(c.inline_styles){h=e.explode(c.font_size_legacy_values);d={font:function(j,i){b(i,{backgroundColor:i.style.backgroundColor,color:i.color,fontFamily:i.face,fontSize:h[parseInt(i.size,10)-1]})},u:function(j,i){b(i,{textDecoration:"underline"})},strike:function(j,i){b(i,{textDecoration:"line-through"})}};a.onPreProcess.add(f);a.onSetContent.add(f);a.onInit.add(function(){a.selection.onSetContent.add(f)})}});(function(b){var a=b.dom.TreeWalker;b.EnterKey=function(f){var i=f.dom,e=f.selection,d=f.settings,h=f.undoManager,c=f.schema.getNonEmptyElements();function g(A){var v=e.getRng(true),G,j,z,u,p,M,B,o,k,n,t,J,x,C;function E(N){return N&&i.isBlock(N)&&!/^(TD|TH|CAPTION|FORM)$/.test(N.nodeName)&&!/^(fixed|absolute)/i.test(N.style.position)&&i.getContentEditable(N)!=="true"}function F(O){var N;if(b.isIE&&i.isBlock(O)){N=e.getRng();O.appendChild(i.create("span",null,"\u00a0"));e.select(O);O.lastChild.outerHTML="";e.setRng(N)}}function y(P){var O=P,Q=[],N;while(O=O.firstChild){if(i.isBlock(O)){return}if(O.nodeType==1&&!c[O.nodeName.toLowerCase()]){Q.push(O)}}N=Q.length;while(N--){O=Q[N];if(!O.hasChildNodes()||(O.firstChild==O.lastChild&&O.firstChild.nodeValue==="")){i.remove(O)}else{if(O.nodeName=="A"&&(O.innerText||O.textContent)===" "){i.remove(O)}}}}function m(O){var T,R,N,U,S,Q=O,P;N=i.createRng();if(O.hasChildNodes()){T=new a(O,O);while(R=T.current()){if(R.nodeType==3){N.setStart(R,0);N.setEnd(R,0);break}if(c[R.nodeName.toLowerCase()]){N.setStartBefore(R);N.setEndBefore(R);break}Q=R;R=T.next()}if(!R){N.setStart(Q,0);N.setEnd(Q,0)}}else{if(O.nodeName=="BR"){if(O.nextSibling&&i.isBlock(O.nextSibling)){if(!M||M<9){P=i.create("br");O.parentNode.insertBefore(P,O)}N.setStartBefore(O);N.setEndBefore(O)}else{N.setStartAfter(O);N.setEndAfter(O)}}else{N.setStart(O,0);N.setEnd(O,0)}}e.setRng(N);i.remove(P);S=i.getViewPort(f.getWin());U=i.getPos(O).y;if(U<S.y||U+25>S.y+S.h){f.getWin().scrollTo(0,U<S.y?U:U-S.h+25)}}function r(O){var P=z,R,Q,N;R=O||t=="TABLE"?i.create(O||x):p.cloneNode(false);N=R;if(d.keep_styles!==false){do{if(/^(SPAN|STRONG|B|EM|I|FONT|STRIKE|U)$/.test(P.nodeName)){if(P.id=="_mce_caret"){continue}Q=P.cloneNode(false);i.setAttrib(Q,"id","");if(R.hasChildNodes()){Q.appendChild(R.firstChild);R.appendChild(Q)}else{N=Q;R.appendChild(Q)}}}while(P=P.parentNode)}if(!b.isIE){N.innerHTML='<br data-mce-bogus="1">'}return R}function q(Q){var P,O,N;if(z.nodeType==3&&(Q?u>0:u<z.nodeValue.length)){return false}if(z.parentNode==p&&C&&!Q){return true}if(Q&&z.nodeType==1&&z==p.firstChild){return true}if(z.nodeName==="TABLE"||(z.previousSibling&&z.previousSibling.nodeName=="TABLE")){return(C&&!Q)||(!C&&Q)}P=new a(z,p);if(z.nodeType==3){if(Q&&u==0){P.prev()}else{if(!Q&&u==z.nodeValue.length){P.next()}}}while(O=P.current()){if(O.nodeType===1){if(!O.getAttribute("data-mce-bogus")){N=O.nodeName.toLowerCase();if(c[N]&&N!=="br"){return false}}}else{if(O.nodeType===3&&!/^[ \t\r\n]*$/.test(O.nodeValue)){return false}}if(Q){P.prev()}else{P.next()}}return true}function l(N,T){var U,S,P,R,Q,O=x||"P";S=i.getParent(N,i.isBlock);if(!S||!E(S)){S=S||j;if(!S.hasChildNodes()){U=i.create(O);S.appendChild(U);v.setStart(U,0);v.setEnd(U,0);return U}R=N;while(R.parentNode!=S){R=R.parentNode}while(R&&!i.isBlock(R)){P=R;R=R.previousSibling}if(P){U=i.create(O);P.parentNode.insertBefore(U,P);R=P;while(R&&!i.isBlock(R)){Q=R.nextSibling;U.appendChild(R);R=Q}v.setStart(N,T);v.setEnd(N,T)}}return N}function H(){function N(P){var O=n[P?"firstChild":"lastChild"];while(O){if(O.nodeType==1){break}O=O[P?"nextSibling":"previousSibling"]}return O===p}o=x?r(x):i.create("BR");if(N(true)&&N()){i.replace(o,n)}else{if(N(true)){n.parentNode.insertBefore(o,n)}else{if(N()){i.insertAfter(o,n);F(o)}else{G=v.cloneRange();G.setStartAfter(p);G.setEndAfter(n);k=G.extractContents();i.insertAfter(k,n);i.insertAfter(o,n)}}}i.remove(p);m(o);h.add()}function D(){var O=new a(z,p),N;while(N=O.current()){if(N.nodeName=="BR"){return true}N=O.next()}}function L(){var P,O,N;if(z&&z.nodeType==3&&u>=z.nodeValue.length){if(!b.isIE&&!D()){P=i.create("br");v.insertNode(P);v.setStartAfter(P);v.setEndAfter(P);O=true}}P=i.create("br");v.insertNode(P);if(b.isIE&&t=="PRE"&&(!M||M<8)){P.parentNode.insertBefore(i.doc.createTextNode("\r"),P)}N=i.create("span",{},"&nbsp;");P.parentNode.insertBefore(N,P);e.scrollIntoView(N);i.remove(N);if(!O){v.setStartAfter(P);v.setEndAfter(P)}else{v.setStartBefore(P);v.setEndBefore(P)}e.setRng(v);h.add()}function s(N){do{if(N.nodeType===3){N.nodeValue=N.nodeValue.replace(/^[\r\n]+/,"")}N=N.firstChild}while(N)}function K(P){var N=i.getRoot(),O,Q;O=P;while(O!==N&&i.getContentEditable(O)!=="false"){if(i.getContentEditable(O)==="true"){Q=O}O=O.parentNode}return O!==N?Q:N}function I(O){var N;if(!b.isIE){O.normalize();N=O.lastChild;if(!N||(/^(left|right)$/gi.test(i.getStyle(N,"float",true)))){i.add(O,"br")}}}if(!v.collapsed){f.execCommand("Delete");return}if(A.isDefaultPrevented()){return}z=v.startContainer;u=v.startOffset;x=(d.force_p_newlines?"p":"")||d.forced_root_block;x=x?x.toUpperCase():"";M=i.doc.documentMode;B=A.shiftKey;if(z.nodeType==1&&z.hasChildNodes()){C=u>z.childNodes.length-1;z=z.childNodes[Math.min(u,z.childNodes.length-1)]||z;if(C&&z.nodeType==3){u=z.nodeValue.length}else{u=0}}j=K(z);if(!j){return}h.beforeChange();if(!i.isBlock(j)&&j!=i.getRoot()){if(!x||B){L()}return}if((x&&!B)||(!x&&B)){z=l(z,u)}p=i.getParent(z,i.isBlock);n=p?i.getParent(p.parentNode,i.isBlock):null;t=p?p.nodeName.toUpperCase():"";J=n?n.nodeName.toUpperCase():"";if(J=="LI"&&!A.ctrlKey){p=n;t=J}if(t=="LI"){if(!x&&B){L();return}if(i.isEmpty(p)){if(/^(UL|OL|LI)$/.test(n.parentNode.nodeName)){return false}H();return}}if(t=="PRE"&&d.br_in_pre!==false){if(!B){L();return}}else{if((!x&&!B&&t!="LI")||(x&&B)){L();return}}x=x||"P";if(q()){if(/^(H[1-6]|PRE)$/.test(t)&&J!="HGROUP"){o=r(x)}else{o=r()}if(d.end_container_on_empty_block&&E(n)&&i.isEmpty(p)){o=i.split(n,p)}else{i.insertAfter(o,p)}m(o)}else{if(q(true)){o=p.parentNode.insertBefore(r(),p);F(o)}else{G=v.cloneRange();G.setEndAfter(p);k=G.extractContents();s(k);o=k.firstChild;i.insertAfter(k,p);y(o);I(p);m(o)}}i.setAttrib(o,"id","");h.add()}f.onKeyDown.add(function(k,j){if(j.keyCode==13){if(g(j)!==false){j.preventDefault()}}})}})(tinymce);
(function() {

  jQuery(function() {});

}).call(this);
(function() {



}).call(this);
(function() {
  var Mailing;

  Mailing = {
    setup: function() {
      $("#mailing_receiver_id").chosen();
      tinyMCE.init({
        mode: "exact",
        elements: "mailing_body"
      });
      return $("#recipients_search").submit(function() {
        $.get(this.action, $(this).serialize(), null, 'script');
        return false;
      });
    }
  };

  Mailing.setup();

}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//







;
