// SPDX-License-Identifier: BUSL-1.1
// @ts-nocheck

import { LukupContract, DATATYPES } from '../index';
import { LukupWallet } from "../../wallet";
import { abi, networks } from '../../abi/Content.json';

enum FUNCTIONS {
    UPLOAD = ''
}

export default class ContentContract extends LukupContract {

    public contractAddress: string
    
    constructor(signer: LukupWallet, contentItemAddress: string) {

        const chainId: string = signer.provider._network.chainId.toString()
        const address = contentItemAddress
        super(address, JSON.stringify(abi), signer)

        this.contractAddress = address
    }

    public async transferFrom(_senderAddress: string, _recieverAddress: string, _tokens: string, options?: { gasPrice: number, gasLimit: number }): any {
        await this.validateInput(DATATYPES.ADDRESS, _senderAddress)
        await this.validateInput(DATATYPES.ADDRESS, _recieverAddress)
        await this.validateInput(DATATYPES.NUMBER, _tokens)
        return this.callContract(FUNCTIONS.UPLOAD, _senderAddress, _recieverAddress, _tokens, options)
    }

}