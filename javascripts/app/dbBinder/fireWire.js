/**
 * Created by Danny on 13/12/13.
 */

var autoBinder = autoBinder || {};

autoBinder.FireWire = function(){
    var self = this;
    self.basePath = '';
    self.model  = {};
    self.localRef = {};

    self.init = function(options){
        self.basePath = options.baseUrl;
        self.localRef = new Firebase(self.basePath);
    };

    self.saveData = function(data){
        self.model = data;
        self.localRef.set(data, function(error){
            if(error){
                console.error(error.toString());
            }else{
                console.log("Saved!");
            }
        });
    };
};
