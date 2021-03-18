require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SIGNER_SECRET,
    port: 9090,
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        name: process.env.DB_NAME || 'test_db',
        password: process.env.DB_PASS || '',
        port: process.env.DB_PORT || 5432,
        schema: process.env.DB_SCHEMA || 'mgg',
    }
}