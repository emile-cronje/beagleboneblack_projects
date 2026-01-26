import { Pool } from "pg"

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pg_crud_test_server',
    password: '1793',
    port: 5432
  });
  
  export default pool;