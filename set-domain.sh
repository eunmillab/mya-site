#!/bin/bash
# 배포 전에 도메인을 한 번에 바꾼다.
#   ./set-domain.sh https://mya.studio
set -e
NEW="${1%/}"
[ -z "$NEW" ] && { echo "사용법: ./set-domain.sh https://your-domain.com"; exit 1; }
OLD="https://myaaistudio.com"
grep -rl "$OLD" . --include="*.html" --include="*.xml" --include="*.txt" 2>/dev/null \
  | xargs sed -i '' "s|$OLD|$NEW|g"
echo "도메인 교체 완료: $OLD → $NEW"
grep -rc "$NEW" sitemap.xml robots.txt index.html
