import { Iter } from "@aicacia/iter";

export type SnowflakeOptions = {
  instanceId?: bigint;
  customEpoch?: bigint;
  totalBits?: bigint;
  epochBits?: bigint;
  instanceIdBits?: bigint;
  sequenceBits?: bigint;
  maxInstanceId?: bigint;
  maxSequence?: bigint;
};

export class Snowflake implements Iterator<bigint>, Iterable<bigint> {
  private totalBits = 64n;
  private epochBits = 42n;
  private instanceIdBits = 12n;
  private sequenceBits = 10n;
  private maxInstanceId = (1n << this.instanceIdBits) - 1n;
  private maxSequence = (1n << this.sequenceBits) - 1n;
  private lastTimestamp = 0n;
  private customEpoch = 0n;
  private sequence = 0n;
  private instanceId = 0n;

  constructor({
    instanceId,
    customEpoch,
    totalBits,
    epochBits,
    instanceIdBits,
    sequenceBits,
  }: SnowflakeOptions = {}) {
    if (totalBits != null) {
      this.totalBits = totalBits;
    }
    if (epochBits != null) {
      this.epochBits = epochBits;
    }
    if (instanceIdBits != null) {
      this.instanceIdBits = instanceIdBits;
    }
    if (sequenceBits != null) {
      this.sequenceBits = sequenceBits;
    }
    this.maxInstanceId = (1n << this.instanceIdBits) - 1n;
    this.maxSequence = (1n << this.sequenceBits) - 1n;
    if (
      instanceId != null &&
      instanceId >= 0 &&
      instanceId <= this.maxInstanceId
    ) {
      this.instanceId = instanceId;
    } else {
      this.instanceId = BigInt(
        Math.round(Math.random() * Number(this.maxInstanceId))
      );
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
      this.sequence = (this.sequence + 1n) & this.maxSequence;

      if (this.sequence === 0n) {
        while (currentTime(this.customEpoch) - currentTimestamp < 1n) {}
        currentTimestamp += 1n;
      }
    } else {
      this.sequence = 0n;
    }
    this.lastTimestamp = currentTimestamp;

    let id = currentTimestamp << (this.totalBits - this.epochBits);
    id |=
      this.instanceId <<
      (this.totalBits - this.epochBits - this.instanceIdBits);
    id |= this.sequence;
    return id;
  }

  idFromTimestamp(timestamp: bigint): bigint {
    const currentTimestamp = timestamp - this.customEpoch;
    let id = currentTimestamp << (this.totalBits - this.epochBits);
    id |=
      this.instanceId <<
      (this.totalBits - this.epochBits - this.instanceIdBits);
    return id;
  }
  parseId(
    id: bigint
  ): [timestamp: bigint, instanceId: bigint, sequence: bigint] {
    const maskInstanceId =
      ((1n << this.instanceIdBits) - 1n) << this.sequenceBits;
    const maskSequence = (1n << this.sequenceBits) - 1n;

    const timestamp =
      (id >> (this.instanceIdBits + this.sequenceBits)) + this.customEpoch;
    const instanceId = (id & maskInstanceId) >> this.sequenceBits;
    const sequence = id & maskSequence;

    return [timestamp, instanceId, sequence];
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
