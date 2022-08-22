require('dotenv').config()
const fs = require('fs')
const HDWalletProvider = require('truffle-hdwallet-provider');
// const mnemonic = fs.readFileSync('./sk.txt').toString().trim()

module.exports = {

  plugins: ['truffle-plugin-verify'],

  api_keys: {
    etherscan: process.env.ETHERSCAN_TOKEN,
    bscscan: process.env.BSCSCAN_TOKEN,
  },

  compilers: {
    solc: {
      version: '0.8.0',
    },
  },

  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },

    mainnet: {
      provider: function () {
        return new HDWalletProvider(
          `${process.env.PRIVATE_KEY}`,
          `https://mainnet.infura.io/${process.env.WEB3_INFURA_PROJECT_ID}`
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      confirmations: 2,
      network_id: 1
    },

    kovan: {
      provider: () =>
        new HDWalletProvider(
          `${process.env.PRIVATE_KEY}`,
          `https://kovan.infura.io/v3/${process.env.WEB3_INFURA_PROJECT_ID}`
        ),
      network_id: '42',
    },

    bsctest: {
      provider: function () {
        return new HDWalletProvider(
          `${process.env.PRIVATE_KEY}`,
          "https://data-seed-prebsc-1-s1.binance.org:8545/")
      },
      network_id: 97,
    },

  }
}
