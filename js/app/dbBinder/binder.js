/**
 * Created by daniel.whittaker on 30/10/13.
 */

var autoBinder = autoBinder || {};

autoBinder.Binder = function(){
   // Private members
    this.payload = {};
    this.callBack = {};
    this.viewModel = {};
    this.exclusions = [];
};

autoBinder.Binder.prototype = function(){
    var attach = function(viewModel, exclusions, callBack){
        this.viewModel = viewModel;
        this.callBack = callBack;
        this.exclusions = exclusions;

        attachExtenders.call(this, viewModel, exclusions);

        var options = {
            payload : this.payload,
            callBack : this.callBack,
            viewModel : this.viewModel,
            exclusions : this.exclusions,
            cleanPayload : cleanPayload
        };

        hydratePayload(options);
    };

    var attachExtenders = function(obj, exclusions){
        var target = obj.extend ? obj() : obj;
        exclusions = exclusions || [];
        for(var prop in target){
            if(isKnockoutArray(target[prop])){
                doAttachment.call(this, prop, target[prop]);
                attachExtenders.call(this,target[prop]);
            }else{
                if(shouldTrack.call(this, prop, target)) doAttachment.call(this, prop, target[prop]);
            }
        }
    }

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
        var options = {
            name : propertyName,
            payload : this.payload,
            callBack : this.callBack,
            viewModel : this.viewModel,
            hydratePayload : hydratePayload,
            cleanPayload : cleanPayload,
            exclusions : this.exclusions
        };
        observable.extend({logChange : options });
    };

    ko.extenders.logChange = function(target, options){
        var self = this;
        target.subscribe(function(newValue){
            options.hydratePayload(options);
        });
    };

    var hydratePayload = function(options){
        options.payload = ko.toJS(options.viewModel);
        if(options.exclusions && options.exclusions.length > 0) options.cleanPayload(options)
        if(options.payload) options.callBack(options.payload);
    };

    var cleanPayload = function(options){
        ko.utils.arrayForEach(options.exclusions, function(exclude){
           delete options.payload[exclude];
        });
    };

    var isKnockoutArray = function(observable){
        return observable.push;
    };

    return {
        attach : attach
    };
}();