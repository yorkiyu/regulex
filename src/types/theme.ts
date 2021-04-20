import { RaphaelElement } from 'raphael';

export interface Theme {
  nodeFontSize?: number;
  labelFontSize?: number;
  fontFamily?: string;
  pathLen?: number;
  bgColor?: string;
  paperMargin?: number;
  highlightColor?: HighlightColor;
  textAnchor?: string;
  fontWeight?: string | number;
  // 可视化图形，横轴线
  hline: {
    stroke: string;
    strokeWidth: number;
  };
  startPoint: {
    fill: string;
  };
  endPoint: {
    fill: string;
  };
  exact: {
    bgColor: string;
  };
  dot: {
    bgColor: string;
    textColor: string;
    text: string;
    tip: string;
    radius: number;
  };
  backref: {
    bgColor: string;
    textColor: string;
    strPrefix: string;
    radius: number;
  };
  repeat: {
    padding: number;
    labelMargin: number;
    strokeWidth: 2;
    max: {
      // 贪婪模式
      greedy: {
        stroke: string;
      };
      nonGreedy: {
        stroke: string;
      };
    };
    min: {
      // 贪婪模式
      greedy: {
        stroke: string;
      };
      nonGreedy: {
        stroke: string;
      };
    };
  };
  charset: {
    classDesc: {
      d: string;
      D: string;
      w: string;
      W: string;
      s: string;
      S: string;
    };
    anyChar: {
      bgColor: string;
      textColor: string;
    };
    char: {
      bgColor: string;
      textColor: string;
    };
    class: {
      bgColor: string;
      textColor: string;
    };
    range: {
      bgColor: string;
      textColor: string;
    };
    boxColor: {
      exclude: string;
      include: string;
    };
    labelColor: {
      exclude: string;
      include: string;
    };
  };
  group: {
    padding: number;
    lineColor: string;
    strokeWidth: number;
  };
  assert: {
    rect: {
      strokeWidth: number;
      radius: number;
    };
    nonWordBoundary: {
      bgColor: string;
      textColor: string;
    };
    wordBoundary: {
      bgColor: string;
      textColor: string;
    };
    end: {
      bgColor: string;
      textColor: string;
    };
    begin: {
      bgColor: string;
      textColor: string;
    };
    lookahead: {
      lineColor: string;
      textColor: string;
    };
    negativeLookahead: {
      lineColor: string;
      textColor: string;
    };
  };
  // 全局变量
  global?: Global;
}

export interface Global {
  multiLine?: boolean;
  templateText?: RaphaelElement;
}
export interface HighlightColor {
  delimiter?: string;
  flags?: string;
  exact?: string;
  dot?: string;
  backref?: string;
  $?: string;
  '^'?: string;
  '\\b'?: string;
  '\\B'?: string;
  '('?: string;
  ')'?: string;
  '?='?: string;
  '?!'?: string;
  '?:'?: string;
  '['?: string;
  ']'?: string;
  '|'?: string;
  '{'?: string;
  ','?: string;
  '}'?: string;
  '*'?: string;
  '+'?: string;
  '?'?: string;
  repeatNonGreedy?: string;
  defaults?: string;
  charsetRange?: string;
  charsetClass?: string;
  charsetExclude?: string;
  charsetChars?: string;
}
