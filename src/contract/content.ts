// (c) Kallol Borah, 2022
// SPDX-License-Identifier: BUSL-1.1
// @ts-nocheck

import { LukupContract, DATATYPES } from '../index';
import { LukupWallet } from "../../wallet";
import { abi, networks } from '../../abi/Content.json';

enum FUNCTIONS {
    CREATECONTENT = 'createContent',
    TOKENOWNERBYINDEX = 'tokenOfOwnerByIndex',
    TOTALSUPPLY = 'totalSupply',
    TOKENBYINDEX = 'tokenByIndex',
    REMOVECONTENT = 'removeContent',
    SUPPORTTOKENS = 'supportTokens',
    CHECKSUPPORTFORTOKEN = 'checkSupportForToken',
    STAKE = 'stake',
    VIEWPERFORMANCE = 'viewPerformance',
    VIEWDELIVERY = 'viewDelivery',
    FETCHCONTENTBYCATEGORY = 'fetchContentByCategory',
    SUBSCRIBE = 'subscribe',
    VIEWCONTENT = 'viewContent',
    VIEWAD = 'viewAd',
    SHARECONTENT = 'shareContent',
    SETLICENSETERM = 'setLicenseTerm',
    FETCHEARNINGSBYCATEGORY = 'fetchEarningsbyCategory',
    FETCHEARNINGSFORITEM = 'fetchEarningsForItem',
    FETCHEXPENSESFORAD = 'fetchExpensesForAd'
}

export default class ContentContract extends LukupContract {

    public contractAddress: string
    
    constructor(signer: LukupWallet, contentItemAddress: string) {

        const chainId: string = signer.provider._network.chainId.toString()
        const address = contentItemAddress
        super(address, JSON.stringify(abi), signer)

        this.contractAddress = address
    }

    /**
     * This function creates a record of a content item on the blockchain
     * @param tokenURI      IPFS url of the content file that is pinned
     * @param pricingModel  this is an enum {PPV, AD, FREE} 
     * @param price         integer variable that represents price in LUKUP token units
     * @param stakedToken   digital asset token (eg, Ether, USDC, DAI) that represents asset staked by content creator to pay verification fees 
     * @param staked        integer variable for amount of staked token
     * @param shards        string array with each element containing a shard of the private key used by the content creator to encrypt content stored in IPFS
     * @param keyquorum     minimum number of key shards required to reconstruct the private key to decrypt content fetched from IPFS
     * @param options       standard for gas required for firing transaction on ethereum
     * @returns             content id for submitted content
     */
    public async createContent( tokenURI: string, 
                                pricingModel: string, 
                                price: string, 
                                stakedToken: string,
                                staked: string,
                                shards: string,
                                keyquorum: string,
                                options?: { gasPrice: number, gasLimit: number }): any {
                                await this.validateInput(DATATYPES.STRING, tokenURI)
                                await this.validateInput(DATATYPES.STRING, pricingModel)
                                await this.validateInput(DATATYPES.NUMBER, price)
                                await this.validateInput(DATATYPES.STRING, stakedToken)
                                await this.validateInput(DATATYPES.NUMBER, staked)
                                await this.validateInput(DATATYPES.NUMBER, keyquorum)
                                return this.callContract(FUNCTIONS.CREATECONTENT, 
                                tokenURI, 
                                this.sanitiseInput(DATATYPES.BYTE32, pricingModel), 
                                price,
                                stakedToken,
                                staked,
                                shards,
                                keyquorum,    
                                options)
    }

    /**
     * This function returns the number of content items created by the caller of this function
     * @param options   standard parameter for gas required to fire transaction on ethereum
     * @returns         number of content items created by function requestor
     */
    public async totalSupply(   options?: { gasPrice: number, gasLimit: number }): any {
                                return this.callContract(FUNCTIONS.TOTALSUPPLY, 
                                options)
    }

    /**
     * This function returns the content id corresponding to index passed
     * @param index     index number of the content item whose id needs to be returned
     * @param options   standard parameter for gas required to fire transaction on ethereum
     * @returns         returns content id of content item in full list of content items created by all creators
     */
    public async tokenByIndex(  index: string, 
                                options?: { gasPrice: number, gasLimit: number }): any {
                                await this.validateInput(DATATYPES.NUMBER, index)
                                return this.callContract(FUNCTIONS.TOKENBYINDEX, 
                                index,
                                options)
    }

