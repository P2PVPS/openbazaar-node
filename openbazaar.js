/*
  This library contains a list of functions used to interact with a local
  OpenBazaar (OB) store via its API. For reference documentation, see the API
  documents at http://api.openbazaar.org

  This library is for node.js programs using ECMA2017 async/await.

  Most functions expect to be passed a config object. Here is an example of
  generating a config object:

  // Generate api credentials for OpenBazaar.
  let config = {
    // Config object passed to library functions.
    apiCredentials: apiCredentials,
    obServer: SERVER_URL,
    port: SERVER_PORT,
    obPort: OB_SERVER_PORT
  };
  const apiCredentials = openbazaar.getOBAuth(config);

*/

'use strict'

module.exports = {
  getOBAuth, // Generate an auth header for AJAX calls to the OB store.
  getNotifications, // Get notifications
  markNotificationAsRead, // Mark a notification as read
  fulfillOrder, // Fulfill an order
  getListings, // Get all product listings in the OB store.
  createListing, // Create a new product listing.
  removeListing, // Remove a product listing.
  createProfile, // Create an OB store profile.
  getWalletBalance, // Get the balance of your wallet.
  getExchangeRate, // Get Exchange Rate in USD
  getAddress, // Get your wallet address.
  sendMoney, // Send cryptocurrency to an address.
  getOrder // Get information on an order.
}

// Dependencies
const rp = require('request-promise')

// Generate an auth key for the header. Required fall all OpenBazaar API calls.
function getOBAuth (config) {
  // debugger;

  // Encoding as per API Specification.
  const combinedCredential = `${config.clientId}:${config.clientSecret}`
  // var base64Credential = window.btoa(combinedCredential);
  const base64Credential = Buffer.from(combinedCredential).toString('base64')
  const readyCredential = `Basic ${base64Credential}`

  return readyCredential
}

// This function returns a Promise that resolves to a list of notifications
// recieved by the OB store.
async function getNotifications (config) {
  try {
    const options = {
      method: 'GET',
      uri: `${config.obServer}:${config.obPort}/ob/notifications`,
      json: true, // Automatically stringifies the body to JSON
      headers: {
        Authorization: config.apiCredentials
      }
      // resolveWithFullResponse: true
    }

    return rp(options)
  } catch (err) {
    console.error(`Error in openbazaar.js/getNotifications(): ${err}`)
    console.error(`Error stringified: ${JSON.stringify(err, null, 2)}`)
    throw err
  }
}

async function markNotificationAsRead (config, body) {
  const options = {
    method: 'POST',
    uri: `${config.obServer}:${config.obPort}/ob/marknotificationasread/${body.notificationId}`,
    body: {},
    json: true, // Automatically stringifies the body to JSON
    headers: {
      Authorization: config.apiCredentials
    }
  }

  return rp(options)
}

// Mark an order as 'Fulfilled'.
async function fulfillOrder (config, body) {
  try {
    const options = {
      method: 'POST',
      uri: `${config.obServer}:${config.obPort}/ob/orderfulfillment`,
      body: body,
      json: true, // Automatically stringifies the body to JSON
      headers: {
        Authorization: config.apiCredentials
      }
    }

    return rp(options)
  } catch (err) {
    console.error(`Error in openbazaar.js/fulfillOrder(): ${err}`)
    console.error(`Error stringified: ${JSON.stringify(err, null, 2)}`)
    throw err
  }
}

// Returns a promise that resolves into an array of store listings.
async function getListings (config) {
  // debugger;

  try {
    const options = {
      method: 'GET',
      uri: `${config.obServer}:${config.obPort}/ob/listings`,
      json: true, // Automatically stringifies the body to JSON
      headers: {
        Authorization: config.apiCredentials
      }
    }

    return rp(options)
  } catch (err) {
    console.error(`Error in openbazaar.js/getListings(): ${err}`)
    console.error(`Error stringified: ${JSON.stringify(err, null, 2)}`)
    throw err
  }
}

// Create a listing in the OB store.
function createListing (config, listingData) {
  const options = {
    method: 'POST',
    uri: `${config.obServer}:${config.obPort}/ob/listing/`,
    body: listingData,
    json: true, // Automatically stringifies the body to JSON
    headers: {
      Authorization: config.apiCredentials
    }
  }

  return rp(options)
}

function removeListing (config, slug) {
  const options = {
    method: 'DELETE',
    uri: `${config.obServer}:${config.obPort}/ob/listing/${slug}`,
    body: {
      slug: slug
    },
    json: true, // Automatically stringifies the body to JSON
    headers: {
      Authorization: config.apiCredentials
    }
  }

  return rp(options)
}

// Create a profile for a new store
function createProfile (config, profileData) {
  const options = {
    method: 'POST',
    uri: `${config.obServer}:${config.obPort}/ob/profile/`,
    body: profileData,
    json: true, // Automatically stringifies the body to JSON
    headers: {
      Authorization: config.apiCredentials
    }
    // resolveWithFullResponse: true
  }

  return rp(options)
}

// Get wallet balance
function getWalletBalance (config) {
  const options = {
    method: 'GET',
    uri: `${config.obServer}:${config.obPort}/wallet/balance`,
    json: true, // Automatically stringifies the body to JSON
    headers: {
      Authorization: config.apiCredentials
    }
    // resolveWithFullResponse: true
  }

  return rp(options)
}

// Get wallet balance
function getExchangeRate (config) {
  const options = {
    method: 'GET',
    uri: `${config.obServer}:${config.obPort}/ob/exchangerate`,
    json: true, // Automatically stringifies the body to JSON
    headers: {
      Authorization: config.apiCredentials
    }
    // resolveWithFullResponse: true
  }

  return rp(options)
}

// Get an address to recieve money
function getAddress (config) {
  const options = {
    method: 'GET',
    uri: `${config.obServer}:${config.obPort}/wallet/address`,
    json: true, // Automatically stringifies the body to JSON
    headers: {
      Authorization: config.apiCredentials
    }
    // resolveWithFullResponse: true
  }

  return rp(options)
}

// Send Money (Will send whatever cryptocurrency the server is configured for).
/*
  moneyObj:
    address: Address for the selected cryptocurrency.
    amount: Amount in satoshis
    feeLevel: 'NORMAL' or 'ECONOMIC'. Defaults to 'ECONOMIC'
    memo: Optional note.
*/
function sendMoney (config, moneyObj) {
  const defaultObj = {
    feeLevel: 'ECONOMIC'
  }

  // Add default values to the moneyObj if they are not already assigned.
  Object.assign(moneyObj, defaultObj)

  const options = {
    method: 'POST',
    uri: `${config.obServer}:${config.obPort}/wallet/spend`,
    json: true, // Automatically stringifies the body to JSON
    body: moneyObj,
    headers: {
      Authorization: config.apiCredentials
    }
    // resolveWithFullResponse: true
  }

  return rp(options)
}

/*
  Retrieve information on an order.
*/
function getOrder (config, orderId) {
  const options = {
    method: 'GET',
    uri: `${config.obServer}:${config.obPort}/ob/order/${orderId}`,
    json: true, // Automatically stringifies the body to JSON
    headers: {
      Authorization: config.apiCredentials
    }
    // resolveWithFullResponse: true
  }

  return rp(options)
}
