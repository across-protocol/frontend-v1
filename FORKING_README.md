# Forking for Cypress

Due to the fact there are 3 potential chains currently in this test environment, you have to do the following in order to run the cypress test:

Terminal one in root:

```
$ npx hardhat node  --fork https://mainnet.infura.io/v3/<infura-key>
```

This will fork mainnet.

Terminal two in forking/optimism:

```
$ npx hardhat node --port 9545 --fork https://optimism-mainnet.infura.io/v3/<infura-key>
```

Terminal two in forking/optimism-kovan:

```
$ npx hardhat node --port 9546 --fork https://optimism-kovan.infura.io/v3/<infura-key>
```

This is due to the fact that hardhat wants to default to a certain chainId in the hardhat.config.

Current app also uses arbitrum. cd into forking/arbitrum-rinkeby:

```
$ npx hardhat node --port 9548 --fork https://arbitrum-rinkeby.infura.io/v3/d0d5d84b4f1f40079b76b63220ef8926
```

TODO: Prevent this mess by making it more configurable.

After this, you may run the cypress tests like normal by running yarn cypress:open and yarn start to start the Cypress runner and the app.
