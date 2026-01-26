"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pg_crud_test_server',
    password: '1793',
    port: 5432
});
exports.default = pool;
//# sourceMappingURL=dbConfig.js.map