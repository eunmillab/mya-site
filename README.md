# 먀 AI 스튜디오 홈페이지

정적 사이트입니다. 빌드 과정이 없고, 이 폴더를 그대로 올리면 동작합니다.

## 로컬에서 보기

```bash
cd ~/먀 && python3 -m http.server 8765 --directory mya-site
# http://localhost:8765
```

## 배포

### 1) 도메인 — 이미 적용됨
`https://www.myaaistudio.com` 으로 canonical·og:url·sitemap이 설정되어 있다.
바꿀 일이 생기면 `set-domain.sh`를 쓴다.

```bash
./set-domain.sh https://www.myaaistudio.com   # 이미 적용됨
```

### 2) 올린다 — 셋 중 아무거나

| 서비스 | 방법 | 비용 | 설정 파일 |
|---|---|---|---|
| **Netlify** | netlify.com/drop 에 폴더 드래그 | 무료 | `_redirects` · `_headers` 자동 인식 |
| **Cloudflare Pages** | 대시보드에서 폴더 업로드 | 무료 | 동일 |
| **Vercel** | `npx vercel --prod` | 무료 | `vercel.json` 사용 |

셋 다 HTTPS와 CDN이 자동이다.

**DNS 설정** — 도메인 관리 화면에서
- `www` → 배포처가 준 주소로 CNAME
- `@`(apex) → 배포처의 리디렉트 또는 A 레코드. `_redirects`가 apex를 www로 301 보낸다

**설정 파일**
- `_redirects` — apex→www 301, 확장자 없는 주소(`/team` → `team.html`), 404 처리
- `_headers` — 보안 헤더, 이미지 1년 캐시
- `vercel.json` — Vercel용 동일 설정

### 3) 올린 뒤 확인
- `/` 열리는지
- 아무 주소나 쳐서 `404.html`이 뜨는지 (Cloudflare·Netlify는 자동, Vercel은 설정 필요)
- 카카오톡·슬랙에 링크 붙여넣어 OG 카드가 뜨는지
- 구글 서치콘솔에 `sitemap.xml` 제출

## 파일 구조

```
index.html          홈
ai-ops / content / music / dev / branding     서비스 5
sshot / lab / eunyeon / seonoja               자사 서비스 4
team.html           팀
brand.html          브랜드 가이드라인
terms / privacy     법적 문서
404.html            없는 페이지
logo.html / logo-bot.html                     내부 도구 (noindex)
style.css           전체 공용
*-card.jpg          서비스 캡처 4장
og.jpg              공유 카드 이미지
favicon.svg / apple-touch-icon.png
sitemap.xml / robots.txt
```

## 고칠 때

- 색·크기·간격은 전부 `style.css` 맨 위 `:root` 토큰에 있다. 개별 규칙을 고치지 말고 토큰을 고친다
- 서비스 캡처를 갱신하려면 `~/먀/작업/260923_먀-홈페이지/07_현행구현_참고스펙.md` §6 규격을 따른다
- 카피 원칙: 해요체, 2인칭 호칭 금지, 자랑조 금지, 확인 안 되는 수치 금지
