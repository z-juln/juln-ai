# juln-ai

## api

0. /simple-ai 跳转到青云客提供的ai服务

```typescript
interface Params {
  prompt: string;
}

interface Response = {
  result: 0 | (number & {});
  content: string;
};
```

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
