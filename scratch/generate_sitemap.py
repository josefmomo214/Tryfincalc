import os
import re
from datetime import datetime

base_url = 'https://tryfincalc.com'
articles_path = '/Users/youssefaaouam/Downloads/Loan & mortgage calculator/src/data/articles.ts'
pseo_path = '/Users/youssefaaouam/Downloads/Loan & mortgage calculator/src/lib/pseo-data.ts'
pages_dir = '/Users/youssefaaouam/Downloads/Loan & mortgage calculator/src/pages'
output_path = '/Users/youssefaaouam/Downloads/Loan & mortgage calculator/public/sitemap.xml'

urls = []

# Today's date for lastmod
today = datetime.now().strftime('%Y-%m-%d')

# 1. Static Pages
static_pages = [
    {'path': '/', 'priority': '1.0', 'changefreq': 'weekly'},
    {'path': '/mortgage-calculator', 'priority': '0.9', 'changefreq': 'monthly'},
    {'path': '/loan-calculator', 'priority': '0.9', 'changefreq': 'monthly'},
    {'path': '/monthly-payment-calculator', 'priority': '0.8', 'changefreq': 'monthly'},
    {'path': '/total-interest-calculator', 'priority': '0.8', 'changefreq': 'monthly'},
    {'path': '/refinancing-calculator', 'priority': '0.8', 'changefreq': 'monthly'},
    {'path': '/affordability-calculator', 'priority': '0.8', 'changefreq': 'monthly'},
    {'path': '/rent-vs-buy', 'priority': '0.8', 'changefreq': 'monthly'},
    {'path': '/amortization-schedule', 'priority': '0.8', 'changefreq': 'monthly'},
    {'path': '/blog', 'priority': '0.7', 'changefreq': 'daily'},
    {'path': '/faq', 'priority': '0.5', 'changefreq': 'monthly'},
    {'path': '/about', 'priority': '0.5', 'changefreq': 'monthly'},
    {'path': '/contact', 'priority': '0.4', 'changefreq': 'monthly'},
    {'path': '/privacy-policy', 'priority': '0.3', 'changefreq': 'yearly'},
    {'path': '/terms-of-service', 'priority': '0.3', 'changefreq': 'yearly'},
]

for p in static_pages:
    urls.append(f"""  <url>
    <loc>{base_url}{p['path']}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>{p['changefreq']}</changefreq>
    <priority>{p['priority']}</priority>
  </url>""")

# 2. Blog Articles
with open(articles_path, 'r', encoding='utf-8') as f:
    content = f.read()
    slugs = re.findall(r'slug:\s*["\']([^"\']+)["\']', content)
    for slug in sorted(set(slugs)):
        urls.append(f"""  <url>
    <loc>{base_url}/blog/{slug}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>""")

# 3. pSEO Calculator Pages
with open(pseo_path, 'r', encoding='utf-8') as f:
    content = f.read()
    slugs = re.findall(r'slug:\s*["\']([^"\']+)["\']', content)
    for slug in sorted(set(slugs)):
        urls.append(f"""  <url>
    <loc>{base_url}/calculator/{slug}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>""")

# Combine and write
sitemap_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{"".join(urls)}
</urlset>
"""

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(sitemap_content)

print(f"Sitemap regenerated with {len(urls)} URLs.")
