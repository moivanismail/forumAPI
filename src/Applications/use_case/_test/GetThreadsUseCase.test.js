const GetComment = require('../../../Domains/comments/entities/GetComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadsUseCase = require('../GetThreadsUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');


describe('GetThreadUseCase', () => {
  it('it should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedDetailThread = {
      id: 'thread-123',
      title: 'judul',
      body: 'body',
      date: 'date',
      username: 'Dicoding',
      comments: [],
    };
    const comment1 = new GetComment({
      id: 'comment1',
      username: 'username1',
      date: 'date',
      thread_id: 'thread-123',
      content: 'content',
    });
    const comment2 = new GetComment({
      id: 'comment2',
      username: 'username2',
      date: 'date',
      thread_id: 'thread-123',
      content: '**komentar telah dihapus**',
    });

    const commentsArray = [comment1, comment2];

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mock needed function
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(
      new GetThread({
        id: 'thread-123',
        title: 'judul',
        body: 'body',
        date: 'date',
        username: 'Dicoding',
        comments: [],
      }),
    ));
    mockCommentRepository.getCommentByThreadId = jest.fn(() => Promise.resolve([
      {
        id: 'comment1',
        username: 'username1',
        date: 'date',
        thread_id: 'thread-123',
        content: 'content',
        is_deleted: false,
      },
      {
        id: 'comment2',
        username: 'username2',
        date: 'date',
        thread_id: 'thread-123',
        content: 'content',
        is_deleted: true,
      },
    ]));

    // create use case instance
    const getThreadsUseCase = new GetThreadsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await getThreadsUseCase.execute(threadId);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
    expect(result).toEqual(new GetThread({ ...expectedDetailThread, comments: commentsArray }));
  });
});