import tape from "tape";
import { Snowflake } from "./Snowflake";

tape("defaults", (assert) => {
  const snowflake = new Snowflake({
    instanceId: 0n,
    customEpoch: 1674400749400n,
  });
  assert.equals(snowflake.getInstanceId(), 0n);
  assert.equals(snowflake.getCustomEpoch(), 1674400749400n);
  assert.equals(snowflake.idFromTimestamp(1674400778395n), 121613844480n);
  assert.deepEqual(snowflake.parseId(121613844480n), [1674400778395n, 0n, 0n]);
  assert.end();
});

tape("128bit", (assert) => {
  const snowflake = new Snowflake({
    totalBits: 128n,
    epochBits: 64n,
    instanceIdBits: 48n,
    sequenceBits: 16n,
    instanceId: 0n,
    customEpoch: 1674400749400n,
  });
  assert.equals(snowflake.getInstanceId(), 0n);
  assert.equals(snowflake.getCustomEpoch(), 1674400749400n);
  assert.equals(
    snowflake.idFromTimestamp(1674400778395n),
    534863344417208449105920n
  );
  assert.deepEqual(snowflake.parseId(534863344417208449105920n), [
    1674400778395n,
    0n,
    0n,
  ]);
  assert.end();
});

tape("should be able to generate thousands of unique ids", (assert) => {
  const ids = new Set<bigint>();
  for (const id of new Snowflake().iter()) {
    ids.add(id);
    if (ids.size >= 1024000) {
      break;
    }
  }
  assert.equals(ids.size, 1024000);
  assert.end();
});
