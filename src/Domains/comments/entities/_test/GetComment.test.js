const GetComment = require('../GetComment');

describe('a GetComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
        owner: 'comment-123',
        };
    
        // Action and Assert
        expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
        id: 123,
        username: 'dicoding',
        date: 123,
        content: 'dicoding',
        };
    
        // Action and Assert
        expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    
    it('should create GetComment entities correctly', () => {
        // Arrange
        const payload = {
        id: 'comment-123',
        username: 'dicoding',
        date: 'date',
        content: 'dicoding',
        };
    
        // Action
        const getComment = new GetComment(payload);
    
        // Assert
        expect(getComment.id).toEqual(payload.id);
        expect(getComment.username).toEqual(payload.username);
        expect(getComment.date).toEqual(payload.date);
        expect(getComment.content).toEqual(payload.content);
    });
    });