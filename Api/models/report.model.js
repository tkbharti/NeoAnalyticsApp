const db = require('../db/database');

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}  
 
class ReportModel { 

    static async getReportList() {
        const sqlQuery = `
            SELECT * FROM report 
            WHERE status='A'
            ORDER BY created_at DESC
        `;
       
        try { 
          const rows  = await runQuery(sqlQuery);   
          return rows;
        } catch (error) {
          console.error("Error fetching all report:", error.message);
          throw new Error("Failed to fetch all report");
        }  
    }  

    static async getReportData(id) {
        const sqlQuery = `
            SELECT * FROM report 
            WHERE status='A' AND id=? 
        `;
       
        try { 
          const rows  = await runQuery(sqlQuery,[id]);   
          return rows;
        } catch (error) {
          console.error("Error fetching  report:", error.message);
          throw new Error("Failed to fetch report");
        }  
    }   
         
    static async saveReport(item) {  
        const { reportname, metadata, created_by, updated_by, status, created_at, updated_at} = item;
        const q = `
                    INSERT INTO report (
                    name, metadata, created_by, updated_by, status, created_at, updated_at
                    )
                    VALUES (?,?,?,?,?,datetime('now'),datetime('now'))                     
                `;

        const params = [reportname, JSON.stringify(metadata), created_by, updated_by, status, created_at, updated_at];

        try {
            const result = await runQuery(q, params);
            return result || null;
        } catch (err) {
            console.error("❌ DB ERROR:", err);
            return null;
        }
    }    
 
    static async updateReportRecord(item) { 
        const { reportname, metadata, updated_by, updated_at, id} = item;
        const q = `
            UPDATE report 
            SET name=?, metadata=?, updated_by=?, updated_at=datetime('now')
            WHERE id=?
        `; 
        return await runQuery(q, [reportname, JSON.stringify(metadata), updated_by, id]);
    }
    
    static async deleteReportRecord(item) { 
        const {status, updated_by,id} = item;
        const q = `
            UPDATE report 
            SET status=?, updated_by=?, updated_at=datetime('now')
            WHERE id=?
        `;  
        return await runQuery(q, [status, updated_by, id]);
    }
    
}

module.exports = ReportModel;
