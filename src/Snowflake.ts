import { Iter } from "@aicacia/iter";

const TOTAL_BITS = 64n;
const EPOCH_BITS = 42n;
const INSTANCE_ID_BITS = 12n;
const SEQUENCE_BITS = 10n;

const MAX_INSTANCE_ID = (1n << INSTANCE_ID_BITS) - 1n;
const MAX_SEQUENCE = (1n << SEQUENCE_BITS) - 1n;

export class Snowflake implements Iterator<bigint>, Iterable<bigint> {
  private lastTimestamp = 0n;
  private customEpoch = 0n;
  private sequence = 0n;
  private instanceId = BigInt(
    Math.round(Math.random() * Number(MAX_INSTANCE_ID))
  );

  constructor({
    instanceId,
    customEpoch,
  }: { instanceId?: bigint; customEpoch?: bigint } = {}) {
    if (instanceId != null && instanceId >= 0 && instanceId < MAX_INSTANCE_ID) {
      this.instanceId = instanceId;
    }
    if (customEpoch != null && customEpoch >= 0) {
      this.customEpoch = customEpoch;
    }
  }

  getInstanceId() {
    return this.instanceId;
  }
  getCustomEpoch() {
    return this.customEpoch;
  }

  getUniqueId(): bigint {
    let currentTimestamp = currentTime(this.customEpoch);

    if (currentTimestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & MAX_SEQUENCE;

      if (this.sequence === 0n) {
        while (currentTime(this.customEpoch) - currentTimestamp < 1n) {}
        currentTimestamp += 1n;
      }
    } else {
      this.sequence = 0n;
    }
    this.lastTimestamp = currentTimestamp;

    let id = currentTimestamp << (TOTAL_BITS - EPOCH_BITS);
    id |= this.instanceId << (TOTAL_BITS - EPOCH_BITS - INSTANCE_ID_BITS);
    id |= this.sequence;
    return id;
  }

  idFromTimestamp(timestamp: bigint): bigint {
    const currentTimestamp = timestamp - this.customEpoch;
    let id = currentTimestamp << (TOTAL_BITS - EPOCH_BITS);
    id |= this.instanceId << (TOTAL_BITS - EPOCH_BITS - INSTANCE_ID_BITS);
    return id;
  }

  iter(): Iter<bigint> {
    return new Iter(this);
  }

  [Symbol.iterator]() {
    return this;
  }

  next(): IteratorResult<bigint> {
    return { done: false, value: this.getUniqueId() };
  }
}

function currentTime(adjust: bigint): bigint {
  return BigInt(Date.now()) - adjust;
}
