/**
 * Created by Danny on 13/12/13.
 */

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

//autoBinder.FireWire.prototype = function(){
//
//    var localRef = function(path){
//        return new Firebase(basePath + path);
//    };
//
//    var init = function(options){
//        this.basePath = options.firebasePath;
//    };
//
//    var saveData = function(path, data){
//        var ref = localRef(path);
//        ref.push().set(data);
//    };
//
//    return {
//        init : init,
//        saveData : saveData
//    };
//}();
//
//autoBinder.FakeWire = function(){
//    var self = this;
//    self.basePath = '';
//    self.model  = {};
//
//    self.init = function(options){
//        self.basePath = options.baseUrl;
//    };
//
//    self.saveData = function(data){
//        self.model = data;
//    };
//};