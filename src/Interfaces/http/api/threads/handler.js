const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadsUseCase = require('../../../../Applications/use_case/GetThreadsUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadsByIdHandler = this.getThreadsByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const {id: owner} = request.auth.credentials;
    const useCasePayload = {
      title: request.payload.title,
      body: request.payload.body,
    };
    const addedThread = await addThreadUseCase.execute(useCasePayload, owner);
    return h.response ({
      status: 'success',
      data: {
        addedThread,
      },
    }).code(201);
  }

    async getThreadsByIdHandler(request, h) {
      const getThreadsUseCase = this._container.getInstance(GetThreadsUseCase.name);
      const {threadId} = request.params;
      const thread = await getThreadsUseCase.execute(threadId);
      return h.response ({
            status: 'success',
            data: {
                thread,
            },
        });
        return response;
    }
}

module.exports = ThreadsHandler;