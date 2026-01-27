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
exports.DeleteAssetTasksForAsset = exports.DeleteAssetTask = exports.DeleteAllAssetTasks = exports.GetAssetTasksCount = exports.UpdateAssetTask = exports.CreateAssetTask = exports.GetAssetTaskById = void 0;
var assetTaskModel_1 = require("../models/assetTaskModel");
var mqtt_1 = require("mqtt");
var AssetTaskController = /** @class */ (function () {
    function AssetTaskController() {
        this.mqttClient = null;
        this.assetTaskModel = new assetTaskModel_1.AssetTaskModel();
        this.SetupProcessExitHandlers();
    }
    AssetTaskController.prototype.Initialise = function (broker) {
        this.InitializeMqttClient(broker);
    };
    AssetTaskController.prototype.InitializeMqttClient = function (mqttBroker) {
        var brokerConnectionString = "mqtt://" + mqttBroker + ":1883";
        this.mqttClient = mqtt_1.default.connect(brokerConnectionString);
        this.mqttClient.on("connect", function () {
            console.log("Asset Task Controller: Connected to MQTT broker: " + mqttBroker);
        });
    };
    AssetTaskController.prototype.GetAssetTaskById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, assetTask, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.assetTaskModel.GetAssetTaskById(id)];
                    case 1:
                        assetTask = _a.sent();
                        if (!assetTask) {
                            return [2 /*return*/, res.status(404).json({ message: "Asset Task not found" })];
                        }
                        res.json(assetTask);
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
    AssetTaskController.prototype.CreateAssetTask = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var assetTaskData, mqttSessionId, createdAssetTask, assetTaskData_1, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        assetTaskData = JSON.parse(req.body.assetTaskData);
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.assetTaskModel.CreateAssetTask(assetTaskData)];
                    case 2:
                        createdAssetTask = _b.sent();
                        if (createdAssetTask != null) {
                            assetTaskData_1 = {
                                mqttSessionId: mqttSessionId,
                                messageId: createdAssetTask.messageId,
                                clientId: createdAssetTask.clientId,
                                entityType: "AssetTask",
                                operation: "Create",
                                entity: JSON.stringify(createdAssetTask),
                                entityId: createdAssetTask.id
                            };
                            (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish("/entities", JSON.stringify(assetTaskData_1));
                        }
                        res.status(201).json(createdAssetTask);
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
    AssetTaskController.prototype.UpdateAssetTask = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var assetTaskData, mqttSessionId, id, existingTask, updatedAssetTask, assetTaskData_2, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        assetTaskData = JSON.parse(req.body.assetTaskData);
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.assetTaskModel.GetAssetTaskById(id)];
                    case 2:
                        existingTask = _b.sent();
                        if (!existingTask) {
                            return [2 /*return*/, res.status(404).json({ message: "Asset Task not found" })];
                        }
                        return [4 /*yield*/, this.assetTaskModel.UpdateAssetTask(id, assetTaskData)];
                    case 3:
                        updatedAssetTask = _b.sent();
                        if (updatedAssetTask != null) {
                            assetTaskData_2 = {
                                mqttSessionId: mqttSessionId,
                                messageId: updatedAssetTask.messageId,
                                clientId: updatedAssetTask.clientId,
                                entityType: "AssetTask",
                                operation: "Update",
                                entity: JSON.stringify(updatedAssetTask),
                                entityId: updatedAssetTask.id
                            };
                            (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish("/entities", JSON.stringify(assetTaskData_2));
                            res.json(updatedAssetTask);
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
    AssetTaskController.prototype.GetAssetTasksCount = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var count, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.assetTaskModel.GetAssetTasksCount()];
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
    AssetTaskController.prototype.DeleteAllAssetTasks = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.assetTaskModel.DeleteAllAssetTasks()];
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
    AssetTaskController.prototype.DeleteAssetTask = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var mqttSessionId, id, savedAssetTask, assetTaskData, error_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.assetTaskModel.GetAssetTaskById(id)];
                    case 2:
                        savedAssetTask = _b.sent();
                        if (!(savedAssetTask == null)) return [3 /*break*/, 3];
                        return [2 /*return*/, res.status(404).json({ message: "Asset Task not found" })];
                    case 3: return [4 /*yield*/, this.assetTaskModel.DeleteAssetTask(id)];
                    case 4:
                        _b.sent();
                        assetTaskData = {
                            mqttSessionId: mqttSessionId,
                            messageId: req.body.messageId,
                            clientId: savedAssetTask.clientId,
                            entityType: 'AssetTask',
                            operation: 'Delete',
                            entity: JSON.stringify(savedAssetTask),
                            entityId: id
                        };
                        (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish('/entities', JSON.stringify(assetTaskData));
                        res.json(savedAssetTask);
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
    AssetTaskController.prototype.DeleteAssetTasksForAsset = function (assetId, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult, taskIds, _i, taskIds_1, row, taskId, savedAssetTask, assetTaskData, error_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.assetTaskModel.GetAssetTaskIdsForAsset(assetId)];
                    case 1:
                        queryResult = _b.sent();
                        taskIds = Array.from(queryResult.rows);
                        _i = 0, taskIds_1 = taskIds;
                        _b.label = 2;
                    case 2:
                        if (!(_i < taskIds_1.length)) return [3 /*break*/, 6];
                        row = taskIds_1[_i];
                        taskId = row.id;
                        return [4 /*yield*/, this.assetTaskModel.GetAssetTaskById(taskId)];
                    case 3:
                        savedAssetTask = _b.sent();
                        if (savedAssetTask == null)
                            return [3 /*break*/, 5];
                        return [4 /*yield*/, this.assetTaskModel.DeleteAssetTask(taskId)];
                    case 4:
                        _b.sent();
                        assetTaskData = {
                            messageId: req.body.messageId,
                            clientId: savedAssetTask.clientId,
                            entityType: 'AssetTask',
                            operation: 'Delete',
                            entity: JSON.stringify(savedAssetTask),
                            entityId: taskId
                        };
                        (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish('/entities', JSON.stringify(assetTaskData));
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
    AssetTaskController.prototype.SetupProcessExitHandlers = function () {
        process.on('exit', this.Cleanup.bind(this));
        process.on('SIGINT', this.Cleanup.bind(this));
        process.on('SIGTERM', this.Cleanup.bind(this));
        process.on('uncaughtException', this.Cleanup.bind(this));
    };
    AssetTaskController.prototype.Cleanup = function () {
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
    return AssetTaskController;
}());
var assetTaskController = new AssetTaskController();
assetTaskController.Initialise("192.168.10.124");
var GetAssetTaskById = function (req, res) { return assetTaskController.GetAssetTaskById(req, res); };
exports.GetAssetTaskById = GetAssetTaskById;
var CreateAssetTask = function (req, res) { return assetTaskController.CreateAssetTask(req, res); };
exports.CreateAssetTask = CreateAssetTask;
var UpdateAssetTask = function (req, res) { return assetTaskController.UpdateAssetTask(req, res); };
exports.UpdateAssetTask = UpdateAssetTask;
var GetAssetTasksCount = function (req, res) { return assetTaskController.GetAssetTasksCount(req, res); };
exports.GetAssetTasksCount = GetAssetTasksCount;
var DeleteAllAssetTasks = function (req, res) { return assetTaskController.DeleteAllAssetTasks(req, res); };
exports.DeleteAllAssetTasks = DeleteAllAssetTasks;
var DeleteAssetTask = function (req, res) { return assetTaskController.DeleteAssetTask(req, res); };
exports.DeleteAssetTask = DeleteAssetTask;
var DeleteAssetTasksForAsset = function (assetId, req, res) { return assetTaskController.DeleteAssetTasksForAsset(assetId, req, res); };
exports.DeleteAssetTasksForAsset = DeleteAssetTasksForAsset;
exports.default = exports.DeleteAssetTasksForAsset;
