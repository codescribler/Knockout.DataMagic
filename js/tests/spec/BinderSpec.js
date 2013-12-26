describe("A binder", function() {
    var binder;
    var viewModel;
    var actual;
    var flag;

    beforeEach(function() {
        flag = false;
        binder = new datamagic.Binder();
    });

    it("must reflect the value of a view model with only one observable", function(){
        viewModel = {
            example : ko.observable('hello')
        };

        var exclusions = [];
        binder.attach(viewModel, exclusions, function(data){
            expect(data.example).toEqual('hello');
        });
    });

    it("must reflect the value of a boolean observable", function(){
       viewModel = {
           yesNo : ko.observable(false)
       }

        var exclusions = [];
        binder.attach(viewModel, exclusions, function(data){
            expect(data.yesNo).toEqual(false);
        });
    });

    it("payload must stay in sync with the viewModel observable", function(){
        viewModel = {
            example : ko.observable('hello')
        };

        var callBack = function(data){
            actual = data;
            flag = true;
        };

        runs(function(){
            var exclusions = [];
            binder.attach(viewModel, exclusions, callBack);
            viewModel.example('hello changed');
        });

        waitsFor(function(){
            return actual.example === 'hello changed';
        });
    });

    it("payload must stay in sync with a boolean observable", function(){
        viewModel = {
            example : ko.observable(true)
        };

        var callBack = function(data){
            actual = data;
            flag = true;
        };

        runs(function(){
            var exclusions = [];
            binder.attach(viewModel, exclusions, callBack);
            viewModel.example(false);
        });

        waitsFor(function(){
            return actual.example === false;
        });
    });

    it("call back should not be called if there is no change", function(){
        viewModel = {
            example : ko.observable('hello')
        };

        var count = 0;
        var callBack = function(data){
            count += 1;
        };

        var exclusions = [];
        binder.attach(viewModel, exclusions, callBack);
        viewModel.example('hello');

        expect(count).toEqual(0);
    });

    it("payload must stay in sync with a viewModel with multiple observables", function(){
        viewModel = {
            observable1 : ko.observable('hello'),
            observable2 : ko.observable(0)
        };

        var callBack = function(data){
            actual = data;
            flag = true;
        };

        runs(function(){
            var exclusions = [];
            binder.attach(viewModel, exclusions, callBack);
            viewModel.observable1('hello changed');
            viewModel.observable2(1);
        });

        waitsFor(function(){
            return actual.observable1 === 'hello changed' && actual.observable2 === 1;
        });
    });


    it("payload must reflect view models with an empty observable array", function(){
        viewModel = {
            observable1 : ko.observableArray([])
        };

        var exclusions = [];
        binder.attach(viewModel, exclusions, function(data){
            expect(data.observable1).toEqual([]);
        });
    });

    it("payload must reflect view models with a populated observable array containing POJO's", function(){
        viewModel = {
            observable1 : ko.observableArray(['0', '1'])
        };

        var exclusions = [];
        binder.attach(viewModel, exclusions, function(data){
            expect(data.observable1).toEqual(['0', '1']);
        });
    });

    it('payload must stay in sync with changes to simple observable arrays', function(){
        viewModel = {
            list : ko.observableArray(['first'])
        };

        var callBack = function(data){
            actual = data;
        };

        runs(function(){
            var exclusions = [];
            binder.attach(viewModel, exclusions, callBack);
            viewModel.list.push('second');
        });

        waitsFor(function(){
            return actual.list[1] === 'second';
        });
    });

    it('payload must track changes within observables within an array', function(){
        viewModel = {
            list : ko.observableArray([
                ko.observable('item 1')
            ])
        };

        var callBack = function(data){
            actual = data;
        };

        runs(function(){
            var exclusions = [];
            binder.attach(viewModel, exclusions, callBack);
            viewModel.list()[0]('item 1 changed');
        });

        waitsFor(function(){
            return actual.list[0] === 'item 1 changed';
        });
    });

    it('payload must not include excluded properties from within complex objects in observables within an array', function(){
        var ComplexItem = function (title, completed) {
            this.title = ko.observable(title);
            this.completed = ko.observable(completed || false);
        };

        viewModel = {
            list : ko.observableArray([])
        };

        var callBack = function(data){
            actual = data;
        };

        runs(function(){
            var exclusions = [];
            binder.attach(viewModel, ['title'], callBack);
            viewModel.list.push(new ComplexItem("Title", true));
        });

        waitsFor(function(){
            var expected = {
                list: [
                    { completed : true }
                ]
            }

            var one = JSON.stringify(actual).replace(/(\\t|\\n)/g,''),
                two = JSON.stringify(expected).replace(/(\\t|\\n)/g,'');

            return one === two;
        });
    });

    it('payload must track changes within complex objects with observables within an array', function(){
        var ComplexItem = function (title, completed) {
            this.title = ko.observable(title);
            this.completed = ko.observable(completed || false);
        };

        viewModel = {
            list : ko.observableArray([
                new ComplexItem("One", false),
                new ComplexItem("Two", true),
                new ComplexItem("Three", false)
            ])
        };

        var callBack = function(data){
            actual = data;
        };

        runs(function(){
            var exclusions = [];
            binder.attach(viewModel, exclusions, callBack);
            viewModel.list()[0].completed(true);
        });

        waitsFor(function(){
            return actual.list[0].completed === true;
        });
    });

    it('payload must track changes within complex objects added to arrays after attach', function(){
        var ComplexItem = function (title, completed) {
            this.title = ko.observable(title);
            this.completed = ko.observable(completed || false);
        };

        viewModel = {
            list : ko.observableArray([
                new ComplexItem("One", false)

            ])
        };

        var callBack = function(data){
            actual = data;
        };

        runs(function(){
            var exclusions = [];
            binder.attach(viewModel, exclusions, callBack);
            viewModel.list.push(new ComplexItem("Two", true));
            viewModel.list()[1].completed(false);
        });

        waitsFor(function(){
            var expected = {
                list: [
                    { title: "One", completed : false },
                    { title: "Two", completed : false }
                ]
            }

            var one = JSON.stringify(actual).replace(/(\\t|\\n)/g,''),
                two = JSON.stringify(expected).replace(/(\\t|\\n)/g,'');

            return one === two;
        });
    });

    it("binder should not track changes to properites in the exclusion list", function(){
        viewModel = {
            example : ko.observable('hello'),
            excludeMe : ko.observable('hello')
        };

        var callBack = function(data){
            expect(data.excludeMe).not.toBeDefined();
        };

        var exclusions = ['excludeMe'];
        binder.attach(viewModel, exclusions, callBack);
        viewModel.excludeMe('hello again');
    });

    it("the payload should not contain functions from the view model", function(){
        viewModel = function(){
            var self = this;
            self.example = ko.observable('hello');
            self.excludeMe = ko.observable('hello');

            self.doSomething = function(){

            };
        };

        var callBack = function(data){
            expect(data.doSomething).not.toBeDefined();
        };

        var exclusions = ['excludeMe'];
        binder.attach(new viewModel(), exclusions, callBack);
    })
});



/*    it("should be able to play a Song", function() {
        binder.play(song);
        expect(binder.currentlyPlayingSong).toEqual(song);

        //demonstrates use of custom matcher
        expect(binder).toBePlaying(song);
    });

    describe("when song has been paused", function() {
        beforeEach(function() {
            binder.play(song);
            binder.pause();
        });

        it("should indicate that the song is currently paused", function() {
            expect(binder.isPlaying).toBeFalsy();

            // demonstrates use of 'not' with a custom matcher
            expect(binder).not.toBePlaying(song);
        });

        it("should be possible to resume", function() {
            binder.resume();
            expect(binder.isPlaying).toBeTruthy();
            expect(binder.currentlyPlayingSong).toEqual(song);
        });
    });

    // demonstrates use of spies to intercept and test method calls
    it("tells the current song if the user has made it a favorite", function() {
        spyOn(song, 'persistFavoriteStatus');

        binder.play(song);
        binder.makeFavorite();

        expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
    });

    //demonstrates use of expected exceptions
    describe("#resume", function() {
        it("should throw an exception if song is already playing", function() {
            binder.play(song);

            expect(function() {
                binder.resume();
            }).toThrow("song is already playing");
        });
    });*//*

});
*/
