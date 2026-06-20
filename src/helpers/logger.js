function logError(error) {
  console.error('[ERROR]', error instanceof Error ? error.message : error);
}

module.exports = { logError };
