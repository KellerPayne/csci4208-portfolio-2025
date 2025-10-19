//implement this file
import {seedDoc} from "../model.js";

export class MemoryAdapter {

    constructor({stampOnSave = true} = {}) {
        this._doc = null;
        this._stampOnSave = stampOnSave;
    }

    _stamp(d) {
        d.rev = (d.rev ?? 0) + 1;
        d.updatedAt = new Date().toISOString();
    }

    async load() {
        if (!this._doc) this._doc = seedDoc();
        return this._doc;
    }

    async save(next) {
        if (this._stampOnSave) this._stamp(next);
        this._doc = next;
    }

    reset() {
        this._doc = null;
    }

    snapshot() {
        return structuredClone(this._doc);
    }
}

export const memoryAdapter = new MemoryAdapter();