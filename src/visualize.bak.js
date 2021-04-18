import {
  CHARSET_NODE,
  AssertLookahead,
  ASSERT_NODE,
  GROUP_NODE,
  CHOICE_NODE,
  EMPTY_NODE,
  AssertNegativeLookahead,
} from './constants';
import K from './Kit';

const FONT_SIZE = 16;
const LABEL_FONT_SIZE = 14;
const PATH_LEN = 16;
const BG_COLOR = '#eee';
const FONT_FAMILY = 'DejaVu Sans Mono,monospace';

let _multiLine = false; /* global flag quick work */

const PAPER_MARGIN = 10;

const _charSizeCache = {}; let _tmpText;
function getCharSize(fontSize, fontBold) {
  fontBold = fontBold || 'normal';
  if (_charSizeCache[fontSize] && _charSizeCache[fontSize][fontBold]) return _charSizeCache[fontSize][fontBold];
  _tmpText.attr({ 'font-size': fontSize, 'font-weight': fontBold });
  const box = _tmpText.getBBox();
  _charSizeCache[fontSize] = _charSizeCache[fontSize] || {};
  return _charSizeCache[fontSize][fontBold] = {
    width: box.width / ((_tmpText.attr('text').length - 1) / 2),
    height: box.height / 2,
  };
}

function initTmpText(paper) {
  _tmpText = paper.text(
    -1000, -1000, 'XgfTlM|.q\nXgfTlM|.q', // random multiline text
  ).attr({ 'font-family': FONT_FAMILY, 'font-size': FONT_SIZE });
}

function visualize(re, flags, paper) {
  paper.clear();
  paper.setSize(0, 0);
  const bg = paper.rect(0, 0, 0, 0);
  bg.attr('fill', BG_COLOR);
  bg.attr('stroke', BG_COLOR);

  initTmpText(paper);
  _multiLine = !!~flags.indexOf('m');

  let texts = highlight(re.tree);

  texts.unshift(text('/', hlColorMap.delimiter));
  texts.unshift(text('RegExp: '));
  texts.push(text('/', hlColorMap.delimiter));
  if (flags) texts.push(text(flags, hlColorMap.flags));
  const charSize = getCharSize(FONT_SIZE, 'bold');
  const startX = PAPER_MARGIN; const startY = charSize.height / 2 + PAPER_MARGIN;
  let width = 0; let height = 0;

  width = texts.reduce((x, t) => {
    t.x = x;
    t.y = startY;
    const w = t.text.length * charSize.width;
    return x + w;
  }, startX);
  width += PAPER_MARGIN;
  height = charSize.height + PAPER_MARGIN * 2;
  texts = paper.add(texts);

  paper.setSize(width, charSize.height + PAPER_MARGIN * 2);

  const ret = plot(re.tree, 0, 0);

  height = Math.max(ret.height + 3 * PAPER_MARGIN + charSize.height, height);
  width = Math.max(ret.width + 2 * PAPER_MARGIN, width);
  paper.setSize(width, height);

  bg.attr('width', width);
  bg.attr('height', height);

  translate(ret.items, PAPER_MARGIN, PAPER_MARGIN * 2 + charSize.height - ret.y);
  paper.add(ret.items);
}

function plot(tree, x, y) {
  tree.unshift({ type: 'startPoint' });
  tree.push({ type: 'endPoint' });
  return plotTree(tree, x, y);
}

function translate(items, dx, dy) {
  items.forEach((t) => {
    if (t._translate) t._translate(dx, dy);
    else { t.x += dx; t.y += dy; }
  });
}

