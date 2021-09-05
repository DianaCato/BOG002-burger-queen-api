exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.DB_URL || 'mysql://bq:secret@localhost:33060/bq';
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-burger-queen';
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'changeme';