    /**
     * This function fetches the content item id for the content owner and the index of the content item in the list of content tokens
     * @param owner     wallet address of content creator
     * @param index     index number of the content item whose id needs to be returned
     * @param options   standard parameter for gas required to fire transaction on ethereum
     * @returns         content item id corresponding to passed index in list of content items created by owner
     */
    public async tokenOfOwnerByIndex( owner: string, 
                                index: string, 
                                options?: { gasPrice: number, gasLimit: number }): any {
                                await this.validateInput(DATATYPES.ADDRESS, owner)
                                await this.validateInput(DATATYPES.NUMBER, index)
                                return this.callContract(FUNCTIONS.TOKENOWNERBYINDEX, 
                                owner, 
                                index,
                                options)
    }

    /**
     * This function removes a content item belonging to a content category
     * @param contentId     number representing content identifier
     * @param category      bytes32 string representing content category
     * @param options       standard parameter for gas required to fire transaction on ethereum
     * @returns             nothing
     */
    public async removeContent( contentId: string, 
                                category: string, 
                                options?: { gasPrice: number, gasLimit: number }): any {
                                await this.validateInput(DATATYPES.NUMBER, contentId)
                                await this.validateInput(DATATYPES.STRING, category)
                                return this.callContract(FUNCTIONS.REMOVECONTENT, 
                                contentId, 
                                this.sanitiseInput(DATATYPES.BYTE32, category),
                                options)
    }

    /**
     * This function is called by the deployer of the contracts to indicating support for a digital asset token on the system
     * @param token     address of digital asset token (eg, USDC, DAI) that is supported on the system and used for staking
     * @param options   
     * @returns         nothing
     */
    public async supportTokens( token: string, 
                                options?: { gasPrice: number, gasLimit: number }): any {
                                await this.validateInput(DATATYPES.ADDRESS, token)
                                return this.callContract(FUNCTIONS.SUPPORTTOKENS, 
                                token,
                                options)
    }

    /**
     * This function is called by the deployer of the contracts to check support for a digital asset token on the system
     * @param token     address of digital asset token (eg, USDC, DAI) that is supported on the system and used for staking
     * @param options   
     * @returns         boolean, true indicating supported token, false indicating lack of support
     */
    public async checkSupportForToken(token: string, 
                                options?: { gasPrice: number, gasLimit: number }): any {
                                await this.validateInput(DATATYPES.ADDRESS, token)
                                return this.callContract(FUNCTIONS.CHECKSUPPORTFORTOKEN, 
                                token,
                                options)
    }

    /**
     * This function stakes a digital asset token by the requestor (usually the content creator or an advertiser) for verifying content
     * @param token     blockchain address of digital asset token (eg, USDC, DAI) staked
     * @param amount    number indicating amount staked
     * @param options 
     * @returns         nothing
     */
    public async stake( token: string, 
                        amount: string, 
                        options?: { gasPrice: number, gasLimit: number }): any {
                        await this.validateInput(DATATYPES.ADDRESS, token)
                        await this.validateInput(DATATYPES.NUMBER, amount)
                        return this.callContract(FUNCTIONS.STAKE, 
                        token, 
                        amount,
                        options)
    }

    /**
     * This function returns performance attributes (eg, likes, shares, subscriptions) for content item
     * @param contentId     content item identifier
     * @param options   
     * @returns             returns tuple of number of likes, shares, subscriptions
     */
    public async viewPerformance(contentId: string, 
                                options?: { gasPrice: number, gasLimit: number }): any {
                                await this.validateInput(DATATYPES.NUMBER, contentId)
                                return this.callContract(FUNCTIONS.VIEWPERFORMANCE, 
                                contentId,
                                options)
    }

    /**
     * This function checks delivery of ads on content viewed
     * @param adId      identifier for ad unit
     * @param options   
     * @returns         array of content ids on which ad has been delivered
     */
    public async viewDelivery(  adId: string, 
                                options?: { gasPrice: number, gasLimit: number }): any {
                                await this.validateInput(DATATYPES.NUMBER, adId)
                                return this.callContract(FUNCTIONS.VIEWDELIVERY, 
                                adId,
                                options)
    }

    /**
     * This function fetches content for a given content category
     * @param category  content category
     * @param options 
     * @returns         array of content ids belonging to that category
     */
    public async fetchContentByCategory(category: string, 
                                        options?: { gasPrice: number, gasLimit: number }): any {
                                        await this.validateInput(DATATYPES.STRING, category)
                                        return this.callContract(FUNCTIONS.FETCHCONTENTBYCATEGORY, 
                                        this.sanitiseInput(DATATYPES.BYTE32, category),
                                        options)
    }

