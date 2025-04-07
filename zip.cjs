// zip.js
const fsPromises = require('fs').promises; // Async file operations
const fs = require('fs'); // For streams
const path = require('path');
const { exec } = require('child_process');
const archiver = require('archiver');

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
}

async function copyDir(src, dest) {
  await fsPromises.mkdir(dest, { recursive: true });
  const entries = await fsPromises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fsPromises.copyFile(srcPath, destPath);
    }
  }
}

async function createZip() {
  try {
    // Step 1: Build the project
    //console.log('Building project...');
    //await runCommand('npm run build');

    // Step 2: Process _worker.js with Wrangler
    console.log('Processing _worker.js...');
    const wranglerCmd = 'npx wrangler deploy .svelte-kit/cloudflare/_worker.js --name v2ray-sub2json-worker --compatibility-flag [nodejs_compat] --compatibility-date 2025-01-18 --dry-run --outdir=dist';
    await runCommand(wranglerCmd);

    // Step 3: Copy assets to dist/
    console.log('Copying assets to dist/...');
    const sourceDir = path.join('.svelte-kit', 'cloudflare');
    const distDir = 'dist';
    await copyDir(path.join(sourceDir, '_app'), path.join(distDir, '_app'));
    await fsPromises.copyFile(path.join(sourceDir, 'favicon.png'), path.join(distDir, 'favicon.png'));
    await fsPromises.copyFile(path.join(sourceDir, '_headers'), path.join(distDir, '_headers'));

    // Step 4: Create ZIP
    console.log('Creating ZIP file...');
    const version = require('./package.json').version || '0.0.1';
    const output = fs.createWriteStream(`v2ray-sub2json-worker-v${version}.zip`); // Use fs, not fsPromises
    const archive = archiver('zip', { zlib: { level: 9 } });

    await new Promise((resolve, reject) => {
      output.on('close', () => {
        console.log(`ZIP created: ${archive.pointer()} bytes`);
        resolve();
      });
      archive.on('error', reject);
      archive.pipe(output);
      archive.directory('dist/', false);
      //archive.file('README.md', { name: 'README.md' });
      archive.finalize();
    });

    console.log(`ZIP created: v${version}`);
  } catch (err) {
    console.error('Failed:', err);
    process.exit(1);
  }
}

async function generateReadme() {
  const readmeContent = `# V2Ray Sub2JSON Worker\n\nRun locally: \`npx serve -s _app\`\nDeploy: Upload to Cloudflare Pages dashboard`;
  await fsPromises.writeFile('README.md', readmeContent);
}

// Run the process
(async () => {
  //await generateReadme();
  await createZip();
})();