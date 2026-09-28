"""Reproducible HTTP/HTML inventory, without JavaScript or redirect following.

python3 scripts/audit-crawl.py BASE OUTPUT_DIRECTORY
Seeds from source routes, all locale variants, sitemap and legacy redirects;
then follows same-origin HTML anchors. Inlinks count distinct source pages.
"""
import concurrent.futures
import csv
import json
import re
import sys
import subprocess
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import xml.etree.ElementTree as ET

BASE = sys.argv[1].rstrip('/')
OUT = Path(sys.argv[2]); OUT.mkdir(parents=True, exist_ok=True)
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args): return None
opener = urllib.request.build_opener(NoRedirect)
def fetch(path):
    if BASE.startswith('https:'):
        result = subprocess.run(['curl','-sS','--max-time','25','-D','-',BASE+path], capture_output=True, text=True)
        if result.returncode: return 0, {}, result.stderr
        head, _, body = result.stdout.partition('\n\n')
        lines = head.splitlines()
        return int(lines[0].split()[1]), dict(line.split(': ',1) for line in lines[1:] if ': ' in line), body
    try:
        with opener.open(BASE + path, timeout=25) as r:
            return r.status, dict(r.headers), r.read().decode('utf-8', errors='replace')
    except urllib.error.HTTPError as r:
        return r.code, dict(r.headers), r.read().decode('utf-8', errors='replace')
    except Exception as e: return 0, {}, str(e)
class HTML(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.meta = {}; self.links = []; self.images = []; self.canonical = []
        self.hreflang = []; self.h1 = 0; self.title = ''; self.in_title = False
        self.schemas = []; self.script = None; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta': self.meta[a.get('name', a.get('property', ''))] = a.get('content', '')
        if tag == 'title': self.in_title = True
        if tag == 'h1': self.h1 += 1
        if tag == 'a': self.links.append(a.get('href', ''))
        if tag == 'img': self.images.append(a.get('src', ''))
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical.append(a.get('href'))
        if tag == 'link' and a.get('hreflang'): self.hreflang.append(a)
        if tag == 'script' and a.get('type') == 'application/ld+json': self.script = ''
    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.script is not None: self.script += data
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag == 'script' and self.script is not None:
            try: self.schemas.append(json.loads(self.script))
            except ValueError: self.schemas.append({'INVALID_JSON': self.script})
            self.script = None
def local(url, current='/'):
    u = urllib.parse.urlsplit(urllib.parse.urljoin(BASE + current, url))
    if u.netloc not in [urllib.parse.urlsplit(BASE).netloc, 'tryfincalc.com', 'www.tryfincalc.com']: return None
    return u.path or '/'
def walk(value, key):
    if isinstance(value, dict):
        for k,v in value.items():
            if k == key: yield v
            yield from walk(v,key)
    elif isinstance(value,list):
        for v in value: yield from walk(v,key)

sources = {}
for p in Path('src/pages').rglob('*.tsx'):
    route = '/' + re.sub(r'/index$', '', str(p.relative_to('src/pages'))[:-4])
    if route == '/index': route = '/'
    if '[' not in route and not p.name.startswith('_'): sources[route] = str(p)
for file, prefix, template in [('src/data/articles.ts','/blog/','src/pages/blog/[slug].tsx'),('src/lib/pseo-data.ts','/calculator/','src/pages/calculator/[slug].tsx')]:
    for slug in re.findall(r"slug:\s*['\"]([^'\"]+)", Path(file).read_text()): sources[prefix+slug] = template
legacy = re.findall(r"source:\s*['\"]([^'\"]+)", Path('next.config.ts').read_text())
seed = {prefix + route for route in sources for prefix in ['', '/usd', '/eur']}
seed.update(legacy); seed.update(['/og-image.jpg','/og-image.png','/logo.png','/api/hello','/robots.txt'])
status, _, sitemap = fetch('/sitemap.xml'); (OUT/'sitemap.xml').write_text(sitemap)
try: sitemap_urls = {local(n.text) for n in ET.fromstring(sitemap).iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
except ET.ParseError: sitemap_urls = set()
seed.update(sitemap_urls); seed.discard(None)
rows = {}; inbound = {}; assets = set()
while seed:
    batch = sorted(seed - rows.keys()); seed = set()
    if not batch: break
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for path, (status, headers, body) in zip(batch, pool.map(fetch,batch)):
            page = HTML(body)
            normalized = re.sub(r'^/(usd|eur)(?=/|$)', '', path) or '/'
            source = sources.get(normalized, 'public asset / redirect / discovered route')
            row = dict(url=path, source=source, status=status, location=headers.get('Location',headers.get('location','')),
                robots=page.meta.get('robots','index, follow (default)'), canonical=page.canonical, hreflang=page.hreflang,
                sitemap=path in sitemap_urls, title=page.title, description=page.meta.get('description',''), h1_count=page.h1,
                schema_types=list(walk(page.schemas,'@type')), invalid_json=any('INVALID_JSON' in s for s in page.schemas if isinstance(s,dict)),
                og_image=page.meta.get('og:image',''), twitter_image=page.meta.get('twitter:image',''),
                rendering='ISR (3600s)' if '/blog/' in normalized else 'SSG' if '/calculator/' in normalized else 'static HTML with client hydration',
                initial_placeholder='Enter details to calculate' in body, links=page.links)
            rows[path] = row
            for link in set(page.links):
                target = local(link,path)
                if target:
                    inbound.setdefault(target,set()).add(path)
                    if target not in rows: seed.add(target)
            for url in [row['og_image'],row['twitter_image'],*walk(page.schemas,'url')]:
                if isinstance(url,str) and re.search(r'\.(png|jpg|jpeg|webp|svg)$',url):
                    target=local(url,path)
                    if target: assets.add(target); seed.add(target)
for path,row in rows.items(): row['internal_inlinks'] = len(inbound.get(path,set()))
(OUT/'crawl.json').write_text(json.dumps(list(rows.values()),indent=2))
fields = [k for k in next(iter(rows.values())) if k != 'links']
with (OUT/'routes.csv').open('w') as f:
    w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore'); w.writeheader(); w.writerows(rows.values())
summary=dict(base=BASE, responses=len(rows), sitemap_urls=len(sitemap_urls), statuses=dict(Counter(r['status'] for r in rows.values())),
    sitemap_non200=[p for p in sitemap_urls if rows[p]['status'] != 200],
    sitemap_noindex=[p for p in sitemap_urls if 'noindex' in rows[p]['robots']],
    missing_assets=[p for p in assets if rows.get(p,{}).get('status') != 200],
    broken_anchor_destinations=[p for p in inbound if rows.get(p,{}).get('status') not in [200,301,302,307,308]],
    placeholder_routes=[p for p,r in rows.items() if r['initial_placeholder']])
(OUT/'summary.json').write_text(json.dumps(summary,indent=2)); print(json.dumps(summary,indent=2))
