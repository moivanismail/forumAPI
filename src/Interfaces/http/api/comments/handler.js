const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
    constructor(container) {
        this._container = container;
        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    }
    
    async postCommentHandler(request, h) {
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        const {id: owner} = request.auth.credentials;
        const {threadId} = request.params;
        const {content} = request.payload;
        const useCasePayload = {
            content,
            owner,
            threadId,
        };

        const addedComment = await addCommentUseCase.execute(useCasePayload);

        return h.response({
        status: 'success',
        data: {
            addedComment,
        },
        }).code(201);
    }

    async deleteCommentHandler(request, h) {
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

        const {id: owner} = request.auth.credentials;
        const {commentId, threadId} = request.params;

    await deleteCommentUseCase.execute(commentId, threadId, owner);

        return h.response({
        status: 'success',
        });
    }
}

module.exports = CommentsHandler;