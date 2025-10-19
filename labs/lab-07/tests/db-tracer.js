// DB tracer: wraps db API to log calls/args/results to the test console
import * as db from "../scripts/db.js";

let sink = (m)=>{};
export function __dbTraceSetSink(fn){ sink = fn || ((m)=>{}); }
function fmt(v){
  try { return typeof v === "object" ? JSON.stringify(v, null, 2) : String(v); }
  catch { return String(v); }
}
function wrapAsync(name, fn){
  return async (...args)=>{
    sink(`→ ${name}(${args.map(fmt).join(", ")})`);
    try{
      const res = await fn(...args);
      sink(`← ${name} ✓ ${res !== undefined ? "result: " + fmt(res) : ""}`.trim());
      return res;
    }catch(e){
      sink(`← ${name} ✗ error: ${e.message}`);
      throw e;
    }
  };
}
function wrapSync(name, fn){
  return (...args)=>{
    sink(`→ ${name}(${args.map(fmt).join(", ")})`);
    try{
      const res = fn(...args);
      sink(`← ${name} ✓ ${res !== undefined ? "result: " + fmt(res) : ""}`.trim());
      return res;
    }catch(e){
      sink(`← ${name} ✗ error: ${e.message}`);
      throw e;
    }
  };
}

// Export wrapped API
export const useAdapter = (adapter)=>{ sink(`⚙ useAdapter(${adapter && (adapter.name || "adapter")})`); return db.useAdapter(adapter); };
export const boot       = wrapAsync("boot", db.boot);
export const getDoc     = wrapSync("getDoc", db.getDoc);
export const findMany   = wrapSync("findMany", db.findMany);
export const findOne    = wrapSync("findOne", db.findOne);
export const insertOne  = wrapAsync("insertOne", db.insertOne);
export const updateOne  = wrapAsync("updateOne", db.updateOne);
export const deleteOne  = wrapAsync("deleteOne", db.deleteOne);
export const transact   = wrapAsync("transact", db.transact);

// Expose sink setter for test-runner
window.__dbTraceSetSink = __dbTraceSetSink;
