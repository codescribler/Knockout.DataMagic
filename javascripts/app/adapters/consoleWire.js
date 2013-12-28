/**
 * Created by Danny on 24/12/13.
 */
datamagic.ConsoleWire = function(options){
    var self = this;
    self.saveData = function(data){
        if(typeof console === "undefined"){
            console = { log: function() { } };
        }
        console.log(data);
    };

    self.saveData(options);
};
