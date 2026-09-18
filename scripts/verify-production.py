"""Read-only checks against `npm run start -- --port 3100` (no browser required)."""
import concurrent.futures
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3100'
CALCULATORS = ['mortgage-calculator', 'loan-calculator', 'monthly-payment-calculator',
              'total-interest-calculator', 'refinancing-calculator', 'affordability-calculator',
              'rent-vs-buy', 'amortization-schedule']
OLD = {'/blog/debt-to-income-ratio': '/blog/28-36-rule-explained',
       '/blog/reduce-personal-loan-costs': '/blog/compare-loan-offers'}
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args): return None
opener = urllib.request.build_opener(NoRedirect)
def fetch(path):
    try:
        with opener.open(BASE + path, timeout=30) as response:
            return response.status, response.headers, response.read().decode()
    except urllib.error.HTTPError as response:
        return response.code, response.headers, response.read().decode()

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.headings = []; self.links = []; self.scripts = []; self.canonical = []
        self.titles = []; self.descriptions = []; self.controls = []; self.labels = []
        self.nested = []; self.active = []; self.script = None; self.title = False
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'h1': self.headings.append(attrs)
        if tag == 'a': self.links.append(attrs.get('href', ''))
        if tag in ('a', 'button'):
            if self.active: self.nested.append((self.active[-1], tag))
            self.active.append(tag)
        if tag == 'link' and attrs.get('rel') == 'canonical': self.canonical.append(attrs['href'])
        if tag == 'meta' and attrs.get('name') == 'description': self.descriptions.append(attrs['content'])
        if tag == 'title': self.title = True
        if tag == 'script':
            self.script = {'attrs': attrs, 'text': ''}; self.scripts.append(self.script)
        if tag in ('input', 'select'): self.controls.append(attrs)
        if tag == 'label': self.labels.append(attrs.get('for'))
    def handle_endtag(self, tag):
        if tag in ('a', 'button') and self.active: self.active.pop()
        if tag == 'script': self.script = None
        if tag == 'title': self.title = False
    def handle_data(self, data):
        if self.script is not None: self.script['text'] += data
        if self.title: self.titles.append(data)

for old, new in OLD.items():
    for prefix in ['', '/eur']:
        status, headers, _ = fetch(prefix + old)
        assert status == 308, (old, status)
        assert headers['Location'] == prefix + new, (old, headers['Location'])
        assert fetch(prefix + new)[0] == 200
print('PASS: both permanent redirects, USD and EUR, with reachable destinations')

all_links = set(); titles = set(); descriptions = set()
for route in CALCULATORS:
    for prefix in ['', '/eur']:
        status, _, source = fetch(prefix + '/' + route)
        assert status == 200, (route, status)
        page = Page(source)
        assert len(page.headings) == 1, (route, len(page.headings))
        assert page.canonical == ['https://tryfincalc.com/' + route]
        assert not page.nested, (route, page.nested)
        assert len(page.descriptions) == 1
        assert not re.search(r'NaN|Infinity|-\$0\.00', source)
        for control in page.controls:
            assert control.get('aria-label') or control.get('id') in page.labels, (route, control)
        for script in page.scripts:
            if script['attrs'].get('type') == 'application/ld+json': json.loads(script['text'])
        data = next(json.loads(s['text']) for s in page.scripts if s['attrs'].get('id') == '__NEXT_DATA__')
        scripts = [s['attrs'] for s in page.scripts] + data.get('scriptLoader', [])
        for script_id in ['adsbygoogle-loader', 'cookieyes', 'consent-defaults']:
            assert sum(s.get('id') == script_id for s in scripts) == 1, (route, script_id)
        assert source.index('consent-defaults') < source.index('id="adsbygoogle-loader"')
        assert 'pub-3710437974251848' in source
        # afterInteractive GA scripts are installed from the shared app bundle after hydration.
        bundles = ''.join(fetch(s['attrs']['src'])[2] for s in page.scripts if s['attrs'].get('src', '').startswith('/_next/static/chunks/'))
        assert bundles.count('id:"gtag-loader"') == 1 and bundles.count('id:"gtag-init"') == 1
        assert bundles.count('G-Y84YC0NQTR') == 2
        assert 'Cookie Settings' in source
        if route == 'amortization-schedule':
            body = re.search(r'<tbody[^>]*>(.*?)</tbody>', source, re.S)[1]
            assert len(re.findall(r'<tr\b', body)) == 12
            assert 'aria-expanded="false"' in source and 'Show full schedule' in source
        if not prefix:
            assert page.titles[0] not in titles
            assert page.descriptions[0] not in descriptions
            titles.add(page.titles[0]); descriptions.add(page.descriptions[0])
        all_links.update(link.split('#')[0].split('?')[0] for link in page.links if link.startswith('/'))
print('PASS: 16 calculator responses, one H1 each, labels, unique metadata, canonicals, JSON-LD, scripts and initial 12-row schedule')

status, _, sitemap = fetch('/sitemap.xml'); assert status == 200
urls = [node.text for node in ET.fromstring(sitemap).iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert len(urls) == len(set(urls))
for url in urls:
    assert url.startswith('https://tryfincalc.com/')
    assert not any(part in url for part in [*OLD, '/api/', '/search', 'opengraph', '/_'])
    all_links.add(url[len('https://tryfincalc.com'):])
assert all('https://tryfincalc.com/' + route in urls for route in CALCULATORS)
for route in ['/', '/about', '/contact', '/faq', '/blog', '/privacy-policy', '/terms-of-service']:
    status, _, source = fetch(route); assert status == 200, route
    page = Page(source); assert len(page.headings) == 1, route
    assert not page.nested, (route, page.nested)
    all_links.update(link.split('#')[0].split('?')[0] for link in page.links if link.startswith('/'))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for route, response in zip(sorted(all_links), pool.map(fetch, sorted(all_links))):
        assert response[0] == 200, (route, response[0])
assert 'Sitemap: https://tryfincalc.com/sitemap.xml' in fetch('/robots.txt')[2]
assert 'google.com, pub-3710437974251848, DIRECT, f08c47fec0942fa0' in fetch('/ads.txt')[2]
for path in Path('src').rglob('*'):
    if path.suffix in ['.ts', '.tsx']:
        source = path.read_text()
        assert not any(old in source for old in OLD), path
        assert 'net net monthly household income' not in source, path
        assert not re.search(r'Check Official Rates|top providers|latest personal loan offers|Pre-?qualify|Get a custom rate', source, re.I), path
print(f'PASS: {len(urls)} unique sitemap URLs, {len(all_links)} internal destinations, core pages, robots, ads.txt and obsolete-copy checks')
print('Browser interaction, layout, external CMP responses and private dashboards are not tested by this script.')
