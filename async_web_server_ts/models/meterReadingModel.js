"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeterReadingModel = void 0;
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const dbMapper_1 = require("../db/dbMapper");
const MeterReadingMapper = new dbMapper_1.DbMapper({
    id: "id",
    version: "version",
    client_id: "clientId",
    message_id: "messageId",
    meter_id: "meterId",
    reading: "reading",
    reading_on: "readingOn"
});
class MeterReadingModel {
    async Initialise() {
        await dbConfig_1.default.query('DROP TABLE IF EXISTS meter_reading');
        await dbConfig_1.default.query('DROP INDEX IF EXISTS index_meter_reading_id_client_id');
        await dbConfig_1.default.query('CREATE TABLE meter_reading(ID SERIAL PRIMARY KEY, VERSION INTEGER NOT NULL, CLIENT_ID INTEGER NOT NULL, MESSAGE_ID TEXT, METER_ID BIGINT NOT NULL, READING NUMERIC(19, 4), READING_ON TIMESTAMP, CONSTRAINT fk_meter FOREIGN KEY(METER_ID) REFERENCES METER(ID))');
        await dbConfig_1.default.query('CREATE UNIQUE INDEX index_meter_reading_id_client_id ON meter_reading(id, client_id)');
        await dbConfig_1.default.query("CREATE UNIQUE INDEX index_meter_reading_message_id ON meter_reading(message_id)");
    }
    ;
    async GetMeterReadings() {
        const result = await dbConfig_1.default.query("SELECT * FROM meter_reading");
        return result.rows;
    }
    async GetMeterReadingById(id) {
        const result = await dbConfig_1.default.query("SELECT * FROM meter_reading WHERE id = $1", [id]);
        let reading = null;
        if (result.rows != null && (result.rows.length > 0))
            reading = MeterReadingMapper.map(result.rows[0]);
        return reading;
    }
    async CreateMeterReading(meterReading) {
        const insertResult = await dbConfig_1.default.query("INSERT INTO meter_reading (client_id, version, message_id, meter_id, reading, reading_on) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [meterReading['clientId'], 0, meterReading['messageId'], meterReading['meterId'], meterReading['reading'], meterReading['readingOn']]);
        let newMeterReading = null;
        if (insertResult.rows != null && (insertResult.rows.length > 0))
            newMeterReading = MeterReadingMapper.map(insertResult.rows[0]);
        return newMeterReading;
    }
    async UpdateMeterReading(id, meterReading) {
        let version = meterReading['version'];
        version += 1;
        const updateResult = await dbConfig_1.default.query("UPDATE meter_reading SET reading = $1, reading_on = $2, message_id = $4, version = $5 WHERE id = $3 RETURNING *", [meterReading['reading'], meterReading['readingOn'], id, meterReading['messageId'], version]);
        let updatedMeterReading = null;
        if (updateResult.rows != null && (updateResult.rows.length > 0))
            updatedMeterReading = MeterReadingMapper.map(updateResult.rows[0]);
        return updatedMeterReading;
    }
    async GetMeterReadingsCount() {
        const result = await dbConfig_1.default.query("SELECT COUNT(id) FROM meter_reading");
        return parseInt(result.rows[0].count, 10);
    }
    ;
    async DeleteAllMeterReadings() {
        return await dbConfig_1.default.query("DELETE FROM meter_reading");
    }
    ;
    async DeleteMeterReading(id) {
        return await dbConfig_1.default.query("DELETE FROM meter_reading WHERE id = $1", [id]);
    }
    ;
    async GetMeterReadingIdsForMeter(meterId) {
        return await dbConfig_1.default.query('SELECT * FROM meter_reading WHERE meter_id = $1', [meterId]);
    }
    ;
}
exports.MeterReadingModel = MeterReadingModel;
//# sourceMappingURL=meterReadingModel.js.map