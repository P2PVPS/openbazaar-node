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

describe('Create Listing', () => {
  describe('createListing()', () => {
    it('should create a listing.', async () => {

      const now = new Date()
      const oneDay = 60000 * 60 * 24
      const thirtyDaysFromNow = new Date(now.getTime() + oneDay*30)

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

      assert(1,'test')
      
    })
  })
})
