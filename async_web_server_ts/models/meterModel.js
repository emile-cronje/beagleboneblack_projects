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
exports.MeterModel = void 0;
var dbConfig_1 = require("../db/dbConfig");
var dbMapper_1 = require("../db/dbMapper");
var MeterMapper = new dbMapper_1.DbMapper({
    id: "id",
    version: "version",
    client_id: "clientId",
    message_id: "messageId",
    guid: "guid",
    code: "code",
    description: "description",
    is_paused: "isPaused",
    adr: "adr"
});
var MeterModel = /** @class */ (function () {
    function MeterModel() {
    }
    MeterModel.prototype.Initialise = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query('DROP TABLE IF EXISTS meter_reading')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("DROP TABLE IF EXISTS meter")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("DROP INDEX IF EXISTS index_meter_code")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("DROP INDEX IF EXISTS index_meter_id_client_id")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("CREATE TABLE meter(ID SERIAL PRIMARY KEY, VERSION INTEGER NOT NULL, CLIENT_ID INTEGER NOT NULL, MESSAGE_ID TEXT, GUID TEXT NOT NULL, CODE TEXT NOT NULL, DESCRIPTION TEXT NOT NULL, ADR NUMERIC(19, 4), IS_PAUSED BOOL NOT NULL)")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("CREATE UNIQUE INDEX index_meter_code ON meter(code)")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("CREATE UNIQUE INDEX index_meter_message_id ON meter(message_id)")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("DROP FUNCTION IF EXISTS calculate_average_daily_rate(p_meter_id BIGINT)")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, dbConfig_1.default.query("\nCREATE OR REPLACE FUNCTION calculate_average_daily_rate(p_meter_id INTEGER)\nRETURNS NUMERIC AS $$\nDECLARE\navg_daily_rate NUMERIC;\nBEGIN\n-- Calculate the average daily rate\nSELECT AVG(COALESCE(daily_rate, 0)) INTO avg_daily_rate  -- Replace NULL with 0 for averaging\nFROM (\nSELECT\n(reading - LAG(reading) OVER (ORDER BY reading_on))::NUMERIC /\nNULLIF((reading_on::DATE - LAG(reading_on) OVER (ORDER BY reading_on)::DATE), 0) AS daily_rate\nFROM meter_reading\nWHERE meter_id = p_meter_id\nORDER BY id -- consider if you need this ORDER BY, it might not be required and impacts performance\n) AS daily_rates;\n\n   -- Return the calculated average daily rate\n   RETURN avg_daily_rate;\nEND;\n$$ LANGUAGE plpgsql;\n    ")];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    MeterModel.prototype.GetMeters = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("SELECT * FROM meter")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    MeterModel.prototype.GetMeterById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, meter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("SELECT * FROM meter WHERE id = $1", [id])];
                    case 1:
                        result = _a.sent();
                        meter = null;
                        if (result.rows != null && (result.rows.length > 0))
                            meter = MeterMapper.map(result.rows[0]);
                        return [2 /*return*/, meter];
                }
            });
        });
    };
    MeterModel.prototype.GetMeterAdr = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("SELECT COALESCE(calculate_average_daily_rate($1), 0) AS average_daily_rate", [id])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, parseFloat(result.rows[0].average_daily_rate)];
                }
            });
        });
    };
    MeterModel.prototype.CreateMeter = function (meter) {
        return __awaiter(this, void 0, void 0, function () {
            var insertResult, newMeter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("INSERT INTO meter (client_id, guid, version, message_id, code, description, is_paused, adr) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [meter['clientId'], meter['guid'], 0, meter['messageId'], meter['code'], meter['description'], false, 0])];
                    case 1:
                        insertResult = _a.sent();
                        newMeter = null;
                        if (insertResult.rows != null && (insertResult.rows.length > 0))
                            newMeter = MeterMapper.map(insertResult.rows[0]);
                        return [2 /*return*/, newMeter];
                }
            });
        });
    };
    MeterModel.prototype.UpdateMeter = function (id, meter) {
        return __awaiter(this, void 0, void 0, function () {
            var version, updateResult, updatedMeter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        version = meter['version'];
                        version += 1;
                        return [4 /*yield*/, dbConfig_1.default.query("UPDATE meter SET code = $1, description = $2, is_paused = $3, message_id = $5, version = $6 WHERE id = $4 RETURNING *", [meter['code'], meter['description'], meter['isPaused'], id, meter['messageId'], version])];
                    case 1:
                        updateResult = _a.sent();
                        updatedMeter = null;
                        if (updateResult.rows != null && (updateResult.rows.length > 0))
                            updatedMeter = MeterMapper.map(updateResult.rows[0]);
                        return [2 /*return*/, updatedMeter];
                }
            });
        });
    };
    MeterModel.prototype.GetMetersCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("SELECT COUNT(id) FROM meter")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, parseInt(result.rows[0].count, 10)];
                }
            });
        });
    };
    ;
    MeterModel.prototype.DeleteAllMeters = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("DELETE FROM meter")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    MeterModel.prototype.DeleteMeter = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbConfig_1.default.query("DELETE FROM meter WHERE id = $1", [id])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    return MeterModel;
}());
exports.MeterModel = MeterModel;
