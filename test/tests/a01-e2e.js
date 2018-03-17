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
        config.clientId = OB_USERNAME
        config.clientSecret = OB_PASSWORD
        const apiCredentials = ob.getOBAuth(config)

        // console.log(`apiCredentials: ${JSON.stringify(apiCredentials, null, 2)}`)

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

describe('Notifications', () => {
  describe('getNotifications()', () => {
    it('should return an array of notifications.', async () => {
      const notifications = await ob.getNotifications(config)

      // console.log(`test notifications: ${JSON.stringify(notifications, null, 2)}`)

      assert.isArray(notifications.notifications, 'Returns an array')
      assert.isNumber(notifications.total, 'Returns a total of notifications')
    })
  })
})

/*
describe('Create Profile', () => {
  describe('Generate a new profile for the new store.', () => {
    it('should generate a new profile', async () => {
      const profileData = {
        'handle': 'drwasho',
        'name': 'Washington Sanchez',
        'location': 'Brisbane',
        'about': 'The Dude',
        'shortDescription': 'Yo',
        'contactInfo': {
          'website': 'openbazaar.org',
          'email': 'drwasho@openbazaar.org',
          'phoneNumber': '12345'
        },
        'nsfw': false,
        'vendor': true,
        'moderator': false,
        'colors': {
          'primary': '#000000',
          'secondary': '#FFD700',
          'text': '#ffffff',
          'highlight': '#123ABC',
          'highlightText': '#DEAD00'
        }
      }

      const profile = await ob.createProfile(config, profileData)

      console.log(`profile: ${JSON.stringify(profile, null, 2)}`)

      // Save the credentials for use in other tests.
      // config.apiCredentials = apiCredentials

      assert(true, 'test')
    })
  })
})
*/

/*
describe('Create Listing', () => {
  describe('createListing()', () => {
    it('should create a listing.', async () => {
      const now = new Date()
      const oneDay = 60000 * 60 * 24
      const thirtyDaysFromNow = new Date(now.getTime() + oneDay * 30)

      const listingData = {
        coupons: [
          {
            discountCode: 'TESTING',
            title: 'TESTING',
            priceDiscount: 29
          }
        ],
        refundPolicy: '',
        shippingOptions: [],
        termsAndConditions: '',
        metadata: {
          contractType: 'SERVICE',
          expiry: thirtyDaysFromNow.toISOString(),
          format: 'FIXED_PRICE',
          pricingCurrency: 'USD'
        },
        item: {
          categories: [],
          condition: 'NEW',
          description: 'test description',
          nsfw: false,
          options: [],
          price: 123,
          tags: [],
          title: 'test title',
          images: [{
            filename: 'p2pvp.org.png',
            original: 'zb2rhdwvBAjky685CtiZHbA291rJGGAVpA7RhvY7vRrznX6Ne',
            large: 'zb2rhoDG3RLMkFarDGajWALbgeXgGG6xmHCZAqiTYrdrdP8ew',
            medium: 'zb2rhmdVqhZjnpw6Pwd4tCimB1L79ABcukcRnqDroP1C5B6GE',
            small: 'zb2rhiBc94WnxN3eNtbnBU2CD9sJ1X1QiaemYFpAVFwQVPDsq',
            tiny: 'zb2rhYBN6k6udcF86NWaPr1GBB8HpPYLcL1HwFtJZE7gGEpT8'
          }],
          skus: [{
            quantity: 1,
            productID: '123456789'
          }]
        }
      }

      const result = await ob.createListing(config, listingData)

      console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert(1, 'test')
    })
  })
})
*/
