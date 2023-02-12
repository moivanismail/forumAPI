const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadsUseCase = require('../GetThreadsUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const thread = {
      id: 'thread-123',
      title: "judul",
      body: 'body',
      date: '2023-02-12T05:16:47.539Z',
      username: 'dicoding',
    };
    const comments = [
      {
        id: 'comment-123',
        username: 'user1',
        date: '2023-02-11T05:16:47.539Z',
        content: 'komentar',
        is_deleted: false,
      },
      {
        id: 'comment-124',
        username: 'user2',
        date: '2023-02-10T05:16:47.539Z',
        content: 'komentar 2',
        is_deleted: true,
      },
    ];
    const expectedThread = {
      id: 'thread-123',
      title: "judul",
      body: 'body',
      date: '2023-02-12T05:16:47.539Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'user1',
          date: '2023-02-11T05:16:47.539Z',
          content: 'komentar',
        },
        {
          id: 'comment-124',
          username: 'user2',
          date: '2023-02-10T05:16:47.539Z',
          content: '**komentar telah dihapus**',
        },
      ],
    };

    // dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mock needed function
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));

     //  usecase instance
    const getThreadsUseCase = new GetThreadsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThread = await getThreadsUseCase.execute(threadId);

    // Assert
    expect(getThread).toEqual(expectedThread);
    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId)
      .toHaveBeenCalledWith(threadId);
  });
});