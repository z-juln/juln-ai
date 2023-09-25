# juln-ai

## api

1. /gpt 直接根据问题生成答案

```typescript
interface Params {
  prompt: string;
  temperature?: number; // 默认为0.7
}

interface Response = string;
```

2. /gpt/sse 直接根据问题生成答案(EventSource)

```typescript
interface Params {
  prompt: string;
  temperature?: number; // 默认为0.7
}

interface Response = string;
```
