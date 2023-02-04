class DeleteCommentUsecase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }
    
    async execute(commentId, threadId, owner) {
        await this._threadRepository.verifyAvailableThread(threadId);
        await this._commentRepository.verifyAvailableComment(commentId);
        await this._commentRepository.verifyCommentOwner(commentId, owner);
        await this._commentRepository.deleteCommentById(commentId);
    }
}

module.exports = DeleteCommentUsecase;