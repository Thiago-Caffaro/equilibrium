const CURSEFORGE_MIN_INTERVAL_MS = 350;

let queue = Promise.resolve();
let nextRequestAt = 0;

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// A single queue is shared by JAR resolution and the interactive search.  This
// keeps a batch import from making the normal search compete with itself.
export function queueCurseForgeRequest(operation) {
  const scheduled = queue.then(async () => {
    const delay = Math.max(0, nextRequestAt - Date.now());
    if (delay > 0) await wait(delay);
    try {
      return await operation();
    } finally {
      nextRequestAt = Date.now() + CURSEFORGE_MIN_INTERVAL_MS;
    }
  });
  queue = scheduled.catch(() => undefined);
  return scheduled;
}
