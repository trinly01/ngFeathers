(function(){
    var app = angular.module('ngFeathers', [])
    
    app.factory('$feathersConfig', function(){
        var config = {};
        config.host = 'http://localhost:3030';
        return config;
    });
    
    
    
    app.factory('$feathers', $feathers);
    $feathers.$inject = ['$feathersConfig'];
    function $feathers($feathersConfig) {
        
        var db = feathers().configure(feathers.socketio(io($feathersConfig.host)));
        
        db.serve = function(serviceName){
            var service = db.service(serviceName);
        
            service.data = [];

            service.find(function(err, data){
                if(err)
                    console.error(err);
                else
                    angular.forEach(data, function(val){
                        $timeout(function(){
                            service.data.push(val);
                        });
                    });
            });

            service.on('created', function(data){
                $timeout(function(){
                    service.data.push(data);
                });
            });

            service.on('updated', function(data){
                service.data.findIndex(function(val, key){
                    var comparison = (val._id == data._id);
                    if(comparison)
                        $timeout(function(){
                            service.data[key] = data;
                        });
                    return comparison;
                });
            });

            service.on('patched', function(data){
                service.data.findIndex(function(val, key){
                    var comparison = (val._id == data._id);
                    if(comparison)
                        $timeout(function(){
                            service.data[key] = data;
                        });
                    return comparison;
                });
            });

            service.on('removed', function(data){

                var removeByAttr = function(arr, attr, value){
                    var i = arr.length;
                    while(i--){
                       if( arr[i] 
                           && arr[i].hasOwnProperty(attr) 
                           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

                           arr.splice(i,1);

                       }
                    }
                    return arr;
                }

                $timeout(function(){
                    service.data = removeByAttr(service.data, '_id', data._id);
                });
            });

            return service;
        }
        
        return db;
    }
    
})();