import { promises as fs } from 'fs';
import path from 'path';

const destPath = path.join(process.cwd(), 'dist', 'cjs', 'package.json');

const packageContent = {
  type: 'commonjs',
};

async function createPackageJson() {
  try {
    await fs.writeFile(destPath, JSON.stringify(packageContent, null, 2));
  } catch (error) {
    console.error('Error generating dist/cjs/package.json:', error);
  }
}

createPackageJson();
