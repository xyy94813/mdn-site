// Copyright 2024 RoXoM(xyy94813@sina.com)
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

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import fm from "front-matter";

import {
  CONTENT_TRANSLATED_ROOT,
  getOriginDocPath,
} from "./utils/path.mjs";

import { getFileCommitHash } from './utils/git.mjs'

const updateL10n = async (inputTargetPath) => {
  const targetPath = path.resolve(process.cwd(), inputTargetPath);

  if (!targetPath.startsWith(CONTENT_TRANSLATED_ROOT))
    throw new Error("Wrong origin docs path");

  // 遍历读取目录或文件

  console.log("Start update l10n....");

  const originDocPath = getOriginDocPath(targetPath)
  const commitHash = await getFileCommitHash(originDocPath)
  fs.readFile(targetPath, "utf-8", async (err, data) => {
    const originDocContent = fm(data);
    const newContent = `---
title: ${originDocContent.attributes.title}
slug: ${originDocContent.attributes.slug}
l10n:
  sourceCommit: ${commitHash}
---

${originDocContent.body}
`;
    fs.writeFile(targetPath, newContent, (err) => {
      if (err) throw err;
      console.log(`updated l10n for "${targetPath}".`);
    });
  })
}

export default updateL10n
