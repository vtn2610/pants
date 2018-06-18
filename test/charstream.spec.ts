import CharStream from '../lib/charstream';
import { assert, expect } from 'chai';
import 'mocha';

describe('CharStream', () => {
  it('should be instantiable with just a string and toString should produce the right output', () => {
    const s = "helloworld";
    const cs = new CharStream(s);
    expect(cs.toString()).to.equal(s);
  });

  it('should produce a new CharStream when seeking', () => {
    const s = "helloworld";
    const cs = new CharStream(s);
    const cs2 = cs.seek(5);
    expect(cs2.toString()).to.equal("world");
  });

  it('should produce a new CharStream when seeking twice', () => {
    const s = "helloworld";
    const cs = new CharStream(s);
    const cs2 = cs.seek(5);
    const cs3 = cs2.seek(2);
    expect(cs3.toString()).to.equal("rld");
  });

  it('should always store a reference to (not a copy of) the original string', () => {
    const s = "helloworld";
    const cs = new CharStream(s);
    const cs2 = cs.seek(5);
    assert(cs.input === cs2.input);
  });

  it('should return EOF when the end of the input is reached', () => {
    const s = "helloworld";
    const cs = new CharStream(s);
    const cs2 = cs.seek(10)
    expect(cs2.isEOF()).to.equal(true);
  });

  it('should not be possible to seek too far', () => {
    const s = "helloworld";
    const cs = new CharStream(s);
    const cs2 = cs.seek(100)
    expect(cs2.isEOF()).to.equal(true);
    expect(cs2.pos).to.equal(s.length);
  });
});