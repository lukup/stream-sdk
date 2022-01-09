# The Lukup SDK
The Lukup SDK provides access to the smart contracts deployed for content creators, viewers, advertisers, and verifiers.

# installing using npm
```npm install @lukup/stream-sdk```

# creating new wallet
```
const {LukupWallet} = require('@lukup/stream-sdk');
let mnemonics = await LukupWallet.generateMnemonics()
let wallet = await LukupWallet.importWallet(menmonics)
```
# setProvider
```
const {Provider} = require('@lukup/stream-sdk');
const defaultProvider = 'ropsten' // or any other network of your choice.
let walletWithProvider = wallet.setProvider(
    Provider.defaultProvider(defaultProvider)
)
```
# interacting with Smart contracts
```let content = new ContentContract(wallet);```

This will create an instance of Content contract and you can access all the functions within the Content Contract using this object.

Now you can call a function in content object like:
```content.createContent(............)``` 


# This is how you can integrate with any Dapp.
1. Install and Import the SDK
2. Create a wallet instance and fund it
3. Create instances of the Contract that you want to interact with using the above wallet and call their functions.