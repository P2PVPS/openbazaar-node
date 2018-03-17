// const rp = require('request-promise')
const assert = require('chai').assert
const ob = require('../../openbazaar.js')

const config = {
  apiCredentials: '',
  server: 'http://localhost',
  port: 4002,
  obPort: 4002
}

const OB_USERNAME = 'yourUsername'
const OB_PASSWORD = 'yourPassword'

describe('Authentication', () => {

  describe('getOBAuth()', () => {
    it('should generate an authorization header.', async () => {
      try {
        const apiCredentials = ob.getOBAuth(OB_USERNAME, OB_PASSWORD)

        //console.log(`apiCredentials: ${JSON.stringify(apiCredentials, null, 2)}`)

        // Save the credentials for use in other tests.
        config.apiCredentials = apiCredentials

        assert(typeof (apiCredentials) === 'string', 'Returns a string')
      } catch (err) {
        console.log('Error authenticating test user: ' + JSON.stringify(err, null, 2))
        throw err
      }
    })
  })
})


describe('Create Listing', () => {

  describe('createListing()', () => {
    it('should create a listing.', async () => {
      try {
        const apiCredentials = ob.getOBAuth(OB_USERNAME, OB_PASSWORD)

        console.log(`apiCredentials: ${JSON.stringify(apiCredentials, null, 2)}`)
        config.apiCredentials = apiCredentials

        assert(typeof (apiCredentials) === 'string', 'Returns a string')
      } catch (err) {
        console.log('Error authenticating test user: ' + JSON.stringify(err, null, 2))
        throw err
      }
    })
  })
})
