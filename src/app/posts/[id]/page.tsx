'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Post, User } from '@/types';
import { fetchPostById, fetchUserById } from '@/lib/api';
import { formatRelativeDate } from '@/lib/utils';
import { ThemeToggle } from '../../components/ThemeToggle';
import { ThemeAwareLogo } from '../../components/ThemeAwareLogo';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// アイコンコンポーネント
const HeartIcon = ({ size = 16, filled = false }: { size?: number; filled?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const BookmarkIcon = ({ size = 16, filled = false }: { size?: number; filled?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);


const FileIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
  </svg>
);

const ChevronLeftIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6"></path>
  </svg>
);

const ChevronRightIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6"></path>
  </svg>
);

const CopyIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const FolderIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const SearchIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="M21 21l-4.35-4.35"></path>
  </svg>
);

const GitBranchIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="6" y1="3" x2="6" y2="15"></line>
    <circle cx="18" cy="6" r="3"></circle>
    <circle cx="6" cy="18" r="3"></circle>
    <path d="M18 9a9 9 0 0 1-9 9"></path>
  </svg>
);

const SettingsIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFileList, setShowFileList] = useState(false);
  const [selectedFile, setSelectedFile] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [codeWidth, setCodeWidth] = useState(60);
  const [isResizing, setIsResizing] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showDescriptionPanel, setShowDescriptionPanel] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // 複数ファイル対応のためのサンプルデータ構造
  const mockFiles = post ? [
    {
      name: post.sourceCode.filename,
      language: post.sourceCode.language,
      code: post.sourceCode.code,
      type: 'file' as const
    },
    {
      name: 'utils.py',
      language: 'python',
      code: `# Utility functions for data processing and API handling
import json
import re
from typing import List, Dict, Optional, Union
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataProcessor:
    """A comprehensive data processing utility class."""

    def __init__(self, config: Dict[str, any] = None):
        self.config = config or {}
        self.cache = {}
        logger.info("DataProcessor initialized")

    def process_json_data(self, data: Union[str, Dict]) -> Dict:
        """
        Process JSON data with validation and normalization.

        Args:
            data: JSON string or dictionary

        Returns:
            Processed and validated dictionary
        """
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON: {e}")
                return {}

        # Normalize data structure
        normalized = self._normalize_keys(data)

        # Apply validation rules
        validated = self._validate_data(normalized)

        return validated

    def _normalize_keys(self, data: Dict) -> Dict:
        """Normalize dictionary keys to snake_case."""
        normalized = {}
        for key, value in data.items():
            # Convert camelCase to snake_case
            snake_key = re.sub(r'(?<!^)(?=[A-Z])', '_', key).lower()

            if isinstance(value, dict):
                normalized[snake_key] = self._normalize_keys(value)
            elif isinstance(value, list):
                normalized[snake_key] = [
                    self._normalize_keys(item) if isinstance(item, dict) else item
                    for item in value
                ]
            else:
                normalized[snake_key] = value

        return normalized

    def _validate_data(self, data: Dict) -> Dict:
        """Apply validation rules to data."""
        # Remove None values
        clean_data = {k: v for k, v in data.items() if v is not None}

        # Validate required fields based on config
        required_fields = self.config.get('required_fields', [])
        for field in required_fields:
            if field not in clean_data:
                logger.warning(f"Missing required field: {field}")

        return clean_data

    def format_timestamp(self, timestamp: Union[str, datetime]) -> str:
        """Format timestamp to ISO format."""
        if isinstance(timestamp, str):
            try:
                timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            except ValueError:
                logger.error(f"Invalid timestamp format: {timestamp}")
                return ""

        return timestamp.isoformat()

    def calculate_metrics(self, data_list: List[Dict]) -> Dict:
        """Calculate various metrics from data list."""
        if not data_list:
            return {}

        metrics = {
            'total_count': len(data_list),
            'unique_values': {},
            'averages': {},
            'date_range': {}
        }

        # Calculate unique values for categorical fields
        categorical_fields = ['category', 'type', 'status']
        for field in categorical_fields:
            values = [item.get(field) for item in data_list if item.get(field)]
            metrics['unique_values'][field] = list(set(values))

        # Calculate averages for numeric fields
        numeric_fields = ['score', 'rating', 'count']
        for field in numeric_fields:
            values = [item.get(field) for item in data_list if isinstance(item.get(field), (int, float))]
            if values:
                metrics['averages'][field] = sum(values) / len(values)

        # Calculate date range
        date_fields = ['created_at', 'updated_at']
        for field in date_fields:
            dates = [item.get(field) for item in data_list if item.get(field)]
            if dates:
                sorted_dates = sorted(dates)
                metrics['date_range'][field] = {
                    'earliest': sorted_dates[0],
                    'latest': sorted_dates[-1]
                }

        return metrics

def helper_function(data: any, processor: DataProcessor = None) -> str:
    """Generic helper function for data processing."""
    if processor is None:
        processor = DataProcessor()

    if isinstance(data, dict):
        processed = processor.process_json_data(data)
        return f"Processed {len(processed)} fields"
    elif isinstance(data, list):
        metrics = processor.calculate_metrics(data)
        return f"Calculated metrics for {metrics.get('total_count', 0)} items"
    else:
        return f"Processed data of type: {type(data).__name__}"

def another_utility(config: Dict = None) -> bool:
    """Another utility function with extended functionality."""
    default_config = {
        'timeout': 30,
        'retries': 3,
        'cache_enabled': True
    }

    if config:
        default_config.update(config)

    try:
        # Simulate some processing
        processor = DataProcessor(default_config)
        logger.info("Utility function executed successfully")
        return True
    except Exception as e:
        logger.error(f"Utility function failed: {e}")
        return False

# Advanced string processing utilities
def clean_text(text: str) -> str:
    """Clean and normalize text data."""
    if not isinstance(text, str):
        return ""

    # Remove extra whitespace
    cleaned = re.sub(r'\s+', ' ', text.strip())

    # Remove special characters but keep basic punctuation
    cleaned = re.sub(r'[^\w\s\.\,\!\?\-]', '', cleaned)

    return cleaned

def extract_emails(text: str) -> List[str]:
    """Extract email addresses from text."""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    return re.findall(email_pattern, text)

def format_file_size(size_bytes: int) -> str:
    """Format file size in human readable format."""
    if size_bytes == 0:
        return "0B"

    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0

    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024
        i += 1

    return f"{size_bytes:.1f}{size_names[i]}"`,
      type: 'file' as const
    },
    {
      name: 'api_client.ts',
      language: 'typescript',
      code: `/**
 * Comprehensive API client for handling HTTP requests
 * with proper error handling, caching, and retry logic
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  cacheEnabled?: boolean;
  authToken?: string;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  expiry: number;
}

interface RequestOptions extends AxiosRequestConfig {
  cache?: boolean;
  cacheTTL?: number;
  retries?: number;
}

class ApiClient {
  private client: AxiosInstance;
  private cache: Map<string, CacheEntry> = new Map();
  private config: Required<ApiConfig>;

  constructor(config: ApiConfig) {
    this.config = {
      timeout: 10000,
      retries: 3,
      cacheEnabled: true,
      authToken: '',
      ...config
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.authToken && {
          'Authorization': \`Bearer \${this.config.authToken}\`
        })
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(\`Making request to: \${config.url}\`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(\`Response received from: \${response.config.url}\`);
        return response;
      },
      (error) => {
        console.error('Response error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Server Error';
      return new Error(\`HTTP \${error.response.status}: \${message}\`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network Error: No response received');
    } else {
      // Something else happened
      return new Error(\`Request Error: \${error.message}\`);
    }
  }

  private getCacheKey(url: string, params?: any): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return \`\${url}|\${paramsStr}\`;
  }

  private isValidCacheEntry(entry: CacheEntry): boolean {
    return Date.now() < entry.expiry;
  }

  private async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    retries: number = this.config.retries
  ): Promise<AxiosResponse<T>> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0) {
        console.log(\`Retrying request. Attempts remaining: \${retries - 1}\`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.retryRequest(requestFn, retries - 1);
      }
      throw error;
    }
  }

  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const cacheKey = this.getCacheKey(url, options.params);

    // Check cache if enabled
    if (this.config.cacheEnabled && options.cache !== false) {
      const cached = this.cache.get(cacheKey);
      if (cached && this.isValidCacheEntry(cached)) {
        console.log('Returning cached data for:', url);
        return cached.data;
      }
    }

    const response = await this.retryRequest(
      () => this.client.get<T>(url, options),
      options.retries
    );

    // Cache the response if enabled
    if (this.config.cacheEnabled && options.cache !== false) {
      const ttl = options.cacheTTL || 300000; // 5 minutes default
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
        expiry: Date.now() + ttl
      });
    }

    return response.data;
  }

  async post<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const response = await this.retryRequest(
      () => this.client.post<T>(url, data, options),
      options.retries
    );
    return response.data;
  }

  async put<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const response = await this.retryRequest(
      () => this.client.put<T>(url, data, options),
      options.retries
    );
    return response.data;
  }

  async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const response = await this.retryRequest(
      () => this.client.delete<T>(url, options),
      options.retries
    );
    return response.data;
  }

  // Utility methods
  clearCache(): void {
    this.cache.clear();
    console.log('Cache cleared');
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  updateAuthToken(token: string): void {
    this.config.authToken = token;
    this.client.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
    console.log('Auth token updated');
  }

  // Batch requests
  async batchGet<T>(urls: string[], options: RequestOptions = {}): Promise<T[]> {
    const requests = urls.map(url => this.get<T>(url, options));
    return Promise.all(requests);
  }

  // Upload file
  async uploadFile(url: string, file: File, options: RequestOptions = {}): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const uploadOptions = {
      ...options,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options.headers
      }
    };

    return this.post(url, formData, uploadOptions);
  }
}

// Export default instance
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  retries: 3,
  cacheEnabled: true
});

export default ApiClient;`,
      type: 'file' as const
    }
  ] : [];

  useEffect(() => {
    const loadPostData = async () => {
      try {
        const resolvedParams = await params;
        const postData = await fetchPostById(resolvedParams.id);
        if (!postData) {
          notFound();
          return;
        }

        const userData = await fetchUserById(postData.authorId);
        setPost(postData);
        setAuthor(userData || null);
      } catch (error) {
        console.error('Failed to load post data:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadPostData();
  }, [params]);

  // ダークモード検出
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // ダークモード変更を監視
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // codeWidthをCSSカスタムプロパティとして設定
  useEffect(() => {
    document.documentElement.style.setProperty('--code-width', `${codeWidth}%`);
  }, [codeWidth]);

  // リサイズ機能
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const containerRect = document.querySelector('.main-content')?.getBoundingClientRect();
      if (!containerRect) return;

      const newCodeWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      const clampedWidth = Math.max(20, Math.min(80, newCodeWidth));
      setCodeWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleCopyCode = async () => {
    const currentFile = mockFiles[selectedFile];
    if (currentFile?.code) {
      try {
        await navigator.clipboard.writeText(currentFile.code);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  if (!post || !author) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-11 sm:h-16">
            {/* 左側: ロゴ */}
            <Link href="/" className="flex items-center flex-shrink-0 min-w-0 mr-2">
              <div className="w-6 h-6 sm:w-10 sm:h-10 mr-1 sm:mr-3 flex-shrink-0">
                <ThemeAwareLogo />
              </div>
              <span className="font-bold text-sm sm:text-xl text-gray-900 dark:text-white truncate">CodeBook</span>
            </Link>

            {/* 右側: ボタン群 */}
            <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
              {/* 検索ボタン */}
              <Link
                href="/search"
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                aria-label="検索"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>

              {/* テーマ切り替えボタン */}
              <div className="flex-shrink-0">
                <ThemeToggle />
              </div>

              {/* プロフィール - PCのみ */}
              <button className="hidden sm:flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="text-sm font-medium">プロフィール</span>
              </button>

              {/* 投稿ボタン */}
              <Link
                href="/posts/create"
                className="bg-gray-700 dark:bg-gray-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors whitespace-nowrap flex-shrink-0"
              >
                投稿
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* タイトルエリア */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* タイトルと設定タグ */}
          <div className="mb-3">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 投稿者プロフ情報とアクション */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Image
                src={author.avatar}
                alt={author.displayName}
                width={32}
                height={32}
                className="rounded-full flex-shrink-0"
                unoptimized
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {author.displayName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">@{author.username}</div>
              </div>
            </div>

            {/* いいね・ブックマーク */}
            <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                    isLiked
                      ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <HeartIcon size={14} filled={isLiked} />
                  <span>{post.likes}</span>
                </button>
                <button
                  className={`p-1 rounded transition-colors ${
                    isBookmarked
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <BookmarkIcon size={14} filled={isBookmarked} />
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex overflow-hidden relative main-content" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {/* VSCode風左サイドバー - PC表示のみ */}
        <div className="hidden md:flex w-12 bg-gray-800 dark:bg-gray-950 border-r border-white/20 dark:border-gray-600 flex-col items-center py-2 space-y-1 flex-shrink-0">
          <button
            className={`p-2 rounded hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors ${
              activeMenu === 'files' ? 'bg-gray-700 dark:bg-gray-800 text-white' : 'text-gray-400 dark:text-gray-500'
            }`}
            onClick={() => {
              setActiveMenu(activeMenu === 'files' ? null : 'files');
              setShowFileList(activeMenu !== 'files');
            }}
            title="ファイル一覧"
          >
            <FolderIcon size={16} />
          </button>
          <button
            className={`p-2 rounded hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors ${
              activeMenu === 'search' ? 'bg-gray-700 dark:bg-gray-800 text-white' : 'text-gray-400 dark:text-gray-500'
            }`}
            onClick={() => setActiveMenu(activeMenu === 'search' ? null : 'search')}
            title="検索"
          >
            <SearchIcon size={16} />
          </button>
          <button
            className={`p-2 rounded hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors ${
              activeMenu === 'git' ? 'bg-gray-700 dark:bg-gray-800 text-white' : 'text-gray-400 dark:text-gray-500'
            }`}
            onClick={() => setActiveMenu(activeMenu === 'git' ? null : 'git')}
            title="Git"
          >
            <GitBranchIcon size={16} />
          </button>
          <div className="flex-1"></div>
          <button
            className={`p-2 rounded hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors ${
              activeMenu === 'settings' ? 'bg-gray-700 dark:bg-gray-800 text-white' : 'text-gray-400 dark:text-gray-500'
            }`}
            onClick={() => setActiveMenu(activeMenu === 'settings' ? null : 'settings')}
            title="設定"
          >
            <SettingsIcon size={16} />
          </button>
        </div>

        {/* ファイル一覧トグルボタン - モバイルのみ */}
        <button
          className="md:hidden fixed top-14 left-2 z-50 bg-gray-800 dark:bg-gray-900 text-white p-2 rounded-lg shadow-lg"
          onClick={() => {
            setActiveMenu(activeMenu === 'files' ? null : 'files');
            setShowFileList(activeMenu !== 'files');
          }}
          aria-label="ファイル一覧"
        >
          <FolderIcon size={16} />
        </button>

        {/* 説明パネルトグルボタン - モバイルのみ */}
        <button
          className="md:hidden fixed top-14 right-2 z-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          onClick={() => setShowDescriptionPanel(!showDescriptionPanel)}
          aria-label="説明パネル"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>

        {/* ソースコード表示エリア */}
        <div className="flex-1 flex">
          <div
            className={`code-display-area bg-[#1e1e1e] flex flex-col overflow-hidden relative ${showDescriptionPanel ? 'hidden' : ''}`}
            style={{
              minHeight: '500px',
              width: showDescriptionPanel ? '0' : '100%'
            }}
          >
            {/* ファイル一覧オーバーレイ */}
            {showFileList && activeMenu === 'files' && (
              <div className="absolute top-0 left-0 bottom-0 w-64 bg-gray-800 dark:bg-gray-900 border-r border-white/20 dark:border-gray-600 z-10 shadow-lg">
                <div className="flex items-center justify-between p-3 border-b border-white/10 dark:border-gray-600 bg-gray-900 dark:bg-gray-950">
                  <span className="text-sm font-medium text-gray-200 dark:text-gray-300">ソースファイル</span>
                  <button
                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-200 dark:hover:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 rounded transition-colors"
                    onClick={() => {
                      setShowFileList(false);
                      setActiveMenu(null);
                    }}
                  >
                    <ChevronLeftIcon size={14} />
                  </button>
                </div>
                <div className="p-2 space-y-1">
                  {mockFiles.map((file, index) => (
                    <button
                      key={index}
                      className={`w-full flex items-center space-x-2 px-3 py-2 text-left text-sm rounded transition-colors ${
                        selectedFile === index
                          ? 'bg-blue-600 dark:bg-blue-700 text-blue-100 font-medium'
                          : 'text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-gray-100 dark:hover:text-gray-200'
                      }`}
                      onClick={() => {
                        setSelectedFile(index);
                        setShowFileList(false);
                        setActiveMenu(null);
                      }}
                    >
                      <FileIcon size={12} />
                      <span className="truncate">{file.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* コードヘッダー */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-300">
                  {mockFiles[selectedFile]?.name}
                </span>
                <span className="text-xs px-2 py-0.5 bg-[#3e3e3e] text-gray-300 rounded">
                  {mockFiles[selectedFile]?.language}
                </span>
              </div>
              <button
                className="flex items-center space-x-2 px-2 py-1 bg-[#3e3e3e] hover:bg-[#4e4e4e] text-gray-300 rounded text-xs transition-colors"
                onClick={handleCopyCode}
              >
                <CopyIcon size={14} />
                <span>{copySuccess ? 'コピー済み!' : 'コピー'}</span>
              </button>
            </div>

            {/* コード本体 */}
            <div className="flex-1 overflow-auto code-area">
              <SyntaxHighlighter
                language={mockFiles[selectedFile]?.language.toLowerCase()}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  background: 'transparent',
                  fontSize: '0.875rem',
                  lineHeight: '1.625'
                }}
                showLineNumbers={true}
                wrapLines={true}
                lineNumberStyle={{
                  minWidth: '3em',
                  paddingRight: '1em',
                  color: '#858585',
                  userSelect: 'none'
                }}
              >
                {mockFiles[selectedFile]?.code || ''}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* リサイズバー - PC表示のみ */}
          <div
            className="hidden md:block w-px bg-gray-200 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-500 cursor-col-resize flex-shrink-0 relative group"
            onMouseDown={() => setIsResizing(true)}
          >
            <div className="absolute inset-0 w-2 -ml-1 group-hover:bg-gray-400/20 dark:group-hover:bg-gray-500/20"></div>
          </div>

          {/* 説明文エリア（独立スクロール） - PCは通常表示、モバイルは絶対配置 */}
          <div
            className={`
              bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden
              ${showDescriptionPanel ? 'fixed inset-0 z-40 border-l border-gray-200 dark:border-gray-700' : 'hidden md:flex'}
            `}
            style={{
              width: showDescriptionPanel ? '100%' : `${100 - codeWidth}%`
            }}
          >
            {/* モバイル用閉じるボタン */}
            {showDescriptionPanel && (
              <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">説明</h2>
                <button
                  onClick={() => setShowDescriptionPanel(false)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  aria-label="閉じる"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="flex-1 overflow-auto p-6">
              <div className="prose prose-sm max-w-none">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                  {post.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('#')) {
                      const level = paragraph.match(/^#+/)?.[0].length || 1;
                      const text = paragraph.replace(/^#+\s*/, '');
                      const HeadingTag = `h${Math.min(level, 6)}` as keyof React.JSX.IntrinsicElements;
                      return (
                        <HeadingTag
                          key={index}
                          className={`font-bold text-gray-900 dark:text-white ${
                            level === 1 ? 'text-xl' : level === 2 ? 'text-lg' : 'text-base'
                          }`}
                        >
                          {text}
                        </HeadingTag>
                      );
                    }
                    if (paragraph.startsWith('```')) {
                      const codeBlock = paragraph.replace(/```[\w]*\n?|\n?```/g, '');
                      return (
                        <pre key={index} className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
                          <code className="text-gray-800 dark:text-gray-200">{codeBlock}</code>
                        </pre>
                      );
                    }
                    if (paragraph.trim()) {
                      return (
                        <p key={index} className="text-gray-700 dark:text-gray-300">
                          {paragraph}
                        </p>
                      );
                    }
                    return null;
                  })}

                  {/* スクロールテスト用の追加コンテンツ */}
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-8">技術的な詳細情報</h1>
                  <p className="text-gray-700 dark:text-gray-300">
                    このプロジェクトは、現代的なWeb開発における様々な課題を解決するために作成されました。
                    TypeScript、React、Next.jsを使用して、スケーラブルで保守性の高いアプリケーションを構築することを目指しています。
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">技術的なアプローチ</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    本プロジェクトでは、最新のフロントエンド技術を組み合わせて、ユーザーエクスペリエンスを向上させるための様々な手法を実装しています。
                    特に、パフォーマンスの最適化、アクセシビリティの向上、そしてSEO対策に力を入れています。
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">アーキテクチャの詳細</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    アプリケーションのアーキテクチャは、マイクロサービスの概念を取り入れたモジュラー設計となっています。
                    各機能は独立したコンポーネントとして実装され、テストが容易で、保守しやすい構造を実現しています。
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">データ管理戦略</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    データの管理については、ReactのContext APIとカスタムフックを組み合わせた状態管理システムを構築しています。
                    これにより、グローバルな状態を効率的に管理し、コンポーネント間のデータ共有をスムーズに行うことができます。
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">パフォーマンス最適化</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    パフォーマンスの最適化においては、以下の手法を積極的に活用しています：
                    コードスプリッティング、遅延読み込み、キャッシュ戦略の最適化、そしてバンドルサイズの最小化などです。
                    これらの技術を組み合わせることで、ユーザーに快適なブラウジング体験を提供しています。
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">セキュリティ対策</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    セキュリティは現代のWebアプリケーションにおいて最も重要な要素の一つです。
                    本プロジェクトでは、OWASPのWebアプリケーションセキュリティTop 10を参考に、包括的なセキュリティ対策を実装しています。
                    これには、XSS攻撃の防止、CSRF攻撃の対策、SQLインジェクションの防止などが含まれます。
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">テスト戦略</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    品質の高いソフトウェアを提供するため、包括的なテスト戦略を採用しています。
                    ユニットテスト、結合テスト、E2Eテストの3層構造でテストを実装し、
                    高いコードカバレッジを維持しながら、継続的な品質改善を進めています。
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">デプロイメントと運用</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    デプロイメントには、DockerコンテナとKubernetesを活用したクラウドネイティブなアプローチを採用しています。
                    CI/CDパイプラインを通じて、コードの品質チェックからデプロイまでの一連のプロセスを自動化し、
                    迅速かつ信頼性の高いリリースを実現しています。
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">モニタリングとログ管理</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    アプリケーションの健全性とパフォーマンスを維持するため、包括的なモニタリングシステムを導入しています。
                    Prometheus、Grafana、ELK Stackなどのツールを組み合わせ、リアルタイムのメトリクス収集と可視化を実現しています。
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">今後の展望</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    現在進行中の機能改善として、AIを活用したユーザーエクスペリエンスの向上、
                    リアルタイムコラボレーション機能の強化、そしてモバイルアプリケーションの開発などを予定しています。
                    これらの改善により、さらに使いやすく、効率的なプラットフォームへと発展させていく予定です。
                  </p>

                  <p className="text-gray-700 dark:text-gray-300">
                    以上が本プロジェクトの概要となります。詳細な技術仕様や実装の詳細については、
                    左側のソースコードをご参照ください。コードの中には、実装のポイントや注意事項がコメントとして記載されています。
                  </p>
                </div>

                {/* 投稿メタ情報 */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                  <div className="space-y-2">
                    <div>{formatRelativeDate(post.createdAt)}に投稿</div>
                    <div>{post.views} 閲覧</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}