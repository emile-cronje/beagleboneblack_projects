from ToDoItem import ToDoItem
from EntityDaoSqlite import EntityDaoSqlite
import json

class ToDoDaoSqlite(EntityDaoSqlite):
    def __init__(self, dbConn):
        super().__init__(dbConn)
        self.tableName = "items"

    async def InitDb(self):
        asyncDbConn = self.dbConn

        await asyncDbConn.execute("DROP TABLE IF EXISTS items")
        await asyncDbConn.execute('''CREATE TABLE IF NOT EXISTS items
                (ID            INTEGER PRIMARY KEY,
                VERSION        INTEGER NOT NULL,
                CLIENT_ID      TEXT,                                                                                      
                NAME           TEXT    NOT NULL,
                DESCRIPTION    TEXT    NOT NULL,         
                IS_COMPLETE    BOOL     NOT NULL);''')
        await asyncDbConn.execute('''CREATE UNIQUE INDEX index_name 
                            ON items(name)''')
        await asyncDbConn.execute("DELETE FROM items")

        await asyncDbConn.commit()

    async def AddItem(self, item):
        self.entityCount += 1
        lastId = 0
        asyncDbConn = self.dbConn

        await asyncDbConn.execute(f"INSERT INTO {self.tableName} (VERSION, CLIENT_ID, NAME, DESCRIPTION, IS_COMPLETE) \
            VALUES ('{item.version}', '{item.clientId}', '{item.name}', '{item.description}', {item.isComplete} )")

        await asyncDbConn.commit()

        async with asyncDbConn.execute(f"select last_insert_rowid();") as cursor:                
            async for row in cursor:        
                lastId = row[0]

        newItem = await self.GetItemById(lastId)
        return json.loads(json.dumps(newItem.__dict__))        

    async def UpdateItem(self, id, item):
        asyncDbConn = self.dbConn

        await asyncDbConn.execute(f"UPDATE {self.tableName} \
                                    SET \
                                    VERSION = VERSION + 1, \
                                    NAME = '{item.name}', \
                                    DESCRIPTION = '{item.description}', \
                                    IS_COMPLETE = {item.isComplete} \
                                    WHERE ID = {id}")

        await asyncDbConn.commit()    
        updatedItem = await self.GetItemById(id)                     
        return json.loads(json.dumps(updatedItem.__dict__))                        

    async def GetItemById(self, id):
        asyncDbConn = self.dbConn

        async with asyncDbConn.execute(f"SELECT id, version, client_id, name, description, is_complete FROM {self.tableName} WHERE Id = '{id}'") as cursor:        
            item = ToDoItem()

            async for row in cursor:
                item.id = row[0]            
                item.version = row[1]                        
                item.clientId = row[2]                                        
                item.name = row[3]
                item.description = row[4]
                item.isComplete = bool(row[5])

        return item            

    async def GetItemByName(self, name):
        asyncDbConn = self.GetDbConnection()                

        async with asyncDbConn.execute(f"SELECT id, version, name, description, is_complete FROM {self.tableName} WHERE name = '{name}'") as cursor:        
            item = ToDoItem()

            async for row in cursor:
                item.id = row[0]            
                item.version = row[1]                        
                item.name = row[2]
                item.description = row[3]
                item.isComplete = bool(row[4])

        return item            

    async def GetItemCount(self):
        count = await super().GetEntityCount()
        return count

    async def DeleteItem(self, id):
        await super().DeleteEntity(id)        

    async def DeleteAllItems(self):
        await super().DeleteAllEntities()