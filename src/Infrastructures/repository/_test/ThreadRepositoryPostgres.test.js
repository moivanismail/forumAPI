const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // action & Assert
      expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when thread available', async () => {
      // arrange
      await ThreadsTableTestHelper.addThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // action and assert
      expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addThread Function', () => {
    it('should persist add thread', async () => {
      // arrange
      const addThread = new AddThread({
        title: "judul",
        body: 'body',
      });
      const owner = 'user-123';

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // action
      await threadRepositoryPostgres.addThread(addThread, owner);

      // assert
      const results = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(results).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // arrange
      const newThread = new AddThread({
        title: "judul",
        body: 'body',
      });

      const owner = 'user-123'

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // action
      const addedThread = await threadRepositoryPostgres.addThread(newThread, owner);

      // assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: "judul",
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      expect(threadRepositoryPostgres.getThreadById('fakeId')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread information when thread found', async () => {
      // Arrange
      const threadId = 'thread-123';
      const expectedResult = {
        id: 'thread-123',
        title: 'judul',
        body: 'body',
        username: 'dicoding',
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({});

      // Action
      const result = await threadRepositoryPostgres.getThreadById(threadId);

      expect(result.id).toEqual(expectedResult.id);
      expect(result.title).toEqual(expectedResult.title);
      expect(result.body).toEqual(expectedResult.body);
      expect(result.username).toEqual(expectedResult.username);
      expect(result).toHaveProperty('date');
    });
  });
});