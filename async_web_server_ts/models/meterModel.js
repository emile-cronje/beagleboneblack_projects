"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeterModel = void 0;
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const dbMapper_1 = require("../db/dbMapper");
const MeterMapper = new dbMapper_1.DbMapper({
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
class MeterModel {
    async Initialise() {
        await dbConfig_1.default.query('DROP TABLE IF EXISTS meter_reading');
        await dbConfig_1.default.query("DROP TABLE IF EXISTS meter");
        await dbConfig_1.default.query("DROP INDEX IF EXISTS index_meter_code");
        await dbConfig_1.default.query("DROP INDEX IF EXISTS index_meter_id_client_id");
        await dbConfig_1.default.query("CREATE TABLE meter(ID SERIAL PRIMARY KEY, VERSION INTEGER NOT NULL, CLIENT_ID INTEGER NOT NULL, MESSAGE_ID TEXT, GUID TEXT NOT NULL, CODE TEXT NOT NULL, DESCRIPTION TEXT NOT NULL, ADR NUMERIC(19, 4), IS_PAUSED BOOL NOT NULL)");
        await dbConfig_1.default.query("CREATE UNIQUE INDEX index_meter_code ON meter(code)");
        await dbConfig_1.default.query("CREATE UNIQUE INDEX index_meter_message_id ON meter(message_id)");
        await dbConfig_1.default.query("DROP FUNCTION IF EXISTS calculate_average_daily_rate(p_meter_id BIGINT)");
        await dbConfig_1.default.query(`
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
    `);
    }
    ;
    async GetMeters() {
        const result = await dbConfig_1.default.query("SELECT * FROM meter");
        return result.rows;
    }
    async GetMeterById(id) {
        const result = await dbConfig_1.default.query("SELECT * FROM meter WHERE id = $1", [id]);
        let meter = null;
        if (result.rows != null && (result.rows.length > 0))
            meter = MeterMapper.map(result.rows[0]);
        return meter;
    }
    async GetMeterAdr(id) {
        const result = await dbConfig_1.default.query("SELECT COALESCE(calculate_average_daily_rate($1), 0) AS average_daily_rate", [id]);
        return parseFloat(result.rows[0].average_daily_rate);
    }
    async CreateMeter(meter) {
        const insertResult = await dbConfig_1.default.query("INSERT INTO meter (client_id, guid, version, message_id, code, description, is_paused, adr) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [meter['clientId'], meter['guid'], 0, meter['messageId'], meter['code'], meter['description'], false, 0]);
        let newMeter = null;
        if (insertResult.rows != null && (insertResult.rows.length > 0))
            newMeter = MeterMapper.map(insertResult.rows[0]);
        return newMeter;
    }
    async UpdateMeter(id, meter) {
        let version = meter['version'];
        version += 1;
        const updateResult = await dbConfig_1.default.query("UPDATE meter SET code = $1, description = $2, is_paused = $3, message_id = $5, version = $6 WHERE id = $4 RETURNING *", [meter['code'], meter['description'], meter['isPaused'], id, meter['messageId'], version]);
        let updatedMeter = null;
        if (updateResult.rows != null && (updateResult.rows.length > 0))
            updatedMeter = MeterMapper.map(updateResult.rows[0]);
        return updatedMeter;
    }
    async GetMetersCount() {
        const result = await dbConfig_1.default.query("SELECT COUNT(id) FROM meter");
        return parseInt(result.rows[0].count, 10);
    }
    ;
    async DeleteAllMeters() {
        return await dbConfig_1.default.query("DELETE FROM meter");
    }
    ;
    async DeleteMeter(id) {
        return await dbConfig_1.default.query("DELETE FROM meter WHERE id = $1", [id]);
    }
    ;
}
exports.MeterModel = MeterModel;
//# sourceMappingURL=meterModel.js.map