// return NodePlot config
function plotTree(tree, x, y) {
  const results = []; let items = [];
  let width = 0; let height = 0;
  let fromX = x; let top = y; let bottom = y;
  if (!tree.length) return plotNode.empty(null, x, y);
  tree.forEach((node) => {
    let ret;
    if (node.repeat) {
      ret = plotNode.repeat(node, fromX, y);
    } else {
      ret = plotNode[node.type](node, fromX, y);
    }
    results.push(ret);
    fromX += ret.width + PATH_LEN;
    width += ret.width;
    top = Math.min(top, ret.y);
    bottom = Math.max(bottom, ret.y + ret.height);
    items = items.concat(ret.items);
  });
  height = bottom - top;
  results.reduce((a, b) => {
    width += PATH_LEN;
    const p = hline(a.lineOutX, y, b.lineInX);
    items.push(p);
    return b;
  });
  const { lineInX } = results[0]; const
    { lineOutX } = results[results.length - 1];
  return {
    items,
    width,
    height,
    x,
    y: top,
    lineInX,
    lineOutX,
  };
}
// return NodePlot config
function textRect(s, x, y, bgColor, textColor) {
  s = K.toPrint(s);
  const padding = 6;
  const charSize = getCharSize(FONT_SIZE);
  const tw = s.length * charSize.width; const h = charSize.height + padding * 2; const w = tw + padding * 2;
  const rect = {
    type: 'rect',
    x,
    y: y - (h / 2),
    width: w,
    height: h,
    stroke: 'none',
    fill: bgColor || 'transparent',
  };
  const t = {
    type: 'text',
    x: x + w / 2,
    y,
    text: s,
    'font-size': FONT_SIZE,
    'font-family': FONT_FAMILY,
    fill: textColor || 'black',
  };
  return {
    text: t,
    rect,
    items: [rect, t],
    width: w,
    height: h,
    x,
    y: rect.y,
    lineInX: x,
    lineOutX: x + w,
  };
}

// return LabelObject {lable:Element,x,y,width,height}
function textLabel(x, y, s, color) { // x is center x ,y is bottom y
  const charSize = getCharSize(LABEL_FONT_SIZE);
  const lines = s.split('\n');
  const textHeight = lines.length * charSize.height;
  let textWidth;
  if (lines.length > 1) {
    textWidth = Math.max.apply(Math, lines.map((a) => a.length));
  } else {
    textWidth = s.length;
  }
  textWidth *= charSize.width;
  const margin = 4;
  const txt = {
    type: 'text',
    x,
    y: y - textHeight / 2 - margin,
    text: s,
    'font-size': LABEL_FONT_SIZE,
    'font-family': FONT_FAMILY,
    fill: color || '#444',
  };
  return {
    label: txt,
    x: x - textWidth / 2,
    y: y - textHeight - margin,
    width: textWidth,
    height: textHeight + margin,
  };
}

// return element config
function hline(x, y, destX) {
  return {
    type: 'path',
    x,
    y,
    path: ['M', x, y, 'H', destX],
    'stroke-linecap': 'butt',
    'stroke-linejoin': 'round',
    stroke: '#333',
    'stroke-width': 2,
    _translate(x, y) {
      const p = this.path;
      p[1] += x; p[2] += y; p[4] += x;
    },
  };
}

// return element config
function smoothLine(fromX, fromY, toX, toY) {
  const radius = 10; let p; let _translate;
  const signX = fromX > toX ? -1 : 1; const signY = fromY > toY ? -1 : 1;
  if (Math.abs(fromY - toY) < radius * 1.5 /* || Math.abs(fromX-toX)<radius*2 */) {
    p = ['M', fromX, fromY,
      'C', fromX + Math.min(Math.abs(toX - fromX) / 2, radius) * signX, fromY,
      toX - (toX - fromX) / 2, toY,
      toX, toY];
    _translate = function (x, y) {
      const p = this.path;
      p[1] += x; p[2] += y;
      p[4] += x; p[5] += y;
      p[6] += x; p[7] += y;
      p[8] += x; p[9] += y;
    };
  } else {
    p = [
      'M', fromX, fromY,
      'Q', fromX + radius * signX, fromY, fromX + radius * signX, fromY + radius * signY,
      'V', Math.abs(fromY - toY) < radius * 2 ? fromY + radius * signY : (toY - radius * signY),
      'Q', fromX + radius * signX, toY, fromX + radius * signX * 2, toY,
      'H', toX,
    ];
    _translate = function (x, y) {
      const p = this.path;
      p[1] += x; p[2] += y;
      p[4] += x; p[5] += y; p[6] += x; p[7] += y;
      p[9] += y;
      p[11] += x; p[12] += y; p[13] += x; p[14] += y;
      p[16] += x;
    };
  }
  return {
    type: 'path',
    path: p,
    'stroke-linecap': 'butt',
    'stroke-linejoin': 'round',
    stroke: '#333',
    'stroke-width': 2,
    _translate,
  };
}

