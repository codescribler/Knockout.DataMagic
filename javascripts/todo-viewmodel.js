/**
 * Created by Danny on 24/12/13.
 */
(function () {
    'use strict';

    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;

    // A factory function we can use to create binding handlers for specific
    // keycodes.
    function keyhandlerBindingFactory(keyCode) {
        return {
            init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
                var wrappedHandler, newValueAccessor;

                // wrap the handler with a check for the enter key
                wrappedHandler = function (data, event) {
                    if (event.keyCode === keyCode) {
                        valueAccessor().call(this, data, event);
                    }
                };

                // create a valueAccessor with the options that we would want to pass to the event binding
                newValueAccessor = function () {
                    return {
                        keyup: wrappedHandler
                    };
                };

                // call the real event binding's init function
                ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
            }
        };
    }

    // a custom binding to handle the enter key
    ko.bindingHandlers.enterKey = keyhandlerBindingFactory(ENTER_KEY);

    // another custom binding, this time to handle the escape key
    ko.bindingHandlers.escapeKey = keyhandlerBindingFactory(ESCAPE_KEY);

    // wrapper to hasFocus that also selects text and applies focus async
    ko.bindingHandlers.selectAndFocus = {
        init: function (element, valueAccessor, allBindingsAccessor, bindingContext) {
            ko.bindingHandlers.hasFocus.init(element, valueAccessor, allBindingsAccessor, bindingContext);
            ko.utils.registerEventHandler(element, 'focus', function () {
                element.focus();
            });
        },
        update: function (element, valueAccessor) {
            ko.utils.unwrapObservable(valueAccessor()); // for dependency
            // ensure that element is visible before trying to focus
            setTimeout(function () {
                ko.bindingHandlers.hasFocus.update(element, valueAccessor);
            }, 0);
        }
    };
}());
    // represent a single todo item
    var Todo = function (title, completed) {
        this.title = ko.observable(title);
        this.completed = ko.observable(completed || false);
    };

    // our main view model
    var ViewModel = function () {
        // map array of passed in todos to an observableArray of Todo objects
        this.todos = ko.observableArray();

        // store the new todo value being entered
        this.current = ko.observable();

        this.showMode = ko.observable('all');

        this.loading = ko.observable(true);

        this.filteredTodos = ko.computed(function () {
            switch (this.showMode()) {
                case 'active':
                    return this.todos().filter(function (todo) {
                        return !todo.completed();
                    });
                case 'completed':
                    return this.todos().filter(function (todo) {
                        return todo.completed();
                    });
                default:
                    return this.todos();
            }
        }.bind(this));

        // add a new todo, when enter key is pressed
        this.add = function () {
            var current = this.current().trim();
            if (current) {
                this.todos.push(new Todo(current));
                this.current('');
                if(this.todos().length > 9){
                    this.todos.remove(this.todos()[0]); // Kill the first item
                }
            }
        }.bind(this);

        // remove a single todo
        this.remove = function (todo) {
            this.todos.remove(todo);
        }.bind(this);

        // remove all completed todos
        this.removeCompleted = function () {
            this.todos.remove(function (todo) {
                return todo.completed();
            });
        }.bind(this);

        // count of all completed todos
        this.completedCount = ko.computed(function () {
            return this.todos().filter(function (todo) {
                return todo.completed();
            }).length;
        }.bind(this));

        // count of todos that are not complete
        this.remainingCount = ko.computed(function () {
            return this.todos().length - this.completedCount();
        }.bind(this));

        // writeable computed observable to handle marking all complete/incomplete
        this.allCompleted = ko.computed({
            //always return true/false based on the done flag of all todos
            read: function () {
                return !this.remainingCount();
            }.bind(this),
            // set all todos to the written value (true/false)
            write: function (newValue) {
                this.todos().forEach(function (todo) {
                    // set even if value is the same, as subscribers are not notified in that case
                    todo.completed(newValue);
                });
            }.bind(this)
        });

        // helper function to keep expressions out of markup
        this.getLabel = function (count) {
            return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
        }.bind(this);
    };

