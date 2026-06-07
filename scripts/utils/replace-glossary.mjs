// Copyright 2026 RoXoM(xyy94813@sina.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import fs from 'node:fs/promises'
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import { map } from "unist-util-map";
import { visit } from "unist-util-visit";
import path from 'node:path';

const glossaryRepo = new Map();

const glossaryMdProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .freeze();

const __fileName = path.resolve(new URL(import.meta.url).pathname);

const initializeGlossary = async (targetLang = 'zh-cn') => {
  if (glossaryRepo.has(targetLang)) {
    return glossaryRepo.get(targetLang);
  }

  const glossaryFilePath = process.env.GLOSSARY_FILE_PATH
  || path.resolve(__fileName, `../../../translated-content/docs/${targetLang}/glossary.md`);
  const glossaryMD = await fs.readFile(glossaryFilePath, 'utf-8')
  const glossaryAST = glossaryMdProcessor.parse(glossaryMD)
  // Process the AST to extract glossary terms and definitions
  // This is a simplified example - you would need to implement the actual parsing logic
  const glossary = new Map();

  // TODO: configure lang glossary, and support more language
  if (targetLang === 'zh-cn') {
    glossary.set('Value', '值')
  }

  visit(glossaryAST, 'table', (node) => {
    node
      .children.slice(1) // remove the header row
      .forEach(row => {
        let key;
        // first column is the term, second column is the glossary definition
        visit(row.children[0], 'text', (termNode) => {
          key = termNode.value;
        })
        visit(row.children[1], 'text', (termNode) => {
          glossary.set(key, termNode.value);
        })
      })
  })

  glossaryRepo.set(targetLang, glossary);

  return glossary
}

const commonMdProcessor = unified()
  .use(remarkParse)
  .use(remarkStringify)
  .freeze();

export async function replaceGlossaryTerms(mdContent, targetLang = 'zh-cn') {
  const glossary = await initializeGlossary(targetLang);

  const fileAST = commonMdProcessor.parse(mdContent);

  return commonMdProcessor.stringify(map(fileAST, (node) => {
    if (node.type === 'heading') {
      const term = node.children[0].value;
      if (glossary.has(term)) {
        node.children[0].value = glossary.get(term) || term;
      }
    }
    return node;
  }));
}

export default replaceGlossaryTerms;
