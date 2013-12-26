/**
 * Created by Danny on 24/12/13.
 */
datamagic.ConsoleWire = function(){
    var self = this;
    self.basePath = '';


    self.init = function(options){
        self.basePath = options.baseUrl;
    };

    self.saveData = function(data){
        if(typeof console === "undefined"){
            console = { log: function() { } };
        }

        

        console.log(data);
    };
};
