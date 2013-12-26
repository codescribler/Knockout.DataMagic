/**
 * Created by Danny on 13/12/13.
 */

datamagic.FireWire = function(options){
    var self = this;
    self.basePath = options.baseUrl || "";
    self.model  = {};
    self.localRef = new Firebase(self.basePath);

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
