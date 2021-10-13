require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@eth-optimism/plugins/hardhat/compiler");
require("@eth-optimism/hardhat-ovm");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      hardfork: "london",
      gasPrice: "auto",
      initialBaseFeePerGas: 1_000_000_000,
      // chainId: 31337,
      chainId: 1,
    },
    optimistic: {
      url: "http://127.0.0.1:9545", // this is the default port
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
      },
      gasPrice: 15_000_000, // required
      ovm: true, // required,
      chainId: 10,
    },
    // optimisticKovan: {
    //   url: "http://127.0.0.1:9546", // this is the default port
    //   accounts: {
    //     mnemonic: "test test test test test test test test test test test junk",
    //   },
    //   gasPrice: 15_000_000, // required
    //   ovm: true, // required,
    //   chainId: 69,
    // },
  },
};
