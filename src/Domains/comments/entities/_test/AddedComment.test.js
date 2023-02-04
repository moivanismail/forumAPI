const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
        id: 'comment-123',
        };
    
        // Action and Assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
        id: 'comment-123',
        content: 'ini comment',
        owner: 123,
        threadId: 'thread-123',
        date: 123,
        isDeleted: 'false',
        };
    
        // Action and Assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedComment entities correctly', () => {
        // Arrange
        const payload = {
        id: 'comment-123',
        content: 'ini comment',
        owner: 'user-123',
        };
    
        // Action
        const addedComment = new AddedComment(payload);
    
        // Assert
        expect(addedComment.id).toEqual(payload.id);
        expect(addedComment.content).toEqual(payload.content);
        expect(addedComment.owner).toEqual(payload.owner);
    });
});