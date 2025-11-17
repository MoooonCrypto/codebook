'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CreatePost, Tag } from '@/types';
import { CodeEditor, CodeDisplay } from '@/app/components/CodeEditor';
import { MarkdownRenderer } from '@/app/components/MarkdownRenderer';
import { TagInput } from '@/app/components/TagInput';
import { ThemeAwareLogo } from '@/app/components/ThemeAwareLogo';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { detectLanguage } from '@/lib/languageDetection';
import { mockPosts } from '@/lib/mockData';
import { fetchGitHubFile, fetchGist } from '@/lib/github';

// 言語のプリセット
const LANGUAGES = [
  'typescript', 'javascript', 'python', 'html', 'css', 'json', 'bash', 'markdown'
];

// タグのプリセット（実際にはAPIから取得）
const PRESET_TAGS = [
  'react', 'nextjs', 'typescript', 'javascript', 'python', 'rust', 'go',
  'hooks', 'api', 'async', 'performance', 'css', 'grid', 'responsive',
  'concurrency', 'memory-safety', 'optimization', 'frontend', 'backend'
];

export default function CreatePost() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [importTab, setImportTab] = useState<'editor' | 'github'>('editor');
  const [githubUrl, setGithubUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');

  const [formData, setFormData] = useState<CreatePost>({
    title: '',
    description: '',
    content: '',
    sourceCode: {
      filename: '',
      language: 'typescript',
      code: ''
    },
    authorId: 'user-001', // 実際には認証から取得
    tags: [],
    isPublished: false
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }
    if (!formData.description.trim()) {
      newErrors.description = '説明文は必須です';
    }
    if (!formData.sourceCode.code.trim()) {
      newErrors.code = 'ソースコードは必須です';
    }
    if (!formData.sourceCode.filename.trim()) {
      newErrors.filename = 'ファイル名は必須です';
    }
    if (selectedTags.length === 0) {
      newErrors.tags = '少なくとも1つのタグを選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (published: boolean) => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 実際にはAPIを呼び出す
      const postData = { ...formData, tags: selectedTags, isPublished: published };
      console.log('投稿データ:', postData);

      // 成功後リダイレクト
      router.push('/');
    } catch (error) {
      console.error('投稿エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  // GitHubからインポート
  const handleGitHubImport = async () => {
    if (!githubUrl.trim()) {
      setImportError('GitHub URLを入力してください');
      return;
    }

    setIsImporting(true);
    setImportError('');

    try {
      let result;

      // Gist URLの場合
      if (githubUrl.includes('gist.github.com')) {
        const gistId = githubUrl.split('/').pop() || '';
        result = await fetchGist(gistId);
      }
      // 通常のGitHubファイルURLの場合
      else {
        result = await fetchGitHubFile(githubUrl);
      }

      // フォームデータに反映
      setFormData(prev => ({
        ...prev,
        sourceCode: {
          filename: result.filename,
          language: result.language,
          code: result.content,
        },
        title: prev.title || result.filename, // タイトルが空なら自動設定
      }));

      // エディタタブに切り替え
      setImportTab('editor');
      setGithubUrl('');
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'インポートに失敗しました');
    } finally {
      setIsImporting(false);
    }
  };

  // コード変更時に言語を自動識別
  const handleCodeChange = (newCode: string) => {
    setFormData(prev => {
      const detectedLanguage = detectLanguage(prev.sourceCode.filename, newCode);
      return {
        ...prev,
        sourceCode: {
          ...prev.sourceCode,
          code: newCode,
          language: detectedLanguage
        }
      };
    });
  };

  // ファイル名変更時に言語を自動識別
  const handleFilenameChange = (newFilename: string) => {
    setFormData(prev => {
      const detectedLanguage = detectLanguage(newFilename, prev.sourceCode.code);
      return {
        ...prev,
        sourceCode: {
          ...prev.sourceCode,
          filename: newFilename,
          language: detectedLanguage
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-11 sm:h-16">
            {/* 左側: ロゴ + タイトル */}
            <div className="flex items-center flex-shrink-0 min-w-0 mr-2">
              <Link href="/" className="flex items-center mr-2 sm:mr-4">
                <div className="w-6 h-6 sm:w-10 sm:h-10 mr-1 sm:mr-3 flex-shrink-0">
                  <ThemeAwareLogo />
                </div>
                <span className="font-bold text-sm sm:text-xl text-gray-900 dark:text-white truncate">CodeBook</span>
              </Link>
              <h1 className="hidden sm:block text-base sm:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                新しい投稿
              </h1>
            </div>

            {/* 右側: アクションボタン */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* テーマ切り替えボタン */}
              <div className="flex-shrink-0">
                <ThemeToggle />
              </div>

              {/* プレビューボタン */}
              <button
                type="button"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm border rounded-md transition-colors whitespace-nowrap ${
                  isPreviewMode
                    ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {isPreviewMode ? '編集' : 'プレビュー'}
              </button>

              {/* 下書き保存ボタン - PCのみ */}
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="hidden sm:block px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                下書き
              </button>

              {/* 公開ボタン */}
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-md transition-colors disabled:opacity-50 whitespace-nowrap font-medium"
              >
                公開
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      {isPreviewMode ? (
        /* プレビューモード: 2カラムレイアウト */
        <div className="flex h-[calc(100vh-4rem)]">
          {/* 左側: コードプレビュー */}
          <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
            <CodeDisplay
              code={formData.sourceCode.code}
              language={formData.sourceCode.language}
              filename={formData.sourceCode.filename}
              className="h-full"
            />
          </div>

          {/* 右側: 投稿情報プレビュー */}
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 overflow-y-auto">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {formData.title || 'タイトルを入力してください'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {formData.description || '説明文を入力してください'}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedTags.length > 0 ? (
                selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-400 text-sm">タグを選択してください</span>
              )}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">詳細説明</h3>
              <MarkdownRenderer content={formData.content} />
            </div>
          </div>
        </div>
      ) : (
        /* 編集モード: 1カラムレイアウト */
        <div className="max-w-4xl mx-auto p-8 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            {/* タイトル */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                タイトル *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: React カスタムフック useLocalStorage"
              />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>

            {/* 説明文 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                説明文 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="コードの概要や特徴を簡潔に説明してください"
              />
              {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
            </div>

            {/* タグ選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                タグ * (最大5つまで)
              </label>
              <TagInput
                posts={mockPosts}
                value={selectedTags}
                onChange={setSelectedTags}
                maxTags={5}
                placeholder="タグを入力してください..."
              />
              {errors.tags && <p className="mt-1 text-xs text-red-600">{errors.tags}</p>}
            </div>

            {/* ソースファイル設定 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                ソースファイル設定
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ファイル名 *
                  </label>
                  <input
                    type="text"
                    value={formData.sourceCode.filename}
                    onChange={(e) => handleFilenameChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: useLocalStorage.ts"
                  />
                  {errors.filename && <p className="mt-1 text-xs text-red-600">{errors.filename}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    言語 <span className="text-xs text-green-600 dark:text-green-400">(自動識別)</span>
                  </label>
                  <select
                    value={formData.sourceCode.language}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      sourceCode: { ...prev.sourceCode, language: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    ファイル名や内容から自動で識別されます
                  </p>
                </div>
              </div>

              {/* ファイルアップロード・コード入力エリア */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ソースコード *
                </label>

                {/* タブ切り替え */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setImportTab('editor')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      importTab === 'editor'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    コード入力 / ファイルアップロード
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportTab('github')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      importTab === 'github'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    GitHubからインポート
                  </button>
                </div>

                {importTab === 'github' ? (
                  /* GitHubインポート */
                  <div className="mb-4 p-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-start gap-3">
                      <svg className="w-8 h-8 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                          GitHubリポジトリ または Gist から取得
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                          GitHub上の個別ファイルのURLまたはGist URLを入力してください
                        </p>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="例: https://github.com/user/repo/blob/main/src/App.tsx"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleGitHubImport}
                              disabled={isImporting || !githubUrl.trim()}
                              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isImporting ? 'インポート中...' : 'インポート'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setGithubUrl('');
                                setImportError('');
                              }}
                              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              クリア
                            </button>
                          </div>
                          {importError && (
                            <p className="text-xs text-red-600 dark:text-red-400">{importError}</p>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            <p className="font-medium mb-1">対応形式:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>GitHubファイル: https://github.com/user/repo/blob/branch/path/file.ts</li>
                              <li>Gist: https://gist.github.com/user/gist-id</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ファイルアップロード */
                  <div className="mb-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="mt-2">
                      <label className="cursor-pointer">
                        <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          ファイルを選択してアップロード
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".js,.ts,.jsx,.tsx,.py,.html,.css,.json,.md,.txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const content = event.target?.result as string;
                                const detectedLanguage = detectLanguage(file.name, content);
                                setFormData(prev => ({
                                  ...prev,
                                  sourceCode: {
                                    ...prev.sourceCode,
                                    filename: file.name,
                                    language: detectedLanguage,
                                    code: content
                                  }
                                }));
                              };
                              reader.readAsText(file);
                            }
                          }}
                        />
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        または下のテキストエリアに直接入力
                      </p>
                    </div>
                  </div>
                  </div>
                )}

                {/* コード入力エリア */}
                <textarea
                  value={formData.sourceCode.code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-3 bg-gray-900 text-gray-100 font-mono text-sm
                           border border-gray-600 rounded-lg
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
                           placeholder-gray-500"
                  placeholder="ここにコードを入力してください..."
                />
                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
              </div>
            </div>

            {/* 詳細説明 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                詳細説明 (マークダウン対応)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="コードの詳細な説明、使用例、注意点など（マークダウン記法対応）"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}