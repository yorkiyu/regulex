import { Theme } from '../types/theme';

/**
 * 常规主题
 */
export const normal: Theme = {
  nodeFontSize: 16,
  labelFontSize: 14,
  fontFamily: 'DejaVu Sans Mono,monospace', 
  pathLen: 16,
  bgColor: '#eee',
  paperMargin: 10,
  textAnchor: '',
  fontWeight: 'bold',
  highlightColor: {
    delimiter: 'Indigo',
    flags: 'darkgreen',
    exact: '#334',
    dot: 'darkblue',
    backref: 'teal',
    $: 'purple',
    '^': 'purple',
    '\\b': '#F30',
    '\\B': '#F30',
    '(': 'blue',
    ')': 'blue',
    '?=': 'darkgreen',
    '?!': 'red',
    '?:': 'grey',
    '[': 'navy',
    ']': 'navy',
    '|': 'blue',
    '{': 'maroon',
    ',': 'maroon',
    '}': 'maroon',
    '*': 'maroon',
    '+': 'maroon',
    '?': 'maroon',
    repeatNonGreedy: '#F61',
    defaults: 'black',
    charsetRange: 'olive',
    charsetClass: 'navy',
    charsetExclude: 'red',
    charsetChars: '#534',
  }
};
