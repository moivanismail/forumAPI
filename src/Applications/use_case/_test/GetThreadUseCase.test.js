const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadsUseCase = require('../GetThreadsUseCase');

describe('GetThreadsUseCase', () => {
    it('should orchestrating the get thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
        };
        const thread = {
            id: 'thread-123',
            title: 'dicoding',
            body: 'Dicoding Indonesia',
            date: 'date',
            username: 'dicoding',
        };
       const expectedTherad = {
            id: 'thread-123',
            title: 'dicoding',
            body: 'Dicoding Indonesia',
            date: 'date',
            username: 'dicoding',
        };

        // create dependency
        const mockThreadRepository = new ThreadRepository();

        // mock needed function
        mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
        mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(thread));

        // usecase instance
        const getThreadUseCase = new GetThreadsUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const getThread = await getThreadUseCase.execute(useCasePayload);

        // Assert
        expect(getThread).toEqual(expectedTherad);
        expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.threadId);
        expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    });
});