import pool from "../db/dbConfig"
import {DbMapper} from "../db/dbMapper";

export interface Meter {
    id: number;
    version: number;
    clientId: string;
    messageId?: string;
    guid?: string;
    code: string;
    description: string;
    isPaused: boolean;
    adr: number;
}

const MeterMapper = new DbMapper<Meter>({
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

export class MeterModel {
    async Initialise(): Promise<void> {
        await pool.query('DROP TABLE IF EXISTS meter_reading');
        await pool.query("DROP TABLE IF EXISTS meter");
        await pool.query("DROP INDEX IF EXISTS index_meter_code");
        await pool.query("DROP INDEX IF EXISTS index_meter_id_client_id");
        await pool.query(
            "CREATE TABLE meter(ID SERIAL PRIMARY KEY, VERSION INTEGER NOT NULL, CLIENT_ID INTEGER NOT NULL, MESSAGE_ID TEXT, GUID TEXT NOT NULL, CODE TEXT NOT NULL, DESCRIPTION TEXT NOT NULL, ADR NUMERIC(19, 4), IS_PAUSED BOOL NOT NULL)");

        await pool.query("CREATE UNIQUE INDEX index_meter_code ON meter(code)");
        await pool.query("CREATE UNIQUE INDEX index_meter_message_id ON meter(message_id)");                
        await pool.query("DROP FUNCTION IF EXISTS calculate_average_daily_rate(p_meter_id BIGINT)");        
        await pool.query(`
CREATE OR REPLACE FUNCTION calculate_average_daily_rate(p_meter_id INTEGER)
RETURNS NUMERIC AS $$
DECLARE
avg_daily_rate NUMERIC;
BEGIN
-- Calculate the average daily rate
SELECT AVG(COALESCE(daily_rate, 0)) INTO avg_daily_rate  -- Replace NULL with 0 for averaging
FROM (
SELECT
(reading - LAG(reading) OVER (ORDER BY reading_on))::NUMERIC /
NULLIF((reading_on::DATE - LAG(reading_on) OVER (ORDER BY reading_on)::DATE), 0) AS daily_rate
FROM meter_reading
WHERE meter_id = p_meter_id
ORDER BY id -- consider if you need this ORDER BY, it might not be required and impacts performance
) AS daily_rates;

   -- Return the calculated average daily rate
   RETURN avg_daily_rate;
END;
$$ LANGUAGE plpgsql;
    `)        
    };

    async GetMeters(): Promise<Meter[]> {
        const result = await pool.query("SELECT * FROM meter");
        return result.rows;
    }

    async GetMeterById(id: number): Promise<Meter | null> {
        const result =
            await pool.query("SELECT * FROM meter WHERE id = $1",
                [id]);

        let meter: any = null;

        if (result.rows != null && (result.rows.length > 0))
            meter = MeterMapper.map(result.rows[0]);

        return meter;
    }

    async GetMeterAdr(id: number): Promise<number | null> {
        const result =
            await pool.query("SELECT COALESCE(calculate_average_daily_rate($1), 0) AS average_daily_rate",
                [id]);

        return parseFloat(result.rows[0].average_daily_rate);
    }    

    async CreateMeter(meter: any): Promise<Meter> {
        const insertResult = await pool.query(
            "INSERT INTO meter (client_id, guid, version, message_id, code, description, is_paused, adr) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [meter['clientId'], meter['guid'], 0, meter['messageId'], meter['code'], meter['description'], false, 0]
        );

        let newMeter: any = null;

        if (insertResult.rows != null && (insertResult.rows.length > 0))
            newMeter = MeterMapper.map(insertResult.rows[0]);

        return newMeter;                
    }

    async UpdateMeter(id: number, meter: any): Promise<Meter | null> {
        let version: number = meter['version'];
        version += 1;
        
        const updateResult = await pool.query(
            "UPDATE meter SET code = $1, description = $2, is_paused = $3, message_id = $5, version = $6 WHERE id = $4 RETURNING *",
            [meter['code'], meter['description'], meter['isPaused'], id, meter['messageId'], version]
        );

        let updatedMeter: any = null;

        if (updateResult.rows != null && (updateResult.rows.length > 0))
            updatedMeter = MeterMapper.map(updateResult.rows[0]);

        return updatedMeter;
    }

    async GetMetersCount(): Promise<any> {
        const result = await pool.query("SELECT COUNT(id) FROM meter");
        return parseInt(result.rows[0].count, 10);
    };

    async DeleteAllMeters(): Promise<any> {
        return await pool.query(
            "DELETE FROM meter");
    };

    async DeleteMeter(id: number): Promise<any> {
        return await pool.query(
            "DELETE FROM meter WHERE id = $1",
            [id]);
    };
}