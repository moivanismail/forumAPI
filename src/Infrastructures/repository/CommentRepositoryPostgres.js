const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository{
    constructor(pool, idGenerator){
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(newComment){
        const {content, owner, threadId} = newComment;
        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();
        const is_deleted = false;

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
            values: [id, content, owner, threadId, date, is_deleted],
        };

        const result = await this._pool.query(query);

        return new AddedComment(result.rows[0]);
    }

    async verifyAvailableComment(id){
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1 AND is_deleted = false',
            values: [id],
        };

        const result = await this._pool.query(query);

        if(!result.rowCount){
            throw new NotFoundError('komentar tidak ditemukan');
        }
    }

    async verifyCommentOwner(id, owner){
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2 AND is_deleted = false',
            values: [id, owner],
        };

        const result = await this._pool.query(query);

        if(!result.rowCount){
            throw new AuthorizationError('Anda tidak berhak menghapus komentar ini');
        }
    }

    async deleteCommentById(id){
        const query = {
            text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
            values: [id],
        };

        await this._pool.query(query);
    }

    async getCommentByThreadId(threadId){
        const query = {
            text: 'SELECT comments.*, users.username FROM comments LEFT JOIN users ON comments.owner = users.id WHERE thread_id = $1 ORDER BY date ASC',
            values: [threadId],
        };
        
        const result = await this._pool.query(query);
        
        return result.rows;
    }
}

module.exports = CommentRepositoryPostgres;