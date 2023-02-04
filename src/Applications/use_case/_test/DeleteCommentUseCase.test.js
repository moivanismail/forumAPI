const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange

        const commentId = 'comment-123';
        const threadId = 'thread-123';
        const owner = 'user-123';

    
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();
    
        /** creating dependency of use case */
        const deleteCommentUseCase = new DeleteCommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        });
    
        /** mocking needed function */
        mockThreadRepository.verifyAvailableThread = jest.fn()
        .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn()
        .mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteCommentById = jest.fn()
        .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyAvailableComment = jest.fn()
        .mockImplementation(() => Promise.resolve());

    
        // Action
        await deleteCommentUseCase.execute(commentId, threadId, owner);
    
        // Assert
        expect(mockThreadRepository.verifyAvailableThread)
        .toBeCalledWith(threadId);
        expect(mockCommentRepository.verifyCommentOwner)
        .toBeCalledWith(commentId, owner);
        expect(mockCommentRepository.deleteCommentById)
        .toBeCalledWith(commentId);
        expect(mockCommentRepository.verifyAvailableComment)
        .toBeCalledWith(commentId);
    });
});