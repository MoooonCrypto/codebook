// ファイル拡張子と言語のマッピング
export const extensionToLanguageMap: { [key: string]: string } = {
  // JavaScript/TypeScript
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',

  // Python
  '.py': 'python',
  '.pyw': 'python',
  '.pyx': 'python',

  // Java
  '.java': 'java',
  '.class': 'java',
  '.jar': 'java',

  // C/C++
  '.c': 'c',
  '.cpp': 'c++',
  '.cxx': 'c++',
  '.cc': 'c++',
  '.h': 'c',
  '.hpp': 'c++',
  '.hxx': 'c++',

  // C#
  '.cs': 'c#',

  // Go
  '.go': 'go',

  // Rust
  '.rs': 'rust',

  // Swift
  '.swift': 'swift',

  // Kotlin
  '.kt': 'kotlin',
  '.kts': 'kotlin',

  // PHP
  '.php': 'php',
  '.phtml': 'php',
  '.php3': 'php',
  '.php4': 'php',
  '.php5': 'php',
  '.php7': 'php',

  // Ruby
  '.rb': 'ruby',
  '.rbw': 'ruby',

  // Dart
  '.dart': 'dart',

  // HTML/CSS
  '.html': 'html',
  '.htm': 'html',
  '.css': 'css',
  '.scss': 'css',
  '.sass': 'css',
  '.less': 'css',

  // SQL
  '.sql': 'sql',
  '.mysql': 'sql',
  '.pgsql': 'sql',

  // Shell
  '.sh': 'shell',
  '.bash': 'shell',
  '.zsh': 'shell',
  '.fish': 'shell',

  // Config/Data
  '.json': 'json',
  '.xml': 'xml',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.toml': 'toml',
  '.ini': 'ini',

  // Markdown
  '.md': 'markdown',
  '.markdown': 'markdown',

  // Docker
  'dockerfile': 'docker',
  '.dockerfile': 'docker',
};

// 言語名の正規化マッピング
export const languageNormalizationMap: { [key: string]: string } = {
  'js': 'javascript',
  'ts': 'typescript',
  'jsx': 'javascript',
  'tsx': 'typescript',
  'py': 'python',
  'rb': 'ruby',
  'kt': 'kotlin',
  'rs': 'rust',
  'go': 'go',
  'java': 'java',
  'c++': 'c++',
  'cpp': 'c++',
  'c': 'c',
  'cs': 'c#',
  'php': 'php',
  'swift': 'swift',
  'dart': 'dart',
  'html': 'html',
  'css': 'css',
  'sql': 'sql',
  'shell': 'shell',
  'bash': 'shell',
  'docker': 'docker',
  'dockerfile': 'docker',
};

/**
 * ファイル名から拡張子を取得
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) {
    // 拡張子がない場合、ファイル名全体をチェック（Dockerfileなど）
    const lowerFilename = filename.toLowerCase();
    if (lowerFilename === 'dockerfile') {
      return 'dockerfile';
    }
    return '';
  }
  return filename.substring(lastDot).toLowerCase();
}

/**
 * ファイル拡張子から言語を検出
 */
export function detectLanguageFromExtension(filename: string): string | null {
  const extension = getFileExtension(filename);

  if (!extension) {
    // 拡張子がない場合、ファイル名全体をチェック
    const lowerFilename = filename.toLowerCase();
    if (extensionToLanguageMap[lowerFilename]) {
      return extensionToLanguageMap[lowerFilename];
    }
    return null;
  }

  return extensionToLanguageMap[extension] || null;
}

/**
 * 言語名を正規化
 */
export function normalizeLanguageName(language: string): string {
  const normalized = language.toLowerCase().trim();
  return languageNormalizationMap[normalized] || normalized;
}

/**
 * 投稿データの言語情報を補完
 */
export function enrichSourceCodeWithLanguageInfo(sourceCode: {
  filename: string;
  language: string;
  code: string;
}) {
  const fileExtension = getFileExtension(sourceCode.filename);
  const detectedLanguage = detectLanguageFromExtension(sourceCode.filename);
  const normalizedLanguage = normalizeLanguageName(sourceCode.language);

  return {
    ...sourceCode,
    language: normalizedLanguage,
    fileExtension: fileExtension || undefined,
    detectedLanguage: detectedLanguage || undefined,
  };
}

/**
 * 言語でフィルタリングするための判定関数
 */
export function isPostMatchingLanguage(
  post: { sourceCode: { language: string; fileExtension?: string; detectedLanguage?: string } },
  targetLanguage: string
): boolean {
  const normalizedTarget = normalizeLanguageName(targetLanguage);
  const normalizedSourceLanguage = normalizeLanguageName(post.sourceCode.language);

  // 直接的な言語マッチ
  if (normalizedSourceLanguage === normalizedTarget) {
    return true;
  }

  // 検出された言語とのマッチ
  if (post.sourceCode.detectedLanguage) {
    const normalizedDetected = normalizeLanguageName(post.sourceCode.detectedLanguage);
    if (normalizedDetected === normalizedTarget) {
      return true;
    }
  }

  // 拡張子ベースのマッチ
  if (post.sourceCode.fileExtension) {
    const languageFromExtension = extensionToLanguageMap[post.sourceCode.fileExtension];
    if (languageFromExtension && normalizeLanguageName(languageFromExtension) === normalizedTarget) {
      return true;
    }
  }

  return false;
}