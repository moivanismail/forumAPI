const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        this._verifyOwnerId(useCasePayload);
        const addThread = new AddThread(useCasePayload);

        return this._threadRepository.addThread(addThread);
    }

    _verifyOwnerId(useCasePayload) {
        if (!useCasePayload.owner) {
            throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_OWNER_ID');
        }

        if (typeof useCasePayload.owner !== 'string') {
            throw new Error('ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddThreadUseCase;