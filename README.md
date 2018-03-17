[![Build Status](https://travis-ci.org/P2PVPS/openbazaar-node.svg?branch=master)](https://travis-ci.org/P2PVPS/openbazaar-node)

# openbazaar-node

This library contains a list of functions used to interact with a local
OpenBazaar (OB) store via its API. For reference documentation, see the API
documents at http://api.openbazaar.org

This library is for node.js programs using ECMA2017 async/await.

Functions implemented in this library:

* getOBAuth - Generate an authorization header for REST API calls to the OB store.
* createProfile - Create a profile for the OB store.
* createListings - Create a new listing in the store.
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

Before you can make API calls to your OpenBazaar server, you'll need to make a
few changes to the `config` file used by OpenBazaar. On Linux systems, this
file is located in `~/.openbazaar2.0/`. An example config file is provided
in [test/setup/config](test/setup/config).

Most functions in this library expect to be passed a config object.
Here is an example of generating a config object:

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

## Testing
The tests in the [test/tests](test/tests) directory also provide code examples of
how to use this library to interact with an OpenBazaar server.

**Warning:** Tests are *not* intended to be run against a production server. Tests
make live API calls against a server and could potentially screw up an existing
OpenBazaar server.

The tests make use of the [OpenBazaar Docker image](https://hub.docker.com/r/openbazaar/server/).
To run tests you'll need to [install Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04)
as well as [install Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04).

Once that is complete, run these commands:
```
npm install
./reset-ob
npm test
```
