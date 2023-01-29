const GetThread = require('../GetThread');

describe('a getThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: "judul",
    };

    // Action and assret
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data types specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: "judul",
      body: true,
      created_at: '22-09-2022',
      owner: 'user-123',
    };

    // Action and assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: "judul",
      body: 'body',
      created_at: '22-09-2022',
      owner: 'user-123',
    };

    // Action
    const {
      id, title, body, owner, created_at,
    } = new GetThread(payload);

    // assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
    expect(created_at).toEqual(payload.created_at);
  });
});