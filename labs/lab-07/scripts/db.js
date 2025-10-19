//implement this file
let _adapter = null;
let _doc = null;

// load the app document via the adapter and cache it
export async function boot() {
    if (!_adapter) throw new Error("No adapter set. Call useAdapter(...) first.");
    _doc = await _adapter.load();
    return _doc;
}

// insert a new record into collection 'col'
export async function insertOne(col, data) {
    const d = getDoc();
    const rec = {id: uid(), ...data};
    d[col].push(rec);
    await _adapter.save(d);
    _doc = d;
    return rec;
}

// get a safe copy of the cached doc
export function getDoc() {
    return structuredClone(_doc);
}

// read many
export function findMany(col, pred = () => true) {
    return getDoc()[col].filter(pred);    
}

export function findOne(col, pred) {
    return getDoc()[col].find(pred) || null;
}

// apply shallow patch; arrays are replaced
export async function updateOne(col, id, patch) {
    const d = getDoc();
    const i = d[col].findIndex(r => r.id === id);
    if (i === -1) return 0;
    d[col][i] = {...d[col][i], ...patch};
    await _adapter.save(d);
    _doc = d;
    return 1;
}

// delete
export async function deleteOne(col, id) {
    const d = getDoc();
    const before = d[col].length;
    d[col] = d[col].filter(r => r.id !== id);
    const deleted = before - d[col].length;
    if (deleted) {
        await _adapter.save(d);
        _doc = d;
    }
    return deleted;
}

export function useAdapter(adapter) {
    _adapter = adapter;
}

export const uid = () => crypto.randomUUID().slice(0, 8);

export function queryBy(row, filter = {}) {
    return Object.entries(filter).every(([k,v]) => {
        if (v && typeof v === "object" && !Array.isArray(v)) {
            if("$in" in v) return v.$in.includes(row[k]);
            if("$gt" in v) return row[k] > v.$gt;
            if("$gte" in v) return row[k] >= v.$gte;
            if("$lt" in v) return row[k] < v.$lt;
            if("$lte" in v) return row[k] <= v.$lte;
            if("$ne" in v) return row[k] !== v.$ne;
            if("$contians" in v) return String(row[k] ?? "").includes(String(v.$contains));
        }
        return row[k] === v;
    });
}

export function findManyBy(col, filter = {}) {
    return getDoc()[col].filter(r => queryBy(r, filter));
}

export function findOneBy(col, filter = {}) {
    return getDoc()[col].find(r => queryBy(r, filter)) ?? null;
}

export function project(row, fields) {
    if (!fields) return row;
    const out = {};
    for (const k of Object.keys(fields)) if (fields[k]) out[k] = row[k];
    return out;
}

export function find(col, {filter = {}, sort = null, limit = null, skip=0, fields = null}={}) {
    let rows = findManyBy(col, filter);
    if (sort) {
        const [[k, dir]] = Object.entries(sort);
        rows = rows.slice().sort((a,b) => (a[k] > b[k] ? 1: a[k] < b[k] ? -1:0) * (dir === -1 ? -1:1));
    }
    if (skip) rows = rows.slice(skip);
    if (limit) rows = rows.slice(0, limit);
    if (fields) rows = rows.map(r => project(r, fields));
    return rows;
}

export async function updateOneOps(col, id, ops = {}) {
    const row = findOne(col, r => r.id === id);
    if (!row) return 0;
    const patch = {};
    if (ops.$set) Object.assign(patch, ops.$set);
    if (ops.$addToSet) {
        for (const [k, v] of Object.entries(ops.$addToSet)) {
            const cur = Array.isArray(row[k]) ? row[k] : [];
            patch[k] = Array.from(new Set([...cur, ...(Array.isArray(v) ? v: [v])]));
        }
    }
    if (ops.$pull) {
        for (const [k,v] of Object.entries(ops.$pull)) {
            const cur = Array.isArray(row[k]) ? row[k] : [];
            patch[k] = cur.filter(x => x !== v);
        }
    }
    return updateOne(col, id, patch);
}

export async function upsertOne(col, filter, data) {
    const existing = findOneBy(col, filter);

    if(existing) {
        await updateOne(col, existing.id, data);
        return findOne(col, r => r.id === existing.id);
    }
    else {
        return insertOne(col, data);
    }
}

export async function transact(mutatorFn) {
    const d = getDoc();
    mutatorFn(d);
    await _adapter.save(d);
    _doc = d;
    return _doc;
}