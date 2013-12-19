/**
 * Created by Danny on 11/12/13.
 */

var autoBinder = autoBinder || {};

//autoBinder.FakeWire = function(){
//    var self = this;
//    self.basePath = '';
//    self.model  = {};
//
//    self.init = function(options){
//        self.basePath = options.baseUrl;
//    };
//
//    self.saveData = function(data){
//        self.model = data;
//    };
//};

describe("A persistence provider", function(){
    var provider;
    var binder;
    var viewModel;
    var wire;
    var options;

    beforeEach(function() {

        options = {
            baseUrl     : "http://www.example.com/",
            autoStart: true
        };
        binder  = new autoBinder.Binder();

        wire    = new autoBinder.FireWire();
        spyOn(wire, 'saveData');
        spyOn(wire, 'init');
        wire.saveData.reset()

        viewModel = {
          name  : ko.observable('Daniel'),
          age   : ko.observable(35)
        };

        provider = new autoBinder.Provider({binder: binder, viewModel: viewModel, wire: wire, options: options});
    });

    it("must initialise the wire", function(){
        expect(wire.init).toHaveBeenCalledWith({ baseUrl : 'http://www.example.com/', autoStart: true });
    });

    it("must save a model on change", function(){
        viewModel.name('Daniel Whittaker');
        expect(wire.saveData).toHaveBeenCalledWith({ name : 'Daniel Whittaker', age : 35 });
    });

    it("when stopped should stop saving changes", function(){
        provider.stop();
        viewModel.name('Daniel Whittaker');
        expect(wire.saveData.callCount).toEqual(1); // It's 1 because on provider creation, autoStart is true
    });
});

describe("A persistence provider with exclusions and not autoStarted", function(){
    var provider;
    var binder;
    var viewModel;
    var wire;
    var options;

    beforeEach(function() {

        options = {
            baseUrl     : "http://www.example.com/",
            exclusions  : ["lastName", "age"]
        };
        binder  = new autoBinder.Binder();

        wire    = new autoBinder.FireWire();
        spyOn(wire, 'saveData');
        spyOn(wire, 'init');
        wire.saveData.reset()

        viewModel = {
            firstName  : ko.observable('Bob'),
            lastName  : ko.observable('Dylan'),
            age   : ko.observable(35)
        };

        provider = new autoBinder.Provider({binder: binder, viewModel: viewModel, wire: wire, options: options});
    });

    it("will call initialise when started", function(){
        provider.start();
        expect(wire.init).toHaveBeenCalledWith({ baseUrl : 'http://www.example.com/', exclusions  : ["lastName", "age"] });
    });

    it("when started will not call saveData on change of excluded field", function(){
        provider.start();
        viewModel.age(36);
        expect(wire.saveData.callCount).toEqual(0);
    });

});