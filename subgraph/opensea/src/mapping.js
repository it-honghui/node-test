"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOwnershipTransferred = exports.handleOwnershipRenounced = exports.handleOrdersMatched = exports.handleOrderCancelled = exports.handleOrderApprovedPartTwo = exports.handleOrderApprovedPartOne = void 0;
var WyvernExchange_1 = require("../generated/WyvernExchange/WyvernExchange");
var schema_1 = require("../generated/schema");
function handleOrderApprovedPartOne(event) {
    var wyvernExchange = WyvernExchange_1.WyvernExchange.bind(event.address);
    var contract = new schema_1.Contract(wyvernExchange._address.toHexString());
    var transaction = schema_1.Transaction.load(event.transaction.hash.toHexString());
    var account = schema_1.Account.load(event.params.maker.toHexString());
    var marketplace = schema_1.MarketPlace.load(event.params.exchange.toHexString());
    var feeEvent = schema_1.FeeEvent.load(event.transaction.hash.toHexString());
    var saleEvent = schema_1.SaleEvent.load(event.transaction.hash.toHexString());
    if (transaction == null) {
        transaction = new schema_1.Transaction(event.transaction.hash.toHexString());
    }
    if (account == null) {
        account = new schema_1.Account(event.params.maker.toHexString());
    }
    if (marketplace == null) {
        marketplace = new schema_1.MarketPlace(event.params.exchange.toHexString());
    }
    if (feeEvent == null) {
        feeEvent = new schema_1.FeeEvent(event.transaction.hash.toHexString());
    }
    if (saleEvent == null) {
        saleEvent = new schema_1.SaleEvent(event.transaction.hash.toHexString());
    }
    marketplace.exchangeAddress = event.params.exchange;
    saleEvent.marketplace = marketplace.id;
    saleEvent.transaction = transaction.id;
    //feeEvent.feeMethod = event.params.feeMethod(BigInt.fromI32(0))
    feeEvent.feeRecipient = event.params.feeRecipient;
    feeEvent.takerProtocolFee = event.params.takerProtocolFee;
    feeEvent.makerProtocolFee = event.params.makerProtocolFee;
    feeEvent.makerRelayerFee = event.params.makerRelayerFee;
    feeEvent.takerProtocolFee = event.params.takerRelayerFee;
    feeEvent.transaction = transaction.id;
    feeEvent.account = account.id;
    feeEvent.contract = contract.id;
    transaction.hash = event.transaction.hash;
    transaction.block = event.block.number;
    transaction.date = event.block.timestamp;
    transaction.account = account.id;
    transaction.marketplace = marketplace.id;
    transaction.saleEvent = saleEvent.id;
    transaction.feeEvent = feeEvent.id;
    contract.address = wyvernExchange._address;
    contract.name = wyvernExchange._name;
    contract.version = wyvernExchange.version();
    contract.codename = wyvernExchange.codename();
    contract.save();
    marketplace.save();
    account.save();
    feeEvent.save();
    transaction.save();
}
exports.handleOrderApprovedPartOne = handleOrderApprovedPartOne;
function handleOrderApprovedPartTwo(event) {
    var auction = schema_1.Auction.load(event.params.hash.toHexString());
    var transaction = schema_1.Transaction.load(event.transaction.hash.toHexString());
    if (transaction == null) {
        transaction = new schema_1.Transaction(event.transaction.hash.toHexString());
    }
    if (auction == null) {
        auction = new schema_1.Auction(event.params.hash.toHexString());
    }
    auction.listingTime = event.params.listingTime;
    auction.basePrice = event.params.basePrice;
    auction.expirationTime = event.params.expirationTime;
    auction.paymentToken = event.params.paymentToken;
    auction.staticExtraData = event.params.staticExtradata;
    auction.extra = event.params.extra;
    auction.hash = event.params.hash;
    auction.orderbook = event.params.orderbookInclusionDesired;
    auction.transaction = transaction.id;
    transaction.hash = event.transaction.hash;
    transaction.block = event.block.number;
    transaction.date = event.block.timestamp;
    auction.save();
    transaction.save();
}
exports.handleOrderApprovedPartTwo = handleOrderApprovedPartTwo;
function handleOrderCancelled(event) {
}
exports.handleOrderCancelled = handleOrderCancelled;
function handleOrdersMatched(event) {
    var saleEvent = schema_1.SaleEvent.load(event.transaction.hash.toHexString());
    var nft = schema_1.NFT.load(event.params.metadata.toHexString());
    var transaction = schema_1.Transaction.load(event.transaction.hash.toHexString());
    var account = schema_1.Account.load(event.params.taker.toHexString());
    if (transaction == null) {
        transaction = new schema_1.Transaction(event.transaction.hash.toHexString());
    }
    if (nft == null) {
        nft = new schema_1.NFT(event.params.metadata.toHexString());
    }
    if (saleEvent == null) {
        saleEvent = new schema_1.SaleEvent(event.transaction.hash.toHexString());
    }
    if (account == null) {
        account = new schema_1.Account(event.params.taker.toHexString());
    }
    saleEvent.sellHash = event.params.sellHash;
    saleEvent.buyHash = event.params.buyHash;
    saleEvent.maker = event.params.maker;
    saleEvent.taker = event.params.taker;
    saleEvent.account = account.id;
    saleEvent.price = event.params.price;
    saleEvent.nft = nft.id;
    saleEvent.transaction = transaction.id;
    transaction.hash = event.transaction.hash;
    transaction.block = event.block.number;
    transaction.date = event.block.timestamp;
    transaction.nft = nft.id;
    transaction.saleEvent = saleEvent.id;
    saleEvent.save();
    transaction.save();
    account.save();
    nft.save();
}
exports.handleOrdersMatched = handleOrdersMatched;
function handleOwnershipRenounced(event) {
}
exports.handleOwnershipRenounced = handleOwnershipRenounced;
function handleOwnershipTransferred(event) {
    var transferevent = schema_1.TransferEvent.load(event.params.previousOwner.toHexString());
    var account = schema_1.Account.load(event.params.newOwner.toHexString());
    var transaction = schema_1.Transaction.load(event.transaction.hash.toHexString());
    if (transferevent == null) {
        transferevent = new schema_1.TransferEvent(event.params.previousOwner.toHexString());
    }
    if (account == null) {
        account = new schema_1.Account(event.params.newOwner.toHexString());
    }
    if (transaction == null) {
        transaction = new schema_1.Transaction(event.transaction.hash.toHexString());
    }
    transferevent.sender = event.params.previousOwner;
    transferevent.receiver = event.params.newOwner;
    transferevent.account = account.id;
    transferevent.transaction = transaction.id;
    transferevent.save();
    transaction.save();
    account.save();
}
exports.handleOwnershipTransferred = handleOwnershipTransferred;
