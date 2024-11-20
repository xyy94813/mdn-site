import path from "node:path";
import { exec } from "node:child_process";

import { CONTENT_REPO_ROOT } from './path.mjs'

export const getFileCommitHash = async (originDocPath) => {
  return new Promise((resolve, reject) => {
    const relativePath = path.relative(CONTENT_REPO_ROOT, originDocPath);
    exec(
      `git rev-list --max-count=1 HEAD -- ${relativePath}`,
      { cwd: CONTENT_REPO_ROOT },
      (err, stdout) => {
        if (err) return reject(err);
        resolve(stdout.replace(/\n$/, ""));
      }
    );
  });
};
