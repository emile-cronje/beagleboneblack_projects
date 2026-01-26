import pool from "../db/dbConfig"
import {DbMapper} from "../db/dbMapper";

export interface Asset {
    id: number;
    version: number;
    clientId: string;
    messageId?: string;
    guid: string;
    code: string;
    description: string;
    isMsi: boolean;
}

const AssetMapper = new DbMapper<Asset>({
    id: "id",
    version: "version",
    client_id: "clientId",
    message_id: "messageId",
    guid: "guid",    
    code: "code",
    description: "description",
    is_msi: "isMsi"
});

export class AssetModel {
    async Initialise(): Promise<void> {
        await pool.query('DROP TABLE IF EXISTS asset_task')        
        await pool.query("DROP TABLE IF EXISTS asset");
        await pool.query("DROP INDEX IF EXISTS index_asset_code");
        await pool.query("DROP INDEX IF EXISTS index_asset_id_client_id");
        await pool.query(
            "CREATE TABLE asset(ID SERIAL PRIMARY KEY, VERSION INTEGER NOT NULL, CLIENT_ID INTEGER NOT NULL, MESSAGE_ID TEXT, GUID TEXT NOT NULL, CODE TEXT NOT NULL, DESCRIPTION TEXT NOT NULL, IS_MSI BOOLEAN NOT NULL)");

        await pool.query("CREATE UNIQUE INDEX index_asset_code ON asset(code)");
        await pool.query("CREATE UNIQUE INDEX index_asset_id_client_id ON asset(id, client_id)");
    };

    async GetAssets(): Promise<Asset[]> {
        const result = await pool.query("SELECT * FROM asset");
        return result.rows;
    }

    async GetAssetById(id: number): Promise<Asset | null> {
        const result =
            await pool.query("SELECT * FROM asset WHERE id = $1",
                [id]);

        let asset: any = null;

        if (result.rows != null && (result.rows.length > 0))
            asset = AssetMapper.map(result.rows[0]);

        return asset;
    }

    async CreateAsset(asset: any): Promise<Asset> {
        const insertResult = await pool.query(
            "INSERT INTO asset (client_id, guid, version, message_id, code, description, is_msi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [asset['clientId'], asset['guid'], 0, asset['messageId'], asset['code'], asset['description'], asset['isMsi']]
        );

        let newAsset: any = null;

        if (insertResult.rows != null && (insertResult.rows.length > 0))
            newAsset = AssetMapper.map(insertResult.rows[0]);

        return newAsset;                
    }

    async UpdateAsset(id: number, asset: any): Promise<Asset | null> {
        let version: number = asset['version'];
        version += 1;
        
        const updateResult = await pool.query(
            "UPDATE asset SET code = $1, description = $2, is_msi = $3, message_id = $4, version = $5 WHERE id = $6 RETURNING *",
            [asset['code'], asset['description'], asset['isMsi'], asset['messageId'], version, id]
        );

        let updatedAsset: any = null;

        if (updateResult.rows != null && (updateResult.rows.length > 0))
            updatedAsset = AssetMapper.map(updateResult.rows[0]);

        return updatedAsset;
    }

    async GetAssetsCount(): Promise<any> {
        const result = await pool.query("SELECT COUNT(id) FROM asset");
        return parseInt(result.rows[0].count, 10);
    };

    async DeleteAllAssets(): Promise<any> {
        return await pool.query(
            "DELETE FROM asset");
    };

    async DeleteAsset(id: number): Promise<any> {
        return await pool.query(
            "DELETE FROM asset WHERE id = $1",
            [id]);
    };
}