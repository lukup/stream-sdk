// @ts-nocheck
"use strict"

import { EtherWallet, ExternalAccount, LukupBytesLike } from './etherWallet';
import { Provider } from "../utils/provider";
import { ethers } from 'ethers';

export class LukupWallet extends EtherWallet {

    constructor(privateKey: LukupBytesLike | ExternalAccount, provider?: Provider) {
        super(privateKey, provider);
    }

    /**
     *  Static method to generate mnemonic.
     */
    static generateMnemonic(): string {
        return EtherWallet.createRandom()._mnemonic().phrase;
        // return newWallet.mnemonic.phrase;
    }

    /**
     *  Static methods to create a new Wallet instance.
     */
    static createWallet(): LukupWallet {
        const newWallet = EtherWallet.createRandom();
        return new LukupWallet(LukupWallet.parseMnemonics(newWallet.mnemonic.phrase, newWallet.mnemonic.path));
    }

    /**
     *  Static methods to create a new Wallet instance from mnemonics.
     */
    static importWallet(mnemonic: string, path?: string): LukupWallet {
        const newWallet = EtherWallet.fromMnemonic(mnemonic, path);
        return new LukupWallet(LukupWallet.parseMnemonics(newWallet.mnemonic.phrase, newWallet.mnemonic.path));
    }

    public setProvider(provider: Provider) {
        return new LukupWallet(this.privateKey, provider);
    }
    /**
     * The Metamask plugin also allows signing transactions to
     * send ether and pay to change state within the blockchain.
     * For this, we need the account signer...
     * @param window.ethereum object 
     * @returns signer object
     */
    static async web3Provider(object: any) {
        if (!object.isMetaMask) return new Error('Invalid object')
        await window.ethereum.enable()
        const provider = new ethers.providers.Web3Provider(object)
        const signer = provider.getSigner()
        return signer
    }
}