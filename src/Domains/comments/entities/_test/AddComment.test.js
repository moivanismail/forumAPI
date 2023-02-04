const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
        threadId: 'thread-123',
        };
    
        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
        threadId: 'thread-123',
        content: 123,
        owner: 123,
        };
    
        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    
    it('should create AddComment entities correctly', () => {
        // Arrange
        const payload = {
        threadId: 'thread-123',
        content: 'ini comment',
        owner: 'user-123',
        };
    
        // Action
        const addComment = new AddComment(payload);
    
        // Assert
        expect(addComment.threadId).toEqual(payload.threadId);
        expect(addComment.content).toEqual(payload.content);
        expect(addComment.owner).toEqual(payload.owner);
    });
    });