function point(x, y, fill) {
  const r = 10;
  return {
    items: [{
      type: 'circle',
      fill,
      cx: x + r,
      cy: y,
      r,
      stroke: 'none',
      _translate(x, y) {
        this.cx += x;
        this.cy += y;
      },
    }],
    width: r * 2,
    height: r * 2,
    x,
    y,
    lineInX: x,
    lineOutX: x + r * 2,
  };
}

var plotNode = {
  startPoint(node, x, y) {
    return point(x, y, 'r(0.5,0.5)#EFE-green');
  },
  endPoint(node, x, y) {
    return point(x, y, 'r(0.5,0.5)#FFF-#000');
  },
  empty(node, x, y) {
    const len = 10;
    const l = hline(x, y, x + len);
    return {
      items: [l],
      width: len,
      height: 2,
      x,
      y,
      lineInX: x,
      lineOutX: x + len,
    };
  },
  exact(node, x, y) {
    const color = 'skyblue';
    return textRect(node.chars, x, y, color);
  },
  dot(node, x, y) {
    const bgColor = 'DarkGreen'; const textColor = 'white';
    const a = textRect('AnyCharExceptNewLine', x, y, bgColor, textColor);
    a.rect.r = 10;
    a.rect.tip = 'AnyChar except CR LF';
    return a;
  },
  backref(node, x, y) {
    const bgColor = 'navy'; const textColor = 'white';
    const a = textRect(`Backref #${node.num}`, x, y, bgColor, textColor);
    a.rect.r = 8;
    return a;
  },
  repeat(node, x, y) {
    if (elideOK(node)) return plotNode.empty(null, x, y);
    const padding = 10; const LABEL_MARGIN = 4;
    const { repeat } = node; let txt = ''; let
      items = [];
    const NonGreedySkipPathColor = 'darkgreen';
    /* if (repeat.min===0 && !node._branched) {
      node._branched=true;
      return plotNode.choice({type:CHOICE_NODE,branches:[[{type:EMPTY_NODE}],[node]]},x,y);
    } */
    if (repeat.min === repeat.max && repeat.min === 0) {
      return plotNode.empty(null, x, y); // so why allow /a{0}/ ?
    }

    const ret = plotNode[node.type](node, x, y);
    let { width } = ret; let
      { height } = ret;

    if (repeat.min === repeat.max && repeat.min === 1) {
      return ret; // if someone write /a{1}/
    } if (repeat.min === repeat.max) {
      txt += _plural(repeat.min);
    } else {
      txt += repeat.min;
      if (isFinite(repeat.max)) {
        txt += (repeat.max - repeat.min > 1 ? ' to ' : ' or ') + _plural(repeat.max);
      } else {
        txt += ' or more times';
      }
    }

    let offsetX = padding; let offsetY = 0; const r = padding; let rectH = ret.y + ret.height - y; const rectW = padding * 2 + ret.width;
    width = rectW;
    let p; // repeat rect box path
    if (repeat.max !== 1) { // draw repeat rect box
      rectH += padding;
      height += padding;
      p = {
        type: 'path',
        path: ['M', ret.x + padding, y,
          'Q', x, y, x, y + r,
          'V', y + rectH - r,
          'Q', x, y + rectH, x + r, y + rectH,
          'H', x + rectW - r,
          'Q', x + rectW, y + rectH, x + rectW, y + rectH - r,
          'V', y + r,
          'Q', x + rectW, y, ret.x + ret.width + padding, y,
        ],
        _translate: _curveTranslate,
        stroke: 'maroon',
        'stroke-width': 2,
      };
      if (repeat.nonGreedy) {
        // txt+="(NonGreedy!)";
        p.stroke = 'Brown';
        p['stroke-dasharray'] = '-';
      }
      items.push(p);
    } else { // so completely remove label when /a?/ but not /a??/
      // @ts-ignore
      txt = false;
    }

    let skipPath;
    if (repeat.min === 0) { // draw a skip path
      const skipRectH = y - ret.y + padding; const skipRectW = rectW + padding * 2;
      offsetX += padding;
      offsetY = -padding - 2; // tweak,stroke-width is 2
      width = skipRectW; height += padding;
      skipPath = {
        type: 'path',
        path: ['M', x, y,
          'Q', x + r, y, x + r, y - r,
          'V', y - skipRectH + r,
          'Q', x + r, y - skipRectH, x + r * 2, y - skipRectH,
          'H', x + skipRectW - r * 2,
          'Q', x + skipRectW - r, y - skipRectH, x + skipRectW - r, y - skipRectH + r,
          'V', y - r,
          'Q', x + skipRectW - r, y, x + skipRectW, y,
        ],
        _translate: _curveTranslate,
        stroke: repeat.nonGreedy ? NonGreedySkipPathColor : '#333',
        'stroke-width': 2,
      };
      if (p) translate([p], padding, 0);
      items.push(skipPath);
    }

    if (txt) {
      const tl = textLabel(x + width / 2, y, txt);
      translate([tl.label], 0, rectH + tl.height + LABEL_MARGIN); // bottom  label
      items.push(tl.label);
      height += LABEL_MARGIN + tl.height;
      const labelOffsetX = (Math.max(tl.width, width) - width) / 2;
      if (labelOffsetX) translate(items, labelOffsetX, 0);
      width = Math.max(tl.width, width);
      offsetX += labelOffsetX;
    }

    translate(ret.items, offsetX, 0);
    items = items.concat(ret.items);
    return {
      items,
      width,
      height,
      x,
      y: ret.y + offsetY,
      lineInX: ret.lineInX + offsetX,
      lineOutX: ret.lineOutX + offsetX,
    };

    function _plural(n) {
      return n + ((n < 2) ? ' time' : ' times');
    }
    function _curveTranslate(x, y) {
      const p = this.path;
      p[1] += x; p[2] += y;
      p[4] += x; p[5] += y; p[6] += x; p[7] += y;
      p[9] += y;
      p[11] += x; p[12] += y; p[13] += x; p[14] += y;
      p[16] += x;
      p[18] += x; p[19] += y; p[20] += x; p[21] += y;
      p[23] += y;
      p[25] += x; p[26] += y; p[27] += x; p[28] += y;
    }
  },
  choice(node, x, y) {
    if (elideOK(node)) return plotNode.empty(null, x, y);
    const marginX = 20; const spacing = 6; const paddingY = 4; let height = 0; let width = 0;
    const branches = node.branches.map((branch) => {
      const ret = plotTree(branch, x, y);
      height += ret.height;
      width = Math.max(width, ret.width);
      return ret;
    });
    height += (branches.length - 1) * spacing + paddingY * 2;
    width += marginX * 2;

    const centerX = x + width / 2; let dy = y - height / 2 + paddingY; const // destY
      lineOutX = x + width; let items = [];
    branches.forEach((a) => {
      const dx = centerX - a.width / 2; // destX
      translate(a.items, dx - a.x, dy - a.y);
      items = items.concat(a.items);
      /*
      var p1=smoothLine(x,y,dx-a.x+a.lineInX,y+dy-a.y);
      var p2=smoothLine(lineOutX,y,a.lineOutX+dx-a.x,y+dy-a.y);
      items=items.concat(a.items);
      items.push(p1,p2); */
      // current a.y based on y(=0),its middle at y=0
      const lineY = y + dy - a.y;
      const p1 = smoothLine(x, y, x + marginX, lineY);
      const p2 = smoothLine(lineOutX, y, x + width - marginX, lineY);
      items.push(p1, p2);
      if (x + marginX !== dx - a.x + a.lineInX) {
        items.push(hline(x + marginX, lineY, dx - a.x + a.lineInX));
      }
      if (a.lineOutX + dx - a.x !== x + width - marginX) {
        items.push(hline(a.lineOutX + dx - a.x, lineY, x + width - marginX));
      }

      a.x = dx; a.y = dy;
      dy += a.height + spacing;
    });

    return {
      items,
      width,
      height,
      x,
      y: y - height / 2,
      lineInX: x,
      lineOutX,
    };
  },
  charset(node, x, y) {
    const padding = 6; const spacing = 4;
    const clsDesc = {
      d: 'Digit', D: 'NonDigit', w: 'Word', W: 'NonWord', s: 'WhiteSpace', S: 'NonWhiteSpace',
    };
    const charBgColor = 'LightSkyBlue'; const charTextColor = 'black';
    const clsBgColor = 'Green'; const clsTextColor = 'white';
    const rangeBgColor = 'teal'; const rangeTextColor = 'white';
    const boxColor = node.exclude ? 'Pink' : 'Khaki';
    const labelColor = node.exclude ? '#C00' : '';
    const simple = onlyCharClass(node);
    if (simple) {
      var a = textRect(clsDesc[node.classes[0]], x, y, clsBgColor, clsTextColor);
      a.rect.r = 5;
      if (!node.exclude) {
        return a;
      }
      var tl = textLabel(a.x + a.width / 2, a.y, 'None of:', labelColor);
      var { items } = a;
      items.push(tl.label);
      var oldWidth = a.width;
      var width = Math.max(tl.width, a.width);
      var offsetX = (width - oldWidth) / 2;// ajust label text
      translate(items, offsetX, 0);
      return {
        items,
        width,
        height: a.height + tl.height,
        x: Math.min(tl.x, a.x),
        y: tl.y,
        lineInX: offsetX + a.x,
        lineOutX: offsetX + a.x + a.width,
      };
    }
    if (!node.chars && !node.ranges.length && !node.classes.length) {
      // It must be exclude charset here
      var a = textRect('AnyChar', x, y, 'green', 'white');
      a.rect.r = 5;
      return a;
    }
    let packs = []; let ret; var width = 0; let height = 0; let singleBoxHeight;
    if (node.chars) {
      ret = textRect(node.chars, x, y, charBgColor, charTextColor);
      ret.rect.r = 5;
      packs.push(ret);
      width = ret.width;
    }
    node.ranges.forEach((rg) => {
      rg = rg.split('').join('-');
      const ret = textRect(rg, x, y, rangeBgColor, rangeTextColor);
      ret.rect.r = 5;
      packs.push(ret);
      width = Math.max(ret.width, width);
    });
    node.classes.forEach((cls) => {
      const ret = textRect(clsDesc[cls], x, y, clsBgColor, clsTextColor);
      ret.rect.r = 5;
      packs.push(ret);
      width = Math.max(ret.width, width);
    });

    singleBoxHeight = packs[0].height;

    const pack1 = []; const pack2 = [];
    packs.sort((a, b) => b.width - a.width);
    packs.forEach((a) => {
      if (a.width * 2 + spacing > width) pack1.push(a);
      else pack2.push(a); // can be inline
    });
    packs = pack1;
    let a1; let a2;
    while (pack2.length) {
      a1 = pack2.pop(); a2 = pack2.pop();
      if (!a2) { packs.push(a1); break; }
      if (a1.width - a2.width > 2) {
        packs.push(a1);
        pack2.push(a2);
        continue;
      }
      translate(a2.items, a1.width + spacing, 0);
      packs.push({
        items: a1.items.concat(a2.items),
        width: a1.width + a2.width + spacing,
        height: a1.height,
        x: a1.x,
        y: a1.y,
      });
      height -= a1.height;
    }

    width += padding * 2;
    height = (packs.length - 1) * spacing + packs.length * singleBoxHeight + padding * 2;

    const rect = {
      type: 'rect',
      x,
      y: y - height / 2,
      r: 4,
      width,
      height,
      stroke: 'none',
      fill: boxColor,
    };

    let startY = rect.y + padding;
    // @ts-ignore
    var items = [rect];

    packs.forEach((a) => {
      translate(a.items, x - a.x + (width - a.width) / 2, startY - a.y);
      items = items.concat(a.items);
      startY += a.height + spacing;
    });
    var tl = textLabel(rect.x + rect.width / 2, rect.y, `${node.exclude ? 'None' : 'One'} of:`, labelColor);
    items.push(tl.label);
    var oldWidth = width;
    width = Math.max(tl.width, width);
    var offsetX = (width - oldWidth) / 2;// ajust label text
    translate(items, offsetX, 0);
    return {
      items,
      width,
      height: height + tl.height,
      x: Math.min(tl.x, x),
      y: tl.y,
      lineInX: offsetX + x,
      lineOutX: offsetX + x + rect.width,
    };
  },
  group(node, x, y) {
    if (elideOK(node)) return plotNode.empty(null, x, y);
    const padding = 10; const lineColor = 'silver'; const strokeWidth = 2;
    const sub = plotTree(node.sub, x, y);
    if (node.num) {
      translate(sub.items, padding, 0);
      const rectW = sub.width + padding * 2; const rectH = sub.height + padding * 2;
      const rect = {
        type: 'rect',
        x,
        y: sub.y - padding,
        r: 6,
        width: rectW,
        height: rectH,
        'stroke-dasharray': '.',
        stroke: lineColor,
        'stroke-width': strokeWidth,
      };
      const tl = textLabel(rect.x + rect.width / 2, rect.y - strokeWidth, `Group #${node.num}`);
      const items = sub.items.concat([rect, tl.label]);
      const width = Math.max(tl.width, rectW);
      const offsetX = (width - rectW) / 2;// ajust label text space
      if (offsetX) translate(items, offsetX, 0);
      return {
        items,
        width,
        height: rectH + tl.height + 4, // 4 is margin
        x,
        y: tl.y,
        lineInX: offsetX + sub.lineInX + padding,
        lineOutX: offsetX + sub.lineOutX + padding,
      };
    }
    return sub;
  },
  assert(node, x, y) {
    const simpleAssert = {
      AssertNonWordBoundary: { bg: 'maroon', fg: 'white' },
      AssertWordBoundary: { bg: 'purple', fg: 'white' },
      AssertEnd: { bg: 'Indigo', fg: 'white' },
      AssertBegin: { bg: 'Indigo', fg: 'white' },
    };
    let conf; const nat = node.assertionType; let txt = `${nat.replace('Assert', '')}!`;
    if (conf = simpleAssert[nat]) {
      if (_multiLine && (nat === 'AssertBegin' || nat === 'AssertEnd')) {
        txt = `Line${txt}`;
      }
      return textRect(txt, x, y, conf.bg, conf.fg);
    }

    let lineColor; let fg; const padding = 8;
    if (nat === AssertLookahead) {
      lineColor = 'CornflowerBlue';
      fg = 'darkgreen';
      txt = 'Followed by:';
    } else if (nat === AssertNegativeLookahead) {
      lineColor = '#F63';
      fg = 'Purple';
      // txt="Negative\nLookahead!"; // break line
      txt = 'Not followed by:';
    }

    const sub = plotNode.group(node, x, y);
    const rectH = sub.height + padding * 2; const rectW = sub.width + padding * 2;
    const rect = {
      type: 'rect',
      x,
      y: sub.y - padding,
      r: 6,
      width: rectW,
      height: rectH,
      'stroke-dasharray': '-',
      stroke: lineColor,
      'stroke-width': 2,
    };

    const tl = textLabel(rect.x + rectW / 2, rect.y, txt, fg);
    const width = Math.max(rectW, tl.width);
    const offsetX = (width - rectW) / 2;// ajust label text
    translate(sub.items, offsetX + padding, 0);

    if (offsetX) translate([rect, tl.label], offsetX, 0);
    const items = sub.items.concat([rect, tl.label]);
    return {
      items,
      width,
      height: rect.height + tl.height,
      x,
      y: tl.y,
      lineInX: offsetX + sub.lineInX + padding,
      lineOutX: offsetX + sub.lineOutX + padding,
    };
  },
};

