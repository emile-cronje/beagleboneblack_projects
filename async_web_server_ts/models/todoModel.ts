import pool from "../db/dbConfig"
import {DbMapper} from "../db/dbMapper";

export interface Todo {
    id: number;
    version: number;
    clientId: string;
    messageId?: string;
    name: string;
    description: string;
    isComplete: boolean;
}

const TodoMapper = new DbMapper<Todo>({
    id: "id",
    version: "version",
    client_id: "clientId",
    message_id: "messageId",
    name: "name",
    description: "description",
    is_complete: "isComplete"
});

export class ToDoModel {
    async Initialise(): Promise<void> {
        await pool.query("DROP TABLE IF EXISTS todo_item");
        await pool.query("DROP INDEX IF EXISTS index_todo_item_name");
        await pool.query("DROP INDEX IF EXISTS index_todo_item_id_client_id");
        await pool.query(
            "CREATE TABLE todo_item(ID BIGSERIAL PRIMARY KEY, VERSION INTEGER NOT NULL, CLIENT_ID INTEGER NOT NULL, MESSAGE_ID TEXT, NAME TEXT NOT NULL, DESCRIPTION TEXT NOT NULL, IS_COMPLETE BOOLEAN NOT NULL)");

        await pool.query("CREATE UNIQUE INDEX index_todo_item_name ON todo_item(name)");
        await pool.query("CREATE UNIQUE INDEX index_todo_item_id_client_id ON todo_item(id, client_id)");
    };

    async GetTodos(): Promise<Todo[]> {
        const result = await pool.query("SELECT * FROM todos");
        return result.rows;
    }

    async GetTodoById(id: number): Promise<Todo | null> {
        const result =
            await pool.query("SELECT * FROM todo_item WHERE id = $1",
                [id]);

        let todoItem: any = null;

        if (result.rows != null && (result.rows.length > 0))
            todoItem = TodoMapper.map(result.rows[0]);

        return todoItem;
    }

    async CreateTodo(todoItem: any): Promise<Todo> {
        const insertResult = await pool.query(
            "INSERT INTO todo_item (client_id, version, message_id, name, description, is_complete) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [todoItem['clientId'], 0, todoItem['messageId'], todoItem['name'], todoItem['description'], false]
        );

        let newToDoItem: any = null;

        if (insertResult.rows != null && (insertResult.rows.length > 0))
            newToDoItem = TodoMapper.map(insertResult.rows[0]);

        return newToDoItem;        
    }

    async UpdateTodo(id: number, todoItem: any): Promise<Todo | null> {
        let version: number = todoItem['version'];
        version += 1;
        
        const updateResult = await pool.query(
            "UPDATE todo_item SET name = $1, description = $2, is_complete = $3, message_id = $4, version = $6 WHERE id = $5 RETURNING *",
            [todoItem['name'], todoItem['description'], todoItem['isComplete'], todoItem['messageId'], id, version]
        );

        let updatedTodoItem: any = null;

        if (updateResult.rows != null && (updateResult.rows.length > 0))
            updatedTodoItem = TodoMapper.map(updateResult.rows[0]);

        return updatedTodoItem;
    }

    async GetTodoItemsCount(): Promise<any> {
        const result = await pool.query("SELECT COUNT(id) FROM todo_item");
        return parseInt(result.rows[0].count, 10);
    };

    async DeleteAllTodoItems(): Promise<any> {
        return await pool.query(
            "DELETE FROM todo_item");
    };

    async DeleteTodo(id: number): Promise<any> {
        return await pool.query(
            'DELETE FROM todo_item WHERE id = $1', [id]);
    };
}
