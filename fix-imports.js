import fs from 'fs';
import path from 'path';

function fixImports(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const updatedContent = content.replace(/from '(\.\/.*?[^.js])';/g, "from '$1.js';");
      fs.writeFileSync(fullPath, updatedContent);
    }
  }
}

fixImports('./build');
