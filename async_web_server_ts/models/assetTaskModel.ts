import pool from "../db/dbConfig"
import {DbMapper} from "../db/dbMapper";
import {QueryResult} from "pg";
import {Request} from "express";

export interface AssetTask {
    id: number;
    version: number;
    clientId: string;
    messageId?: string;
    assetId: number;    
    code: string;
    description: string;
    isRfs: boolean;
}

const AssetTaskMapper = new DbMapper<AssetTask>({
    id: "id",
    version: "version",
    client_id: "clientId",
    message_id: "messageId",
    code: "code",
    description: "description",
    is_rfs: "isRfs",
    asset_id: "assetId"    
});

export class AssetTaskModel {
    async Initialise(): Promise<void> {
        await pool.query("DROP TABLE IF EXISTS asset_task");
        await pool.query("DROP INDEX IF EXISTS index_asset_task_code");
        await pool.query("DROP INDEX IF EXISTS index_asset_task_id_client_id");
        await pool.query(
            "CREATE TABLE asset_task(ID SERIAL PRIMARY KEY, ASSET_ID INTEGER NOT NULL, VERSION INTEGER NOT NULL, CLIENT_ID INTEGER NOT NULL, MESSAGE_ID TEXT, CODE TEXT NOT NULL, DESCRIPTION TEXT NOT NULL, IS_RFS BOOLEAN NOT NULL)");

        await pool.query("CREATE UNIQUE INDEX index_asset_task_code ON asset_task(code)");
        await pool.query("CREATE UNIQUE INDEX index_asset_task_id_client_id ON asset_task(id, client_id)");
    };

    async GetAssetTasks(): Promise<AssetTask[]> {
        const result = await pool.query("SELECT * FROM asset_task");
        return result.rows;
    }

    async GetAssetTaskById(id: number): Promise<AssetTask | null> {
        const result =
            await pool.query("SELECT * FROM asset_task WHERE id = $1",
                [id]);

        let assetTask: any = null;

        if (result.rows != null && (result.rows.length > 0))
            assetTask = AssetTaskMapper.map(result.rows[0]);

        return assetTask;
    }

    async CreateAssetTask(assetTask: any): Promise<AssetTask> {
        const insertResult = await pool.query(
            "INSERT INTO asset_task (client_id, version, message_id, asset_id, code, description, is_rfs) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [assetTask['clientId'], 0, assetTask['messageId'], assetTask['assetId'], assetTask['code'], assetTask['description'], assetTask['isRfs']]
        );

        let newAssetTask: any = null;

        if (insertResult.rows != null && (insertResult.rows.length > 0))
            newAssetTask = AssetTaskMapper.map(insertResult.rows[0]);

        return newAssetTask;                        
    }

    async UpdateAssetTask(id: number, assetTask: any): Promise<AssetTask | null> {
        let version: number = assetTask['version'];
        version += 1;
        
        const updateResult = await pool.query(
            "UPDATE asset_task SET code = $1, description = $2, is_rfs = $3, message_id = $5, version = $6 WHERE id = $4 RETURNING *",
            [assetTask['code'], assetTask['description'], assetTask['isRfs'], id, assetTask['messageId'], version]
        );

        let updatedAssetTask: any = null;

        if (updateResult.rows != null && (updateResult.rows.length > 0))
            updatedAssetTask = AssetTaskMapper.map(updateResult.rows[0]);

        return updatedAssetTask;
    }

    async GetAssetTasksCount(): Promise<any> {
        const result = await pool.query("SELECT COUNT(id) FROM asset_task");
        return parseInt(result.rows[0].count, 10);
    };

    async DeleteAllAssetTasks(): Promise<any> {
        return await pool.query(
            "DELETE FROM asset_task");
    };

    async DeleteAssetTask(id: number): Promise<any> {
        return await pool.query(
            "DELETE FROM asset_task WHERE id = $1",
            [id]);
    };

     async GetAssetTaskIdsForAsset(assetId: number): Promise<QueryResult<any>> {
        return await pool.query('SELECT id FROM asset_task WHERE asset_id = $1', [assetId]);
    };    
}