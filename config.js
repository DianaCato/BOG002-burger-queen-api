exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.DB_URL || 'mysql://bq:secret@localhost:33060/bq';
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-burger-queen';
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'changeme';

// // Environment variables for development
// exports.dbPort = process.env.DB_PORT || 33060 ;
// exports.dbPassword = process.env.DB_PASSWORD || 'secret';
// exports.dbName = process.env.DB_NAME || 'bq';
// exports.dbUser = process.env.DB_USER || 'bq';

// Environment variables for testing
exports.dbPort = process.env.DB_PORT || 23306 ;
exports.dbPassword = process.env.DB_PASSWORD || 'secret';
exports.dbName = process.env.DB_NAME || 'test';
exports.dbUser = process.env.DB_USER || 'test';
 