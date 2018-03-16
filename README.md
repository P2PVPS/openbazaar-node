[![Build Status](https://travis-ci.org/P2PVPS/openbazaar-node.svg?branch=master)](https://travis-ci.org/P2PVPS/openbazaar-node)

# openbazaar-node

This library contains a list of functions used to interact with a local
OpenBazaar (OB) store via its API. For reference documentation, see the API
documents at http://api.openbazaar.org

This library is for node.js programs using ECMA2017 async/await.

Functions implemented in this library:

* getOBAuth - Generate an auth header for AJAX calls to the OB store.
* getNotifications - Get notifications
* markNotificationAsRead - Mark a notification as read
* fulfillOrder - Fulfill an order
* getListings - Get all product listings in the OB store.

Please help expand this library by submitting a Pull Request.

## Installation

Install this package with:

`npm install --save openbazaar-node`

## Usage

Include this library in the node.js application dependencies with:

`const openbazaar = require("openbazaar-node")`

Most functions expect to be passed a config object. Here is an example of
generating a config object:

```
// Generate api credentials for OpenBazaar.
const apiCredentials = openbazaar.getOBAuth(OB_USERNAME, OB_PASSWORD);
let config = {
  // Config object passed to library functions.
  apiCredentials: apiCredentials,
  server: SERVER_URL,
  port: SERVER_PORT,
  obPort: OB_SERVER_PORT
};
```
