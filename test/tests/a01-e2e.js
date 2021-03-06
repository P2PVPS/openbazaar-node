// const rp = require('request-promise')
const assert = require('chai').assert
const ob = require('../../openbazaar.js')

const config = {
  apiCredentials: '',
  obServer: 'http://localhost',
  // obServer: 'http://p2pvps.net',
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

        console.log(`apiCredentials: ${JSON.stringify(apiCredentials, null, 2)}`)

        // Save the credentials for use in other tests.
        config.apiCredentials = apiCredentials

        assert(typeof apiCredentials === 'string', 'Returns a string')
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

describe('Create Profile', () => {
  describe('Generate a new profile for the new store.', () => {
    it('should generate a new profile', async () => {
      try {
        const profileData = {
          handle: 'drwasho',
          name: 'Washington Sanchez',
          location: 'Brisbane',
          about: 'The Dude',
          shortDescription: 'Yo',
          contactInfo: {
            website: 'openbazaar.org',
            email: 'drwasho@openbazaar.org',
            phoneNumber: '12345'
          },
          nsfw: false,
          vendor: true,
          moderator: false,
          colors: {
            primary: '#000000',
            secondary: '#FFD700',
            text: '#ffffff',
            highlight: '#123ABC',
            highlightText: '#DEAD00'
          }
        }

        const profile = await ob.createProfile(config, profileData)
        // console.log(`profile: ${JSON.stringify(profile, null, 2)}`)

        assert(profile.handle === 'drwasho', 'Correct handle returned')
        assert(profile.contactInfo.website === 'openbazaar.org', 'Correct contact info returned')
      } catch (err) {
        if (err.statusCode === 409) {
          assert(
            err.response.body.reason === 'Profile already exists. Use PUT.',
            'Profile already exists. Correct error message returned'
          )
        } else {
          throw err
        }
      }
    })
  })
})

describe('Listing', () => {
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
          images: [
            {
              filename: 'p2pvp.org.png',
              original: 'zb2rhdwvBAjky685CtiZHbA291rJGGAVpA7RhvY7vRrznX6Ne',
              large: 'zb2rhoDG3RLMkFarDGajWALbgeXgGG6xmHCZAqiTYrdrdP8ew',
              medium: 'zb2rhmdVqhZjnpw6Pwd4tCimB1L79ABcukcRnqDroP1C5B6GE',
              small: 'zb2rhiBc94WnxN3eNtbnBU2CD9sJ1X1QiaemYFpAVFwQVPDsq',
              tiny: 'zb2rhYBN6k6udcF86NWaPr1GBB8HpPYLcL1HwFtJZE7gGEpT8'
            }
          ],
          skus: [
            {
              quantity: 1,
              productID: '123456789'
            }
          ]
        }
      }

      const result = await ob.createListing(config, listingData)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)
      config.slug = result.slug

      assert.property(result, 'slug', 'Returns object with a property of slug')
    })
  })

  describe('getListings()', () => {
    it('should return an array of store listings', async () => {
      const listings = await ob.getListings(config)

      // console.log(`listings: ${JSON.stringify(listings, null, 2)}`)

      assert.isArray(listings, 'Returns an array')
    })
  })

  describe('removeListing()', () => {
    it('should return an empty object.', async () => {
      const result = await ob.removeListing(config, config.slug)

      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isObject(result, 'Returns an object')
      assert.isEmpty(result, 'Object is empty.')
    })
  })
})

