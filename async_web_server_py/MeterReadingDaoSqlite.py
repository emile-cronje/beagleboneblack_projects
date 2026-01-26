from MeterReading import MeterReading
from EntityDaoSqlite import EntityDaoSqlite
import json
from datetime import datetime

class MeterReadingDaoSqlite(EntityDaoSqlite):
    def __init__(self, dbConn):
        super().__init__(dbConn)
        self.tableName = "meter_reading"
       
    async def InitDb(self):
        asyncDbConn = self.dbConn

        await asyncDbConn.execute(f"DROP TABLE IF EXISTS {self.tableName}")
        await asyncDbConn.execute(f'''CREATE TABLE IF NOT EXISTS {self.tableName}
                (ID            INTEGER PRIMARY KEY,
                VERSION        INTEGER NOT NULL,
                CLIENT_ID      TEXT,                                                                                                                        
                METER_ID       INTEGER  NOT NULL,
                READING        REAL,
                READING_ON     REAL);''')
        await asyncDbConn.execute(f"DELETE FROM {self.tableName}")

        await asyncDbConn.commit()

    def fix_isoformat_string(self, iso_string):
        # Replace 'Z' with '+00:00' for UTC
        if iso_string.endswith('Z'):
            iso_string = iso_string.replace('Z', '+00:00')
        
        # Find the fractional seconds part and limit to 6 digits
        if '.' in iso_string:
            # Split the datetime string on the decimal point
            date_part, frac_part = iso_string.split('.')
            # Split the fractional part by the timezone offset
            frac_seconds, tz_part = frac_part.split('+') if '+' in frac_part else frac_part.split('-')
            # Truncate the fractional seconds to 6 digits
            frac_seconds = frac_seconds[:6]
            # Reassemble the ISO string with truncated precision and correct timezone
            iso_string = f"{date_part}.{frac_seconds}+{tz_part}"
    
        return iso_string

    async def AddMeterReading(self, meterReading):
        self.entityCount += 1
        lastId = 0        
        asyncDbConn = self.dbConn

        lastId = 0        
        #print("bfx: "+ meterReading.readingOn)        
        readingOnString = self.fix_isoformat_string(meterReading.readingOn)        
        readingOnString = readingOnString.replace('T', ' ')                
        #print("afx: "+ readingOnString)        
        readingOn = datetime.fromisoformat(readingOnString)        
        #print("aft: "+ str(readingOn))                

#        cursor.execute("INSERT INTO employees (name, salary) VALUES (?, ?)", (name, salary))
        await asyncDbConn.execute(f"INSERT INTO {self.tableName} (VERSION, CLIENT_ID, METER_ID, READING, READING_ON) \
            VALUES (?, ?, ?, ?, ?)", (meterReading.version, meterReading.clientId, meterReading.meterId, meterReading.reading, readingOn))

        await asyncDbConn.commit()

        async with asyncDbConn.execute(f"select last_insert_rowid();") as cursor:                
            async for row in cursor:        
                lastId = row[0]

        newMeterReading = await self.GetMeterReadingById(lastId)                                              
        return json.loads(json.dumps(newMeterReading.__dict__))            

    async def UpdateMeterReading(self, id, meterReading):
        asyncDbConn = self.dbConn

        await asyncDbConn.execute(f"UPDATE {self.tableName} \
                                    SET \
                                    VERSION = VERSION + 1, \
                                    READING = '{meterReading.reading}', \
                                    READING_ON = '{meterReading.readingOn}' \
                                    WHERE ID = {id}")

        await asyncDbConn.commit()    
        updatedMeterReading = await self.GetMeterReadingById(id)                     
        return json.loads(json.dumps(updatedMeterReading.__dict__))                        

    async def GetMeterReadingById(self, id):
        asyncDbConn = self.dbConn

        async with asyncDbConn.execute(f"SELECT id, version, client_id, meter_id, reading, reading_on FROM {self.tableName} WHERE Id = '{id}'") as cursor:                
            meterReading = MeterReading()

            async for row in cursor:
                meterReading.id = row[0]            
                meterReading.version = row[1]                        
                meterReading.clientId = row[2]                                                        
                meterReading.meterId = row[3]                                                                        
                meterReading.reading = row[4]
                meterReading.readingOn = row[5]

        return meterReading            

    async def GetMeterReadingCount(self):
        count = await super().GetEntityCount()
        return count

    async def DeleteMeterReading(self, id):
        await super().DeleteEntity(id)

    async def DeleteAllMeterReadings(self):
        await super().DeleteAllEntities()        
