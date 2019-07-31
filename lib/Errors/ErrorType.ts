import { Option, Some, None, tuple} from 'space-lift';
import { fixMarkup } from 'highlight.js';
import { edit } from "../Edit/MetricLcs";
import { getPackedSettings } from 'http2';
import { CharUtil } from "../charstream"
import CharStream = CharUtil.CharStream;
import { Primitives } from '../primitives';
import Success = Primitives.Success;

export interface ErrorType {
    /**
     * Property that returns the set of
     * possible errors
     */
    causes : ErrorType[]

    /**
     * Property that returns the expected
     * string for the error
     */
    expectedStr: string

    /**
     * Property that returns the edit
     * distance of the corrected string
     */
    edit : number 

    /**
     * Property that returns the modified input
     * stream
     */
    modStream : CharStream
}