/**
 * Created by Danny on 13/12/13.
 */
var autoBinder = autoBinder || {};


autoBinder.Provider = function(parameters){
    var self = this;
    self.binder = parameters.binder;
    self.viewModel = parameters.viewModel;
    self.wire = parameters.wire;
    self.options = parameters.options;
    self.active = parameters.options.autoStart || false;
    self.initialised = false;

    self.init = function(){
        self.wire.init(self.options);
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
    }
};

