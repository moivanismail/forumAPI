const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
    });

    afterEach(async () => {
        await CommentTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('verifyAvailableComment function', () => {
        it('should throw NotFoundError when comment not available', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError when comment available', async () => {
            // Arrange
            await CommentTableTestHelper.addComment({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('addComment function', () => {
        it('should persist add comment and return added comment correctly', async () => {
            // Arrange
            const newComment = new AddComment({
                content: 'ini comment',
                owner: 'user-123',
                threadId: 'thread-123',
            });
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await commentRepositoryPostgres.addComment(newComment);

            // Assert
            const comments = await CommentTableTestHelper.findCommentsById('comment-123');
            expect(comments).toHaveLength(1);
        });

        it('should return added comment correctly', async () => {
            const newComment = new AddComment({
                content: 'ini comment',
                owner: 'user-123',
                threadId: 'thread-123',
            });
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedComment = await commentRepositoryPostgres.addComment(newComment);

            // Assert
            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: newComment.content,
                owner: newComment.owner,
            }));
        });
    });

    describe('verifyCommentOwner function', () => {
        it('should throw AuthorizationError when comment owner not match', async () => {
            // Arrange
            await CommentTableTestHelper.addComment({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456')).rejects.toThrowError(AuthorizationError);
        });

        it('should not throw AuthorizationError when comment owner match', async () => {
            // Arrange
            await CommentTableTestHelper.addComment({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
        });
    });

    describe('deleteComment function', () => {
        it('should persist delete comment', async () => {
            // Arrange
            const commentId = 'comment-123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await CommentTableTestHelper.addComment({});

            // Action
            await commentRepositoryPostgres.deleteCommentById(commentId);

            // Assert
            const comments = await CommentTableTestHelper.findCommentsById(commentId);
            expect(comments).toHaveLength(0);
        });
    });

    describe('getCommentByThreadId function', () => {
        it('should return comment thread correctly', async () => {
            // Arrange
            const threadId = 'thread-123';
            const expectedResult = {
                id: 'comment-123',
                owner: 'user-123',
                content: 'ini comment',
                threadId: 'thread-123',
            };

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await CommentTableTestHelper.addComment({});

            // Action
            const result = await commentRepositoryPostgres.getCommentByThreadId(threadId);

            // Assert
            expect(result[0].id).toEqual(expectedResult.id);
            expect(result[0].owner).toEqual(expectedResult.owner);
            expect(result[0].content).toEqual(expectedResult.content);
            expect(result[0].thread_id).toEqual(expectedResult.threadId);
            expect(result[0].username).toBeDefined();
            expect(result[0].date).toBeDefined();
            expect(result[0].is_deleted).toBeDefined();
        });
    });
});