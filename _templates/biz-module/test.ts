// ━━━ 새 비즈니스 모듈 테스트 템플릿 ━━━
// worker/test/app.test.ts 에 아래 테스트를 추가하세요.
// __ITEM__ / __item__ / __items__ 를 실제 이름으로 치환하세요.

// describe('__items__', () => {
//   it('should list __items__', async () => {
//     const mockDb = {
//       prepare: () => ({
//         bind: () => ({
//           all: async () => ({
//             results: [
//               { id: 1, title: 'Test', status: 'active', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
//             ],
//           }),
//         }),
//       }),
//     }
//
//     const res = await app.request('/api/admin/__items__', {}, { DB: mockDb })
//     expect(res.status).toBe(200)
//
//     const body = await res.json()
//     expect(body).toHaveLength(1)
//     expect(body[0].title).toBe('Test')
//   })
//
//   it('should create __item__', async () => {
//     let captured: unknown[] = []
//     const mockDb = {
//       prepare: () => ({
//         bind: (...args: unknown[]) => {
//           captured = args
//           return { run: async () => ({}) }
//         },
//       }),
//     }
//
//     const res = await app.request(
//       '/api/admin/__items__',
//       {
//         method: 'POST',
//         headers: { 'content-type': 'application/json' },
//         body: JSON.stringify({ title: 'New Item' }),
//       },
//       { DB: mockDb },
//     )
//     expect(res.status).toBe(201)
//     expect(captured[0]).toBe('New Item')
//   })
//
//   it('should return 404 for non-existent __item__', async () => {
//     const mockDb = {
//       prepare: () => ({
//         bind: () => ({
//           first: async () => null,
//         }),
//       }),
//     }
//
//     const res = await app.request('/api/admin/__items__/999', {}, { DB: mockDb })
//     expect(res.status).toBe(404)
//   })
// })
