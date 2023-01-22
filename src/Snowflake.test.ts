import tape from "tape";
import { Snowflake } from "./Snowflake";

const MAX_GEN_PER_SEC = 1024000;

tape("Snowflake", (assert) => {
  const snowflake = new Snowflake({
    instanceId: 0n,
    customEpoch: 1674400749400n,
  });
  assert.equals(snowflake.getInstanceId(), 0n);
  assert.equals(snowflake.getCustomEpoch(), 1674400749400n);
  assert.equals(snowflake.idFromTimestamp(1674400778395n), 121613844480n);
  assert.end();
});

tape(
  "Snowflake should be able to generate thousands of unique ids",
  (assert) => {
    const ids = new Set<bigint>();
    for (const id of new Snowflake().iter()) {
      ids.add(id);
      if (ids.size >= MAX_GEN_PER_SEC) {
        break;
      }
    }
    assert.equals(ids.size, MAX_GEN_PER_SEC);
    assert.end();
  }
);
