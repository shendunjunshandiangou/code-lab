# -*- coding: utf-8 -*-
import re, sys
text = open(sys.argv[1], encoding='utf-8').read()
m = re.search(r'## 文章正文\s*\n(.*)', text, re.DOTALL)
if not m:
    print(0)
else:
    body = m.group(1).strip()
    # count Chinese chars + alphanumeric as content chars
    chars = len(re.sub(r'\s', '', body))
    han = len(re.findall(r'[\u4e00-\u9fff]', body))
    print(f'total={chars} han={han}')
