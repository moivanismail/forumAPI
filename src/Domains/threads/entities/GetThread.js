class GetThread{
    constructor(payload){
        this._verifyPayload(payload);

        const {id, title, body, owner, created_at} = payload;

        this.id = id;
        this.title = title;
        this.body = body;
        this.owner = owner;
        this.created_at = created_at;
    }

    _verifyPayload(payload){
        const { id, title, body, owner, created_at } = payload;

        if(!id || !title || !body || !owner || !created_at){
            throw new Error('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if(typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string' || typeof created_at !== 'string'){
            throw new Error('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = GetThread;