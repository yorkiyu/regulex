/**
 * 配色参考：https://peiseka.com/webpeise.html#ps16
 * 华丽、花哨、女性化
 * */

import { Theme } from '../types/theme';

/**
 * 常规主题
 */
export const gorgeous: Theme = {
  nodeFontSize: 16,
  labelFontSize: 14,
  fontFamily: 'Arial',
  pathLen: 16,
  bgColor: '#f0f0f0',
  paperMargin: 10,
  textAnchor: '',
  fontWeight: 'normal',
  line: {
    stroke: '#000',
    strokeWidth: 2,
    strokeLinecap: 'butt',
    strokeLinejoin: 'round',
  },
  startPoint: {
    fill: 'r(0.5,0.5)#EFE-#339999',
  },
  endPoint: {
    fill: 'r(0.5,0.5)#FFF-#000',
  },
  exact: {
    bgColor: '#FF6666',
  },
  dot: {
    bgColor: '#663366',
    textColor: 'white',
    text: 'AnyCharExceptNewLine',
    tip: 'AnyChar except CR LF',
    radius: 10,
  },
  backref: {
    bgColor: 'navy',
    textColor: 'white',
    strPrefix: 'Backref',
    radius: 8,
  },
  repeat: {
    padding: 10,
    labelMargin: 4,
    strokeWidth: 2,
    max: {
      // 贪婪模式
      greedy: {
        stroke: '#339999',
      },
      nonGreedy: {
        stroke: '#66CC99',
      },
    },
    min: {
      // 贪婪模式
      greedy: {
        stroke: '#666699',
      },
      nonGreedy: {
        stroke: '#99CC66',
      },
    },
  },
  charset: {
    classDesc: {
      d: 'Digit',
      D: 'NonDigit',
      w: 'Word',
      W: 'NonWord',
      s: 'WhiteSpace',
      S: 'NonWhiteSpace',
    },
    anyChar: {
      text: 'AnyChar',
      bgColor: 'green',
      textColor: 'white',
    },
    char: {
      bgColor: 'LightSkyBlue',
      textColor: 'black',
    },
    class: {
      bgColor: 'Green',
      textColor: 'white',
    },
    range: {
      bgColor: 'teal',
      textColor: 'white',
    },
    boxColor: {
      exclude: 'Pink',
      include: 'Khaki',
    },
    labelColor: {
      exclude: '#C00',
      include: '',
    },
  },
  group: {
    padding: 10,
    lineColor: 'silver',
    strokeWidth: 2,
  },
  assert: {
    rect: {
      strokeWidth: 2,
      radius: 6,
    },
    nonWordBoundary: {
      bgColor: 'maroon',
      textColor: 'white',
    },
    wordBoundary: {
      bgColor: 'purple',
      textColor: 'white',
    },
    end: {
      bgColor: 'Indigo',
      textColor: 'white',
    },
    begin: {
      bgColor: 'Indigo',
      textColor: 'white',
    },
    lookahead: {
      lineColor: 'CornflowerBlue',
      textColor: 'darkgreen',
    },
    negativeLookahead: {
      lineColor: '#F63',
      textColor: 'Purple',
    },
  },
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
  },
  global: {},
};
