// Minimal "API console" runner shared by both demo pages
export function createConsoleSink(container) {
  const box = document.createElement("div");
  box.className = "console";
  container.appendChild(box);
  const log = (msg) => {
    box.textContent += (box.textContent ? "\n" : "") + msg;
    box.scrollTop = box.scrollHeight;
  };
  // Wire the tracer sink
  if (typeof window.__dbTraceSetSink === "function") window.__dbTraceSetSink(log);
  return { log, box };
}

export function gentleParse(jsonText) {
  try { return JSON.parse(jsonText); } catch { throw new Error("Invalid JSON in input."); }
}

// Build a simple predicate from {field, op, value}
export function buildPredicate(where) {
  if (!where) return () => true;
  const { field, op="eq", value } = where;
  return (row) => {
    const x = row?.[field];
    switch (op) {
      case "eq": return x === value;
      case "neq": return x !== value;
      case "gt": return x > value;
      case "gte": return x >= value;
      case "lt": return x < value;
      case "lte": return x <= value;
      case "in": return Array.isArray(value) && value.includes(x);
      case "contains": return (x ?? "").toString().includes((value ?? "").toString());
      default: return true;
    }
  };
}

// Pretty JSON
export const pretty = (v) => {
  try { return JSON.stringify(v, null, 2); } catch { return String(v); }
};
