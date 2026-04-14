import os
import re

articles_path = '/Users/youssefaaouam/Downloads/Loan & mortgage calculator/src/data/articles.ts'
pseo_path = '/Users/youssefaaouam/Downloads/Loan & mortgage calculator/src/lib/pseo-data.ts'
pages_dir = '/Users/youssefaaouam/Downloads/Loan & mortgage calculator/src/pages'

all_urls = set()
link_map = {} # from -> [to]

# 1. Get all published URLs
with open(articles_path, 'r', encoding='utf-8') as f:
    articles_content = f.read()
    slugs = re.findall(r'slug:\s*["\']([^"\']+)["\']', articles_content)
    for slug in slugs:
        all_urls.add(f'/blog/{slug}')

with open(pseo_path, 'r', encoding='utf-8') as f:
    pseo_content = f.read()
    pseo_slugs = re.findall(r'slug:\s*["\']([^"\']+)["\']', pseo_content)
    for slug in pseo_slugs:
        all_urls.add(f'/calculator/{slug}')

for f in os.listdir(pages_dir):
    if f.endswith('.tsx') and not f.startswith('_') and not f.startswith('['):
        name = f.replace('.tsx', '')
        if name == 'index':
            all_urls.add('/')
        else:
            all_urls.add(f'/{name}')

print(f'Total URLs found: {len(all_urls)}')

# 2. Extract links
def extract_links(content):
    links = []
    matches = re.findall(r'href=["\']([^"\']+)["\']', content)
    for url in matches:
        if url.startswith('https://tryfincalc.com'):
            url = url.replace('https://tryfincalc.com', '')
        if url.startswith('/') and '.' not in url and not url.startswith('/api'):
            url = url.rstrip('/')
            if url == '': url = '/'
            links.append(url)
    return links

# Check articles
# Split by article structure to assign links to correct slug
article_blocks = re.split(r'{\s*title:', articles_content)
for block in article_blocks[1:]:
    slug_match = re.search(r'slug:\s*["\']([^"\']+)["\']', block)
    if slug_match:
        slug = f'/blog/{slug_match.group(1)}'
        links = extract_links(block)
        link_map[slug] = link_map.get(slug, []) + links

# Check pSEO
pseo_blocks = re.split(r'{\s*slug:', pseo_content)
for block in pseo_blocks[1:]:
    slug_match = re.search(r'["\']([^"\']+)["\']', block)
    if slug_match:
        slug = f'/calculator/{slug_match.group(1)}'
        links = extract_links(block)
        link_map[slug] = link_map.get(slug, []) + links

# Check static pages
for f in os.listdir(pages_dir):
    if f.endswith('.tsx') and not f.startswith('_') and not f.startswith('['):
        name = f.replace('.tsx', '')
        slug = '/' if name == 'index' else f'/{name}'
        with open(os.path.join(pages_dir, f), 'r', encoding='utf-8') as file:
            content = file.read()
            links = extract_links(content)
            link_map[slug] = link_map.get(slug, []) + links

# 3. Analyze gaps
incoming_counts = {url: 0 for url in all_urls}

for from_url, tos in link_map.items():
    for to in tos:
        if to in all_urls:
            incoming_counts[to] += 1

print('--- ANALYSIS ---')
under_linked_outgoing = []
under_linked_incoming = []

for url in sorted(all_urls):
    outgoing_links = [to for to in link_map.get(url, []) if to in all_urls]
    outgoing = len(outgoing_links)
    incoming = incoming_counts[url]
    
    if outgoing < 2:
        under_linked_outgoing.append((url, outgoing))
    if incoming < 1:
        under_linked_incoming.append((url, incoming))

print(f'Under-linked (Outgoing < 2): {len(under_linked_outgoing)}')
for url, count in under_linked_outgoing:
    print(f'  {url} ({count})')

print(f'Under-linked (Incoming < 1): {len(under_linked_incoming)}')
for url, count in under_linked_incoming:
    print(f'  {url} ({count})')

print('--- TARGET PAGE CHECK ---')
targets = ['/blog/400k-mortgage-monthly-payment', '/blog/fixed-vs-variable-mortgage', '/mortgage-calculator']
for t in targets:
    print(f'{t}: {incoming_counts.get(t, 0)} incoming links')
