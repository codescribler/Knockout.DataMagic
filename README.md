Knockout.DataMagic
==================

Supper simple 3 way data binding for your knockout view models. A fast and effective way to get your data into a database and get you app up
and running in no time. Simply point your view model at a database like firebase or an api url and DataMagic will save your changes as they happen!

### Useful links ###
1. Take a look at [the project site](http://codescribler.github.io/Knockout.DataMagic) for more info.
2. The [jasmine test suite](http://codescribler.github.io/Knockout.DataMagic/SpecRunner.html).

# Dependencies #

You will need knockoutjs version <strong>3</strong> or higher and the jQuery.

# Installation #

Just include knockout-datamagic.js after jQuery and knockoutjs version 3! For a supper simple experience, sign up for a free firebase database and include the 'firewire.js' wire from the the data adapters folder.
You will need to set up you your end point of choice.

# Basic usage #

Given a knockout view model:


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


Next initialise the wire transport used to get your data to the database. In this examplewe will initialise a firebase wire:


    var fireWire = new datamagic.FireWire({ baseUrl : "<The Url to your FireBase database>" });


The final step is to provide datamagic with the wire and tell it to attach to the view model and start watching for changes.
View models often contain observables that you do not wish to persist so you can exclude them by adding their name to the exclusions list.


    var options = {
        exclusions  : ["fullName"]
    };

    var dm = new datamagic.dm({viewModel: vm, wire: fireWire, options: options});
    dm.start();


When you receive updates to the data from the server, just call dm.stop() update the view model and then call dm.start(). This avoids going round in circles.

# Known issues #

This library is in its very early stages of development and is liable to change and does have some known issues.

1. If you make multiple changes in one go, including adding new complex objects to an observable array, the new objects may not get tracked.
2. The 'todo' demo stops tracking changes after the second 'to do' is marked as complete. All other actions continue to work.