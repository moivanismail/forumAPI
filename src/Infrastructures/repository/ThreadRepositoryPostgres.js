const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread, owner) {
    const { title, body} = addThread;
    this.title = title;
    this.body = body;

    
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();
    
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };
    console.log('postgres repository owner bawah: ' + owner);

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan di database');
    }
  }

  async getThreadById(thread) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.created_at as date, users.username FROM threads 
      INNER JOIN users 
      ON threads.owner = users.id 
      WHERE threads.id = $1`,
      values: [thread],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('thread tidak ditemukan di database');
    }

    return result.rows[0];;
  }
}

module.exports = ThreadRepositoryPostgres;