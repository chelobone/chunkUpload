﻿
this.CHUNK = function (serviceUrl) {
    var _chunk = this;
    var _serviceUrl = serviceUrl;
    var fileHandleName = "";
    var startTime, endTime;

    this.UploadChunk = function () {

    }

    this.start = function () {
        startTime = new Date();
    };

    this.end = function () {
        endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;

        // get seconds 
        var seconds = Math.round(timeDiff);
        //console.log(seconds + " seconds");
        return seconds;
    }

    this.Upload = function () {
        return new Promise(function (resolve, reject) {
            var objFile = $('#documento');
            if (objFile != undefined) {
                var archivos = $('#documento')[0].files;
                if (archivos != undefined) {
                    if (archivos.length > 0) {
                        _chunk.start();
                        _chunk.beginUpload().then(function (begin) {
                            console.log(begin);
                            fileHandleName = begin.d;
                            _chunk.parseFile(archivos[0]).then(function (parsed) {
                                //console.log(parsed);

                                resolve(parsed);
                            }).catch(function (error) {
                                reject(error);
                            });
                        });
                    }
                }
            }
        });
    }

    this.parseFile = function (file) {
        return new Promise(function (resolve, reject) {
            var fileSize = file.size;
            var fileName = file.name;
            var chunkSize = 128 * 1024; // bytes
            var offset = 0;
            var self = this; // we need a reference to the current object
            var chunkReaderBlock = null;

            var readEventHandler = function (evt) {
                if (evt.target.error == null) {
                    offset += evt.target.result.byteLength;
                    var startAt = 0;

                    if (offset >= evt.target.result.byteLength) {
                        startAt = (offset - evt.target.result.byteLength);
                    }
                    //var val = 0;
                    //offset = val == 0 ? offset : val + 1 + evt.target.result.byteLength;
                    //val += evt.target.result.byteLength;
                    data = evt.target.result;
                    console.log("1:" + offset);
                    _chunk.continueUpload(data, startAt).then(function (continuar) {
                        //console.log('leyendo archivo');

                        //console.log(evt);
                        //resolve("1");
                        if (offset >= fileSize) {
                            _chunk.endUpload(fileName).then(function (end) {

                                resolve(end);
                            }).catch(function (error) {
                                reject(error);
                            });
                            //console.log("Done reading file");
                            return;
                        } else {
                            // of to the next chunk
                            chunkReaderBlock(offset, chunkSize, file);
                        }
                    }).catch(function (error) {
                        reject(error);
                    });
                    //callback(evt.target.result); // callback for handling read chunk
                } else {
                    console.log("Read error: " + evt.target.error);
                    //reject(evt.target.error);
                    return;
                }
            }

            chunkReaderBlock = function (_offset, length, _file) {
                var r = new FileReader();
                var blob = _file.slice(_offset, length + _offset);
                r.onload = readEventHandler;
                r.readAsArrayBuffer(blob);
            }

            // now let's start the read with the first block
            chunkReaderBlock(offset, chunkSize, file);
        });
    }

    this.beginUpload = function () {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: _serviceUrl + '/BeginUploadFile',
                async: true,
                type: "POST",
                //data: JSON.stringify({ maxChunkSize: 0 }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    resolve(data);
                },
                error: function (data, errorCode, errorMessage) {
                    reject(data.responseText);
                }
            });
        });
    }

    this.continueUpload = function (dataByte, offset) {
        return new Promise(function (resolve, reject) {
            //var bytes = [];
            var prebytes = new Uint8Array(dataByte);
            //var CHUNK_SZ = 0x8000;
            //var c = [];
            //for (var i = 0; i < prebytes.length; i += CHUNK_SZ) {
            //    c.push(String.fromCharCode.apply(null, prebytes.subarray(i, i + CHUNK_SZ)));
            //}

            //var base64String = btoa(c);
            var base64String = btoa(prebytes.reduce(function (data, byte) {
                return data + String.fromCharCode(byte);
            }, ''));

            console.log("2:" + offset);
            //console.log(base64String.length);

            var datos = { fileHandle: fileHandleName, data: base64String, startAt: offset };

            var parsed = JSON.stringify({ carga: datos });
            //console.log(parsed);
            $.ajax({
                url: _serviceUrl + '/UploadChunk',
                async: true,
                type: "POST",
                data: parsed,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    resolve(data);
                },
                error: function (data, errorCode, errorMessage) {
                    reject(data.responseText);
                }
            });
        });
    }

    this.endUpload = function (fileName) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: _serviceUrl + '/EndUploadFile',
                async: true,
                type: "POST",
                data: JSON.stringify({ fileHandle: fileHandleName, nombre: fileName, quitUpload: false }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    //console.log(data);
                    resolve(data);
                },
                error: function (data, errorCode, errorMessage) {
                    reject(data.responseJSON);
                }
            });
        });
    }

    this.UploadNormal = function (input) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
                var dataURL = reader.result;
                var fileName = input.files[0].name;
                //var output = document.getElementById('output');
                //output.src = dataURL;
                var datos = { fileHandle: '', data: dataURL, startAt: input.files[0].size };

                var parsed = JSON.stringify({ carga: datos, nombre: fileName });
                console.log(parsed);
                $.ajax({
                    url: _serviceUrl + '/CargaNormal',
                    async: true,
                    type: "POST",
                    data: parsed,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (data, errorCode, errorMessage) {
                        reject(data.responseJSON);
                    }
                });
            };
            reader.readAsDataURL(input.files[0]);
        });
    }
}

