class ThreadRepository{
    async addThread(newThread){
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
    async getThreadById(threadId){
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
    async getThreadByTitle(threadTitle){
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
    async getThreadByOwner(threadOwner){
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
    async getThreadByDate(threadDate){
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
    async deleteThreadById(threadId){
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = ThreadRepository;