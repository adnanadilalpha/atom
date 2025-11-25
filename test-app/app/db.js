// Mock database for testing
// In production, replace with actual database connection
const mockData = {
    users: [],
    records: []
};

module.exports = {
    query: async (sql, params) => {
        console.log(`[DB] Query: ${sql}`, params);
        // Mock query results
        return { rows: [] };
    },
    insert: (table, data) => {
        console.log(`[DB] Inserted into ${table}:`, data);
        const id = (mockData[table]?.length || 0) + 1;
        const record = { id, ...data, createdAt: new Date().toISOString() };
        if (!mockData[table]) mockData[table] = [];
        mockData[table].push(record);
        return { success: true, record };
    },
    getMockData: () => mockData
};