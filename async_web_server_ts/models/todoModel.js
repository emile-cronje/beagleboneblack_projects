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
exports.ToDoModel = void 0;
var dbConfig_1 = require("../db/dbConfig");
var dbMapper_1 = require("../db/dbMapper");
var TodoMapper = new dbMapper_1.DbMapper({
    id: "id",
    version: "version",
    client_id: "clientId",
    message_id: "messageId",
    name: "name",
    description: "description",
    is_complete: "isComplete"
});
var ToDoModel = /** @class */ (function () {
    function ToDoModel() {
    }
    ToDoModel.prototype.Initialise = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("DROP TABLE IF EXISTS todo_item")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("DROP INDEX IF EXISTS index_todo_item_name")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("DROP INDEX IF EXISTS index_todo_item_id_client_id")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("CREATE TABLE todo_item(ID BIGSERIAL PRIMARY KEY, VERSION INTEGER NOT NULL, CLIENT_ID INTEGER NOT NULL, MESSAGE_ID TEXT, NAME TEXT NOT NULL, DESCRIPTION TEXT NOT NULL, IS_COMPLETE BOOLEAN NOT NULL)")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("CREATE UNIQUE INDEX index_todo_item_name ON todo_item(name)")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("CREATE UNIQUE INDEX index_todo_item_id_client_id ON todo_item(id, client_id)")];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    ToDoModel.prototype.GetTodos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("SELECT * FROM todos")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    ToDoModel.prototype.GetTodoById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, todoItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("SELECT * FROM todo_item WHERE id = $1", [id])];
                    case 1:
                        result = _a.sent();
                        todoItem = null;
                        if (result.rows != null && (result.rows.length > 0))
                            todoItem = TodoMapper.map(result.rows[0]);
                        return [2 /*return*/, todoItem];
                }
            });
        });
    };
    ToDoModel.prototype.CreateTodo = function (todoItem) {
        return __awaiter(this, void 0, void 0, function () {
            var insertResult, newToDoItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("INSERT INTO todo_item (client_id, version, message_id, name, description, is_complete) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [todoItem['clientId'], 0, todoItem['messageId'], todoItem['name'], todoItem['description'], false])];
                    case 1:
                        insertResult = _a.sent();
                        newToDoItem = null;
                        if (insertResult.rows != null && (insertResult.rows.length > 0))
                            newToDoItem = TodoMapper.map(insertResult.rows[0]);
                        return [2 /*return*/, newToDoItem];
                }
            });
        });
    };
    ToDoModel.prototype.UpdateTodo = function (id, todoItem) {
        return __awaiter(this, void 0, void 0, function () {
            var version, updateResult, updatedTodoItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        version = todoItem['version'];
                        version += 1;
                        return [4 /*yield*/, dbConfig_1.default.query("UPDATE todo_item SET name = $1, description = $2, is_complete = $3, message_id = $4, version = $6 WHERE id = $5 RETURNING *", [todoItem['name'], todoItem['description'], todoItem['isComplete'], todoItem['messageId'], id, version])];
                    case 1:
                        updateResult = _a.sent();
                        updatedTodoItem = null;
                        if (updateResult.rows != null && (updateResult.rows.length > 0))
                            updatedTodoItem = TodoMapper.map(updateResult.rows[0]);
                        return [2 /*return*/, updatedTodoItem];
                }
            });
        });
    };
    ToDoModel.prototype.GetTodoItemsCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("SELECT COUNT(id) FROM todo_item")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, parseInt(result.rows[0].count, 10)];
                }
            });
        });
    };
    ;
    ToDoModel.prototype.DeleteAllTodoItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("DELETE FROM todo_item")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    ToDoModel.prototype.DeleteTodo = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query('DELETE FROM todo_item WHERE id = $1', [id])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    return ToDoModel;
}());
exports.ToDoModel = ToDoModel;
