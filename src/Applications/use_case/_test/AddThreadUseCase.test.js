const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should throw error when payload not contain owner property', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };
    let owner = '';

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // creating use case instance
    const getAddedThread = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    // Action and Assert
    await expect(getAddedThread.execute(useCasePayload, owner)).rejects.toThrowError('ADD_THREAD_USE_CASE.NOT_CONTAIN_OWNER_ID');
  });

  it('should throw error when payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };
    let owner = 123;

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // creating use case instance
    const getAddedThread = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    // Action and Assert
    await expect(getAddedThread.execute(useCasePayload, owner)).rejects.toThrowError('ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };
    const owner = 'user-123';

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });


    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // mock needed function
    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedThread));

    // creating use case instance
    const getAddedThread = new AddThreadUseCase({ threadRepository: mockThreadRepository });
    // Action
    const addedThread = await getAddedThread.execute(useCasePayload, owner);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread(useCasePayload), owner);
    });
});