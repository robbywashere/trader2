const {
  AuthenticatedClient: client
} = require('coinbase-pro');

const apiURI = 'https://api.pro.coinbase.com';
const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';
const {
  secrets
} = require('./secrets');
const {
  db
} = require('./db');

async function ExecuteBuyOrder(amount) {
  const {
    debug,
    selectedKey
  } = db.get('config').value();
  const {
    passphrase,
    secret,
    apiKey,
  } = secrets.get('apiKeys').find({
    identifier: 'sandbox-key'
  }).value();

  const uri = debug ? sandboxURI : apiURI;
  const authedClient = new client(apiKey, secret, passphrase, uri);
  const order = {
    funds: amount,
    side: "buy",
    currency: "BTC",
    product_id: "BTC-USD",
    type: "market"
  }
  try {
    const res = await authedClient.placeOrder(order);
    if (debug) console.log(JSON.stringify(res, null, 4));
    return res
  } catch (e) {
    const error = new Error(e.message);
    error.info = {
      uri,
      ...order
    }
    throw error;
  }
};

module.exports = {
  ExecuteBuyOrder
};