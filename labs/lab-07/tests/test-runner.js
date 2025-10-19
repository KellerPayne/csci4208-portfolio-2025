// Enhanced test runner with a visual console per test block
export async function runTests(name, fn) {
  const root = document.getElementById("out");
  const section = document.createElement("section");

  const h2 = document.createElement("h2");
  h2.className = "test-title";
  h2.textContent = name;

  const consoleBox = document.createElement("div");
  consoleBox.className = "console";
  const appendConsole = (msg) => {
    consoleBox.textContent += (consoleBox.textContent ? "\n" : "") + msg;
    consoleBox.scrollTop = consoleBox.scrollHeight;
  };

  const list = document.createElement("ol");

  section.appendChild(h2);
  section.appendChild(consoleBox);
  section.appendChild(list);
  section.appendChild(document.createElement("hr")).className = "sep";
  root.appendChild(section);

  const log = (msg, cls="") => {
    const li = document.createElement("li");
    li.textContent = msg; if (cls) li.className = cls;
    list.appendChild(li);
  };
  const assert = (cond, msg) => cond ? log("✓ " + msg, "ok") : log("✗ " + msg, "fail");

  // Set sink for the DB tracer if present
  if (typeof window.__dbTraceSetSink === "function") {
    window.__dbTraceSetSink((m) => appendConsole(m));
  }

  // Initial header in console
  appendConsole(`Running: ${name}`);

  try {
    await fn({ assert, log, console: appendConsole });
    appendConsole(`Finished: ${name}`);
  } catch (e) {
    appendConsole(`ERROR: ${e.message}`);
    log("ERROR: " + e.message, "fail");
  }
}
