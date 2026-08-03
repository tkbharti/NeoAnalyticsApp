const db = require('../db/database');

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}  
 
class WidgetModel { 

    static async getWidgetList() {
        const sqlQuery = `
            SELECT * FROM widgets 
            WHERE status='A'
            ORDER BY created_at DESC
        `;
       
        try { 
          const rows  = await runQuery(sqlQuery);   
          return rows;
        } catch (error) {
          console.error("Error fetching all widget:", error.message);
          throw new Error("Failed to fetch all widget");
        }  
    }  

       static async getWidgetData(id) {
        const sqlQuery = `
            SELECT * FROM widgets 
            WHERE status='A' AND id=? 
        `;
       
        try { 
          const rows  = await runQuery(sqlQuery,[id]);   
          return rows;
        } catch (error) {
          console.error("Error fetching  widget:", error.message);
          throw new Error("Failed to fetch widget");
        }  
    }   
         
    static async saveWidget(item) {  
        const {widgetname, widgetparams, widgetprop, created_by, updated_by, status, widgettype, widgettypelabel, tblname,created_at, updated_at} = item;
        const q = `
                    INSERT INTO widgets (
                    widgetname, widgetparams, widgetprop, created_by, updated_by, status, widgettype, widgettypelabel,tblname, created_at, updated_at
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))                     
                `;

        const params = [widgetname, JSON.stringify(widgetparams), JSON.stringify(widgetprop), created_by, updated_by, status, widgettype, widgettypelabel, tblname, created_at, updated_at];

        try {
            const result = await runQuery(q, params);
            return result || null;
        } catch (err) {
            console.error("❌ DB ERROR:", err);
            return null;
        }
    }             
    
    static async updateWidgetRecord(item) { 
        const { widgetname, widgetparams, widgetprop, updated_by, tblname, id, updated_at} = item;
        const q = `
            UPDATE widgets 
            SET widgetname=?, widgetparams=?, widgetprop=?, updated_by=?, tblname=?, updated_at=datetime('now')
            WHERE id=?
        `; 
        return await runQuery(q, [widgetname, JSON.stringify(widgetparams), JSON.stringify(widgetprop), updated_by, tblname, id, updated_at]);
    }
    
    static async deleteWidgetRecord(item) { 
        const {status, updated_by,id} = item;
        const q = `
            UPDATE widgets 
            SET status=?, updated_by=?, updated_at=datetime('now')
            WHERE id=?
        `;  
        return await runQuery(q, [status, updated_by, id]);
    }
}

module.exports = WidgetModel;
