import { Option, Some, None, tuple} from 'space-lift';
import { fixMarkup } from 'highlight.js';

export interface ErrorType {
    rootCause() : Option<ErrorType>
    explanation() : string
}