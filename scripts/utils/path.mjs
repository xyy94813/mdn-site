import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.resolve(fileURLToPath(import.meta.url), '..')

export const ROOT_PATH = path.resolve(__dirname, '..', '..')

export const CONTENT_REPO_ROOT = path.resolve(ROOT_PATH, 'content')

export const CONTENT_ROOT = path.resolve(CONTENT_REPO_ROOT, 'files', 'en-us')

export const TRANSLATED_DOCS_REPO_ROOT = path.resolve(ROOT_PATH, 'translated-content')

export const CONTENT_TRANSLATED_ROOT = path.resolve(TRANSLATED_DOCS_REPO_ROOT, 'files')

export const getDocRelativePath = (originDocPath) => path.relative(CONTENT_ROOT, originDocPath)

export const getTranslatedDocPath = (originDocPath, lang) => path.resolve(CONTENT_TRANSLATED_ROOT, lang, getDocRelativePath(originDocPath))
