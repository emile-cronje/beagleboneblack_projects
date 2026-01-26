from AssetTask import AssetTask
from EntityDaoSqlite import EntityDaoSqlite
import json

class AssetTaskDaoSqlite(EntityDaoSqlite):
    def __init__(self, dbConn):
        super().__init__(dbConn)
        self.tableName = "assettasks"
       
    async def InitDb(self):
        asyncDbConn = self.dbConn

        await asyncDbConn.execute("DROP TABLE IF EXISTS assettasks")
        await asyncDbConn.execute('''CREATE TABLE IF NOT EXISTS assettasks
                (ID            INTEGER PRIMARY KEY,
                ASSET_ID       INTEGER NOT NULL,                                       
                VERSION        INTEGER NOT NULL,
                CLIENT_ID      TEXT,
                CODE           TEXT    NOT NULL,
                DESCRIPTION    TEXT    NOT NULL,         
                IS_RFS         BOOL     NOT NULL);''')
        await asyncDbConn.execute('''CREATE UNIQUE INDEX index_task_code 
                            ON assettasks(code)''')
        await asyncDbConn.execute("DELETE FROM assettasks")

        await asyncDbConn.commit()

    async def AddAssetTask(self, assetTask):
        self.entityCount += 1
        lastId = 0        
        asyncDbConn = self.dbConn

        await asyncDbConn.execute(f"INSERT INTO {self.tableName} (ASSET_ID, VERSION, CLIENT_ID, CODE, DESCRIPTION, IS_RFS) \
            VALUES ('{assetTask.assetId}', '{assetTask.version}', '{assetTask.clientId}', '{assetTask.code}', '{assetTask.description}', {assetTask.isRfs} )")

        await asyncDbConn.commit()

        async with asyncDbConn.execute(f"select last_insert_rowid();") as cursor:                
            async for row in cursor:        
                lastId = row[0]

        newAssetTask = await self.GetAssetTaskById(lastId)                                              
        return json.loads(json.dumps(newAssetTask.__dict__))            

    async def UpdateAssetTask(self, id, assetTask):
        asyncDbConn = self.dbConn

        await asyncDbConn.execute(f"UPDATE {self.tableName} \
                                    SET \
                                    VERSION = VERSION + 1, \
                                    CODE = '{assetTask.code}', \
                                    DESCRIPTION = '{assetTask.description}', \
                                    IS_RFS = {assetTask.isRfs} \
                                    WHERE ID = '{id}'")

        await asyncDbConn.commit()    
        updatedAssetTask = await self.GetAssetTaskById(id)                     
        return json.loads(json.dumps(updatedAssetTask.__dict__))                        

    async def GetAssetTaskById(self, id):
        asyncDbConn = self.dbConn

        async with asyncDbConn.execute(f"SELECT id, asset_id, version, client_id, code, description, is_rfs FROM {self.tableName} WHERE Id = '{id}'") as cursor:                
            assetTask = AssetTask()

            async for row in cursor:
                assetTask.id = row[0]            
                assetTask.assetId = str(row[1])
                assetTask.version = row[2]                        
                assetTask.clientId = row[3]                                        
                assetTask.code = row[4]
                assetTask.description = row[5]
                assetTask.isRfs = bool(row[6])

        return assetTask            

    async def GetAssetTaskByCode(self, clientId, code):
        asyncDbConn = self.GetDbConnection(clientId)                        

        async with asyncDbConn.execute(f"SELECT id, asset_id, version, code, description, is_rfs FROM {self.tableName} WHERE code= '{code}'") as cursor:                
            assetTask = AssetTask()

            async for row in cursor:
                assetTask.id = row[0]            
                assetTask.assetId = row[1]                                        
                assetTask.version = row[2]                        
                assetTask.code = row[3]
                assetTask.description = row[4]
                assetTask.isRfs = bool(row[5])

        return assetTask            

    async def GetAssetTaskCount(self):
        count = await super().GetEntityCount()
        return count

    async def DeleteAssetTask(self, clientId, id):
        await super().DeleteEntity(clientId, id)

    async def DeleteAllAssetTasks(self):
        await super().DeleteAllEntities()        
