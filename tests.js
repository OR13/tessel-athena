"use strict";
var tessel_athena = require('./tessel_athena');

let athenaSight = new tessel_athena.AthenaSight('Athena');

setInterval(function () {

    console.log('setInterval: ', athenaSight);

    // athenaSight.getCameraImage().then((image) => {
    //     console.log('image: ', image);
    // });

}, 3 * 1000);










