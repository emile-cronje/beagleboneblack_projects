"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const db = new better_sqlite3_1.default(path_1.default.join(__dirname, "app.db"));
// Enable foreign keys
db.pragma("foreign_keys = ON");
class DbWrapper {
    query(sql, params) {
        try {
            const stmt = db.prepare(sql);
            if (params && params.length > 0) {
                // Convert boolean values to 0/1 for SQLite
                const convertedParams = params.map(param => {
                    if (typeof param === 'boolean') {
                        return param ? 1 : 0;
                    }
                    return param;
                });
                // Convert pg-style placeholders ($1, $2, etc.) to ?
                let convertedSql = sql;
                let paramIndex = 1;
                while (convertedSql.includes(`$${paramIndex}`)) {
                    convertedSql = convertedSql.replace(`$${paramIndex}`, "?");
                    paramIndex++;
                }
                const convertedStmt = db.prepare(convertedSql);
                // Handle INSERT/UPDATE/DELETE with RETURNING clause
                if (sql.toUpperCase().includes("RETURNING")) {
                    const result = convertedStmt.run(...convertedParams);
                    // SQLite doesn't support RETURNING, so we need to fetch the data
                    const sqlUpper = sql.toUpperCase();
                    const selectSql = sql.substring(0, sql.toUpperCase().indexOf("RETURNING")).trim();
                    const tableName = this.getTableName(selectSql);
                    let fetchedRow = null;
                    // For INSERT queries, use lastInsertRowid
                    if (sqlUpper.includes("INSERT")) {
                        if (result.lastInsertRowid) {
                            const fetchStmt = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`);
                            fetchedRow = fetchStmt.get(result.lastInsertRowid);
                        }
                    }
                    // For UPDATE queries, extract the ID from WHERE clause
                    else if (sqlUpper.includes("UPDATE")) {
                        const whereMatch = selectSql.match(/WHERE\s+id\s*=\s*\?/i);
                        if (whereMatch && convertedParams.length > 0) {
                            // The ID is typically the last parameter in an UPDATE WHERE id = ? query
                            const idParam = convertedParams[convertedParams.length - 1];
                            const fetchStmt = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`);
                            fetchedRow = fetchStmt.get(idParam);
                        }
                    }
                    const rows = fetchedRow ? [fetchedRow] : [];
                    return { rows };
                }
                // Handle SELECT queries
                if (sql.toUpperCase().startsWith("SELECT")) {
                    const rows = convertedStmt.all(...convertedParams);
                    return { rows };
                }
                // Handle INSERT/UPDATE/DELETE
                convertedStmt.run(...convertedParams);
                return { rows: [] };
            }
            else {
                // No parameters
                if (sql.toUpperCase().includes("RETURNING")) {
                    stmt.run();
                    return { rows: [] };
                }
                if (sql.toUpperCase().startsWith("SELECT")) {
                    const rows = stmt.all();
                    return { rows };
                }
                stmt.run();
                return { rows: [] };
            }
        }
        catch (error) {
            console.error("Database error:", error);
            throw error;
        }
    }
    getTableName(sql) {
        const fromMatch = sql.match(/FROM\s+(\w+)/i);
        if (fromMatch)
            return fromMatch[1];
        const updateMatch = sql.match(/UPDATE\s+(\w+)/i);
        if (updateMatch)
            return updateMatch[1];
        const insertMatch = sql.match(/INSERT\s+INTO\s+(\w+)/i);
        if (insertMatch)
            return insertMatch[1];
        return "";
    }
}
const pool = new DbWrapper();
exports.default = pool;
//# sourceMappingURL=dbConfig.js.map