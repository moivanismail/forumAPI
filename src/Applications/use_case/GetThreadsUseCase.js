class GetThreadsUseCase{
    constructor({threadRepository}){
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload){
        const {threadId} = useCasePayload;
        await this._threadRepository.verifyAvailableThread(threadId);
        const thread = await this._threadRepository.getThreadById(threadId);
        return thread;
    }
}

module.exports = GetThreadsUseCase;
