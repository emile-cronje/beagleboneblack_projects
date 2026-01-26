from Meter import Meter
from EntityDaoSqlite import EntityDaoSqlite
import json

class MeterDaoSqlite(EntityDaoSqlite):
    def __init__(self, dbConn):
        super().__init__(dbConn)
        self.tableName = "meters"
       
    async def InitDb(self):
        asyncDbConn = self.dbConn

        await asyncDbConn.execute("DROP TABLE IF EXISTS meters")
        await asyncDbConn.execute('''CREATE TABLE IF NOT EXISTS meters
                (ID            INTEGER PRIMARY KEY,
                VERSION        INTEGER NOT NULL,
                CLIENT_ID      TEXT,                                                                                                                        
                CODE           TEXT    NOT NULL,
                DESCRIPTION    TEXT    NOT NULL,         
                ADR            REAL,                                           
                IS_PAUSED      BOOL     NOT NULL);''')
        await asyncDbConn.execute('''CREATE UNIQUE INDEX index_meter_code 
                            ON meters(code)''')
        await asyncDbConn.execute("DELETE FROM meters")
        await asyncDbConn.commit()

    async def AddMeter(self, meter):
        self.entityCount += 1
        lastId = 0        
        asyncDbConn = self.dbConn

        await asyncDbConn.execute(f"INSERT INTO {self.tableName} (VERSION, CODE, CLIENT_ID, DESCRIPTION, IS_PAUSED) \
            VALUES ('{meter.version}', '{meter.code}', '{meter.clientId}', '{meter.description}', {meter.isPaused} )")

        await asyncDbConn.commit()

        async with asyncDbConn.execute(f"select last_insert_rowid();") as cursor:                
            async for row in cursor:        
                lastId = row[0]

        newAsset = await self.GetMeterById(lastId)                                              
        return json.loads(json.dumps(newAsset.__dict__))            

    async def UpdateMeter(self, id, meter):
        asyncDbConn = self.dbConn

        await asyncDbConn.execute(f"UPDATE {self.tableName} \
                                    SET \
                                    VERSION = VERSION + 1, \
                                    CODE = '{meter.code}', \
                                    DESCRIPTION = '{meter.description}', \
                                    IS_PAUSED = {meter.isPaused} \
                                    WHERE ID = {id}")

        await asyncDbConn.commit()    
        updatedMeter = await self.GetMeterById(id)                     
        return json.loads(json.dumps(updatedMeter.__dict__))                        

    async def GetMeterById(self, id):
        asyncDbConn = self.dbConn

        async with asyncDbConn.execute(f"SELECT id, version, client_id, code, description, is_paused, adr FROM {self.tableName} WHERE Id = '{id}'") as cursor:                
            meter = Meter()

            async for row in cursor:
                meter.id = row[0]            
                meter.version = row[1]                        
                meter.clientId = row[2]                                                        
                meter.code = row[3]
                meter.description = row[4]
                meter.isPaused = bool(row[5])

        return meter            

    async def GetAssetByCode(self, code):
        asyncDbConn = self.dbConn

        async with asyncDbConn.execute(f"SELECT id, version, code, description, is_paused FROM {self.tableName} WHERE code= '{code}'") as cursor:                
            meter = Meter()

            async for row in cursor:
                meter.id = row[0]            
                meter.version = row[1]                        
                meter.code = row[2]
                meter.description = row[3]
                meter.isComplete = bool(row[4])

        return meter            

    async def GetMeterCount(self):
        count = await super().GetEntityCount()
        return count

    async def DeleteMeter(self, id):
        await super().DeleteEntity(id)

    async def DeleteAllMeters(self):
        await super().DeleteAllEntities()        

    async def GetMeterAdr(self, meterId):
        adr = 0        
        asyncDbConn = self.dbConn

        async with asyncDbConn.execute(f'''
                    SELECT COALESCE(AVG(daily_rate), 0) AS average_daily_rate
                    FROM (
                        SELECT
                            (reading - LAG(reading) OVER (ORDER BY reading_on)) /
                            (JULIANDAY(reading_on) - JULIANDAY(LAG(reading_on) OVER (ORDER BY reading_on))) AS daily_rate
                        FROM meter_reading
                        WHERE meter_id = {meterId}
                    ) AS daily_rates''') as cursor:                
            async for row in cursor:        
                adr = row[0]

        return float(adr)        