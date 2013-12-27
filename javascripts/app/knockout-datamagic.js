/**
 * Created by Danny on 24/12/13.
 */
var datamagic = datamagic || {};

datamagic.Binder = function(){
    // Private members
    this.payload = {};
    this.callBack = {};
    this.viewModel = {};
    this.exclusions = [];
};

datamagic.Binder.prototype = function(){
    var attach = function(viewModel, exclusions, callBack){
        this.viewModel = viewModel;
        this.callBack = callBack;
        this.exclusions = exclusions;

        attachExtenders.call(this, viewModel, exclusions);
    };

    var attachExtenders = function(obj, exclusions){
        var target = obj.extend ? obj() : obj;
        exclusions = exclusions || [];

        if(Object.prototype.toString.call( target ) === '[object Array]'){
            for(var i = 0; i < target.length; i++) {
                doAttachment.call(this, prop, target[i]);
                attachExtenders.call(this,target[i], exclusions);
            }
        }

        for(var prop in target){
            if(isKnockoutArray(target[prop])){
                doAttachment.call(this, prop, target[prop]);
                attachExtenders.call(this,target[prop](), exclusions);
                //attachExtenders.call(this,target[prop]);
            }else{
                if(shouldTrack.call(this, prop, target)){
                    doAttachment.call(this, prop, target[prop]);
                }else{
                    if (this.exclusions.indexOf(prop) < 0) {
                        this.exclusions.push(prop);
                    }
                }
            }
        }
    };

    var shouldTrack = function(prop, target){
        if(!isExcludedProperty.call(this, prop)){
            if(target[prop].extend) return true;
        }
        return false;
    };

    var isExcludedProperty = function(prop){
        return ko.utils.arrayFirst(this.exclusions, function(item){
            return item === prop;
        }) ? true : false;
    };

    var doAttachment = function(propertyName, observable){
        if(observable.extend){
            var options = {
                name : propertyName,
                payload : this.payload,
                callBack : this.callBack,
                viewModel : this.viewModel,
                hydratePayload : hydratePayload,
                cleanPayload : cleanPayload,
                exclusions : this.exclusions
            };
            //observable = observable.extend({logChange : options });
            observable.extend({logChange : options });
        }
    };

    ko.extenders.logChange = function(target, options){
        if(isKnockoutArray(target)){
            target.subscribe(function(changes){

                var rebind = false;

                for(var i = 0; i < changes.length; i++){
                    if(changes[i].status === "added") {
                        rebind = true;
                        break;
                    }
                }

                if(rebind){
                    // Seems a bit excessive - could cause a performance issue here
                    // TODO: Work out how to bind to changes in the new object
                    attach(options.viewModel, options.exclusions,options.callBack);
                }

                options.hydratePayload(options);
            }, null, "arrayChange");
        }else{
            target.subscribe(function(newValue){
                options.hydratePayload(options);
            });
        }
    };



    var hydratePayload = function(options){
        options.payload = ko.toJS(options.viewModel);
        if(options.exclusions && options.exclusions.length > 0) options.cleanPayload(options);
        if(options.payload) options.callBack(options.payload);
    };

    var cleanPayload = function(options){
        options.payload = deepCleanPayload(options.payload, options.exclusions);
    };

    var deepCleanPayload = function(target, exclusions){
        for(var prop in target){
            if(Object.prototype.toString.call( target[prop] ) === '[object Array]'){
                for(var i = 0; i < target[prop].length; i++) {
                    target[prop][i] = deepCleanPayload.call(this,target[prop][i], exclusions);
                }
            }
        }
        target = removeExcludedProperties(target, exclusions);

        return target;
    };

    var removeExcludedProperties = function(target, exclusions){
        ko.utils.arrayForEach(exclusions, function(exclude){
            delete target[exclude];
        });

        return target;
    };

    var isKnockoutArray = function(observable){
        return observable.push;
    };

    return {
        attach : attach
    };
}();

// Provider co-ordinates the interactions between the binder and the data persistence source
datamagic.dm = function(parameters){
    var self = this;
    self.binder = parameters.binder || new datamagic.Binder();
    self.viewModel = parameters.viewModel;
    self.wire = parameters.wire;
    self.options = parameters.options;
    self.active = parameters.options.autoStart || false;
    self.initialised = false;

    self.init = function(){
        self.binder.attach(self.viewModel, self.options.exclusions || [], self.receiveUpdate);
        self.initialised = true;
    };

    self.start = function(){
        if(!self.initialised) self.init();
        self.active = true;
    };

    self.stop = function(){
        self.active = false;
    };

    self.receiveUpdate = function(data){
        if(self.active) self.wire.saveData(data);
    };

    if(self.active){
        self.init();
    }

    return{
        start   : self.start,
        stop    : self.stop
    };
};