"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAsset = exports.DeleteAllAssets = exports.GetAssetsCount = exports.UpdateAsset = exports.CreateAsset = exports.GetAssetById = exports.GetAssets = void 0;
var assetModel_1 = require("../models/assetModel");
var mqtt_1 = require("mqtt");
var assetTaskController_1 = require("../controllers/assetTaskController");
var AssetController = /** @class */ (function () {
    function AssetController() {
        this.mqttClient = null;
        this.assetModel = new assetModel_1.AssetModel();
        this.SetupProcessExitHandlers();
    }
    AssetController.prototype.Initialise = function (broker) {
        this.InitializeMqttClient(broker);
    };
    AssetController.prototype.InitializeMqttClient = function (mqttBroker) {
        var brokerConnectionString = "mqtt://" + mqttBroker + ":1883";
        this.mqttClient = mqtt_1.default.connect(brokerConnectionString);
        this.mqttClient.on("connect", function () {
            console.log("Asset Controller: Connected to MQTT broker: " + mqttBroker);
        });
    };
    AssetController.prototype.GetAssets = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var assets, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.assetModel.GetAssets()];
                    case 1:
                        assets = _a.sent();
                        res.json(assets);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AssetController.prototype.GetAssetById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, asset, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.assetModel.GetAssetById(id)];
                    case 1:
                        asset = _a.sent();
                        if (!asset) {
                            return [2 /*return*/, res.status(404).json({ message: "Asset not found" })];
                        }
                        res.json(asset);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error(error_2);
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AssetController.prototype.CreateAsset = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var assetData, mqttSessionId, createdAsset, assetData_1, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        assetData = JSON.parse(req.body.assetData);
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.assetModel.CreateAsset(assetData)];
                    case 2:
                        createdAsset = _b.sent();
                        if (createdAsset != null) {
                            assetData_1 = {
                                mqttSessionId: mqttSessionId,
                                messageId: createdAsset.messageId,
                                clientId: createdAsset.clientId,
                                entityType: "Asset",
                                operation: "Create",
                                entity: JSON.stringify(createdAsset),
                                entityId: createdAsset.id
                            };
                            (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish("/entities", JSON.stringify(assetData_1));
                        }
                        res.status(201).json(createdAsset);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        console.error(error_3);
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AssetController.prototype.UpdateAsset = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var assetData, mqttSessionId, id, existingAsset, updatedAsset, assetData_2, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        assetData = JSON.parse(req.body.assetData);
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.assetModel.GetAssetById(id)];
                    case 2:
                        existingAsset = _b.sent();
                        if (!existingAsset) {
                            return [2 /*return*/, res.status(404).json({ message: "Asset not found" })];
                        }
                        return [4 /*yield*/, this.assetModel.UpdateAsset(id, assetData)];
                    case 3:
                        updatedAsset = _b.sent();
                        if (updatedAsset == null) {
                            return [2 /*return*/, res.status(404).json({ message: "Asset not found" })];
                        }
                        else {
                            assetData_2 = {
                                mqttSessionId: mqttSessionId,
                                messageId: updatedAsset.messageId,
                                clientId: updatedAsset.clientId,
                                entityType: "Asset",
                                operation: "Update",
                                entity: JSON.stringify(updatedAsset),
                                entityId: updatedAsset.id
                            };
                            (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish("/entities", JSON.stringify(assetData_2));
                            res.json(updatedAsset);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _b.sent();
                        console.error(error_4);
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AssetController.prototype.GetAssetsCount = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var count, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.assetModel.GetAssetsCount()];
                    case 1:
                        count = _a.sent();
                        res.json(count);
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AssetController.prototype.DeleteAllAssets = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.assetModel.DeleteAllAssets()];
                    case 1:
                        result = _a.sent();
                        res.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AssetController.prototype.DeleteAsset = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var mqttSessionId, id, savedAsset, assetData, error_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.assetModel.GetAssetById(id)];
                    case 2:
                        savedAsset = _b.sent();
                        if (!(savedAsset == null)) return [3 /*break*/, 3];
                        return [2 /*return*/, res.status(404).json({ message: "Asset not found" })];
                    case 3: return [4 /*yield*/, (0, assetTaskController_1.default)(id, req, res)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.assetModel.DeleteAsset(id)];
                    case 5:
                        _b.sent();
                        assetData = {
                            mqttSessionId: mqttSessionId,
                            messageId: req.body.messageId,
                            clientId: savedAsset.clientId,
                            entityType: 'Asset',
                            operation: 'Delete',
                            entity: JSON.stringify(savedAsset),
                            entityId: id
                        };
                        (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish('/entities', JSON.stringify(assetData));
                        res.json(savedAsset);
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_7 = _b.sent();
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    AssetController.prototype.SetupProcessExitHandlers = function () {
        process.on('exit', this.Cleanup.bind(this));
        process.on('SIGINT', this.Cleanup.bind(this));
        process.on('SIGTERM', this.Cleanup.bind(this));
        process.on('uncaughtException', this.Cleanup.bind(this));
    };
    AssetController.prototype.Cleanup = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Cleaning up resources...");
                if (this.mqttClient) {
                    this.mqttClient.end();
                    console.log("Disconnected MQTT client");
                }
                process.exit();
                return [2 /*return*/];
            });
        });
    };
    return AssetController;
}());
var assetController = new AssetController();
assetController.Initialise("192.168.10.124");
var GetAssets = function (req, res) { return assetController.GetAssets(req, res); };
exports.GetAssets = GetAssets;
var GetAssetById = function (req, res) { return assetController.GetAssetById(req, res); };
exports.GetAssetById = GetAssetById;
var CreateAsset = function (req, res) { return assetController.CreateAsset(req, res); };
exports.CreateAsset = CreateAsset;
var UpdateAsset = function (req, res) { return assetController.UpdateAsset(req, res); };
exports.UpdateAsset = UpdateAsset;
var GetAssetsCount = function (req, res) { return assetController.GetAssetsCount(req, res); };
exports.GetAssetsCount = GetAssetsCount;
var DeleteAllAssets = function (req, res) { return assetController.DeleteAllAssets(req, res); };
exports.DeleteAllAssets = DeleteAllAssets;
var DeleteAsset = function (req, res) { return assetController.DeleteAsset(req, res); };
exports.DeleteAsset = DeleteAsset;
