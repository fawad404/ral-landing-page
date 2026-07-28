/**
 * One-time migration: update broken RSS source URLs to working alternatives.
 * Client approved Google News RSS as fallback (see Intelligence Hub.pdf, page 20-21).
 * Run: node scripts/fix-source-urls.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const URL_MAP = [
  {
    name: 'LeadingAge',
    old: 'https://leadingage.org/rss.xml',
    new: 'https://leadingage.org/feed/',
  },
  {
    name: 'ADHS Newsroom',
    old: 'https://www.azdhs.gov/rss.xml',
    new: 'https://news.google.com/rss/search?q=arizona+department+health+services+ADHS&hl=en-US&gl=US&ceid=US:en',
  },
  {
    name: 'AHCA/NCAL',
    old: 'https://www.ahcancal.org/rss.xml',
    new: 'https://news.google.com/rss/search?q=AHCA+NCAL+long+term+care+assisted+living&hl=en-US&gl=US&ceid=US:en',
  },
  {
    name: "McKnight's Senior Living",
    old: 'https://www.mcknightsseniorliving.com/feed/',
    new: 'https://news.google.com/rss/search?q=McKnights+senior+living&hl=en-US&gl=US&ceid=US:en',
  },
  {
    name: 'Modern Healthcare',
    old: 'https://www.modernhealthcare.com/rss.xml',
    new: 'https://news.google.com/rss/search?q=modern+healthcare+long+term+care+senior&hl=en-US&gl=US&ceid=US:en',
  },
  {
    name: 'AZ Central',
    old: 'https://www.azcentral.com/rss/',
    new: 'https://news.google.com/rss/search?q=arizona+senior+assisted+living+site:azcentral.com&hl=en-US&gl=US&ceid=US:en',
  },
  {
    name: 'Phoenix Business Journal',
    old: 'https://www.bizjournals.com/phoenix/rss.xml',
    new: 'https://news.google.com/rss/search?q=phoenix+arizona+senior+care+health+business&hl=en-US&gl=US&ceid=US:en',
  },
  {
    name: 'ABC15 Arizona',
    old: 'https://www.abc15.com/rss',
    new: 'https://news.google.com/rss/search?q=ABC15+arizona+assisted+living+senior+care&hl=en-US&gl=US&ceid=US:en',
  },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');

  const Source = mongoose.model(
    'Source',
    new mongoose.Schema({}, { strict: false }),
    'sources',
  );

  for (const entry of URL_MAP) {
    const result = await Source.updateOne(
      { rssUrl: entry.old },
      { $set: { rssUrl: entry.new } },
    );
    if (result.modifiedCount > 0) {
      console.log(`✓ ${entry.name} — updated`);
    } else if (result.matchedCount > 0) {
      console.log(`~ ${entry.name} — already up to date`);
    } else {
      console.log(`✗ ${entry.name} — not found in DB (may already be updated)`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
