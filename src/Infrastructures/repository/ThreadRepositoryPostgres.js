// const NotFoundError = require('../../Commons/exceptions/NotFoundError');
// const AddedThread = require('../../Domains/threads/entities/AddedThread');
// const ThreadRepository = require('../../Domains/threads/ThreadRepository');

// class ThreadRepositoryPostgres extends ThreadRepository {
//     constructor (pool, idGenerator) {
//         super();
//         this._pool = pool;
//         this._idGenerator = idGenerator;
//     }

//     async addThread (newThread) {
//         const{title, body, owner} = newThread; 
//         const id = `thread-${this._idGenerator()}`;
//         const date = new Date().toISOString();

//         const query = {
//             text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
//             values: [id, title, body, owner, date],
//         };

//         const result = await this._pool.query(query);

//         return new AddedThread({...result.rows[0]});
//     }

    
//     async verifyAvailableThread (thread) {
//         const query = {
//             text: 'SELECT id FROM threads WHERE id = $1',
//             values: [thread],
//         };
        
//         const result = await this._pool.query(query);
        
//         if(!result.rowCount){
//             throw new NotFoundError('thread tidak ditemukan');
//         }

//     }
    
//     async getThreadById (thread) {
//         const query = {
//             text: 'SELECT threads.id, threads.title, threads.body, threads.owner, threads.created_at FROM threads INNER JOIN users On threads.owner = users.id WHERE threads.id = $1',
//             values: [thread],
//         };
    
//         const result = await this._pool.query(query);
    
//         if(!result.rows.length){
//             throw new NotFoundError('thread tidak ditemukan');
//         }
    
//         return result.rows[0];
//     }
// }

// module.exports = ThreadRepositoryPostgres; 

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const GetThread = require('../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyAvailableThread(thread) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [thread],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan di database');
    }
  }

  async getThreadById(thread) {
    const query = {
      text: `SELECT t.*, u.username FROM threads t
              LEFT JOIN users u ON u.id = t.owner WHERE t.id = $1`,
      values: [thread],
    };

    const result = await this._pool.query(query);

    return new GetThread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;