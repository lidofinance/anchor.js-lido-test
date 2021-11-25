# Tests for Archor.js and Lido contracts

### Setup

create .env file with WALLET_MNEMONIC='here is your mnemonic...'

### So you can run the following tests:

- yarn:mint - Mint/bond Luna
- yarn:burn - Burn/unbond Bluna (make sure you have some minted already)
- yarn:claim - Claim rewards (make sure you have earned some)
- yarn:withdraw - Withdraw unbounded/burned Bluna (make sure 24h passed from unbound request)
- yarn:instant_burn - Doesn't pass for now bc it's a swap request
