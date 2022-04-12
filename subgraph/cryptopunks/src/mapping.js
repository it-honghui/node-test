"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleProxyRegistered = exports.handleWrappedPunkTransfer = exports.handlePunkNoLongerForSale = exports.handlePunkBought = exports.handlePunkBidWithdrawn = exports.handlePunkBidEntered = exports.handlePunkOffered = exports.handlePunkTransfer = exports.handleAssign = void 0;
var graph_ts_1 = require("@graphprotocol/graph-ts");
var traits_1 = require("./traits");
var schema_1 = require("../generated/schema");
var constant_1 = require("./constant");
var entityHelper_1 = require("./helpers/entityHelper");
var contractHelper_1 = require("../src/helpers/contractHelper");
var wrapAndUnwrap_1 = require("../src/helpers/wrapAndUnwrap");
var askHelpers_1 = require("./helpers/askHelpers");
var bidHelpers_1 = require("../src/helpers/bidHelpers");
function handleAssign(event) {
    graph_ts_1.log.info("handleAssign {}", [event.params.punkIndex.toString()]);
    var trait = traits_1.getTrait(event.params.punkIndex.toI32());
    var account = entityHelper_1.getOrCreateAccount(event.params.to);
    var metadata = entityHelper_1.createMetadata(event.params.punkIndex);
    var contract = contractHelper_1.getOrCreateCryptoPunkContract(event.address);
    // Assign is always the first event that actually creates the punk
    var punk = new schema_1.Punk(event.params.punkIndex.toString());
    punk.wrapped = false;
    punk.tokenId = event.params.punkIndex;
    punk.owner = event.params.to.toHexString();
    var assign = entityHelper_1.getOrCreateAssign(event.params.punkIndex, event.params.to, punk, metadata, event);
    if (trait !== null) {
        var traits = new Array();
        var type = schema_1.Trait.load(trait.type);
        if (!type) {
            type = new schema_1.Trait(trait.type);
            type.type = "TYPE";
            type.numberOfNfts = graph_ts_1.BigInt.fromI32(0);
        }
        type.numberOfNfts = type.numberOfNfts.plus(graph_ts_1.BigInt.fromI32(1));
        type.save();
        traits.push(type.id);
        for (var i = 0; i < trait.accessories.length; i++) {
            var accessoryName = trait.accessories[i];
            var acessoryId = accessoryName.split(" ").join("-");
            var accessory = schema_1.Trait.load(acessoryId);
            if (accessory == null) {
                accessory = new schema_1.Trait(acessoryId);
                accessory.type = "ACCESSORY";
                accessory.numberOfNfts = graph_ts_1.BigInt.fromI32(0);
            }
            accessory.numberOfNfts = accessory.numberOfNfts.plus(graph_ts_1.BigInt.fromI32(1));
            accessory.save();
            traits.push(accessory.id);
        }
        metadata.traits = traits;
    }
    account.numberOfPunksOwned = account.numberOfPunksOwned.plus(graph_ts_1.BigInt.fromI32(1));
    contract.totalSupply = contract.totalSupply.plus(graph_ts_1.BigInt.fromI32(1));
    account.save();
    assign.save();
    contract.save();
    metadata.save();
    punk.save();
}
exports.handleAssign = handleAssign;
function handlePunkTransfer(event) {
    graph_ts_1.log.debug("handlePunkTransfer from: {} to: {}", [
        event.params.from.toHexString(),
        event.params.to.toHexString(),
    ]);
    var fromProxy = schema_1.UserProxy.load(event.params.from.toHexString());
    var toProxy = schema_1.UserProxy.load(event.params.to.toHexString());
    if (toProxy !== null) {
        graph_ts_1.log.debug("PunkTransfer to proxy detected toProxy: {} ", [toProxy.id]);
        return;
    }
    else if (event.params.to.toHexString() != constant_1.WRAPPED_PUNK_ADDRESS &&
        event.params.from.toHexString() != constant_1.WRAPPED_PUNK_ADDRESS) {
        graph_ts_1.log.debug("Regular punk transfer check: {} ", [
            event.params.punkIndex.toString(),
        ]);
        var toAccount = entityHelper_1.getOrCreateAccount(event.params.to);
        var fromAccount = entityHelper_1.getOrCreateAccount(event.params.from);
        var punk = schema_1.Punk.load(event.params.punkIndex.toString());
        var transfer = entityHelper_1.getOrCreateTransfer(event.params.from, event.params.to, event.params.punkIndex, event);
        toAccount.numberOfPunksOwned = toAccount.numberOfPunksOwned.plus(graph_ts_1.BigInt.fromI32(1));
        fromAccount.numberOfPunksOwned = fromAccount.numberOfPunksOwned.minus(graph_ts_1.BigInt.fromI32(1));
        // Capture punk transfers and owners if not transfered to WRAPPED PUNK ADDRESS
        punk.owner = toAccount.id;
        transfer.save();
        toAccount.save();
        fromAccount.save();
        punk.save();
    }
    else if (fromProxy !== null &&
        event.params.from.toHexString() == fromProxy.id &&
        event.params.to.toHexString() == constant_1.WRAPPED_PUNK_ADDRESS) {
        graph_ts_1.log.info("Wrap detected of punk: {} ", [event.params.punkIndex.toString()]);
        var punk = schema_1.Punk.load(event.params.punkIndex.toString());
        punk.wrapped = true;
        punk.save();
    }
    else if (event.params.from.toHexString() == constant_1.WRAPPED_PUNK_ADDRESS) {
        // Burn/Unwrap
        graph_ts_1.log.debug("Unwrapped detected. From: {}, punk: {}", [
            event.params.from.toHexString(),
            event.params.punkIndex.toString(),
        ]);
        var punk = schema_1.Punk.load(event.params.punkIndex.toString());
        punk.wrapped = false;
        punk.save();
    }
}
exports.handlePunkTransfer = handlePunkTransfer;
function handlePunkOffered(event) {
    graph_ts_1.log.debug("handlePunkOffered: PunkIndex {}, toAddress: {}, hash: {}", [
        event.params.punkIndex.toString(),
        event.params.toAddress.toHexString(),
        event.transaction.hash.toHexString(),
    ]);
    var askCreated = askHelpers_1.createAskCreated(event.params.punkIndex, event);
    var punk = schema_1.Punk.load(event.params.punkIndex.toString());
    var currentAsk = punk.currentAsk;
    if (currentAsk !== null) {
        var oldAsk = schema_1.Ask.load(currentAsk);
        if (!oldAsk) {
            oldAsk = new schema_1.Ask(currentAsk);
        }
        oldAsk.open = false;
        oldAsk.removed = askCreated.id;
        oldAsk.save();
    }
    var ask = new schema_1.Ask(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
    askCreated.from = punk.owner;
    askCreated.amount = event.params.minValue;
    ask.from = punk.owner;
    ask.amount = event.params.minValue;
    ask.created = askCreated.id;
    ask.open = true;
    ask.nft = punk.id;
    ask.offerType = "ASK";
    punk.currentAsk = ask.id;
    ask.save();
    askCreated.save();
    punk.save();
}
exports.handlePunkOffered = handlePunkOffered;
/**
 * first step: Create BidEvent //Record the event
 * second step: Create the bid //The product of the event
 *
 */
function handlePunkBidEntered(event) {
    graph_ts_1.log.debug("handlePunkBidCreatedEntered", []);
    var bidCreated = bidHelpers_1.createBidCreated(event.params.punkIndex, event.params.fromAddress.toHexString(), event);
    var punk = schema_1.Punk.load(event.params.punkIndex.toString());
    var account = entityHelper_1.getOrCreateAccount(event.params.fromAddress);
    var bid = bidHelpers_1.getOrCreateBid(event.params.fromAddress.toHexString(), punk, event);
    bid.amount = event.params.value;
    bid.created = bidCreated.id;
    bidCreated.amount = event.params.value;
    bid.save();
    punk.save();
    account.save();
    bidCreated.save();
}
exports.handlePunkBidEntered = handlePunkBidEntered;
/**
 * first step: Create WithdrawnEvent
 * second step: Record Bid as closed
 */
function handlePunkBidWithdrawn(event) {
    graph_ts_1.log.debug("handlePunkBidCreatedWithdrawn", []);
    var bidRemoved = bidHelpers_1.createBidRemoved(event.params.punkIndex, event.params.fromAddress.toHexString(), event);
    var account = entityHelper_1.getOrCreateAccount(event.params.fromAddress);
    var punk = schema_1.Punk.load(event.params.punkIndex.toString());
    var bid = bidHelpers_1.getOrCreateBid(event.params.fromAddress.toHexString(), punk, event);
    bidRemoved.amount = event.params.value;
    bid.open = false;
    punk.save();
    bid.save();
    account.save();
    bidRemoved.save();
}
exports.handlePunkBidWithdrawn = handlePunkBidWithdrawn;
/*
  step one: Create a SaleEvent
  step two: We need to close bid when bid accepted, PunkBought
*/
function handlePunkBought(event) {
    graph_ts_1.log.debug("handlePunkBought", []);
    var punk = schema_1.Punk.load(event.params.punkIndex.toString());
    var contract = contractHelper_1.getOrCreateCryptoPunkContract(event.address);
    var toAccount = entityHelper_1.getOrCreateAccount(event.params.toAddress);
    var fromAccount = entityHelper_1.getOrCreateAccount(event.params.fromAddress);
    var sale = entityHelper_1.getOrCreateSale(event.params.toAddress, event.params.fromAddress, event.params.punkIndex, event);
    var bid = bidHelpers_1.getOrCreateBid(event.params.fromAddress.toHexString(), punk, event);
    sale.amount = event.params.value;
    contract.totalAmountTraded = contract.totalAmountTraded.plus(event.params.value);
    contract.totalSales = contract.totalSales.plus(graph_ts_1.BigInt.fromI32(1));
    // Note: buyPunk() does not emit a PunkTransfer event, so we need to keep track
    toAccount.numberOfPunksOwned = toAccount.numberOfPunksOwned.plus(graph_ts_1.BigInt.fromI32(1));
    fromAccount.numberOfPunksOwned = fromAccount.numberOfPunksOwned.minus(graph_ts_1.BigInt.fromI32(1));
    punk.purchasedBy = toAccount.id;
    punk.owner = toAccount.id;
    bid.open = false;
    punk.save();
    fromAccount.save();
    bid.save();
    toAccount.save();
    contract.save();
    sale.save();
}
exports.handlePunkBought = handlePunkBought;
function handlePunkNoLongerForSale(event) {
    graph_ts_1.log.debug("handlePunkNoLongerForSale", []);
    var askRemoved = askHelpers_1.createAskRemoved(event.params.punkIndex, event);
    var punk = schema_1.Punk.load(event.params.punkIndex.toString());
    punk.save();
    askRemoved.save();
}
exports.handlePunkNoLongerForSale = handlePunkNoLongerForSale;
// This function is called for three events: Mint (Wrap), Burn (Unwrap) and Transfer
function handleWrappedPunkTransfer(event) {
    graph_ts_1.log.info("handleWrappedPunksTransfer tokenId: {} from: {} to: {}", [
        event.params.tokenId.toString(),
        event.params.from.toHexString(),
        event.params.to.toHexString(),
    ]);
    var contract = contractHelper_1.getOrCreateWrappedPunkContract(event.address);
    if (event.params.from.toHexString() == constant_1.ZERO_ADDRESS) {
        // A wrapped punk is minted (wrapped)
        var wrap = wrapAndUnwrap_1.createWrap(graph_ts_1.Address.fromString(constant_1.WRAPPED_PUNK_ADDRESS), event.params.from, event.params.tokenId, event);
        contract.totalSupply = contract.totalSupply.plus(graph_ts_1.BigInt.fromI32(1));
        wrap.to = event.params.to.toHexString();
        wrap.save();
    }
    else if (event.params.to.toHexString() == constant_1.ZERO_ADDRESS) {
        // A wrapped punk is burned (unwrapped)
        var unWrap = wrapAndUnwrap_1.createUnwrap(event.params.from, event.params.to, event.params.tokenId, event);
        contract.totalSupply = contract.totalSupply.minus(graph_ts_1.BigInt.fromI32(1));
        unWrap.save();
    }
    else {
        // Wrapped Punk Transfer
        // We do not want to save a transfer for wrapped punk mints/burns
        var transfer = entityHelper_1.getOrCreateTransfer(event.params.from, event.params.to, event.params.tokenId, event);
        var toAccount = entityHelper_1.getOrCreateAccount(event.params.to);
        var fromAccount = entityHelper_1.getOrCreateAccount(event.params.from);
        var punk = schema_1.Punk.load(event.params.tokenId.toString());
        toAccount.numberOfPunksOwned = toAccount.numberOfPunksOwned.plus(graph_ts_1.BigInt.fromI32(1));
        fromAccount.numberOfPunksOwned = fromAccount.numberOfPunksOwned.minus(graph_ts_1.BigInt.fromI32(1));
        punk.owner = toAccount.id;
        fromAccount.save();
        toAccount.save();
        transfer.save();
        punk.save();
    }
    contract.save();
}
exports.handleWrappedPunkTransfer = handleWrappedPunkTransfer;
function handleProxyRegistered(event) {
    var userProxy = new schema_1.UserProxy(event.params.proxy.toHexString());
    userProxy.user = event.params.user.toHexString();
    userProxy.timestamp = event.block.timestamp;
    userProxy.txHash = event.transaction.hash;
    userProxy.blockNumber = event.block.number;
    userProxy.blockHash = event.block.hash;
    userProxy.save();
}
exports.handleProxyRegistered = handleProxyRegistered;
