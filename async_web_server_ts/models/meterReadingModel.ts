import pool from "../db/dbConfig"
import {DbMapper} from "../db/dbMapper";
import {QueryResult} from "pg";
import {Request} from "express";

export interface MeterReading {
    id: number;
    version: number;
    clientId: string;
    messageId?: string;
    meterId: number;
    reading: number;
    readingOn: Date
}

const MeterReadingMapper = new DbMapper<MeterReading>({
    id: "id",
    version: "version",
    client_id: "clientId",
    message_id: "messageId",
    meter_id: "meterId",
    reading: "reading",
    reading_on: "readingOn"
});

export class MeterReadingModel {
    async Initialise(): Promise<void> {
        await pool.query('DROP TABLE IF EXISTS meter_reading')
        await pool.query('DROP INDEX IF EXISTS index_meter_reading_id_client_id')
        await pool.query('CREATE TABLE meter_reading(ID SERIAL PRIMARY KEY, VERSION INTEGER NOT NULL, CLIENT_ID INTEGER NOT NULL, MESSAGE_ID TEXT, METER_ID BIGINT NOT NULL, READING NUMERIC(19, 4), READING_ON TIMESTAMP, CONSTRAINT fk_meter FOREIGN KEY(METER_ID) REFERENCES METER(ID))')

        await pool.query('CREATE UNIQUE INDEX index_meter_reading_id_client_id ON meter_reading(id, client_id)')
        await pool.query("CREATE UNIQUE INDEX index_meter_reading_message_id ON meter_reading(message_id)");                                
    };

    async GetMeterReadings(): Promise<MeterReading[]> {
        const result = await pool.query("SELECT * FROM meter_reading");
        return result.rows;
    }

    async GetMeterReadingById(id: number): Promise<MeterReading | null> {
        const result =
            await pool.query("SELECT * FROM meter_reading WHERE id = $1",
                [id]);

        let reading: any = null;

        if (result.rows != null && (result.rows.length > 0))
            reading = MeterReadingMapper.map(result.rows[0]);

        return reading;
    }

    async CreateMeterReading(meterReading: any): Promise<MeterReading> {
        const insertResult = await pool.query(
            "INSERT INTO meter_reading (client_id, version, message_id, meter_id, reading, reading_on) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [meterReading['clientId'], 0, meterReading['messageId'], meterReading['meterId'], meterReading['reading'], meterReading['readingOn']]
        );

        let newMeterReading: any = null;

        if (insertResult.rows != null && (insertResult.rows.length > 0))
            newMeterReading = MeterReadingMapper.map(insertResult.rows[0]);

        return newMeterReading;                
    }

    async UpdateMeterReading(id: number, meterReading: any): Promise<MeterReading | null> {
        let version: number = meterReading['version'];
        version += 1;
        
        const updateResult = await pool.query(
            "UPDATE meter_reading SET reading = $1, reading_on = $2, message_id = $4, version = $5 WHERE id = $3 RETURNING *",
            [meterReading['reading'], meterReading['readingOn'], id, meterReading['messageId'], version]
        );

        let updatedMeterReading: any = null;

        if (updateResult.rows != null && (updateResult.rows.length > 0))
            updatedMeterReading = MeterReadingMapper.map(updateResult.rows[0]);

        return updatedMeterReading;
    }

    async GetMeterReadingsCount(): Promise<any> {
        const result = await pool.query("SELECT COUNT(id) FROM meter_reading");
        return parseInt(result.rows[0].count, 10);
    };

    async DeleteAllMeterReadings(): Promise<any> {
        return await pool.query(
            "DELETE FROM meter_reading");
    };

    async DeleteMeterReading(id: number): Promise<any> {
        return await pool.query(
            "DELETE FROM meter_reading WHERE id = $1",
            [id]);
    };

    async GetMeterReadingIdsForMeter(meterId: number): Promise<QueryResult<any>> {
        return await pool.query('SELECT * FROM meter_reading WHERE meter_id = $1', [meterId]);
    };
}