function elideOK(a) {
  if (Array.isArray(a)) { // stack
    const stack = a;
    for (let i = 0; i < stack.length; i++) {
      if (!elideOK(stack[i])) return false;
    }
    return true;
  }
  const node = a;
  if (node.type === EMPTY_NODE) return true;

  if (node.type === GROUP_NODE && node.num === undefined) {
    return elideOK(node.sub);
  }

  if (node.type === CHOICE_NODE) {
    return elideOK(node.branches);
  }
}

var hlColorMap = {
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
};

/**
 re AST.tree return by `parse`
*/
function highlight(tree) {
  let texts = [];
  tree.forEach((node) => {
    if (node.sub) {
      texts.push(text('('));
      if (node.type === ASSERT_NODE) {
        if (node.assertionType === AssertLookahead) {
          texts.push(text('?='));
        } else {
          texts.push(text('?!'));
        }
      } else if (node.nonCapture) {
        texts.push(text('?:'));
      }
      texts = texts.concat(highlight(node.sub));
      texts.push(text(')'));
    } else if (node.branches) {
      node.branches.map(highlight).forEach((ts) => {
        texts = texts.concat(ts);
        texts.push(text('|'));
      });
      texts.pop();
    } else {
      const color = hlColorMap[node.type] || hlColorMap.defaults;
      switch (node.type) {
        case CHARSET_NODE:
          var simple = onlyCharClass(node);
          (!simple || node.exclude) && texts.push(text('['));
          if (node.exclude) texts.push(text('^', hlColorMap.charsetExclude));
          node.ranges.forEach((rg) => {
            texts.push(text(_charsetEscape(`${rg[0]}-${rg[1]}`), hlColorMap.charsetRange));
          });
          node.classes.forEach((cls) => {
            texts.push(text(`\\${cls}`, hlColorMap.charsetClass));
          });
          texts.push(text(_charsetEscape(node.chars), hlColorMap.charsetChars));
          (!simple || node.exclude) && texts.push(text(']'));
          break;
        default:
          var s = node.raw || '';
          if (node.repeat) s = s.slice(0, node.repeat.beginIndex);
          s = K.toPrint(s, true);
          texts.push(text(s, color));
      }
    }
    if (node.repeat) {
      const { min } = node.repeat; const
        { max } = node.repeat;
      if (min === 0 && max === Infinity) texts.push(text('*'));
      else if (min === 1 && max === Infinity) texts.push(text('+'));
      else if (min === 0 && max === 1) texts.push(text('?'));
      else {
        texts.push(text('{'));
        texts.push(text(min));
        if (min === max) texts.push(text('}'));
        else {
          texts.push(text(','));
          if (isFinite(max)) texts.push(text(max));
          texts.push(text('}'));
        }
      }
      if (node.repeat.nonGreedy) {
        texts.push(text('?', hlColorMap.repeatNonGreedy));
      }
    }
  });
  return texts;
}

function _charsetEscape(s) {
  s = K.toPrint(s);
  return s.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
}

function text(s, color) {
  color = color || hlColorMap[s] || hlColorMap.defaults;
  return {
    type: 'text',
    'font-size': FONT_SIZE,
    'font-family': FONT_FAMILY,
    text: `${s}`,
    fill: color,
    'text-anchor': 'start',
    'font-weight': 'bold',
  };
}

function onlyCharClass(node) {
  return !node.chars && !node.ranges.length && node.classes.length === 1;
}

export default visualize;
