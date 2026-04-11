import fs from 'fs';
import path from 'path';

const srcPrefix = '/Users/youssefaaouam/Downloads/Loan & mortgage calculator/src';
const pagesDir = path.join(srcPrefix, 'pages');
const articlesPath = path.join(srcPrefix, 'data/articles.ts');

function extractFromTsx(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const titleMatch = content.match(/title="([^"]+)"/);
    const descMatch = content.match(/description="([^"]+)"/);
    
    return {
        title: titleMatch ? titleMatch[1] : 'N/A',
        description: descMatch ? descMatch[1] : 'N/A'
    };
}

const audit = [];

// Static Pages
const staticPages = [
    'index.tsx', 'about.tsx', 'affordability-calculator.tsx', 'amortization-schedule.tsx',
    'contact.tsx', 'faq.tsx', 'loan-calculator.tsx', 'monthly-payment-calculator.tsx',
    'mortgage-calculator.tsx', 'privacy-policy.tsx', 'refinancing-calculator.tsx',
    'rent-vs-buy.tsx', 'search.tsx', 'terms-of-service.tsx', 'total-interest-calculator.tsx'
];

staticPages.forEach(file => {
    const filePath = path.join(pagesDir, file);
    if (fs.existsSync(filePath)) {
        const { title, description } = extractFromTsx(filePath);
        const route = file === 'index.tsx' ? '/' : `/${file.replace('.tsx', '')}`;
        audit.push({
            route,
            title,
            description,
            titleCount: title.length + 14, // Plus " | TryFinCalc"
            descCount: description.length
        });
    }
});

// Blog Index
const blogIndex = path.join(pagesDir, 'blog/index.tsx');
if (fs.existsSync(blogIndex)) {
    const { title, description } = extractFromTsx(blogIndex);
    audit.push({
        route: '/blog',
        title,
        description,
        titleCount: title.length + 14,
        descCount: description.length
    });
}

// Blog Posts (from articles.ts)
// This is a bit harder to parse with regex if it's complex, but let's try a simple one
const articlesContent = fs.readFileSync(articlesPath, 'utf-8');
// We need to parse the array. Since it's TS, I'll just look for blocks.
// Better way: I'll just use the view_file output I already have for some, 
// but I'll try a rough regex search for all titles/slugs/seoTitle/seoDescription/excerpt

const articleRegex = /\{\s*title:\s*"([^"]+)"[\s\S]*?excerpt:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"(?:[\s\S]*?seoTitle:\s*"([^"]+)")?(?:[\s\S]*?seoDescription:\s*"([^"]+)")?/g;

let match;
while ((match = articleRegex.exec(articlesContent)) !== null) {
    const title = match[4] || match[1];
    const description = match[5] || match[2];
    const slug = match[3];
    audit.push({
        route: `/blog/${slug}`,
        title,
        description,
        titleCount: title.length + 14,
        descCount: description.length
    });
}

console.log(JSON.stringify(audit, null, 2));
