(function(){
    var app = angular.module('ngFeathers', [])

    app.provider('$feathersConfig', function providerFeathers(){
        var host = 'http://localhost:3030';
        
        return({
            getHost: function(){
                return host;
            },
            setHost: function(newHost){
                host = newHost;
            },
            $get: function() {
                return this;
            }
        });
    })

    app.factory('$feathers', $feathers);
    $feathers.$inject = ['$feathersConfig', '$log', '$timeout'];
    function $feathers($feathersConfig, $log, $timeout) {
        
        var db = feathers()
        .configure(feathers.socketio(io($feathersConfig.getHost())))
        .configure(feathers.hooks())
        .configure(feathers.authentication({ storage: window.localStorage }));
        
        db.serve = function(serviceName){
            var service = db.service(serviceName);
        
            service.data = [];

            service.find({},function(err, data){
                if(err)
                    $log.error(err);
                else {
                    
                    if(Object.prototype.toString.call(data.data) === '[object Array]')
                        data = data.data;
                    
                    angular.forEach(data, function(val){
                        $timeout(function(){
                            service.data.push(val);
                        });
                    }); 
                } 
                
            });
            
            service.loadMore = function (query) {
                
                if(!query) {
                    var query = {};
                    query.$skip = service.data.length; 
                }
                    
                service.find({query: query},function(err, data){
                    if(err)
                        $log.error(err);
                    else {

                        if(Object.prototype.toString.call(data.data) === '[object Array]')
                            data = data.data;
                        
                        angular.forEach(data, function(val){
                            $timeout(function(){
                                service.data.push(val);
                            });
                        }); 
                    }
                });
            }

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
        
        db.host = $feathersConfig.getHost();
        return db;
    }
    
})();