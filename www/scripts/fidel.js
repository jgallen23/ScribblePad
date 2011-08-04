/*!
  * Fidel - A javascript controller
  * v1.2
  * https://github.com/jgallen23/fidel
  * copyright JGA 2011
  * MIT License
  */

!function(obj) {

  var Fidel = {};
  Fidel.guid = function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }).toUpperCase();      
  };
  Fidel.extend = function() {
    throw new Error("Fidel.extend is deprecated, please use Fidel.ViewController.extend");
  };

  var o = obj.Fidel;
  Fidel.noConflict = function() {
    obj.Fidel = o;
    return this;
  };
  obj.Fidel = Fidel;
}(this);

!function(f) {
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  f.Class = function(){};
  
  // Create a new Class that inherits from this class
  f.Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if (!initializing) {
        this.guid = f.guid();
        if (this._initialize) this._initialize.apply(this, arguments);
        if (this.init) this.init.apply(this, arguments);
      }
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    Class.prototype.proxy = function(func) {
      var thisObject = this;
      return(function(){ 
        return func.apply(thisObject, arguments); 
      });
    };
    
    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
}(Fidel || this);

!function(f) {
  var cache = {}; //check for "c_" cache for unit testing
  //publish("/some/topic", ["a","b","c"]);
  f.publish = function(topic, args){

    var subs = cache[topic], len = subs ? subs.length : 0;

    //can change loop or reverse array if the order matters
    while(len--){
      subs[len].apply(this, args || []);
    }
  };
  //subscribe("/some/topic", function(a, b, c){ /* handle data */ });
  f.subscribe = function(topic, callback){
    if(!cache[topic]){
            cache[topic] = [];
    }
    cache[topic].push(callback);
    return [topic, callback]; // Array
  };
  //var handle = subscribe("/some/topic", function(){});
  //unsubscribe(handle);
  f.unsubscribe = function(handle){
    console.log(handle);
    var subs = cache[handle[0]],
              callback = handle[1],
              len = subs ? subs.length : 0;

    while(len--){
      if(subs[len] === callback){
      subs.splice(len, 1);
      }
    }
  };


  f.Class.prototype.on = f.Class.prototype.bind = function(name, callback) {
    return f.subscribe(this.guid+"."+name, this.proxy(callback));
  };
  f.Class.prototype.emit = f.Class.prototype.trigger = function(name, data) {
    f.publish(this.guid+"."+name, data);
    f.publish(name, data);
  };
  f.Class.prototype.removeListener = f.Class.prototype.unbind = function(handle) {
    f.unsubscribe(handle);
  };

}(Fidel || this);

(function(f) {
  var eventSplitter = /^(\w+)\s*(.*)$/;

  var ViewController = f.Class.extend({
    _initialize: function(options) {

      for (var key in options) {
        this[key] = options[key];
      }
      if (!this.el) throw "el is required";
      
      if (this.events) this.delegateEvents();
      if (this.elements) this.refreshElements();
      if (this.templateSelector) this.loadTemplate();
      if (!this.actionEvent) this.actionEvent = "click";
      if (this.subs) this.bindEvents();
      this.delegateActions();
      this.getDataElements();
    },
    delegateEvents: function() {
      for (var key in this.events) {
        var methodName = key; 
        var method = this.proxy(this[methodName]);

        var match = this.events[key].match(eventSplitter);
        var eventName = match[1], selector = match[2];

        if (selector === '') {
          this.el.bind(eventName, method);
        } else {
          this.el.delegate(selector, eventName, method);
        }
      }
    },
    delegateActions: function() {
      var elements = this.find("[data-action]");
      for (var i = 0, c = elements.length; i < c; i++) {
        var elem = $(elements[i]);
        var methodName = elem.attr("data-action");
        var method = this.proxy(this[methodName]);
        var eventName = this.actionEvent, selector = '[data-action="'+methodName+'"]';
        this.el.delegate(selector, eventName, method);
      }
    },
    refreshElements: function() {
      for (var key in this.elements) {
        this[key] = this.find(this.elements[key]);
      }
    },
    getDataElements: function() {
      var self = this;
      var elements = this.find("[data-element]");
      for (var i = 0, c = elements.length; i < c; i++) {
        var elem = $(elements[i]);
        self[elem.attr("data-element")] = elem;
      }
    },
    bindEvents: function() {
      for (var key in this.subs) {
        this.bind(key, this.subs[key]);
      }
    },
    loadTemplate: function() {
      this.template = $(this.templateSelector).html();
    },
    find: function(selector) {
      return $(selector, this.el[0]);
    },
    render: function(data, selector) {
      var str = window.str || $;
      if (str) {
        var tmp = str.template(this.template, data);
        selector = (selector)?$(selector):this.el;
        selector.html(tmp);
      }
    }
  });
  f.ViewController = ViewController;
})(Fidel || this);
