import { flatbuffers } from "flatbuffers";

export interface Range {
  from: number;
  to: number;
}

export class PartialBuffer extends flatbuffers.ByteBuffer {
  public availableData: Range[] = [];
  bufferLength: number = 0;
  public size: number = 0;

  constructor(bufferLength: number) {
    super(new Uint8Array(bufferLength));
    this.bufferLength = bufferLength;
  }

  putData(data: Uint8Array, offset: number = 0): void {
    this.bytes().set(data, offset);
    const length = data.length;
    let thisRange = { from: offset, to: offset + length - 1 };
    this.availableData = [...this.availableData, thisRange];
  }

  isDataAvailable(from: number = 0, to: number = this.bufferLength - 1) {
    return this.availableData.reduce((c, el) => c || (el.from <= from && el.to >= to), false);
  }
}

export default PartialBuffer;
