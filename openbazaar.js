/*
  This library contains a list of functions used to interact with a local
  OpenBazaar (OB) store via its API. For reference documentation, see the API
  documents at http://api.openbazaar.org

  This library is for node.js programs using ECMA2017 async/await.

  Functions implemented in this library:
  
  getOBAuth - Generate an auth header for AJAX calls to the OB store.
  getNotifications - Get notifications
  markNotificationAsRead - Mark a notification as read
  fulfillOrder - Fulfill an order
  getListings - Get all product listings in the OB store.

*/

"use strict";

// Dependencies
const rp = require("request-promise");

// Generate an auth key for the header. Required fall all OpenBazaar API calls.
function getOBAuth(clientID, clientSecret) {
  //debugger;

  //Encoding as per API Specification.
  const combinedCredential = `${clientID}:${clientSecret}`;
  //var base64Credential = window.btoa(combinedCredential);
  const base64Credential = Buffer.from(combinedCredential).toString("base64");
  const readyCredential = `Basic ${base64Credential}`;

  return readyCredential;
}

// This function returns a Promise that resolves to a list of notifications
// recieved by the OB store.
async function getNotifications(config) {
  try {
    const options = {
      method: "GET",
      uri: `${config.server}:${config.obPort}/ob/notifications`,
      json: true, // Automatically stringifies the body to JSON
      headers: {
        Authorization: config.apiCredentials,
      },
    };

    return rp(options);
  } catch (err) {
    config.logr.error(`Error in openbazaar.js/getNotifications(): ${err}`);
    config.logr.error(`Error stringified: ${JSON.stringify(err, null, 2)}`);
    throw err;
  }
}

async function markNotificationAsRead(config, body) {
  const options = {
    method: "POST",
    uri: `${config.server}:${config.obPort}/ob/marknotificationasread/${body.notificationId}`,
    body: {},
    json: true, // Automatically stringifies the body to JSON
    headers: {
      Authorization: config.apiCredentials,
    },
  };

  return rp(options);
}

// Mark an order as 'Fulfilled'.
async function fulfillOrder(config, body) {
  try {
    const options = {
      method: "POST",
      uri: `${config.server}:${config.obPort}/ob/orderfulfillment`,
      body: body,
      json: true, // Automatically stringifies the body to JSON
      headers: {
        Authorization: config.apiCredentials,
      },
    };

    return rp(options);
  } catch (err) {
    config.logr.error(`Error in openbazaar.js/fulfillOrder(): ${err}`);
    config.logr.error(`Error stringified: ${JSON.stringify(err, null, 2)}`);
    throw err;
  }
}

// Returns a promise that resolves into an array of store listings.
async function getListings(config) {
  //debugger;

  try {
    const options = {
      method: "GET",
      uri: `${config.server}:${config.obPort}/ob/listings`,
      json: true, // Automatically stringifies the body to JSON
      headers: {
        Authorization: config.apiCredentials,
      },
    };

    return rp(options);
  } catch (err) {
    config.logr.error(`Error in openbazaar.js/getListings(): ${err}`);
    config.logr.error(`Error stringified: ${JSON.stringify(err, null, 2)}`);
    throw err;
  }
}

module.exports = {
  getOBAuth,
  getNotifications,
  markNotificationAsRead,
  fulfillOrder,
  getListings,
};
