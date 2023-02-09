const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('a AddCommentUseCase use case', () => {
    it('should orchestrating adding comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
          content: 'This is comment',
          owner: 'user-123',
          threadId: 'thread-123',
        };
    
        const expectedAddedComment = new AddedComment({
          id: 'comment-123',
          content: useCasePayload.content,
          owner: 'user-123',
        });
    
        // create dependencies
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();
    
        // mocking needed function
        mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn()
          .mockImplementation(() => Promise.resolve(new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: 'user-123',
          })));
    
        // create use case instance
        const addCommentUseCase = new AddCommentUseCase({
          commentRepository: mockCommentRepository,
          threadRepository: mockThreadRepository,
        });
    
        // Action
        const addedComment = await addCommentUseCase.execute(useCasePayload);
    
        // Assert
        expect(addedComment).toStrictEqual(expectedAddedComment);
        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
          content: useCasePayload.content,
          owner: useCasePayload.owner,
          threadId: useCasePayload.threadId,
        }));
      });
});
