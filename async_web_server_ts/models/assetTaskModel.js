"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetTaskModel = void 0;
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const dbMapper_1 = require("../db/dbMapper");
const AssetTaskMapper = new dbMapper_1.DbMapper({
    id: "id",
    version: "version",
    client_id: "clientId",
    message_id: "messageId",
    code: "code",
    description: "description",
    is_rfs: "isRfs",
    asset_id: "assetId"
});
class AssetTaskModel {
    async Initialise() {
        await dbConfig_1.default.query("DROP TABLE IF EXISTS asset_task");
        await dbConfig_1.default.query("DROP INDEX IF EXISTS index_asset_task_code");
        await dbConfig_1.default.query("DROP INDEX IF EXISTS index_asset_task_id_client_id");
        await dbConfig_1.default.query("CREATE TABLE asset_task(ID SERIAL PRIMARY KEY, ASSET_ID INTEGER NOT NULL, VERSION INTEGER NOT NULL, CLIENT_ID INTEGER NOT NULL, MESSAGE_ID TEXT, CODE TEXT NOT NULL, DESCRIPTION TEXT NOT NULL, IS_RFS BOOLEAN NOT NULL)");
        await dbConfig_1.default.query("CREATE UNIQUE INDEX index_asset_task_code ON asset_task(code)");
        await dbConfig_1.default.query("CREATE UNIQUE INDEX index_asset_task_id_client_id ON asset_task(id, client_id)");
    }
    ;
    async GetAssetTasks() {
        const result = await dbConfig_1.default.query("SELECT * FROM asset_task");
        return result.rows;
    }
    async GetAssetTaskById(id) {
        const result = await dbConfig_1.default.query("SELECT * FROM asset_task WHERE id = $1", [id]);
        let assetTask = null;
        if (result.rows != null && (result.rows.length > 0))
            assetTask = AssetTaskMapper.map(result.rows[0]);
        return assetTask;
    }
    async CreateAssetTask(assetTask) {
        const insertResult = await dbConfig_1.default.query("INSERT INTO asset_task (client_id, version, message_id, asset_id, code, description, is_rfs) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [assetTask['clientId'], 0, assetTask['messageId'], assetTask['assetId'], assetTask['code'], assetTask['description'], assetTask['isRfs']]);
        let newAssetTask = null;
        if (insertResult.rows != null && (insertResult.rows.length > 0))
            newAssetTask = AssetTaskMapper.map(insertResult.rows[0]);
        return newAssetTask;
    }
    async UpdateAssetTask(id, assetTask) {
        let version = assetTask['version'];
        version += 1;
        const updateResult = await dbConfig_1.default.query("UPDATE asset_task SET code = $1, description = $2, is_rfs = $3, message_id = $5, version = $6 WHERE id = $4 RETURNING *", [assetTask['code'], assetTask['description'], assetTask['isRfs'], id, assetTask['messageId'], version]);
        let updatedAssetTask = null;
        if (updateResult.rows != null && (updateResult.rows.length > 0))
            updatedAssetTask = AssetTaskMapper.map(updateResult.rows[0]);
        return updatedAssetTask;
    }
    async GetAssetTasksCount() {
        const result = await dbConfig_1.default.query("SELECT COUNT(id) FROM asset_task");
        return parseInt(result.rows[0].count, 10);
    }
    ;
    async DeleteAllAssetTasks() {
        return await dbConfig_1.default.query("DELETE FROM asset_task");
    }
    ;
    async DeleteAssetTask(id) {
        return await dbConfig_1.default.query("DELETE FROM asset_task WHERE id = $1", [id]);
    }
    ;
    async GetAssetTaskIdsForAsset(assetId) {
        return await dbConfig_1.default.query('SELECT id FROM asset_task WHERE asset_id = $1', [assetId]);
    }
    ;
}
exports.AssetTaskModel = AssetTaskModel;
//# sourceMappingURL=assetTaskModel.js.map