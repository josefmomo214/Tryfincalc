const fs = require('fs');
const path = require('path');

const articlesPath = '/Users/youssefaaouam/Downloads/Loan & mortgage calculator/src/data/articles.ts';
const pseoPath = '/Users/youssefaaouam/Downloads/Loan & mortgage calculator/src/lib/pseo-data.ts';
const pagesDir = '/Users/youssefaaouam/Downloads/Loan & mortgage calculator/src/pages';

const allUrls = new Set();
const linkMap = {}; // from -> [to]

// 1. Get all published URLs
// From articles
const articlesContent = fs.readFileSync(articlesPath, 'utf8');
const slugs = articlesContent.match(/slug:\s*["']([^"']+)["']/g).map(s => s.match(/["']([^"']+)["']/)[1]);
slugs.forEach(slug => allUrls.add(`/blog/${slug}`));

// From pSEO
const pseoContent = fs.readFileSync(pseoPath, 'utf8');
const pseoSlugs = pseoContent.match(/slug:\s*["']([^"']+)["']/g).map(s => s.match(/["']([^"']+)["']/)[1]);
pseoSlugs.forEach(slug => allUrls.add(`/calculator/${slug}`));

// From static pages
const staticPages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx') && !f.startsWith('_') && !f.startsWith('['));
staticPages.forEach(f => {
  const name = f.replace('.tsx', '');
  if (name === 'index') allUrls.add('/');
  else allUrls.add(`/${name}`);
});

console.log('Total URLs found:', allUrls.size);

// 2. Extract links from each page
function extractLinks(content) {
  const links = [];
  const matches = content.matchAll(/href=["']([^"']+)["']/g);
  for (const match of matches) {
    let url = match[1];
    if (url.startsWith('https://tryfincalc.com')) {
      url = url.replace('https://tryfincalc.com', '');
    }
    if (url.startsWith('/') && !url.includes('.') && !url.startsWith('/api')) {
      // Normalize: remove trailing slash if any
      url = url.replace(/\/$/, '');
      if (url === '') url = '/';
      links.push(url);
    }
  }
  return links;
}

// Check articles
const articleBlocks = articlesContent.split(/{\s*title:/);
articleBlocks.shift(); // first part is preamble
articleBlocks.forEach((block, index) => {
  const slugMatch = block.match(/slug:\s*["']([^"']+)["']/);
  if (slugMatch) {
    const slug = `/blog/${slugMatch[1]}`;
    const links = extractLinks(block);
    linkMap[slug] = (linkMap[slug] || []).concat(links);
  }
});

// Check pSEO
const pseoBlocks = pseoContent.split(/{\s*slug:/);
pseoBlocks.shift();
pseoBlocks.forEach(block => {
  const slugMatch = block.match(/["']([^"']+)["']/);
  if (slugMatch) {
    const slug = `/calculator/${slugMatch[1]}`;
    const links = extractLinks(block);
    linkMap[slug] = (linkMap[slug] || []).concat(links);
  }
});

// Check static pages
staticPages.forEach(f => {
  const name = f.replace('.tsx', '');
  const slug = name === 'index' ? '/' : `/${name}`;
  const content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
  const links = extractLinks(content);
  linkMap[slug] = (linkMap[slug] || []).concat(links);
});

// 3. Analyze gaps
const incomingCounts = {};
allUrls.forEach(url => incomingCounts[url] = 0);

Object.entries(linkMap).forEach(([from, tos]) => {
  tos.forEach(to => {
    if (allUrls.has(to)) {
      incomingCounts[to]++;
    }
  });
});

console.log('--- ANALYSIS ---');
const underLinkedOutgoing = [];
const underLinkedIncoming = [];

allUrls.forEach(url => {
  const outgoing = (linkMap[url] || []).filter(to => allUrls.has(to)).length;
  const incoming = incomingCounts[url];
  
  if (outgoing < 2) underLinkedOutgoing.push({ url, outgoing });
  if (incoming < 1) underLinkedIncoming.push({ url, incoming });
});

console.log('Under-linked (Outgoing < 2):', underLinkedOutgoing.length);
underLinkedOutgoing.forEach(p => console.log(`  ${p.url} (${p.outgoing})`));

console.log('Under-linked (Incoming < 1):', underLinkedIncoming.length);
underLinkedIncoming.forEach(p => console.log(`  ${p.url} (${p.incoming})`));

console.log('--- TARGET PAGE CHECK ---');
const targets = ['/blog/400k-mortgage-monthly-payment', '/blog/fixed-vs-variable-mortgage', '/mortgage-calculator'];
targets.forEach(t => {
   console.log(`${t}: ${incomingCounts[t] || 0} incoming links`);
});
