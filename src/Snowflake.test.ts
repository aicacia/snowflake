import tape from "tape";
import { Snowflake } from "./Snowflake";

tape("defaults", (assert) => {
  const snowflake = new Snowflake({
    instanceId: 2047n,
    customEpoch: 1674400749400n,
  });
  assert.equals(snowflake.getInstanceId(), 2047n);
  assert.equals(snowflake.getCustomEpoch(), 1674400749400n);
  assert.equals(snowflake.idFromTimestamp(1674400778395n), 121615940608n);
  assert.deepEqual(snowflake.parseId(121615940608n), [
    1674400778395n,
    2047n,
    0n,
  ]);
  assert.end();
});

tape("128bit", (assert) => {
  const snowflake = new Snowflake({
    totalBits: 128n,
    epochBits: 64n,
    instanceIdBits: 48n,
    sequenceBits: 16n,
    instanceId: 32767n,
    customEpoch: 1674400749400n,
  });
  assert.equals(snowflake.getInstanceId(), 32767n);
  assert.equals(snowflake.getCustomEpoch(), 1674400749400n);
  assert.equals(
    snowflake.idFromTimestamp(1674400778395n),
    534863344417210596524032n
  );
  assert.deepEqual(snowflake.parseId(534863344417210596524032n), [
    1674400778395n,
    32767n,
    0n,
  ]);
  assert.end();
});

tape("should be able to generate thousands of unique ids", (assert) => {
  const ids = new Set<bigint>();
  for (const id of new Snowflake()) {
    ids.add(id);
    if (ids.size >= 1024000) {
      break;
    }
  }
  assert.equals(ids.size, 1024000);
  assert.end();
});
