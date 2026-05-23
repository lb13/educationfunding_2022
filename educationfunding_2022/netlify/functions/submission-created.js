// Netlify serverless function — fires automatically on every form submission.
// Composes a Hugo resource markdown file from the form data and opens a
// GitHub pull request so the site owner can review before publishing.
//
// Required environment variables (set in Netlify dashboard):
//   GITHUB_TOKEN        — Personal Access Token with Contents + Pull requests write scope
//   GITHUB_OWNER        — GitHub username/org (default: lb13)
//   GITHUB_REPO         — Repository name     (default: educationfunding_2022)
//   GITHUB_BASE_BRANCH  — Branch PRs target   (default: main)

const https = require('https');

const GITHUB_OWNER  = process.env.GITHUB_OWNER        || 'lb13';
const GITHUB_REPO   = process.env.GITHUB_REPO         || 'educationfunding_2022';
const BASE_BRANCH   = process.env.GITHUB_BASE_BRANCH  || 'main';

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function ghRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: 'api.github.com',
        path,
        method,
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'educationfunding-submission-bot',
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data ? JSON.parse(data) : {});
          } else {
            reject(new Error(`GitHub API ${res.statusCode} on ${method} ${path}: ${data}`));
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const payload = body.payload || {};

    // Only handle our specific form
    if (payload.form_name !== 'resource-submission') {
      return { statusCode: 200, body: 'ignored' };
    }

    // Honeypot — discard bot submissions
    if (payload.data && payload.data['bot-field']) {
      return { statusCode: 200, body: 'ignored' };
    }

    const data = payload.data || {};
    const title         = (data.title          || '').trim();
    const link          = (data.link           || '').trim();
    const description   = (data.description   || '').trim();
    const tagsRaw       = (data.tags           || '').trim();
    const submitterName = (data.submitter_name || '').trim();
    const submitterEmail= (data.submitter_email|| '').trim();

    if (!title || !link) {
      console.warn('[submission-created] missing required fields, skipping');
      return { statusCode: 200, body: 'missing required fields' };
    }

    const tagList   = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
    const today     = new Date().toISOString().slice(0, 10);
    const slug      = slugify(title);
    const newBranch = `submission/${slug}-${Date.now()}`;
    const filePath  = `educationfunding_2022/content/resources/${slug}.md`;

    const tagsYaml = tagList.length
      ? '[' + tagList.map(t => `"${t.replace(/"/g, '\\"')}"`).join(', ') + ']'
      : '[]';

    const markdown = [
      '---',
      `Tags: ${tagsYaml}`,
      `Title: "${title.replace(/"/g, '\\"')}"`,
      `Description: "${description.replace(/"/g, '\\"')}"`,
      `Link: ${link}`,
      `DateAdded: ${today}`,
      '---',
      '',
    ].join('\n');

    const contentBase64 = Buffer.from(markdown).toString('base64');

    // 1. Get the SHA of the base branch HEAD
    const ref = await ghRequest(
      'GET',
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${BASE_BRANCH}`
    );

    // 2. Create the submission branch
    await ghRequest(
      'POST',
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs`,
      { ref: `refs/heads/${newBranch}`, sha: ref.object.sha }
    );

    // 3. Create the markdown file on the new branch
    await ghRequest(
      'PUT',
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
      {
        message: `submission: add "${title}"`,
        content: contentBase64,
        branch: newBranch,
      }
    );

    // 4. Open a pull request
    const prBody = [
      '## Resource submission',
      '',
      `**Title:** ${title}`,
      `**URL:** ${link}`,
      description   ? `**Description:** ${description}` : null,
      tagList.length? `**Tags:** ${tagList.join(', ')}`  : null,
      '',
      '---',
      submitterName  ? `Submitted by: ${submitterName}`  : 'Submitted anonymously',
      submitterEmail ? `Contact: ${submitterEmail}`       : null,
      '',
      '_Review the file in the diff tab, then merge to publish.' +
      ' The site rebuilds automatically once merged._',
    ].filter(line => line !== null).join('\n');

    const pr = await ghRequest(
      'POST',
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`,
      {
        title: `Submission: ${title}`,
        body:  prBody,
        head:  newBranch,
        base:  BASE_BRANCH,
      }
    );

    console.log(`[submission-created] PR opened: ${pr.html_url}`);
    return { statusCode: 200, body: 'ok' };

  } catch (err) {
    console.error('[submission-created]', err);
    return { statusCode: 500, body: String(err) };
  }
};
