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
exports.DeleteMeter = exports.DeleteAllMeters = exports.GetMetersCount = exports.UpdateMeter = exports.CreateMeter = exports.GetMeterAdr = exports.GetMeterById = exports.GetMeters = void 0;
var meterModel_1 = require("../models/meterModel");
var mqtt_1 = require("mqtt");
var meterReadingController_1 = require("./meterReadingController");
var MeterController = /** @class */ (function () {
    function MeterController() {
        this.mqttClient = null;
        this.meterModel = new meterModel_1.MeterModel();
        this.SetupProcessExitHandlers();
    }
    MeterController.prototype.Initialise = function (broker) {
        this.InitializeMqttClient(broker);
    };
    MeterController.prototype.InitializeMqttClient = function (mqttBroker) {
        var brokerConnectionString = "mqtt://" + mqttBroker + ":1883";
        this.mqttClient = mqtt_1.default.connect(brokerConnectionString);
        this.mqttClient.on("connect", function () {
            console.log("Meter Controller: Connected to MQTT broker: " + mqttBroker);
        });
    };
    MeterController.prototype.GetMeters = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var meters, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.meterModel.GetMeters()];
                    case 1:
                        meters = _a.sent();
                        res.json(meters);
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
    MeterController.prototype.GetMeterById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, meter, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.meterModel.GetMeterById(id)];
                    case 1:
                        meter = _a.sent();
                        if (!meter) {
                            return [2 /*return*/, res.status(404).json({ message: "Meter not found" })];
                        }
                        res.json(meter);
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
    MeterController.prototype.GetMeterAdr = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, adr, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.meterModel.GetMeterAdr(id)];
                    case 1:
                        adr = _a.sent();
                        if (adr == null) {
                            return [2 /*return*/, res.status(404).json({ message: "Meter not found" })];
                        }
                        res.json(adr);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error(error_3);
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    MeterController.prototype.CreateMeter = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var meterData, mqttSessionId, createdMeter, meterData_1, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        meterData = JSON.parse(req.body.meterData);
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.meterModel.CreateMeter(meterData)];
                    case 2:
                        createdMeter = _b.sent();
                        if (createdMeter != null) {
                            meterData_1 = {
                                mqttSessionId: mqttSessionId,
                                messageId: createdMeter.messageId,
                                clientId: createdMeter.clientId,
                                entityType: "Meter",
                                operation: "Create",
                                entity: JSON.stringify(createdMeter),
                                entityId: createdMeter.id
                            };
                            (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish("/entities", JSON.stringify(meterData_1));
                        }
                        res.status(201).json(createdMeter);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _b.sent();
                        console.error(error_4);
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MeterController.prototype.UpdateMeter = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var meterData, mqttSessionId, id, existingMeter, updatedMeter, meterData_2, error_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        meterData = JSON.parse(req.body.meterData);
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.meterModel.GetMeterById(id)];
                    case 2:
                        existingMeter = _b.sent();
                        if (!existingMeter) {
                            return [2 /*return*/, res.status(404).json({ message: "Meter not found" })];
                        }
                        return [4 /*yield*/, this.meterModel.UpdateMeter(id, meterData)];
                    case 3:
                        updatedMeter = _b.sent();
                        if (updatedMeter == null) {
                            return [2 /*return*/, res.status(404).json({ message: "Meter not found" })];
                        }
                        else {
                            meterData_2 = {
                                mqttSessionId: mqttSessionId,
                                messageId: updatedMeter.messageId,
                                clientId: updatedMeter.clientId,
                                entityType: "Meter",
                                operation: "Update",
                                entity: JSON.stringify(updatedMeter),
                                entityId: updatedMeter.id
                            };
                            (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish("/entities", JSON.stringify(meterData_2));
                            res.json(updatedMeter);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _b.sent();
                        console.error(error_5);
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MeterController.prototype.GetMetersCount = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var count, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.meterModel.GetMetersCount()];
                    case 1:
                        count = _a.sent();
                        res.json(count);
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
    MeterController.prototype.DeleteAllMeters = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.meterModel.DeleteAllMeters()];
                    case 1:
                        result = _a.sent();
                        res.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MeterController.prototype.DeleteMeter = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var mqttSessionId, id, savedMeter, meterData, error_8;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.meterModel.GetMeterById(id)];
                    case 2:
                        savedMeter = _b.sent();
                        if (!(savedMeter == null)) return [3 /*break*/, 3];
                        return [2 /*return*/, res.status(404).json({ message: "Meter not found" })];
                    case 3: return [4 /*yield*/, (0, meterReadingController_1.default)(id, req, res)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.meterModel.DeleteMeter(id)];
                    case 5:
                        _b.sent();
                        meterData = {
                            mqttSessionId: mqttSessionId,
                            messageId: req.body.messageId,
                            clientId: savedMeter.clientId,
                            entityType: "Meter",
                            operation: "Delete",
                            entity: JSON.stringify(savedMeter),
                            entityId: id
                        };
                        (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish("/entities", JSON.stringify(meterData));
                        res.json(savedMeter);
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_8 = _b.sent();
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    MeterController.prototype.SetupProcessExitHandlers = function () {
        process.on('exit', this.Cleanup.bind(this));
        process.on('SIGINT', this.Cleanup.bind(this));
        process.on('SIGTERM', this.Cleanup.bind(this));
        process.on('uncaughtException', this.Cleanup.bind(this));
    };
    MeterController.prototype.Cleanup = function () {
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
    return MeterController;
}());
var meterController = new MeterController();
meterController.Initialise("192.168.10.124");
var GetMeters = function (req, res) { return meterController.GetMeters(req, res); };
exports.GetMeters = GetMeters;
var GetMeterById = function (req, res) { return meterController.GetMeterById(req, res); };
exports.GetMeterById = GetMeterById;
var GetMeterAdr = function (req, res) { return meterController.GetMeterAdr(req, res); };
exports.GetMeterAdr = GetMeterAdr;
var CreateMeter = function (req, res) { return meterController.CreateMeter(req, res); };
exports.CreateMeter = CreateMeter;
var UpdateMeter = function (req, res) { return meterController.UpdateMeter(req, res); };
exports.UpdateMeter = UpdateMeter;
var GetMetersCount = function (req, res) { return meterController.GetMetersCount(req, res); };
exports.GetMetersCount = GetMetersCount;
var DeleteAllMeters = function (req, res) { return meterController.DeleteAllMeters(req, res); };
exports.DeleteAllMeters = DeleteAllMeters;
var DeleteMeter = function (req, res) { return meterController.DeleteMeter(req, res); };
exports.DeleteMeter = DeleteMeter;
