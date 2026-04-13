-- Cloudflare Pricing Complete Guide page
INSERT INTO pages (slug, title, content_md, content_html, status, published_at, created_at, updated_at)
VALUES (
  'pricing-guide',
  'Cloudflare 요금제 완벽 가이드',
  '# Cloudflare 요금제 완벽 가이드

옥토워커스 보일러플레이트 사용자를 위한 클라우드플레어 요금제 철저 분석 (2025년 4월 기준)

---

## 요약 및 핵심 결론

### 경쟁사 대비 핵심 장점

- **무제한 대역폭**: Free/Paid 모두 이그레스 비용 $0 (AWS는 $0.09/GB)
- **CPU 시간 기반 과금**: I/O 대기 시간에 과금 없음 (70~90% 비용 절감)
- **Zero Cold Start**: V8 Isolate 아키텍처로 1ms 미만 즉시 실행
- **통합 생태계**: CDN + Workers + Storage + AI를 하나의 플랫폼에서

### 주의사항

- Worker당 128MB 메모리 제한
- Free Tier 10만 요청/일 한도
- Node.js 완전 호환 불가 (일부 API 제한)

---

## 1. 웹사이트 플랜 (CDN/보안)

### Free ($0/월)

- 대역폭: 무제한
- DDoS 보호: 기본
- SSL 인증서: 공유
- WAF: 미포함
- 지원: 커뮤니티

### Pro ($20/월)

- DDoS 보호: 향상됨
- WAF: 기본 규칙
- 캐싱 규칙: 20개
- 지원: 이메일

### Business ($200/월)

- WAF: 고급 규칙
- SSL: 커스텀 인증서
- 캐싱 규칙: 50개
- Bot Management: 기본
- 지원: 24/7 채팅
- SLA: 100%

### Enterprise ($3,000~/월)

- WAF: 커스텀 규칙
- SSL: 커스텀 + mTLS
- 캐싱 규칙: 무제한
- Bot Management: 고급
- China CDN: 별도 비용
- 지원: 24/7 전화 + TAM
- SLA: 100% + 보상

---

## 2. Workers 요금제

### Free Plan

- 요청: 100,000/일 (월 약 300만)
- CPU 시간: 10ms/호출
- 메모리: 128MB
- Subrequests: 50/요청
- Worker 수: 100개
- 대역폭: 무제한
- Cron Triggers: 5개
- 정적 자산: 2만 파일

### Paid Plan ($5/월)

- 요청: 1,000만/월 포함, 초과 $0.30/백만
- CPU 시간: 30ms 기본 (최대 5분)
- 메모리: 128MB
- Subrequests: 10,000/요청
- Worker 수: 500개
- 대역폭: 무제한
- Cron Triggers: 250개
- 정적 자산: 10만 파일

### Workers Logs

- Free: 20만/일, 보관 3일
- Paid: 2,000만/월 포함, +$0.60/백만, 보관 7일, Logpush 지원

### Workers Builds (CI/CD)

- Free: 빌드 3,000분/월, 동시 1개, 2 vCPU
- Paid: 빌드 6,000분/월 (+$0.005/분), 동시 6개, 4 vCPU

---

## 3. 스토리지 및 데이터베이스

### R2 (오브젝트 스토리지) — AWS S3 대안

- **이그레스 비용 $0** (최대 장점)
- Free: 저장 10GB, Class A 100만/월, Class B 1,000만/월
- Standard: 저장 $0.015/GB/월, Class A $4.50/백만, Class B $0.36/백만
- Infrequent Access: 저장 $0.01/GB/월, Class A $9.00/백만, Class B $0.90/백만
- Class A (상태 변경): PUT, COPY, POST, DELETE
- Class B (읽기 전용): GET, HEAD, OPTIONS

### KV (키-값 저장소)

- Free: 읽기 10만/일, 쓰기 1,000/일, 저장 1GB
- Paid: 읽기 1,000만/월 (+$0.50/백만), 쓰기 100만/월 (+$5.00/백만)
- 저장: $0.50/GB/월

### D1 (서버리스 SQLite)

- Free: 읽기 500만 rows/일, 쓰기 10만 rows/일, 저장 5GB
- Paid: 읽기 250억/월 (+$0.001/백만), 쓰기 5,000만/월 (+$1.00/백만)
- 저장: 5GB 포함, 초과 $0.75/GB/월
- 이그레스: 무료

### Durable Objects (상태 저장 컴퓨팅)

- SQLite 백엔드 (권장): D1과 동일한 요금 구조
- KV 백엔드 (Paid 전용): 읽기 $0.20/백만, 쓰기 $1.00/백만, 저장 $0.20/GB

### Vectorize (벡터 데이터베이스)

- Free: 쿼리 3,000만 차원/월, 저장 500만 차원
- Paid: 쿼리 5,000만/월 (+$0.01/백만), 저장 1,000만 (+$0.05/1억)
- 예시 (768차원, 5만 벡터, 월 20만 쿼리): 약 $1.94/월

---

## 4. AI/ML 서비스

### Workers AI

- Free: 10,000 Neurons/일
- Paid: 10,000 Neurons/일 포함, 초과 $0.011/1,000 Neurons
- Neuron = GPU 컴퓨팅 작업량 단위
- LLM 1K 토큰 = 약 100~500 Neurons

### AI Gateway

- Free: 로그 10만/일, 보관 7일
- Paid: 로그 1,000만/월, 보관 30일
- 캐싱, 속도 제한, 로깅 무료 제공

---

## 5. 기타 서비스

### Queues (메시지 큐)

- Free: 100만 작업/일
- Paid: 500만/월 포함

### Images (이미지 처리)

- 변환: $0.50/1,000 요청

### Zero Trust (보안 접근)

- Free: 50 사용자, 기본 보안
- Pay-as-you-go: $7/사용자/월, 무제한 사용자
- Contract: 협상, 엔터프라이즈 기능

---

## 6. 경쟁사 비교

### 서버리스 비교

- **Cloudflare Workers**: 요청 $0.30/백만, Cold Start 없음, 이그레스 무료
- **AWS Lambda**: 요청 $0.20/백만, Cold Start 100~1000ms, 이그레스 $0.09/GB
- **Google Cloud Functions**: 요청 $0.40/백만, Cold Start 100~400ms, 이그레스 $0.08~$0.12/GB
- **Azure Functions**: 요청 $0.20/백만, Cold Start 있음, 이그레스 $0.08~$0.12/GB

### 스토리지 비교 (R2 vs S3 vs Blob vs GCS)

- **Cloudflare R2**: 저장 $0.015/GB, 이그레스 무료
- **AWS S3**: 저장 $0.023/GB, 이그레스 $0.09/GB
- **Azure Blob**: 저장 $0.0184/GB, 이그레스 $0.087/GB
- **Google Cloud Storage**: 저장 $0.020/GB, 이그레스 $0.08~$0.12/GB

### 데이터베이스 비교

- **Cloudflare D1**: 관계형(SQLite), 읽기 $0.001/백만, 이그레스 무료
- **AWS DynamoDB**: NoSQL, 읽기 $0.25/백만, 이그레스 유료
- **Google Firestore**: NoSQL, 읽기 $0.06/10만, 이그레스 유료

---

## 7. 실제 비용 시나리오

### 소규모 SaaS (MVP)

- 사용: 월 500만 요청, D1 100만 rows 읽기/일, R2 50GB
- **Cloudflare: $5/월** vs AWS: ~$35/월 (86% 절감)

### 중규모 API 서비스

- 사용: 월 1억 요청, D1 1억 rows 읽기, R2 500GB
- **Cloudflare: $37.61/월** vs AWS: ~$505/월 (93% 절감)

### AI 기반 애플리케이션

- 사용: 월 1,000만 요청, Workers AI 100만 Neurons/일, Vectorize 10만 벡터
- **Cloudflare: $35/월** vs AWS: ~$170/월 (79% 절감)

---

## 8. 비용 최적화 전략

### Workers 최적화

- I/O 작업은 CPU 시간에 포함되지 않음 (네트워크 요청 활용)
- Cache API로 반복 요청 감소
- 정적 자산은 ASSETS 바인딩 사용 (요청 과금 제외)

### 데이터베이스 최적화

- D1 인덱싱으로 rows_read 감소
- 여러 쿼리를 트랜잭션으로 묶기
- 자주 읽는 데이터는 KV에 캐시

### 스토리지 최적화

- 자주 접근하지 않는 데이터는 R2 Infrequent Access 저장
- GET(Class B)이 PUT(Class A)보다 훨씬 저렴

---

## 9. 결론 및 추천

### Cloudflare가 적합한 경우

- 글로벌 서비스: 330+ 도시 엣지 네트워크
- 비용 민감: 특히 이그레스 비용이 큰 경우
- I/O 바운드 워크로드: API 게이트웨이, 프록시
- 실시간 애플리케이션: Cold start 불가능한 경우
- AI/ML 엣지: 낮은 지연 시간 필요

### 다른 플랫폼이 적합한 경우

- 메모리 집약적: 128MB보다 큰 메모리 필요
- 장기 실행 작업: 5분 이상 실행 필요
- Node.js 호환성: 특정 npm 패키지 필수
- AWS 통합: Lambda + RDS/DynamoDB 긴밀 통합

### 단계별 추천 조합

- **PoC/MVP**: Workers Free + D1 Free + R2 Free = **$0/월**
- **성장기**: Workers Paid + D1 + R2 = **$5~20/월**
- **프로덕션**: Workers Paid + Pro Plan + 확장 리소스 = **$25~100/월**
- **엔터프라이즈**: Enterprise 협상 = **$200+/월**

---

이 문서는 2025년 4월 기준 정보이며, 실제 가격은 변동될 수 있습니다.',

  '<h1>Cloudflare 요금제 완벽 가이드</h1>
<p>옥토워커스 보일러플레이트 사용자를 위한 클라우드플레어 요금제 철저 분석 (2025년 4월 기준)</p>

<hr />

<h2>요약 및 핵심 결론</h2>

<h3>경쟁사 대비 핵심 장점</h3>
<ul><li><strong>무제한 대역폭</strong>: Free/Paid 모두 이그레스 비용 $0 (AWS는 $0.09/GB)</li>
<li><strong>CPU 시간 기반 과금</strong>: I/O 대기 시간에 과금 없음 (70~90% 비용 절감)</li>
<li><strong>Zero Cold Start</strong>: V8 Isolate 아키텍처로 1ms 미만 즉시 실행</li>
<li><strong>통합 생태계</strong>: CDN + Workers + Storage + AI를 하나의 플랫폼에서</li></ul>

<h3>주의사항</h3>
<ul><li>Worker당 128MB 메모리 제한</li>
<li>Free Tier 10만 요청/일 한도</li>
<li>Node.js 완전 호환 불가 (일부 API 제한)</li></ul>

<hr />

<h2>1. 웹사이트 플랜 (CDN/보안)</h2>

<h3>Free ($0/월)</h3>
<ul><li>대역폭: 무제한</li>
<li>DDoS 보호: 기본</li>
<li>SSL 인증서: 공유</li>
<li>WAF: 미포함</li>
<li>지원: 커뮤니티</li></ul>

<h3>Pro ($20/월)</h3>
<ul><li>DDoS 보호: 향상됨</li>
<li>WAF: 기본 규칙</li>
<li>캐싱 규칙: 20개</li>
<li>지원: 이메일</li></ul>

<h3>Business ($200/월)</h3>
<ul><li>WAF: 고급 규칙</li>
<li>SSL: 커스텀 인증서</li>
<li>캐싱 규칙: 50개</li>
<li>Bot Management: 기본</li>
<li>지원: 24/7 채팅</li>
<li>SLA: 100%</li></ul>

<h3>Enterprise ($3,000~/월)</h3>
<ul><li>WAF: 커스텀 규칙</li>
<li>SSL: 커스텀 + mTLS</li>
<li>캐싱 규칙: 무제한</li>
<li>Bot Management: 고급</li>
<li>China CDN: 별도 비용</li>
<li>지원: 24/7 전화 + TAM</li>
<li>SLA: 100% + 보상</li></ul>

<hr />

<h2>2. Workers 요금제</h2>

<h3>Free Plan</h3>
<ul><li>요청: 100,000/일 (월 약 300만)</li>
<li>CPU 시간: 10ms/호출</li>
<li>메모리: 128MB</li>
<li>Subrequests: 50/요청</li>
<li>Worker 수: 100개</li>
<li>대역폭: 무제한</li>
<li>Cron Triggers: 5개</li>
<li>정적 자산: 2만 파일</li></ul>

<h3>Paid Plan ($5/월)</h3>
<ul><li>요청: 1,000만/월 포함, 초과 $0.30/백만</li>
<li>CPU 시간: 30ms 기본 (최대 5분)</li>
<li>메모리: 128MB</li>
<li>Subrequests: 10,000/요청</li>
<li>Worker 수: 500개</li>
<li>대역폭: 무제한</li>
<li>Cron Triggers: 250개</li>
<li>정적 자산: 10만 파일</li></ul>

<h3>Workers Logs</h3>
<ul><li>Free: 20만/일, 보관 3일</li>
<li>Paid: 2,000만/월 포함, +$0.60/백만, 보관 7일, Logpush 지원</li></ul>

<h3>Workers Builds (CI/CD)</h3>
<ul><li>Free: 빌드 3,000분/월, 동시 1개, 2 vCPU</li>
<li>Paid: 빌드 6,000분/월 (+$0.005/분), 동시 6개, 4 vCPU</li></ul>

<hr />

<h2>3. 스토리지 및 데이터베이스</h2>

<h3>R2 (오브젝트 스토리지) — AWS S3 대안</h3>
<ul><li><strong>이그레스 비용 $0</strong> (최대 장점)</li>
<li>Free: 저장 10GB, Class A 100만/월, Class B 1,000만/월</li>
<li>Standard: 저장 $0.015/GB/월, Class A $4.50/백만, Class B $0.36/백만</li>
<li>Infrequent Access: 저장 $0.01/GB/월, Class A $9.00/백만, Class B $0.90/백만</li>
<li>Class A (상태 변경): PUT, COPY, POST, DELETE</li>
<li>Class B (읽기 전용): GET, HEAD, OPTIONS</li></ul>

<h3>KV (키-값 저장소)</h3>
<ul><li>Free: 읽기 10만/일, 쓰기 1,000/일, 저장 1GB</li>
<li>Paid: 읽기 1,000만/월 (+$0.50/백만), 쓰기 100만/월 (+$5.00/백만)</li>
<li>저장: $0.50/GB/월</li></ul>

<h3>D1 (서버리스 SQLite)</h3>
<ul><li>Free: 읽기 500만 rows/일, 쓰기 10만 rows/일, 저장 5GB</li>
<li>Paid: 읽기 250억/월 (+$0.001/백만), 쓰기 5,000만/월 (+$1.00/백만)</li>
<li>저장: 5GB 포함, 초과 $0.75/GB/월</li>
<li>이그레스: 무료</li></ul>

<h3>Durable Objects (상태 저장 컴퓨팅)</h3>
<ul><li>SQLite 백엔드 (권장): D1과 동일한 요금 구조</li>
<li>KV 백엔드 (Paid 전용): 읽기 $0.20/백만, 쓰기 $1.00/백만, 저장 $0.20/GB</li></ul>

<h3>Vectorize (벡터 데이터베이스)</h3>
<ul><li>Free: 쿼리 3,000만 차원/월, 저장 500만 차원</li>
<li>Paid: 쿼리 5,000만/월 (+$0.01/백만), 저장 1,000만 (+$0.05/1억)</li>
<li>예시 (768차원, 5만 벡터, 월 20만 쿼리): 약 $1.94/월</li></ul>

<hr />

<h2>4. AI/ML 서비스</h2>

<h3>Workers AI</h3>
<ul><li>Free: 10,000 Neurons/일</li>
<li>Paid: 10,000 Neurons/일 포함, 초과 $0.011/1,000 Neurons</li>
<li>Neuron = GPU 컴퓨팅 작업량 단위</li>
<li>LLM 1K 토큰 = 약 100~500 Neurons</li></ul>

<h3>AI Gateway</h3>
<ul><li>Free: 로그 10만/일, 보관 7일</li>
<li>Paid: 로그 1,000만/월, 보관 30일</li>
<li>캐싱, 속도 제한, 로깅 무료 제공</li></ul>

<hr />

<h2>5. 기타 서비스</h2>

<h3>Queues (메시지 큐)</h3>
<ul><li>Free: 100만 작업/일</li>
<li>Paid: 500만/월 포함</li></ul>

<h3>Images (이미지 처리)</h3>
<ul><li>변환: $0.50/1,000 요청</li></ul>

<h3>Zero Trust (보안 접근)</h3>
<ul><li>Free: 50 사용자, 기본 보안</li>
<li>Pay-as-you-go: $7/사용자/월, 무제한 사용자</li>
<li>Contract: 협상, 엔터프라이즈 기능</li></ul>

<hr />

<h2>6. 경쟁사 비교</h2>

<h3>서버리스 비교</h3>
<ul><li><strong>Cloudflare Workers</strong>: 요청 $0.30/백만, Cold Start 없음, 이그레스 무료</li>
<li><strong>AWS Lambda</strong>: 요청 $0.20/백만, Cold Start 100~1000ms, 이그레스 $0.09/GB</li>
<li><strong>Google Cloud Functions</strong>: 요청 $0.40/백만, Cold Start 100~400ms, 이그레스 $0.08~$0.12/GB</li>
<li><strong>Azure Functions</strong>: 요청 $0.20/백만, Cold Start 있음, 이그레스 $0.08~$0.12/GB</li></ul>

<h3>스토리지 비교 (R2 vs S3 vs Blob vs GCS)</h3>
<ul><li><strong>Cloudflare R2</strong>: 저장 $0.015/GB, 이그레스 무료</li>
<li><strong>AWS S3</strong>: 저장 $0.023/GB, 이그레스 $0.09/GB</li>
<li><strong>Azure Blob</strong>: 저장 $0.0184/GB, 이그레스 $0.087/GB</li>
<li><strong>Google Cloud Storage</strong>: 저장 $0.020/GB, 이그레스 $0.08~$0.12/GB</li></ul>

<h3>데이터베이스 비교</h3>
<ul><li><strong>Cloudflare D1</strong>: 관계형(SQLite), 읽기 $0.001/백만, 이그레스 무료</li>
<li><strong>AWS DynamoDB</strong>: NoSQL, 읽기 $0.25/백만, 이그레스 유료</li>
<li><strong>Google Firestore</strong>: NoSQL, 읽기 $0.06/10만, 이그레스 유료</li></ul>

<hr />

<h2>7. 실제 비용 시나리오</h2>

<h3>소규모 SaaS (MVP)</h3>
<ul><li>사용: 월 500만 요청, D1 100만 rows 읽기/일, R2 50GB</li>
<li><strong>Cloudflare: $5/월</strong> vs AWS: ~$35/월 (86% 절감)</li></ul>

<h3>중규모 API 서비스</h3>
<ul><li>사용: 월 1억 요청, D1 1억 rows 읽기, R2 500GB</li>
<li><strong>Cloudflare: $37.61/월</strong> vs AWS: ~$505/월 (93% 절감)</li></ul>

<h3>AI 기반 애플리케이션</h3>
<ul><li>사용: 월 1,000만 요청, Workers AI 100만 Neurons/일, Vectorize 10만 벡터</li>
<li><strong>Cloudflare: $35/월</strong> vs AWS: ~$170/월 (79% 절감)</li></ul>

<hr />

<h2>8. 비용 최적화 전략</h2>

<h3>Workers 최적화</h3>
<ul><li>I/O 작업은 CPU 시간에 포함되지 않음 (네트워크 요청 활용)</li>
<li>Cache API로 반복 요청 감소</li>
<li>정적 자산은 ASSETS 바인딩 사용 (요청 과금 제외)</li></ul>

<h3>데이터베이스 최적화</h3>
<ul><li>D1 인덱싱으로 rows_read 감소</li>
<li>여러 쿼리를 트랜잭션으로 묶기</li>
<li>자주 읽는 데이터는 KV에 캐시</li></ul>

<h3>스토리지 최적화</h3>
<ul><li>자주 접근하지 않는 데이터는 R2 Infrequent Access 저장</li>
<li>GET(Class B)이 PUT(Class A)보다 훨씬 저렴</li></ul>

<hr />

<h2>9. 결론 및 추천</h2>

<h3>Cloudflare가 적합한 경우</h3>
<ul><li>글로벌 서비스: 330+ 도시 엣지 네트워크</li>
<li>비용 민감: 특히 이그레스 비용이 큰 경우</li>
<li>I/O 바운드 워크로드: API 게이트웨이, 프록시</li>
<li>실시간 애플리케이션: Cold start 불가능한 경우</li>
<li>AI/ML 엣지: 낮은 지연 시간 필요</li></ul>

<h3>다른 플랫폼이 적합한 경우</h3>
<ul><li>메모리 집약적: 128MB보다 큰 메모리 필요</li>
<li>장기 실행 작업: 5분 이상 실행 필요</li>
<li>Node.js 호환성: 특정 npm 패키지 필수</li>
<li>AWS 통합: Lambda + RDS/DynamoDB 긴밀 통합</li></ul>

<h3>단계별 추천 조합</h3>
<ul><li><strong>PoC/MVP</strong>: Workers Free + D1 Free + R2 Free = <strong>$0/월</strong></li>
<li><strong>성장기</strong>: Workers Paid + D1 + R2 = <strong>$5~20/월</strong></li>
<li><strong>프로덕션</strong>: Workers Paid + Pro Plan + 확장 리소스 = <strong>$25~100/월</strong></li>
<li><strong>엔터프라이즈</strong>: Enterprise 협상 = <strong>$200+/월</strong></li></ul>

<hr />

<p>이 문서는 2025년 4월 기준 정보이며, 실제 가격은 변동될 수 있습니다.</p>',

  'published',
  datetime('now'),
  datetime('now'),
  datetime('now')
);
