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
        this.videoCapture();
        // this.openSocket();

        console.log(window.cordova.platformId);
    },

    openSocket: function(text) {
      var ws = new WebSocket('ws://10.0.2.2:8000');

      ws.onopen = function () {
          this.send(text);         // transmit "text" after connecting
      };

      ws.onmessage = function (event) {
          console.log(event.data);    // will be "hello"
          this.close();
      };

      ws.onerror = function () {
          console.log('error');
      };

      ws.onclose = function (event) {
          console.log('closing ' + event.code);
      };
    },

    videoCapture: function() {
      var options = {
        limit: 1,
        duration: 60
      };

      navigator.device.capture.captureVideo(onSuccess, onError, options);

      function onSuccess(mediaFiles) {
        var i, path, len;
        path = mediaFiles[0].fullPath;
          console.log(mediaFiles);
          console.log(path);

          window.resolveLocalFileSystemURL(path, (entry) => {
            console.log(entry);
            entry.file((file) => {
              var reader = new FileReader();
              reader.onloadend = function() {
                console.log("Successful file read: " + this.result);
              }
              return reader.readAsDataURL(file);
            }, (error) => {
              console.log(error);
            });
          }, (error) => {
            console.log(error);
          })

          // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs) => {
          //   console.log('file system open: ' + fs.name);
          //   fs.root.getFile(path, {create: false}, function(entry) {
          //     console.log("didnt fail");
          //     console.log(entry);
          //   }, function(error) {
          //     console.log(error);
          //     console.log("failed getting file");
          //   });
          // }, function(fe) {
          //   console.log("failed getting file system");
          // });
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
