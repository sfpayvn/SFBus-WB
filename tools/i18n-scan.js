const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function walk(dir, exts) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (file === 'node_modules' || file === '.git') continue;
      results = results.concat(walk(full, exts));
    } else {
      if (exts.includes(path.extname(full))) results.push(full);
    }
  }
  return results;
}

function scanTs(file) {
  const src = fs.readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.ES2020, true);
  const literals = [];

  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      literals.push({ text: node.text, line: line + 1, col: character + 1 });
    }
    if (ts.isTemplateExpression(node)) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      literals.push({ text: node.getText(), line: line + 1, col: character + 1 });
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  if (literals.length) {
    return { file, literals };
  }
  return null;
}

function scanHtml(file) {
  const src = fs.readFileSync(file, 'utf8');
  const results = [];
  // Find attribute values
  const attrRegex = /(?:title|placeholder|alt|aria-label|label)=\"([^\"]+)\"/gi;
  let m;
  while ((m = attrRegex.exec(src)) !== null) {
    results.push({ type: 'attr', text: m[1] });
  }
  // Find text nodes (very naive): text between > and < that contains letters
  const textNodeRegex = />([^<>\n]*[A-Za-zÀ-ÖØ-öø-ÿ][^<>\n]*)</g;
  while ((m = textNodeRegex.exec(src)) !== null) {
    const t = m[1].trim();
    if (t && !/^{{.*}}$/.test(t)) results.push({ type: 'text', text: t });
  }
  if (results.length) return { file, results };
  return null;
}

function main() {
  const root = path.resolve(__dirname, '..');
  const tsFiles = walk(root, ['.ts']).filter(f => !f.includes('node_modules'));
  const htmlFiles = walk(root, ['.html']).filter(f => !f.includes('node_modules'));

  const tsFindings = [];
  for (const f of tsFiles) {
    const r = scanTs(f);
    if (r) tsFindings.push(r);
  }

  const htmlFindings = [];
  for (const f of htmlFiles) {
    const r = scanHtml(f);
    if (r) htmlFindings.push(r);
  }

  const out = { ts: tsFindings.length, html: htmlFindings.length, tsFindings, htmlFindings };
  const outFile = path.join(root, 'tools', 'i18n-scan-output.json');
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
  console.log('Scan complete. Output:', outFile);
}

main();
