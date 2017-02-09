<p align="center">
  <a href="https://fb.com/xamf.dev/" target="_blank">
    <img width="150" src="http://feathersjs.com/img/feathers-logo-wide.png">
    <img width="150" src="https://angularjs.org/img/AngularJS-large.png">
  </a>
</p>

<p align="center">FeathersJS Client for AngularJS</p>

<p align="center">
  <img src="https://img.shields.io/npm/dt/vue-material.svg" alt="Downloads">

  <img src="https://img.shields.io/npm/v/vue-material.svg" alt="Version">

  <img src="https://img.shields.io/npm/l/vue-material.svg" alt="License">

  <img src="https://img.shields.io/gitter/room/vuematerial/home.svg" alt="Gitter Chat"><br>
</p>

# ngFeathers

**A FeathersJS Client for Angular!**

## Installation
```javascript
bower install ngFeathers --save
```
```html
<script src="bower_components/socket.io-client/dist/socket.io.min.js"></script>
<script src="bower_components/feathers-client/dist/feathers.min.js"></script>
<script src="bower_components/ngFeathers/ngFeathers.js"></script>
```
```javascript
var app = angular.module('myApp', ['ngFeathers']);
```
## Usage


```javascript
app.factory('messageService', messageService);
messageService.$inject = ['$feathers'];
function messageService($feathers) {
    return $feathers.serve('messages');
} 
```
```javascript
app.controller('mainController', mainController);
mainController.$inject = ['messageService'];
function mainController(messageService) {
    var vm = this;
    
    vm.title="Feathers Chat";
    
    vm.messages = messageService.data; 
    
    vm.send = function(){
        messageService.create({'message': vm.message}); 
    }
    vm.delete = function(id){
        messageService.remove(id);
        console.log(msg);
    }
}
```
