const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
    async addComment({
        id = 'comment-123', 
        content = 'ini comment', 
        owner = 'user-123',
        thread = 'thread-123',
        is_deleted = false,
    }) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
            values: [id, content, owner, thread, is_deleted],
        };

        await pool.query(query);
    },

    async findCommentsById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 AND is_deleted = false',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },


    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },
};

module.exports = CommentTableTestHelper;