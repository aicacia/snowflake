# ts-snowflake

[![license](https://img.shields.io/badge/license-MIT%2FApache--2.0-blue")](LICENSE-MIT)
[![docs](https://img.shields.io/badge/docs-typescript-blue.svg)](https://aicacia.github.io/ts-snowflake/)
[![npm (scoped)](https://img.shields.io/npm/v/@aicacia/snowflake)](https://www.npmjs.com/package/@aicacia/snowflake)
[![build](https://github.com/aicacia/ts-snowflake/workflows/Test/badge.svg)](https://github.com/aicacia/ts-snowflake/actions?query=workflow%3ATest)

snowflake id generator

```ts
import { Snowflake } from "@aicacia/snowflake";

const snowflake = new Snowflake({
  instanceId: 0n,
  customEpoch: 1674400749400n,
});

snowflake.getInstanceId(); // 0n
snowflake.getCustomEpoch(); // 1674400749400n);
snowflake.idFromTimestamp(1674400778395n); // 121613844480n
```
