from Asset import Asset
from EntityDaoSqlite import EntityDaoSqlite
import json

class AssetDaoSqlite(EntityDaoSqlite):
    def __init__(self, dbConn):
        super().__init__(dbConn)
        self.tableName = "assets"
       
    async def InitDb(self):
        asyncDbConn = self.dbConn

        await asyncDbConn.execute("DROP TABLE IF EXISTS assets")
        await asyncDbConn.execute('''CREATE TABLE IF NOT EXISTS assets
                (ID            INTEGER PRIMARY KEY,
                VERSION        INTEGER NOT NULL,
                CLIENT_ID      TEXT,                                                                                                                        
                CODE           TEXT    NOT NULL,
                DESCRIPTION    TEXT    NOT NULL,         
                IS_MSI         BOOL     NOT NULL);''')
        await asyncDbConn.execute('''CREATE UNIQUE INDEX index_code 
                            ON assets(code)''')
        await asyncDbConn.execute("DELETE FROM assets")

        await asyncDbConn.commit()

    async def AddAsset(self, asset):
        self.entityCount += 1
        lastId = 0        
        asyncDbConn = self.dbConn

        await asyncDbConn.execute(f"INSERT INTO {self.tableName} (VERSION, CODE, CLIENT_ID, DESCRIPTION, IS_MSI) \
            VALUES ('{asset.version}', '{asset.code}', '{asset.clientId}', '{asset.description}', {asset.isMsi} )")

        await asyncDbConn.commit()

        async with asyncDbConn.execute(f"select last_insert_rowid();") as cursor:                
            async for row in cursor:        
                lastId = row[0]

        newAsset = await self.GetAssetById(lastId)                                              
        return json.loads(json.dumps(newAsset.__dict__))            

    async def UpdateAsset(self, id, asset):
        asyncDbConn = self.dbConn

        await asyncDbConn.execute(f"UPDATE {self.tableName} \
                                    SET \
                                    VERSION = VERSION + 1, \
                                    CODE = '{asset.code}', \
                                    DESCRIPTION = '{asset.description}', \
                                    IS_MSI = {asset.isMsi} \
                                    WHERE ID = {id}")

        await asyncDbConn.commit()    
        updatedAsset = await self.GetAssetById(id)                     
        return json.loads(json.dumps(updatedAsset.__dict__))                        

    async def GetAssetById(self, id):
        asyncDbConn = self.dbConn

        async with asyncDbConn.execute(f"SELECT id, version, client_id, code, description, is_msi FROM {self.tableName} WHERE Id = '{id}'") as cursor:                
            asset = Asset()

            async for row in cursor:
                asset.id = row[0]            
                asset.version = row[1]                        
                asset.clientId = row[2]                                                        
                asset.code = row[3]
                asset.description = row[4]
                asset.isMsi = bool(row[5])

        return asset            

    async def GetAssetByCode(self, code):
        asyncDbConn = self.dbConn

        async with asyncDbConn.execute(f"SELECT id, version, code, description, is_msi FROM {self.tableName} WHERE code= '{code}'") as cursor:                
            asset = Asset()

            async for row in cursor:
                asset.id = row[0]            
                asset.version = row[1]                        
                asset.code = row[2]
                asset.description = row[3]
                asset.isComplete = bool(row[4])

        return asset            

    async def GetAssetCount(self):
        count = await super().GetEntityCount()
        return count

    async def DeleteAsset(self, id):
        await super().DeleteEntity(id)

    async def DeleteAllAssets(self):
        await super().DeleteAllEntities()        
