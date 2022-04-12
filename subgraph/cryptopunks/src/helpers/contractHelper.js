"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateWrappedPunkContract = exports.getOrCreateCryptoPunkContract = void 0;
var graph_ts_1 = require("@graphprotocol/graph-ts");
var schema_1 = require("../../generated/schema");
var cryptopunks_1 = require("../../generated/cryptopunks/cryptopunks");
var WrappedPunks_1 = require("../../generated/WrappedPunks/WrappedPunks");
function getOrCreateCryptoPunkContract(address) {
    var id = address.toHexString();
    var contract = schema_1.Contract.load(id);
    var cryptopunk = cryptopunks_1.cryptopunks.bind(address);
    if (!contract) {
        contract = new schema_1.Contract(id);
        contract.totalAmountTraded = graph_ts_1.BigInt.fromI32(0);
        contract.totalSales = graph_ts_1.BigInt.fromI32(0);
        var symbolCall = cryptopunk.try_symbol();
        if (!symbolCall.reverted) {
            contract.symbol = symbolCall.value;
        }
        else {
            graph_ts_1.log.warning("symbolCall Reverted", []);
        }
        var nameCall = cryptopunk.try_name();
        if (!nameCall.reverted) {
            contract.name = nameCall.value;
        }
        else {
            graph_ts_1.log.warning("nameCall Reverted", []);
        }
        var imageHashCall = cryptopunk.try_imageHash();
        if (!imageHashCall.reverted) {
            contract.imageHash = imageHashCall.value;
        }
        else {
            graph_ts_1.log.warning("imageHashCall Reverted", []);
        }
        var totalSupplyCall = cryptopunk.try_totalSupply();
        if (!totalSupplyCall.reverted) {
            contract.totalSupply = totalSupplyCall.value;
        }
        else {
            graph_ts_1.log.warning("totalSupplyCall Reverted", []);
        }
        contract.save();
    }
    return contract;
}
exports.getOrCreateCryptoPunkContract = getOrCreateCryptoPunkContract;
function getOrCreateWrappedPunkContract(address) {
    var id = address.toHexString();
    var contract = schema_1.Contract.load(id);
    var wrappedPunks = WrappedPunks_1.WrappedPunks.bind(address);
    if (!contract) {
        contract = new schema_1.Contract(id);
        contract.totalAmountTraded = graph_ts_1.BigInt.fromI32(0);
        contract.totalSales = graph_ts_1.BigInt.fromI32(0);
        var symbolCall = wrappedPunks.try_symbol();
        if (!symbolCall.reverted) {
            contract.symbol = symbolCall.value;
        }
        else {
            graph_ts_1.log.warning("symbolCall Reverted", []);
        }
        var nameCall = wrappedPunks.try_name();
        if (!nameCall.reverted) {
            contract.name = nameCall.value;
        }
        else {
            graph_ts_1.log.warning("nameCall Reverted", []);
        }
        var totalSupplyCall = wrappedPunks.try_totalSupply();
        if (!totalSupplyCall.reverted) {
            contract.totalSupply = totalSupplyCall.value;
        }
        else {
            graph_ts_1.log.warning("totalSupplyCall Reverted", []);
        }
        contract.save();
    }
    return contract;
}
exports.getOrCreateWrappedPunkContract = getOrCreateWrappedPunkContract;
