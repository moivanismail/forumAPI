const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('a AddCommentUseCase use case', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const payload = {
            threadId: 'thread-123',
            content: 'ini comment',
            owner: 'user-123',
        };
        const expectedAddedComment = new AddedComment({
            id: 'comment-123',
            content: payload.content,
            owner: payload.owner,
        });

        // dependency
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        // mock needed function
        mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedComment));

        // use case instance
        const addCommentUseCase = new AddCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        const addedComment = await addCommentUseCase.execute(payload);

        // Assert
        expect(addedComment).toStrictEqual(expectedAddedComment);
        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(payload.threadId);
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment(payload));
    });
});
