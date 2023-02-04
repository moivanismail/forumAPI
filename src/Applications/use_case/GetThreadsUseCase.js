const GetComment = require('../../Domains/comments/entities/GetComment');

class GetThreadsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentByThreadId(threadId);
    
    const comment = [];
    for (let i = 0; i < comments.length; i++) {
      comment.push(new GetComment({
        id: comments[i].id,
        username: comments[i].username,
        date: comments[i].date,
        content:  comments[i].is_deleted ? '**komentar telah dihapus**' : comments[i].content,
    }));
  }

    thread.comments = comment;
    return thread;
  }
}

module.exports = GetThreadsUseCase;