$(document).ready(function () {

    //$("#cargando").jqxLoader({ width: 250, height: 150, autoOpen: false });
    $('#esperando').jqxWindow({
        showCollapseButton: false,
        autoOpen: false,
        isModal: true,
        maxHeight: 400,
        maxWidth: 700,
        minHeight: 200,
        minWidth: 200,
        height: 300,
        width: 500,
        theme: 'summer',
        modalOpacity: 0.3
    });

    $('#cargado').jqxWindow({
        showCollapseButton: false,
        autoOpen: false,
        isModal: true,
        maxHeight: 400,
        maxWidth: 700,
        minHeight: 200,
        minWidth: 200,
        height: 300,
        width: 500,
        theme: 'summer',
        modalOpacity: 0.3
    });

    $('#error').jqxWindow({
        showCollapseButton: false,
        autoOpen: false,
        isModal: true,
        maxHeight: 400,
        maxWidth: 700,
        minHeight: 200,
        minWidth: 200,
        height: 300,
        width: 500,
        theme: 'summer',
        modalOpacity: 0.3
    });

    var chunk = new CHUNK("http://shpdestlc06:100/ChunkService.asmx");
    $("#btnCargar").click(function () {

        $("#esperando").jqxWindow('open');
        chunk.Upload().then(function (result) {
            console.log(result);
            $("#esperando").jqxWindow('close');
            var tiempoEjecucion = chunk.end();
            if (result.d > 0) {
                $("#cargado").jqxWindow('open');
                $("#docID").text("El número de documento entregado por el sistema es: " + result.d);
                $("#detalle").text("El tiempo de carga fue de  " + tiempoEjecucion + " segundos");
            } else {
                $("#error").jqxWindow('open');
                $("#errorMessage").text("Error al cargar documento.");
            }
        }).catch(function (err) {
            console.log(err);
            $("#esperando").jqxWindow('close');
            $("#error").jqxWindow('open');
            $("#errorMessage").text(err.Message);
        });
    });

    $("#btnCargarNormal").click(function () {
        $("#esperando").jqxWindow('open');
        var input = $("#documentoNormal")[0];
        chunk.start();
        chunk.UploadNormal(input).then(function (result) {
            //console.log(result);
            $("#esperando").jqxWindow('close');
            var tiempoEjecucion = chunk.end();
            if (result.d > 0) {
                $("#cargado").jqxWindow('open');
                $("#docID").text("El número de documento entregado por el sistema es: " + result.d);
                $("#detalle").text("El tiempo de carga fue de  " + tiempoEjecucion + " segundos");
            } else {
                $("#error").jqxWindow('open');
                $("#errorMessage").text("Error al cargar documento.");
            }
        }).catch(function (err) {
            console.log(err);
            $("#esperando").jqxWindow('close');
            $("#error").jqxWindow('open');
            $("#errorMessage").text(err.Message);
        });
    });


});
