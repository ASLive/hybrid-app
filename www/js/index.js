/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.querySelector("#sendMessage").addEventListener("touchend", function() {
          console.log("Take video");
          navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1});
        }, false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
        this.videoCapture(this.openSocket);

        console.log(window.cordova.platformId);
    },

    openSocket: function(text) {

      // ip address for connecting when emulator and server share same localhost
      var ip_address_emulator = 'ws://10.0.2.2:8000';

      // ip address for connecting when using a device that hosts a middleman connection through ngrok
      var ip_address_ngrok = 'ws://0f35afae.ngrok.io';
      var ws = new WebSocket(ip_address_ngrok);

      ws.onopen = function () {
          this.send(text);         // transmit passed text after connecting
      };

      ws.onmessage = function (event) {
          console.log(event.data);
          this.close();
      };

      ws.onerror = function () {
          console.log('error');
      };

      ws.onclose = function (event) {
          console.log('closing ' + event.code);
      };
    },

    videoCapture: function(socketFunc) {
      var options = {
        limit: 1,
        duration: 60
      };

      curryedOnSuccess = (socketFunc) => ( (mediaFiles) => onSuccess(socketFunc,mediaFiles) );
      navigator.device.capture.captureVideo(curryedOnSuccess(socketFunc), onError, options);

      function onSuccess(socketFunc, mediaFiles) {
        var i, path, len;
        path = mediaFiles[0].fullPath;

        window.resolveLocalFileSystemURL(path, (entry) => {
          entry.file((file) => {
            var reader = new FileReader();
            reader.onloadend = function() {
              console.log("Successful file read: " + this.result);
              socketFunc("my test text");
            }
            return reader.readAsDataURL(file);
          }, (error) => {
            console.log('Error opening file: ' + error);
          });
        }, (error) => {
          console.log('Error resolving local file system: ' + error);
        });
      }

      function onError(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
      }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
