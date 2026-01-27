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
exports.AssetTaskModel = void 0;
var dbConfig_1 = require("../db/dbConfig");
var dbMapper_1 = require("../db/dbMapper");
var AssetTaskMapper = new dbMapper_1.DbMapper({
    id: "id",
    version: "version",
    client_id: "clientId",
    message_id: "messageId",
    code: "code",
    description: "description",
    is_rfs: "isRfs",
    asset_id: "assetId"
});
var AssetTaskModel = /** @class */ (function () {
    function AssetTaskModel() {
    }
    AssetTaskModel.prototype.Initialise = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("DROP TABLE IF EXISTS asset_task")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("DROP INDEX IF EXISTS index_asset_task_code")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("DROP INDEX IF EXISTS index_asset_task_id_client_id")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("CREATE TABLE asset_task(ID SERIAL PRIMARY KEY, ASSET_ID INTEGER NOT NULL, VERSION INTEGER NOT NULL, CLIENT_ID INTEGER NOT NULL, MESSAGE_ID TEXT, CODE TEXT NOT NULL, DESCRIPTION TEXT NOT NULL, IS_RFS BOOLEAN NOT NULL)")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("CREATE UNIQUE INDEX index_asset_task_code ON asset_task(code)")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("CREATE UNIQUE INDEX index_asset_task_id_client_id ON asset_task(id, client_id)")];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    AssetTaskModel.prototype.GetAssetTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("SELECT * FROM asset_task")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    AssetTaskModel.prototype.GetAssetTaskById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, assetTask;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("SELECT * FROM asset_task WHERE id = $1", [id])];
                    case 1:
                        result = _a.sent();
                        assetTask = null;
                        if (result.rows != null && (result.rows.length > 0))
                            assetTask = AssetTaskMapper.map(result.rows[0]);
                        return [2 /*return*/, assetTask];
                }
            });
        });
    };
    AssetTaskModel.prototype.CreateAssetTask = function (assetTask) {
        return __awaiter(this, void 0, void 0, function () {
            var insertResult, newAssetTask;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("INSERT INTO asset_task (client_id, version, message_id, asset_id, code, description, is_rfs) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [assetTask['clientId'], 0, assetTask['messageId'], assetTask['assetId'], assetTask['code'], assetTask['description'], assetTask['isRfs']])];
                    case 1:
                        insertResult = _a.sent();
                        newAssetTask = null;
                        if (insertResult.rows != null && (insertResult.rows.length > 0))
                            newAssetTask = AssetTaskMapper.map(insertResult.rows[0]);
                        return [2 /*return*/, newAssetTask];
                }
            });
        });
    };
    AssetTaskModel.prototype.UpdateAssetTask = function (id, assetTask) {
        return __awaiter(this, void 0, void 0, function () {
            var version, updateResult, updatedAssetTask;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        version = assetTask['version'];
                        version += 1;
                        return [4 /*yield*/, dbConfig_1.default.query("UPDATE asset_task SET code = $1, description = $2, is_rfs = $3, message_id = $5, version = $6 WHERE id = $4 RETURNING *", [assetTask['code'], assetTask['description'], assetTask['isRfs'], id, assetTask['messageId'], version])];
                    case 1:
                        updateResult = _a.sent();
                        updatedAssetTask = null;
                        if (updateResult.rows != null && (updateResult.rows.length > 0))
                            updatedAssetTask = AssetTaskMapper.map(updateResult.rows[0]);
                        return [2 /*return*/, updatedAssetTask];
                }
            });
        });
    };
    AssetTaskModel.prototype.GetAssetTasksCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("SELECT COUNT(id) FROM asset_task")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, parseInt(result.rows[0].count, 10)];
                }
            });
        });
    };
    ;
    AssetTaskModel.prototype.DeleteAllAssetTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("DELETE FROM asset_task")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    AssetTaskModel.prototype.DeleteAssetTask = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("DELETE FROM asset_task WHERE id = $1", [id])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    AssetTaskModel.prototype.GetAssetTaskIdsForAsset = function (assetId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query('SELECT id FROM asset_task WHERE asset_id = $1', [assetId])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    return AssetTaskModel;
}());
exports.AssetTaskModel = AssetTaskModel;
