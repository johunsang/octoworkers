export function isoNow() {
  return new Date().toISOString()
}

export async function allRows<T>(statement: { all<K>(): Promise<{ results: K[] }> }) {
  const result = await statement.all<T>()
  return result.results
}
