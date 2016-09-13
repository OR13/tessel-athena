"use strict";
/**
 * A single module node library with tests and docs.
 * @module tessel_status
 */


var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port['B']);

var rfidlib = require('rfid-pn532');

var rfid = rfidlib.use(tessel.port['A']);

var Promise = require("bluebird");

const chalk = require('chalk');

var notificationLED = tessel.led[3];

/** Class representing an AthenaSight. */
class AthenaSight {

    /**
     * Create an AthenaSight.
     * @param {string} agent_name - The name of the agent.
     */
    constructor(agent_name) {
        this.agent_name = agent_name;
    }

    /**
    * A promise for the image from the camera.
    * @return {promise} An image from the camera.
    */
    getCameraImage() {
        return new Promise((resolve, reject) => {

            camera.on('ready', function () {
                notificationLED.high();
                // Take the picture
                camera.takePicture(function (err, image) {

                    if (err) {
                        console.log('error taking image', err);
                        reject(err);
                    } else {
                        notificationLED.low();
                        // Name the image
                        var name = 'picture-' + Math.floor(Date.now() * 1000) + '.jpg';
                        // Save the image
                        console.log('Picture saving as', name, '...');
                        process.sendfile(name, image);
                        console.log('done.');

                        resolve(image);

                        // Turn the camera off to end the script
                        camera.disable();
                    }
                });
            });

            camera.on('error', function (err) {
                console.error(err);

                reject(err);
            });

        });
    }

    /**
   * A promise for the UID of an RFID card.
   * @return {promise} A promise for the UID of an RFID card.
   */
    getCardUID() {
        return new Promise((resolve, reject) => {

            rfid.on('ready', function (version) {
                console.log('Ready to read RFID card');

                rfid.on('data', function (card) {
                    var uid = card.uid.toString('hex');
                    console.log('UID:', uid);
                    resolve(uid);
                });
            });

            rfid.on('error', function (err) {
                console.error(err);
                reject(err);
            });


        });
    }


    // /**
    //  * Prints the State of the LED Array with labels.
    //  * @return {number} The RED_LED pin value.
    //  */
    // printState() {

    //     return Promise.join(
    //         this.getRed(),
    //         this.getYellow(),
    //         this.getGreen()
    //     )
    //         .then((data) => {

    //             console.log(data)

    //             var _red = data[0] ? chalk.red(this.RED_LABEL) : this.RED_LABEL;
    //             var _yellow = data[1] ? chalk.yellow(this.YELLOW_LABEL) : this.YELLOW_LABEL;
    //             var _green = data[2] ? chalk.green(this.GREEN_LABEL) : this.GREEN_LABEL;

    //             console.log(_red, _yellow, _green);

    //         });

    // }

}

module.exports = AthenaSight;