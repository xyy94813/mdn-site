import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import fm from "front-matter";

import {
  CONTENT_ROOT,
  getDocRelativePath,
  getTranslatedDocPath,
} from "./utils/path.mjs";

import { getFileCommitHash } from './utils/git.mjs'

const inputTargetPath = process.argv[2];
const targetPath = path.resolve(process.cwd(), inputTargetPath);

if (!targetPath.startsWith(CONTENT_ROOT))
  throw new Error("Wrong origin docs path");

const targetLang = process.argv[3]|| "zh-cn";

const copyDoc = (originDocPath) => {
  const translatedDocsPath = getTranslatedDocPath(originDocPath, targetLang);

  // translated file exist, need check commit id
  if (fs.existsSync(translatedDocsPath)) {
    fs.readFile(translatedDocsPath, "utf-8", async (err, data) => {
      if (err) throw err;
      const translatedDocsContent = fm(data);
      const sourceCommit = translatedDocsContent.attributes.l10n?.sourceCommit;
      // file exist，but no source commit
      if (!sourceCommit) {
        // need manual check
        console.log(
          `"${getDocRelativePath(
            originDocPath
          )}" already has a translation file but no source commit, need manual check.`
        );
        return;
      }
      const curL10n = await getFileCommitHash(originDocPath);
      // no changed
      if (sourceCommit === curL10n) {
        console.log(
          `"${getDocRelativePath(
            originDocPath
          )}" already has a translation file and no changed.`
        );
      } else {
        // has new changed
        console.log(
          `"${getDocRelativePath(
            originDocPath
          )}" already has a translation file and has changed, need manual check.`
        );
        // copy?
      }
    });
    return;
  }
  // fs.cpSync(originDocPath, translatedDocsPath)
  fs.readFile(originDocPath, "utf-8", async (err, data) => {
    const curL10n = await getFileCommitHash(originDocPath);
    const originDocContent = fm(data);
    const translatedContent = `---
title: ${originDocContent.attributes.title}
slug: ${originDocContent.attributes.slug}
l10n:
  sourceCommit: ${curL10n}
---

${originDocContent.body}
`;
    fs.writeFile(translatedDocsPath, translatedContent, (err) => {
      if (err) throw err;
      console.log(`"${getDocRelativePath(originDocPath)}" has been copied to "translated/content/${targetLang}".`);
    });
  });
};

const copyDir = (originDocDirPath) => {
  fs.readdir(originDocDirPath, {
    encoding: 'utf8',
    recursive: true,
    withFileTypes: true,
  }, (err, files) => {
    if (err) throw err
    files
      .filter(f => f.isFile())
      .forEach(f => {
        copyDoc(path.resolve(f.parentPath || f.path, f.name))
      })
  })
};

const copy = (targetPath) => {
  fs.stat(targetPath, (err, data) => {
    if (err) throw err;
    if (data.isDirectory()) {
      copyDir(targetPath);
    } else {
      copyDoc(targetPath);
    }
  });
};
// 遍历读取目录或文件

console.log("Start copy docs....");

copy(targetPath);