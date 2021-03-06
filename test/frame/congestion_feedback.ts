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

suite('CONGESTION_FEEDBACK Frame', function () {
  it('new CongestionFeedbackFrame', function () {
    const congestionFeedbackFrame = new CongestionFeedbackFrame()

    strictEqual(congestionFeedbackFrame.type, 32)
    const buf = toBuffer(congestionFeedbackFrame)
    ok(buf.equals(bufferFromBytes([0b00100000])))
    ok(buf.equals(toBuffer(CongestionFeedbackFrame.fromBuffer(new BufferVisitor(buf)))))
  })

  it('parse with parseFrame', function () {
    const congestionFeedbackFrame = new CongestionFeedbackFrame()

    strictEqual(congestionFeedbackFrame.type, 32)
    const buf = toBuffer(congestionFeedbackFrame)
    ok(buf.equals(bufferFromBytes([0b00100000])))
    ok(buf.equals(toBuffer(parseFrame(new BufferVisitor(buf), new PacketNumber(1)))))
  })

  it('when invalid CongestionFeedbackFrame type', function () {
    throws(() => CongestionFeedbackFrame.fromBuffer(new BufferVisitor(bufferFromBytes([0b01100000]))),
      /INVALID_FRAME_DATA/)
  })
})
