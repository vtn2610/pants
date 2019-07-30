import { Option, Some, None, tuple} from 'space-lift';
import { fixMarkup } from 'highlight.js';
import { edit } from "../Edit/MetricLcs";
import { getPackedSettings } from 'http2';
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;

export interface ErrorType {
    //getTotalEdit() : number
    causes : ErrorType[];
    rootCauses() : Option<ErrorType[]>
    explanation() : string
    expectedStr(): string
    edit : number 
    modString : CharStream
}