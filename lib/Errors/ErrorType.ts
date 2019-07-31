import { Option, Some, None, tuple} from 'space-lift';
import { fixMarkup } from 'highlight.js';
import { edit } from "../Edit/MetricLcs";
import { getPackedSettings } from 'http2';
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { Primitives } from '../primitives';
import Success = Primitives.Success;

export interface ErrorType<T> {
    //getTotalEdit() : number
    success : Success<T>
    causes : ErrorType<T>[]
    explanation() : string
    expectedStr: string
    edit : number 
    modString : CharStream
    convertToType<U>(f: (t: T) => U) : ErrorType<U>
}