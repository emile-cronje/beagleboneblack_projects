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
exports.DeleteToDoItem = exports.DeleteAllToDoItems = exports.GetToDoItemsCount = exports.UpdateToDo = exports.CreateToDo = exports.GetToDoById = exports.GetToDos = void 0;
var todoModel_1 = require("../models/todoModel");
var mqtt_1 = require("mqtt");
var ToDoController = /** @class */ (function () {
    function ToDoController() {
        this.mqttClient = null;
        this.todoModel = new todoModel_1.ToDoModel();
        this.SetupProcessExitHandlers();
    }
    ToDoController.prototype.Initialise = function (broker) {
        this.InitializeMqttClient(broker);
    };
    ToDoController.prototype.GetToDos = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var todos, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.todoModel.GetTodos()];
                    case 1:
                        todos = _a.sent();
                        res.json(todos);
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
    ToDoController.prototype.GetToDoById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, todo, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.todoModel.GetTodoById(id)];
                    case 1:
                        todo = _a.sent();
                        if (!todo) {
                            return [2 /*return*/, res.status(404).json({ message: "Todo not found" })];
                        }
                        res.json(todo);
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
    ToDoController.prototype.CreateToDo = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var itemData, mqttSessionId, createdTodo, itemData_1, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        itemData = JSON.parse(req.body.itemData);
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.todoModel.CreateTodo(itemData)];
                    case 2:
                        createdTodo = _b.sent();
                        if (createdTodo != null) {
                            itemData_1 = {
                                mqttSessionId: mqttSessionId,
                                messageId: createdTodo.messageId,
                                clientId: createdTodo.clientId,
                                entityType: "ToDoItem",
                                operation: "Create",
                                entity: JSON.stringify(createdTodo),
                                entityId: createdTodo.id
                            };
                            (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish("/entities", JSON.stringify(itemData_1));
                        }
                        res.status(201).json(createdTodo);
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
    ToDoController.prototype.UpdateToDo = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var itemData, mqttSessionId, id, existingTodo, updatedTodo, itemData_2, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        itemData = JSON.parse(req.body.itemData);
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.todoModel.GetTodoById(id)];
                    case 2:
                        existingTodo = _b.sent();
                        if (!existingTodo) {
                            return [2 /*return*/, res.status(404).json({ message: "Todo not found" })];
                        }
                        return [4 /*yield*/, this.todoModel.UpdateTodo(id, itemData)];
                    case 3:
                        updatedTodo = _b.sent();
                        if (updatedTodo == null) {
                            return [2 /*return*/, res.status(404).json({ message: "Todo not found" })];
                        }
                        else {
                            itemData_2 = {
                                mqttSessionId: mqttSessionId,
                                messageId: updatedTodo.messageId,
                                clientId: updatedTodo.clientId,
                                entityType: "ToDoItem",
                                operation: "Update",
                                entity: JSON.stringify(updatedTodo),
                                entityId: updatedTodo.id
                            };
                            (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish("/entities", JSON.stringify(itemData_2));
                            res.json(updatedTodo);
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
    ToDoController.prototype.GetToDoItemsCount = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var count, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.todoModel.GetTodoItemsCount()];
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
    ToDoController.prototype.DeleteAllToDoItems = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.todoModel.DeleteAllTodoItems()];
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
    ToDoController.prototype.DeleteToDoItem = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var mqttSessionId, id, savedTodo, toDoData, error_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mqttSessionId = req.body.mqttSessionId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, this.todoModel.GetTodoById(id)];
                    case 2:
                        savedTodo = _b.sent();
                        if (!(savedTodo == null)) return [3 /*break*/, 3];
                        return [2 /*return*/, res.status(404).json({ message: "Todo not found" })];
                    case 3: return [4 /*yield*/, this.todoModel.DeleteTodo(id)];
                    case 4:
                        _b.sent();
                        toDoData = {
                            mqttSessionId: mqttSessionId,
                            messageId: req.body.messageId,
                            clientId: savedTodo.clientId,
                            entityType: 'ToDoItem',
                            operation: 'Delete',
                            entity: JSON.stringify(savedTodo),
                            entityId: id
                        };
                        (_a = this.mqttClient) === null || _a === void 0 ? void 0 : _a.publish('/entities', JSON.stringify(toDoData));
                        res.json(savedTodo);
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_7 = _b.sent();
                        res.status(500).json({ message: "Internal server error" });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ToDoController.prototype.InitializeMqttClient = function (mqttBroker) {
        var brokerConnectionString = "mqtt://" + mqttBroker + ":1883";
        this.mqttClient = mqtt_1.default.connect(brokerConnectionString);
        this.mqttClient.on("connect", function () {
            console.log("ToDoItem Controller: Connected to MQTT broker: " + mqttBroker);
        });
    };
    ToDoController.prototype.SetupProcessExitHandlers = function () {
        process.on('exit', this.Cleanup.bind(this));
        process.on('SIGINT', this.Cleanup.bind(this));
        process.on('SIGTERM', this.Cleanup.bind(this));
        process.on('uncaughtException', this.Cleanup.bind(this));
    };
    ToDoController.prototype.Cleanup = function () {
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
    return ToDoController;
}());
var todoController = new ToDoController();
todoController.Initialise("192.168.10.174");
exports.GetToDos = todoController.GetToDos.bind(todoController);
exports.GetToDoById = todoController.GetToDoById.bind(todoController);
exports.CreateToDo = todoController.CreateToDo.bind(todoController);
exports.UpdateToDo = todoController.UpdateToDo.bind(todoController);
exports.GetToDoItemsCount = todoController.GetToDoItemsCount.bind(todoController);
exports.DeleteAllToDoItems = todoController.DeleteAllToDoItems.bind(todoController);
exports.DeleteToDoItem = todoController.DeleteToDoItem.bind(todoController);
