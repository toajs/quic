'use strict'

// **Github:** https://github.com/fidm/quic
//
// **License:** MIT

import { suite, it } from 'tman'
import { ok, strictEqual, deepEqual, throws } from 'assert'

import { BufferVisitor, toBuffer } from '../../src/internal/common'
import { QuicError } from '../../src/internal/error'
import { StreamID, Offset, PacketNumber } from '../../src/internal/protocol'
import {
  parseFrame, StreamFrame, AckFrame, AckRange, PaddingFrame,
  RstStreamFrame, ConnectionCloseFrame, GoAwayFrame,
  WindowUpdateFrame, BlockedFrame, StopWaitingFrame,
  PingFrame, CongestionFeedbackFrame,
} from '../../src/internal/frame'

import { bufferFromBytes } from '../common'

suite('STOP_WAITING Frame', function () {
  it('new StopWaitingFrame', function () {
    const headerPacketNumber = PacketNumber.fromBuffer(new BufferVisitor(bufferFromBytes([0xff, 0x1f])), 2)
    const leastUnacked = PacketNumber.fromBuffer(new BufferVisitor(bufferFromBytes([0xff, 0x0f])), 2).valueOf()
    const stopWaitingFrame = new StopWaitingFrame(headerPacketNumber, leastUnacked)

    strictEqual(stopWaitingFrame.type, 6)
    strictEqual(leastUnacked, stopWaitingFrame.leastUnacked)
    const buf = toBuffer(stopWaitingFrame)
    ok(buf.equals(bufferFromBytes([
      0x06,
      0x00, 0x10,
    ])))
    ok(buf.equals(toBuffer(StopWaitingFrame.fromBuffer(new BufferVisitor(buf), headerPacketNumber))))
  })

  it('parse with parseFrame', function () {
    const headerPacketNumber = PacketNumber.fromBuffer(new BufferVisitor(bufferFromBytes([0xff, 0x1f])), 2)
    const leastUnacked = PacketNumber.fromBuffer(new BufferVisitor(bufferFromBytes([0xff, 0x0f])), 2).valueOf()
    const stopWaitingFrame = new StopWaitingFrame(headerPacketNumber, leastUnacked)

    strictEqual(stopWaitingFrame.type, 6)
    strictEqual(leastUnacked, stopWaitingFrame.leastUnacked)
    const buf = toBuffer(stopWaitingFrame)
    ok(buf.equals(bufferFromBytes([
      0x06,
      0x00, 0x10,
    ])))
    ok(buf.equals(toBuffer(parseFrame(new BufferVisitor(buf), headerPacketNumber))))
  })
})