    /**
     * This function subscribes to given content id for the requestor
     * @param contentId     content identifier number that is to be subscribed
     * @param options 
     * @returns             nothing
     */
    public async subscribe( contentId: string, 
                            options?: { gasPrice: number, gasLimit: number }): any {
                            await this.validateInput(DATATYPES.NUMBER, contentId)
                            return this.callContract(FUNCTIONS.SUBSCRIBE, 
                            contentId,
                            options)
    }

    /**
     * This function returns the key shards required to view the content item
     * @param contentId     content identifier number that is to be viewed
     * @param options 
     * @returns             string array of key shards
     */
     public async viewContent( contentId: string, 
                            options?: { gasPrice: number, gasLimit: number }): any {
                            await this.validateInput(DATATYPES.NUMBER, contentId)
                            return this.callContract(FUNCTIONS.VIEWCONTENT, 
                            contentId,
                            options)
    }

    /**
     * This function returns the key shards required to decrypt an ad to be delivered on a given content item
     * @param adId          identifier for advertisement to show
     * @param contentId     identifier for content on which ad is to be viewed
     * @param options 
     * @returns             string array of key shards used to decrypt the ad
     */
    public async viewAd(adId: string, 
                        contentId: string, 
                        options?: { gasPrice: number, gasLimit: number }): any {
                        await this.validateInput(DATATYPES.NUMBER, adId)
                        await this.validateInput(DATATYPES.NUMBER, contentId)
                        return this.callContract(FUNCTIONS.VIEWAD, 
                        adId, 
                        contentId,
                        options)
    }

    /**
     * This function shares a given content item with another user on the system
     * @param sharedWith    address of user to share content with
     * @param contentId     shared content identifier
     * @param options 
     * @returns             nothing
     */
    public async shareContent(  sharedWith: string, 
                                contentId: string, 
                                options?: { gasPrice: number, gasLimit: number }): any {
                                await this.validateInput(DATATYPES.ADDRESS, sharedWith)
                                await this.validateInput(DATATYPES.NUMBER, contentId)
                                return this.callContract(FUNCTIONS.SHARECONTENT, 
                                sharedWith, 
                                contentId,
                                options)
    }

    /**
     * This function is called by the deployer of the Lukup contracts to set a standard viewing window for content on the system
     * @param time          number indicating viewing window in milliseconds
     * @param options       
     * @returns             nothing
     */
    public async setLicenseTerm(time: string, 
                                options?: { gasPrice: number, gasLimit: number }): any {
                                await this.validateInput(DATATYPES.NUMBER, time)
                                return this.callContract(FUNCTIONS.SETLICENSETERM, 
                                time,
                                options)
    }

    /**
     * This function fetches earnings for a content category (eg, PPV, AD, FREE) for the requestor
     * @param category  content category
     * @param options 
     * @returns         number for revenues earned
     */
    public async fetchEarningsbyCategory(category: string, 
                                        options?: { gasPrice: number, gasLimit: number }): any {
                                        await this.validateInput(DATATYPES.STRING, category)
                                        return this.callContract(FUNCTIONS.FETCHEARNINGSBYCATEGORY, 
                                        this.sanitiseInput(DATATYPES.BYTE32, category),
                                        options)
    }

    /**
     * This function returns the earnings for a content item
     * @param contentId     content identifier number 
     * @param options 
     * @returns             amount of revenues earned
     */
    public async fetchEarningsForItem(  contentId: string, 
                                        options?: { gasPrice: number, gasLimit: number }): any {
                                        await this.validateInput(DATATYPES.NUMBER, contentId)
                                        return this.callContract(FUNCTIONS.FETCHEARNINGSFORITEM, 
                                        contentId,
                                        options)
    }

    /**
     * This function returns the expenses for an ad item
     * @param adId          ad identifier number 
     * @param options 
     * @returns             amount of expenses made on delivering the ad
     */
    public async fetchExpensesForAd(adId: string, 
                                    options?: { gasPrice: number, gasLimit: number }): any {
                                    await this.validateInput(DATATYPES.NUMBER, adId)
                                    return this.callContract(FUNCTIONS.FETCHEXPENSESFORAD, 
                                    adId,
                                    options)
    }

}