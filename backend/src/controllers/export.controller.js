const ExportService = require("../services/export.service");

class ExportController {
  static async reportsCSV(req, res, next) {
    try {
      const csv = await ExportService.exportReportsCSV(req.query);
      res.header("Content-Type", "text/csv");
      res.attachment("reports.csv");
      res.send(csv);
    } catch (err) {
      next(err);
    }
  }

  static async metricsPDF(req, res, next) {
    try {
      const pdf = await ExportService.exportMetricsPDF();
      res.header("Content-Type", "application/pdf");
      pdf.pipe(res);
      pdf.end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ExportController;
