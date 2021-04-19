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
  startPointFill?: string;
  endPointFill?: string;
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
