const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase{
    constructor({threadRepository, commentRepository}){
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }
    
    async execute(useCasePayload){
        const newComment = new AddComment(useCasePayload);
        await this._threadRepository.verifyAvailableThread(newComment.threadId);
        return this._commentRepository.addComment(newComment);
    }
}

module.exports = AddCommentUseCase;