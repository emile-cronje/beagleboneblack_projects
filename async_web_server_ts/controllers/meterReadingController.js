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
exports.DeleteMeterReadingsForMeter = exports.DeleteMeterReading = exports.DeleteAllMeterReadings = exports.GetMeterReadingsCount = exports.UpdateMeterReading = exports.CreateMeterReading = exports.GetMeterReadingById = void 0;
var meterReadingModel_1 = require("../models/meterReadingModel");
var mqtt_1 = require("mqtt");
var MeterReadingController = /** @class */ (function () {
    function MeterReadingController() {
        this.mqttClient = null;
        this.meterReadingModel = new meterReadingModel_1.MeterReadingModel();
        this.SetupProcessExitHandlers();
    }
    MeterReadingController.prototype.Initialise = function (broker) {
        this.InitializeMqttClient(broker);
    };
    MeterReadingController.prototype.InitializeMqttClient = function (mqttBroker) {
        var brokerConnectionString = "mqtt://" + mqttBroker + ":1883";
        this.mqttClient = mqtt_1.default.connect(brokerConnectionString);
        this.mqttClient.on("connect", function () {
            console.log("Meter Controller: Connected to MQTT broker: " + mqttBroker);
        });
    };
    MeterReadingController.prototype.GetMeterReadingById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, meterReading, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.meterReadingModel.GetMeterReadingById(id)];
                    case 1:
                        meterReading = _a.sent();
                        if (!meterReading) {
                            return [2 /*return*/, res.status(404).json({ message: "Meter Reading not found" })];
                        }
                        res.json(meterReading);
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
    MeterReadingController.prototype.CreateMeterReading = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var meterReadingData, mqttSessionId, createdMeterReading, meterReadingData_1, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        meterReadingData = JSON.parse(req.body.meterReadingData);
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.meterReadingModel.CreateMeterReading(meterReadingData)];
                    case 2:
                        createdMeterReading = _b.sent();
                        if (createdMeterReading != null) {
                            meterReadingData_1 = {
                                mqttSessionId: mqttSessionId,
                                messageId: createdMeterReading.messageId,
                                clientId: createdMeterReading.clientId,
                                entityType: "MeterReading",
                                operation: "Create",
                                entity: JSON.stringify(createdMeterReading),
                                entityId: createdMeterReading.id
                            };
                            (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish("/entities", JSON.stringify(meterReadingData_1));
                        }
                        res.status(201).json(createdMeterReading);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        console.error(error_2);
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MeterReadingController.prototype.UpdateMeterReading = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var meterReadingData, mqttSessionId, id, existingMeterReading, updatedMeterReading, meterReadingData_2, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        meterReadingData = JSON.parse(req.body.meterReadingData);
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.meterReadingModel.GetMeterReadingById(id)];
                    case 2:
                        existingMeterReading = _b.sent();
                        if (!existingMeterReading) {
                            return [2 /*return*/, res.status(404).json({ message: "Meter Reading not found" })];
                        }
                        return [4 /*yield*/, this.meterReadingModel.UpdateMeterReading(id, meterReadingData)];
                    case 3:
                        updatedMeterReading = _b.sent();
                        if (updatedMeterReading == null) {
                            return [2 /*return*/, res.status(404).json({ message: "Meter Reading not found" })];
                        }
                        else {
                            meterReadingData_2 = {
                                mqttSessionId: mqttSessionId,
                                messageId: updatedMeterReading.messageId,
                                clientId: updatedMeterReading.clientId,
                                entityType: "MeterReading",
                                operation: "Update",
                                entity: JSON.stringify(updatedMeterReading),
                                entityId: updatedMeterReading.id
                            };
                            (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish("/entities", JSON.stringify(meterReadingData_2));
                            res.json(updatedMeterReading);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _b.sent();
                        console.error(error_3);
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MeterReadingController.prototype.GetMeterReadingsCount = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var count, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.meterReadingModel.GetMeterReadingsCount()];
                    case 1:
                        count = _a.sent();
                        res.json(count);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MeterReadingController.prototype.DeleteAllMeterReadings = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.meterReadingModel.DeleteAllMeterReadings()];
                    case 1:
                        result = _a.sent();
                        res.json(result);
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
    MeterReadingController.prototype.DeleteMeterReading = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var mqttSessionId, id, savedMeterReading, meterReadingData, error_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.meterReadingModel.GetMeterReadingById(id)];
                    case 2:
                        savedMeterReading = _b.sent();
                        if (!(savedMeterReading == null)) return [3 /*break*/, 3];
                        return [2 /*return*/, res.status(404).json({ message: "Meter Reading not found" })];
                    case 3: return [4 /*yield*/, this.meterReadingModel.DeleteMeterReading(id)];
                    case 4:
                        _b.sent();
                        meterReadingData = {
                            mqttSessionId: mqttSessionId,
                            messageId: req.body.messageId,
                            clientId: savedMeterReading.clientId,
                            entityType: 'MeterReading',
                            operation: 'Delete',
                            entity: JSON.stringify(savedMeterReading),
                            entityId: id
                        };
                        (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish('/entities', JSON.stringify(meterReadingData));
                        res.json(savedMeterReading);
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_6 = _b.sent();
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MeterReadingController.prototype.DeleteMeterReadingsForMeter = function (meterId, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult, meterReadingIds, _i, meterReadingIds_1, row, readingId, savedMeterReading, meterReadingData, error_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.meterReadingModel.GetMeterReadingIdsForMeter(meterId)];
                    case 1:
                        queryResult = _b.sent();
                        meterReadingIds = Array.from(queryResult.rows);
                        _i = 0, meterReadingIds_1 = meterReadingIds;
                        _b.label = 2;
                    case 2:
                        if (!(_i < meterReadingIds_1.length)) return [3 /*break*/, 6];
                        row = meterReadingIds_1[_i];
                        readingId = row.id;
                        return [4 /*yield*/, this.meterReadingModel.GetMeterReadingById(readingId)];
                    case 3:
                        savedMeterReading = _b.sent();
                        if (savedMeterReading == null)
                            return [3 /*break*/, 5];
                        return [4 /*yield*/, this.meterReadingModel.DeleteMeterReading(readingId)];
                    case 4:
                        _b.sent();
                        meterReadingData = {
                            messageId: req.body.messageId,
                            clientId: savedMeterReading.clientId,
                            entityType: 'MeterReading',
                            operation: 'Delete',
                            entity: JSON.stringify(savedMeterReading),
                            entityId: readingId
                        };
                        (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish('/entities', JSON.stringify(meterReadingData));
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
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
    MeterReadingController.prototype.SetupProcessExitHandlers = function () {
        process.on('exit', this.Cleanup.bind(this));
        process.on('SIGINT', this.Cleanup.bind(this));
        process.on('SIGTERM', this.Cleanup.bind(this));
        process.on('uncaughtException', this.Cleanup.bind(this));
    };
    MeterReadingController.prototype.Cleanup = function () {
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
    return MeterReadingController;
}());
var meterReadingController = new MeterReadingController();
meterReadingController.Initialise("192.168.10.174");
var GetMeterReadingById = function (req, res) { return meterReadingController.GetMeterReadingById(req, res); };
exports.GetMeterReadingById = GetMeterReadingById;
var CreateMeterReading = function (req, res) { return meterReadingController.CreateMeterReading(req, res); };
exports.CreateMeterReading = CreateMeterReading;
var UpdateMeterReading = function (req, res) { return meterReadingController.UpdateMeterReading(req, res); };
exports.UpdateMeterReading = UpdateMeterReading;
var GetMeterReadingsCount = function (req, res) { return meterReadingController.GetMeterReadingsCount(req, res); };
exports.GetMeterReadingsCount = GetMeterReadingsCount;
var DeleteAllMeterReadings = function (req, res) { return meterReadingController.DeleteAllMeterReadings(req, res); };
exports.DeleteAllMeterReadings = DeleteAllMeterReadings;
var DeleteMeterReading = function (req, res) { return meterReadingController.DeleteMeterReading(req, res); };
exports.DeleteMeterReading = DeleteMeterReading;
var DeleteMeterReadingsForMeter = function (meterId, req, res) { return meterReadingController.DeleteMeterReadingsForMeter(meterId, req, res); };
exports.DeleteMeterReadingsForMeter = DeleteMeterReadingsForMeter;
exports.default = exports.DeleteMeterReadingsForMeter;
