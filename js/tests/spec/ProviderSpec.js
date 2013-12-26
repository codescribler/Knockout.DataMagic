/**
 * Created by Danny on 11/12/13.
 */

var datamagic = datamagic || {};


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
        binder  = new datamagic.Binder();

        wire    = new datamagic.FireWire();
        spyOn(wire, 'saveData');
        spyOn(wire, 'init');
        wire.saveData.reset()

        viewModel = {
          name  : ko.observable('Daniel'),
          age   : ko.observable(35),
          alive: ko.observable(false)
        };

        provider = new datamagic.dm({binder: binder, viewModel: viewModel, wire: wire, options: options});
    });

    it("must initialise the wire", function(){
        expect(wire.init).toHaveBeenCalledWith({ baseUrl : 'http://www.example.com/', autoStart: true });
    });

    it("must save a model on change", function(){
        viewModel.name('Daniel Whittaker');
        expect(wire.saveData).toHaveBeenCalledWith({ name : 'Daniel Whittaker', age : 35, alive : false });
    });

    it("when stopped should stop saving changes", function(){
        provider.stop();
        viewModel.name('Daniel Whittaker');
        expect(wire.saveData.callCount).toEqual(0);
    });

    it("should trigger a save when a boolean observable is set to true", function(){
        viewModel.alive(true);
        expect(wire.saveData).toHaveBeenCalledWith({ name : 'Daniel', age : 35, alive : true });
    });

    it("should trigger a save when a boolean observable is set to false", function(){
        viewModel.alive(true);
        viewModel.alive(false);
        expect(wire.saveData).toHaveBeenCalledWith({ name : 'Daniel', age : 35, alive : true });
        expect(wire.saveData.callCount).toEqual(2);
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
        binder  = new datamagic.Binder();

        wire    = new datamagic.FireWire();
        spyOn(wire, 'saveData');
        spyOn(wire, 'init');
        wire.saveData.reset()

        viewModel = {
            firstName  : ko.observable('Bob'),
            lastName  : ko.observable('Dylan'),
            age   : ko.observable(35)
        };

        provider = new datamagic.dm({binder: binder, viewModel: viewModel, wire: wire, options: options});
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

