const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const { query } = require("../utils/db.helper");

class ExportService {
  // CSV EXPORT
  static async exportReportsCSV(filters) {
    let sql = `
      SELECT 
        e.firstname,
        e.lastname,
        r.type,
        r.report_date,
        r.content
      FROM reports r
      JOIN employees e ON r.employee_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.type) {
      sql += " AND r.type = ?";
      params.push(filters.type);
    }

    const rows = await query(sql, params);

    const parser = new Parser();
    return parser.parse(rows);
  }

  // PDF EXPORT
  static async exportMetricsPDF() {
    const rows = await query(`
      SELECT 
        e.firstname,
        e.lastname,
        pm.metric_date,
        pm.attendance_hours,
        pm.tasks_completed,
        pm.productivity_score
      FROM performance_metrics pm
      JOIN employees e ON pm.employee_id = e.id
      ORDER BY pm.metric_date DESC
    `);

    const doc = new PDFDocument();
    rows.forEach((r) => {
      doc.text(
        `${r.firstname} ${r.lastname} | ${r.metric_date} | Hours: ${r.attendance_hours} | Tasks: ${r.tasks_completed} | Score: ${r.productivity_score}`,
      );
      doc.moveDown();
    });
    return doc;
  }
}

module.exports = ExportService;
