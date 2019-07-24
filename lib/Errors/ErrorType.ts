import { Option, Some, None, tuple} from 'space-lift';
import { fixMarkup } from 'highlight.js';
import { edit } from "../Edit/MetricLcs";
import { getPackedSettings } from 'http2';

export interface ErrorType {
    rootCause() : Option<ErrorType>
    explanation() : string
    minEdit(input: string, expectedStr: string): edit[]
    expectedStr(): string
    edit : number 
}