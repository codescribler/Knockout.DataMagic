/**
 * Created by Danny on 11/12/13.
 */

var datamagic = datamagic || {};


describe("A persistence provider", function(){
    var provider;
    var viewModel;
    var wire;
    var options;

    beforeEach(function() {

        options = {
            baseUrl     : "http://www.example.com/",
            autoStart: true
        };
        wire    = new datamagic.ConsoleWire(options);
        spyOn(wire, 'saveData');

        wire.saveData.reset();

        viewModel = {
          name  : ko.observable('Daniel'),
          age   : ko.observable(35),
          alive: ko.observable(false)
        };

        provider = new datamagic.dm({viewModel: viewModel, wire: wire, options: options});
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

    describe("when dealing with observable arrays containing complex objects", function(){
        var provider;
        var viewModel;
        var wire;
        var options;
        var ComplexItem = function(name, age){
            var self = this;
            self.name = ko.observable(name);
            self.age = ko.observable(age);
        };

        beforeEach(function() {
            options = {baseUrl : "http://www.example.com"};
            wire    = new datamagic.ConsoleWire(options);
            spyOn(wire, 'saveData');
            wire.saveData.reset();

            viewModel = {
                list  : ko.observableArray()
            };

            provider = new datamagic.dm({viewModel: viewModel, wire: wire, options: options});
        });

        it("should call save data once on change for complex item added after attach", function(){
            provider.start();

            viewModel.list.push(new ComplexItem("Bob", 30));
            viewModel.list.push(new ComplexItem("Bill", 31));
            viewModel.list.push(new ComplexItem("Jill", 41));
            viewModel.list.splice(1, 2, new ComplexItem("Santa", 21));
            wire.saveData.reset();

            viewModel.list()[0].age(45);
            expect(wire.saveData.callCount).toEqual(1);
        });
    });


});

describe("A persistence provider with exclusions and not autoStarted", function(){
    var provider;
    var viewModel;
    var wire;
    var options;

    beforeEach(function() {

        options = {
            baseUrl     : "http://www.example.com/",
            exclusions  : ["lastName", "age"]
        };
        wire    = new datamagic.ConsoleWire(options);

        spyOn(wire, 'saveData');

        wire.saveData.reset();

        viewModel = {
            firstName  : ko.observable('Bob'),
            lastName  : ko.observable('Dylan'),
            age   : ko.observable(35)
        };

        provider = new datamagic.dm({viewModel: viewModel, wire: wire, options: options});
    });

    it("will call saveData when started", function(){
        provider.start();
        viewModel.firstName('Bill');
        expect(wire.saveData.callCount).toEqual(1);
    });

    it("when started will not call saveData on change of excluded field", function(){
        provider.start();
        viewModel.age(36);
        expect(wire.saveData.callCount).toEqual(0);
    });
});



