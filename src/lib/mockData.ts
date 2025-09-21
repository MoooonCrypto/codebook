import { Post } from '@/types';
import { enrichSourceCodeWithLanguageInfo } from './languageUtils';

export const mockPosts: Post[] = [
  {
    id: 'post-001',
    title: 'React カスタムフック useLocalStorage',
    description: 'ローカルストレージとReactステートを同期するカスタムフック',
    content: `# useLocalStorage フック

このカスタムフックを使うことで、ローカルストレージとReactのステートを簡単に同期できます。

## 使用例

\`\`\`typescript
const [name, setName] = useLocalStorage('username', '');
\`\`\`

## 特徴

- TypeScript対応
- 自動的なJSON変換
- SSR対応`,
    sourceCode: enrichSourceCodeWithLanguageInfo({
      filename: 'useLocalStorage.ts',
      language: 'typescript',
      code: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key "' + key + '":', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error setting localStorage key "' + key + '":', error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;`
    }),
    authorId: 'user-001',
    author: {
      id: 'user-001',
      name: 'developer_123',
      email: 'dev@example.com'
    },
    tags: ['react', 'hooks', 'typescript', 'localstorage'],
    likes: 42,
    views: 128,
    comments: 8,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    isPublished: true
  },
  {
    id: 'post-002',
    title: 'Python 非同期処理の基本',
    description: 'asyncio を使った効率的な非同期プログラミング',
    content: `# Python 非同期処理

asyncio を使った非同期処理の基本的なパターンです。

## 複数のAPIを並行して呼び出す例

このコードは複数のAPIエンドポイントを並行して呼び出し、すべての結果を待ちます。`,
    sourceCode: enrichSourceCodeWithLanguageInfo({
      filename: 'async_example.py',
      language: 'python',
      code: `import asyncio
import aiohttp
from typing import List, Dict, Any

async def fetch_data(session: aiohttp.ClientSession, url: str) -> Dict[str, Any]:
    """指定されたURLからデータを取得"""
    try:
        async with session.get(url) as response:
            response.raise_for_status()
            return await response.json()
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return {}

async def fetch_multiple_urls(urls: List[str]) -> List[Dict[str, Any]]:
    """複数のURLから並行してデータを取得"""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_data(session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return [result for result in results if not isinstance(result, Exception)]

# 使用例
async def main():
    urls = [
        'https://api.example.com/users',
        'https://api.example.com/posts',
        'https://api.example.com/comments'
    ]

    results = await fetch_multiple_urls(urls)
    print(f"取得した結果: {len(results)}件")

if __name__ == "__main__":
    asyncio.run(main())`
    }),
    authorId: 'user-002',
    author: {
      id: 'user-002',
      name: 'python_master',
      email: 'python@example.com'
    },
    tags: ['python', 'async', 'asyncio', 'api'],
    likes: 67,
    views: 203,
    comments: 12,
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
    isPublished: true
  },
  {
    id: 'post-003',
    title: 'CSS Grid レスポンシブレイアウト',
    description: 'CSS Grid を使ったモダンなレスポンシブデザイン',
    content: `# CSS Grid レスポンシブレイアウト

CSS Grid を使って、様々な画面サイズに対応するレスポンシブなレイアウトを作成する方法です。

## 特徴

- フレキシブルなグリッドシステム
- メディアクエリによる画面サイズ対応
- ガップの自動調整`,
    sourceCode: enrichSourceCodeWithLanguageInfo({
      filename: 'responsive-grid.css',
      language: 'css',
      code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.grid-item {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* タブレット対応 */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 1.5rem;
  }
}

/* モバイル対応 */
@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
}`
    }),
    authorId: 'user-003',
    author: {
      id: 'user-003',
      name: 'css_designer',
      email: 'design@example.com'
    },
    tags: ['css', 'grid', 'responsive', 'frontend'],
    likes: 38,
    views: 156,
    comments: 5,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    isPublished: true
  },
  {
    id: 'post-004',
    title: 'Go 並行処理とチャネル',
    description: 'Goの並行処理を goroutine とチャネルで効率化',
    content: `# Go 並行処理

Goの強力な並行処理機能である goroutine とチャネルを活用したパターンです。

## ワーカープールパターン

複数のワーカーが並行してタスクを処理する効率的なパターンです。`,
    sourceCode: enrichSourceCodeWithLanguageInfo({
      filename: 'worker_pool.go',
      language: 'go',
      code: `package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

type Job struct {
	ID   int
	Data string
}

type Result struct {
	JobID int
	Value int
}

func worker(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {
	defer wg.Done()

	for job := range jobs {
		fmt.Printf("Worker %d processing job %d\n", id, job.ID)

		// 模擬的な処理時間
		time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)

		// 結果を送信
		results <- Result{
			JobID: job.ID,
			Value: len(job.Data),
		}
	}
}

func main() {
	const numWorkers = 3
	const numJobs = 10

	jobs := make(chan Job, numJobs)
	results := make(chan Result, numJobs)

	var wg sync.WaitGroup

	// ワーカーを起動
	for i := 1; i <= numWorkers; i++ {
		wg.Add(1)
		go worker(i, jobs, results, &wg)
	}

	// ジョブを送信
	for i := 1; i <= numJobs; i++ {
		jobs <- Job{
			ID:   i,
			Data: fmt.Sprintf("task-data-%d", i),
		}
	}
	close(jobs)

	// 結果を収集
	go func() {
		wg.Wait()
		close(results)
	}()

	for result := range results {
		fmt.Printf("Job %d completed with value: %d\n", result.JobID, result.Value)
	}
}`
    }),
    authorId: 'user-004',
    author: {
      id: 'user-004',
      name: 'go_developer',
      email: 'go@example.com'
    },
    tags: ['go', 'concurrency', 'goroutine', 'performance'],
    likes: 51,
    views: 189,
    comments: 9,
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
    isPublished: true
  },
  {
    id: 'post-005',
    title: 'Rust メモリ安全な並行処理',
    description: 'Rustの所有権システムを活用した安全な並行プログラミング',
    content: `# Rust 並行処理

Rustの所有権システムとライフタイムを活用して、メモリ安全な並行処理を実装します。

## 特徴

- コンパイル時のメモリ安全性保証
- データ競合の防止
- ゼロコスト抽象化`,
    sourceCode: enrichSourceCodeWithLanguageInfo({
      filename: 'concurrent_processing.rs',
      language: 'rust',
      code: `use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

#[derive(Debug)]
struct Counter {
    value: Arc<Mutex<i32>>,
}

impl Counter {
    fn new() -> Self {
        Counter {
            value: Arc::new(Mutex::new(0)),
        }
    }

    fn increment(&self) {
        let mut num = self.value.lock().unwrap();
        *num += 1;
    }

    fn get_value(&self) -> i32 {
        *self.value.lock().unwrap()
    }
}

fn main() {
    let counter = Arc::new(Counter::new());
    let mut handles = vec![];

    // 複数のスレッドでカウンターをインクリメント
    for i in 0..10 {
        let counter_clone = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            for _ in 0..100 {
                counter_clone.increment();
                thread::sleep(Duration::from_millis(1));
            }
            println!("Thread {} completed", i);
        });
        handles.push(handle);
    }

    // すべてのスレッドの完了を待機
    for handle in handles {
        handle.join().unwrap();
    }

    println!("Final counter value: {}", counter.get_value());
}`
    }),
    authorId: 'user-005',
    author: {
      id: 'user-005',
      name: 'rust_enthusiast',
      email: 'rust@example.com'
    },
    tags: ['rust', 'memory-safety', 'concurrency', 'performance'],
    likes: 73,
    views: 267,
    comments: 15,
    createdAt: '2024-01-11T11:45:00Z',
    updatedAt: '2024-01-11T11:45:00Z',
    isPublished: true
  },
  {
    id: 'post-006',
    title: 'JavaScript 関数型プログラミング',
    description: 'map, filter, reduce を使った関数型アプローチ',
    content: `# JavaScript 関数型プログラミング

JavaScriptの関数型プログラミングパラダイムを活用したデータ処理パターンです。

## 利点

- 副作用のない純粋関数
- 可読性の向上
- テストしやすいコード`,
    sourceCode: enrichSourceCodeWithLanguageInfo({
      filename: 'functional_utils.js',
      language: 'javascript',
      code: `// 関数型ユーティリティ関数
const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

const curry = (fn) => (...args) =>
  args.length >= fn.length
    ? fn(...args)
    : (...nextArgs) => curry(fn)(...args, ...nextArgs);

// データ変換関数
const multiply = curry((factor, num) => num * factor);
const add = curry((addend, num) => num + addend);
const filter = curry((predicate, array) => array.filter(predicate));
const map = curry((transform, array) => array.map(transform));

// 使用例: 数値配列の処理
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const processNumbers = pipe(
  filter(num => num % 2 === 0),  // 偶数のみ
  map(multiply(3)),              // 3倍
  map(add(1)),                   // 1を加算
  numbers => numbers.reduce((sum, num) => sum + num, 0)  // 合計
);

console.log(processNumbers(data)); // 結果: 91

// オブジェクト配列の処理例
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

const getActiveUserNames = pipe(
  filter(user => user.active),
  map(user => user.name),
  names => names.join(', ')
);

console.log(getActiveUserNames(users)); // "Alice, Charlie"`
    }),
    authorId: 'user-006',
    author: {
      id: 'user-006',
      name: 'js_functional',
      email: 'js@example.com'
    },
    tags: ['javascript', 'functional', 'map', 'filter', 'reduce'],
    likes: 29,
    views: 98,
    comments: 6,
    createdAt: '2024-01-10T16:30:00Z',
    updatedAt: '2024-01-10T16:30:00Z',
    isPublished: true
  }
];