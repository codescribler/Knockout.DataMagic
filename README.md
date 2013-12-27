Knockout.DataMagic
==================

# About #
Supper simple 3 way data binding for your knockout view models. A fast and effective way to get your data into a database and get you app up and running in no time. Simply point your view model at a database like firebase or an api url and DataMagic will save your changes as they happen!

# Installation #
Just include knockout-datamagic.js after jQuery and knockoutjs version 3! For a supper simple experience, sign up for a free firebase database and include the 'firewire.js' wire from the the data adapters folder.
You will need to set up you your end point of choice.

# Basic usage #

Given a knockout view model:

'''
var ViewModel = function(){
    var self = this;
    self.firstName = ko.observable();
    self.lastName = ko.observable();

    self.fullName = ko.computed(function(){
        return self.firstName + " " + self.lastName;
    });
};

var vm = new ViewModel();
ko.applyBindings(vm);
'''

Next initialise the wire transport used to get your data to the database. In this examplewe will initialise a firebase wire:

'''
var fireWire = new datamagic.FireWire({ baseUrl : "<The Url to your FireBase database>" });
'''

The final step is to provide datamagic with the wire and tell it to attach to the view model and start watching for changes.
View models often contain observables that you do not wish to persist so you can exclude them by adding their name to the exclusions list.

'''
var options = {
    exclusions  : ["current", "filteredTodos", "completedCount",  "allCompleted", "loading"]
};

var dm = new datamagic.dm({viewModel: vm, wire: fireWire, options: options});
dm.start();
'''

When you receive updates to the data from the server, just call dm.stop() update the view model and then call dm.start(). This avoids going round in circles.