describe('Wallet', () => {
  describe('getWalletBalance()', () => {
    it('should return the balance of the wallet.', async () => {
      const result = await ob.getWalletBalance(config)

      // console.log(`getWalletBalance() result: ${JSON.stringify(result, null, 2)}`)

      assert.isNumber(result.confirmed, 'Confirmed balance is a number')
      assert.isNumber(result.unconfirmed, 'Unconfirmed balance is a number')
    })
  })

  describe('getExchangeRate()', () => {
    it('should return the exchange rate.', async () => {
      const result = await ob.getExchangeRate(config)

      // console.log(`getExchangeRate() result: ${JSON.stringify(result, null, 2)}`)

      assert.isNumber(result.USD, 'Get USD exchange rate.')
    })
  })

  describe('getAddress()', () => {
    it('should return the public cryptocoin address', async () => {
      const result = await ob.getAddress(config)

      // console.log(`getAddress() result: ${JSON.stringify(result, null, 2)}`)

      assert.isNotEmpty(result.address, 'Address is returned')
    })
  })

  describe('sendMoney()', () => {
    it('should send $0.05 in cryptocurrency to self.', async () => {
      const walletBalance = await ob.getWalletBalance(config)
      const address = await ob.getAddress(config)

      const exchangeRate = await ob.getExchangeRate(config)
      const usdExchangeRate = exchangeRate.USD
      const bchPerDollar = 1 / usdExchangeRate
      // Five and Ten cents in Satoshis.
      const fiveCents = roundSatoshis(bchPerDollar * 0.05)
      const tenCents = fiveCents * 2

      if (walletBalance.confirmed < tenCents) {
        assert(1, 1, 'Test skipped due to lack of balance.')
        return
      }

      const moneyObj = {
        address: address.address,
        amount: fiveCents,
        feeLevel: 'ECONOMIC',
        memo: 'openbazaar-node test'
      }

      const result = await ob.sendMoney(config, moneyObj)

      // console.log(`sendMoney() result: ${JSON.stringify(result, null, 2)}`)

      assert.isNumber(result.amount, 'Total amount of Satoshis sent')
      assert.isNumber(result.confirmedBalance, 'New wallet balance.')
      assert(result.memo, 'openbazaar-node test', 'Memo is included correctly.')
      assert.isNotEmpty(result.timestamp, 'Timestamp is included')
      assert.isNumber(result.unconfirmedBalance, 'Unconfirmed balance is a number.')
    })
  })
})

/*
// TODO mock this API
describe('getOrder()', () => {
  it('should return information on an order', async () => {
    const result = await ob.getOrder(config, 'QmQ1qjhFXvBEtfof346Z9W5Go6K9jojgvvBXquCKQEQQkk')

    console.log(`getOrder() result: ${JSON.stringify(result, null, 2)}`)

    assert.isNotEmpty(result.address, 'Order information is returned')
  })
})
*/
/*
// Example return value from ob.getOrder():

{
   contract:{
      vendorListings:[
         [
            Object
         ],
         [
            length
         ]:1
      ],
      buyerOrder:{
         refundAddress:'qqstld5hu6kf84arkss7jtdc9kvxm50svqksgk04qy',
         refundFee:0,
         shipping:[
            Object
         ],
         buyerID:[
            Object
         ],
         timestamp:'2018-07-28T23:32:04.298412128Z',
         items:[
            Array
         ],
         payment:[
            Object
         ],
         ratingKeys:[
            Array
         ],
         alternateContactInfo:'',
         version:2
      },
      vendorOrderConfirmation:{
         orderID:'QmcAjF4cjSrG2ChiQY4ByLNciYqCfhsfVYuNPJxQ2C8m1u',
         timestamp:'2018-07-28T23:32:04.616538847Z',
         paymentAddress:'qz7t6yshmp3vhks3gfnnz0emv2g2nraaeskcag5ell',
         requestedAmount:1470,
         ratingSignatures:[
            Array
         ]
      },
      vendorOrderFulfillment:[
         [
            Object
         ],
         [
            length
         ]:1
      ],
      signatures:[
         [
            Object
         ],
         [
            Object
         ],
         [
            Object
         ],
         [
            Object
         ],
         [
            length
         ]:4
      ]
   },
   state:'FULFILLED',
   read:false,
   funded:true,
   unreadChatMessages:0,
   paymentAddressTransactions:[
      {
         txid:'961988b62b52672385805c9d3d05116cbe0dd766cfa337acd043312c3153c07e',
         value:1470,
         confirmations:0,
         height:0,
         timestamp:'2018-07-28T23:32:08.952423586Z'
      },
      [
         length
      ]:1
   ]
}
*/

/*
 These are support functions.
*/

// Rounds the floating point val to a precise number of satoshis
function roundSatoshis (val) {
  const satoshis = Number(val) * 100000000
  const roundedSatoshis = Math.round(satoshis)
  return roundedSatoshis
}
