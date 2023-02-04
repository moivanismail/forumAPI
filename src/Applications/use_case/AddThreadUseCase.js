const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload, owner) {
        this._verifyOwnerId(owner);
        const addThread = new AddThread(useCasePayload);

        return this._threadRepository.addThread(addThread, owner);
    }

    _verifyOwnerId(owner) {
        if (!owner) {
            throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_OWNER_ID');
        }

        if (typeof owner !== 'string') {
            throw new Error('ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddThreadUseCase;