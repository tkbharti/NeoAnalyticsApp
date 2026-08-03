const db = require('../db/database');

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}  

function detectType(value) {
    if (value === null || value === undefined) return null;

    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'INTEGER' : 'REAL';
    }

    if (typeof value === 'boolean') {
      return 'BOOLEAN';
    }

    if (typeof value === 'string') {
      return !isNaN(Date.parse(value)) ? 'DATETIME' : 'TEXT';
    }

    return 'TEXT';
} 

function generateCreateTableSql(data, tableName) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const columnTypes = {};

  // Step 1: Collect all keys from all objects
  data.forEach(row => {
    Object.keys(row).forEach(col => {
      if (!columnTypes[col]) {
        columnTypes[col] = new Set();
      }

      const value = row[col];

      if (value === null || value === undefined) return;

      if (typeof value === 'number') {
        columnTypes[col].add(Number.isInteger(value) ? 'INTEGER' : 'REAL');
      } 
      else if (typeof value === 'boolean') {
        columnTypes[col].add('BOOLEAN'); // SQLite stores as INTEGER (0/1)
      } 
      else if (typeof value === 'string') {
        // Detect date
        const isDate = !isNaN(Date.parse(value));
        columnTypes[col].add(isDate ? 'DATETIME' : 'TEXT');
      } 
      else if (typeof value === 'object') {
        columnTypes[col].add('TEXT'); // JSON fallback
      }
    });
  });

  // Step 2: Resolve final datatype per column
  const columnDefinitions = Object.keys(columnTypes).map(col => {
    const types = columnTypes[col];

    let finalType = 'TEXT';

    if (types.has('TEXT')) {
      finalType = 'TEXT';
    } else if (types.has('DATETIME')) {
      finalType = 'DATETIME';
    } else if (types.has('REAL')) {
      finalType = 'REAL';
    } else if (types.has('INTEGER')) {
      finalType = 'INTEGER';
    } else if (types.has('BOOLEAN')) {
      finalType = 'INTEGER'; // SQLite boolean = INTEGER
    }

    return `${col} ${finalType}`;
  });

  return `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions.join(', ')})`;
}

function insertData(data, tableName){
  const columns = Object.keys(data[0]);
  const placeholders = columns.map(() => '?').join(', ');
  const insertSql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

  db.serialize(() => {
    const stmt = db.prepare(insertSql);
    data.forEach(row => {
      const values = Object.values(row);
      stmt.run(values, (err) => {
        if (err) console.error(err.message);
      });
    });
    stmt.finalize();
    console.log(`${data.length} rows inserted.`);
    // Close the database connection when done
    /* db.close((err) => {
        if (err) console.error(err.message);
        console.log('Database connection closed.');
    });*/
  });
}

function deleteTable(tbl){
  return new Promise((resolve, reject) => {
    db.run(`DROP TABLE IF EXISTS ${tbl}`, (err) => {
      if (err) reject(err);
      else resolve("Table deleted");
    });
  });
};

/*
function generateCreateTableSql2(data, tableName) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const columnTypes = {};
 
  function processRow(row, parentKey = '') {
    Object.keys(row).forEach(key => {
      const value = row[key];
      const columnName = parentKey ? `${parentKey}_${key}` : key;

      // 🟡 Case 1: Array → comma-separated TEXT
      if (Array.isArray(value)) {
        if (!columnTypes[columnName]) columnTypes[columnName] = new Set();
        columnTypes[columnName].add('TEXT');
      }

      // 🟡 Case 2: Nested Object → flatten
      else if (typeof value === 'object' && value !== null) {
        processRow(value, columnName);
      }

      // 🟢 Normal values
      else {
        const type = detectType(value);
        if (!type) return;

        if (!columnTypes[columnName]) columnTypes[columnName] = new Set();
        columnTypes[columnName].add(type);
      }
    });
  }
  // Step 1: Process all rows
  data.forEach(row => processRow(row));

  // Step 2: Resolve final types
  const columnDefinitions = Object.keys(columnTypes).map(col => {
    const types = columnTypes[col];

    let finalType = 'TEXT';

    if (types.has('TEXT')) finalType = 'TEXT';
    else if (types.has('DATETIME')) finalType = 'DATETIME';
    else if (types.has('REAL')) finalType = 'REAL';
    else if (types.has('INTEGER')) finalType = 'INTEGER';
    else if (types.has('BOOLEAN')) finalType = 'INTEGER';

    return `${col} ${finalType}`;
  });

  return `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions.join(', ')})`;
}
function insertData2(data, tableName) {
  if (!Array.isArray(data) || data.length === 0) return;

  // 🔹 Step 1: Flatten row (same logic as CREATE TABLE)
  function flattenRow(row, parentKey = '', result = {}) {
    Object.keys(row).forEach(key => {
      const value = row[key];
      const newKey = parentKey ? `${parentKey}_${key}` : key;

      // 🟡 Array → comma-separated string
      if (Array.isArray(value)) {
        result[newKey] = value.join(',');
      }

      // 🟡 Nested Object → flatten
      else if (typeof value === 'object' && value !== null) {
        flattenRow(value, newKey, result);
      }

      // 🟢 Boolean → 1/0
      else if (typeof value === 'boolean') {
        result[newKey] = value ? 1 : 0;
      }

      // 🟢 Normal values
      else {
        result[newKey] = value ?? null;
      }
    });

    return result;
  }

  // 🔹 Step 2: Flatten all rows
  const flatData = data.map(row => flattenRow(row));

  // 🔹 Step 3: Get ALL columns (union of keys)
  const columnSet = new Set();
  flatData.forEach(row => {
    Object.keys(row).forEach(col => columnSet.add(col));
  });

  const columns = Array.from(columnSet);

  // 🔹 Step 4: Prepare SQL
  const placeholders = columns.map(() => '?').join(', ');
  const insertSql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

  // 🔹 Step 5: Insert
  db.serialize(() => {
    const stmt = db.prepare(insertSql);

    flatData.forEach(row => {
      const values = columns.map(col => row[col] ?? null);

      stmt.run(values, (err) => {
        if (err) console.error(err.message);
      });
    });

    stmt.finalize();
    console.log(`${flatData.length} rows inserted.`);
  });
}
*/ 

class DatasetModel { 

    static async getDatasetList() {
        const sqlQuery = `
            SELECT id,name as Dataset,tblname FROM dataset 
            WHERE status='A'
            ORDER BY created_at DESC
        `;
       
        try { 
          const rows  = await runQuery(sqlQuery);   
          return rows;
        } catch (error) {
          console.error("Error fetching dataset:", error.message);
          throw new Error("Failed to fetch dataset");
        }  
    } 

    static async getColumnList(tbl) {
        const sqlQuery = `
            PRAGMA table_info(${tbl}) 
        `;
       
        try { 
          const rows  = await runQuery(sqlQuery);   
          return rows;
        } catch (error) {
          console.error("Error fetching dataset column:", error.message);
          throw new Error("Failed to fetch dataset column");
        }  
    }  

    static async getRecordByColumn(item) {
       let {tbl, columns, size, agg, col, aggofcol, widgettype, allagg } = item;

       const chartExclude=['datatable', 'pivottable'];
     
       let lmt = "";
       if(size){
          lmt = ` Limit ${size}`;
       }

       let clm = columns;
       let cagg ="";
       let groupby ="";
       if(!chartExclude.includes(widgettype)){
          clm  = `${col[0]} as name`;
          cagg = `, ${agg[0]}(${aggofcol[0]}) as value`;
          groupby = `Group By ${col[0]}`;
       }

        let sqlQuery = `
            SELECT ${clm} ${cagg}  FROM ${tbl} ${groupby} ${lmt}
        `;

       if(allagg && allagg.length>0){
          let qstr = "";
          const sqlString = allagg
                .map(item => `${item.agg.toLowerCase()}(${item.aggof}) as '${item.agg.toLowerCase()} of ${item.aggof}'`)
                .join(', ');

          sqlQuery = `SELECT ${aggofcol[0]}, ${sqlString} FROM ${tbl} GROUP BY ${aggofcol[0]}`;
       } 
         
       
        try { 
          const rows  = await runQuery(sqlQuery);   
          return rows;
        } catch (error) {
          console.error("Error fetching dataset:", error.message);
          throw new Error("Failed to fetch dataset");
        } 
    }

    static async getDatasetRecord(tbl) {
      const sqlQuery = `
            SELECT * FROM ${tbl}
        `;
       
      try { 
        const rows  = await runQuery(sqlQuery);   
        return rows;
      } catch (error) {
        console.error("Error fetching dataset:", error.message);
        throw new Error("Failed to fetch dataset");
      }  
    }
         
    static async saveDataset(item) { 
        const tableName = item.tblname; 
        const jsonData  = item.record;
        const createTableSql = generateCreateTableSql(jsonData, tableName);

        if (createTableSql) {
            db.run(createTableSql, async (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(`Table '${tableName}' created successfully.`); 
                    insertData(jsonData, tableName);

                    const {name, tblname, status, created_by, updated_by, created_at, updated_at} = item;
                    const q = `
                                INSERT INTO dataset (
                                name, tblname, status, created_by, updated_by, created_at, updated_at
                                )
                                VALUES (?,?,?,?,?,datetime('now'),datetime('now'))                     
                            `;

                    const params = [name, tblname, status, created_by, updated_by, created_at, updated_at];

                    try {
                        const result = await runQuery(q, params);
                        return result || null;
                    } catch (err) {
                        console.error("❌ DB ERROR:", err);
                        return null;
                    }
                }
            });
        } 
         
    } 
    
    static async updateDatasetRecord(item) { 
        const {status, updated_by ,tblname, id} = item;
        const q = `
            UPDATE dataset 
            SET status=?, updated_by=?, updated_at=datetime('now')
            WHERE id=?
        `; 
        await deleteTable(tblname);
        return await runQuery(q, [status, updated_by, id]);
    }
    

}

module.exports = DatasetModel;
