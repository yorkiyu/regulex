import raphael, { RaphaelPaper } from 'raphael';
import { VisualizeParams } from '@v-regexp/types/visualize';
import { Theme } from '@v-regexp/types/theme';
import themes from '../themes';
import { getCharSize, getHighlightText, getTemplateText, translate } from './common';
import { highlight } from './highlight';
import { plot } from './plot';

export default function visualize({
  regexpParse,
  flags,
  themeOption = 'normal',
  containerId,
}: VisualizeParams): RaphaelPaper {
  const theme: Theme = typeof themeOption === 'string' ? themes[themeOption] : themeOption;
  const paper = raphael(containerId, 0, 0);
  paper.clear();
  paper.setSize(0, 0);
  const bg = paper.rect(0, 0, 0, 0);
  bg.attr('fill', theme.bgColor);
  bg.attr('stroke', theme.bgColor);

  if (!theme.global) {
    theme.global = {};
  }
  theme.global.templateText = getTemplateText(paper, theme);
  theme.global.multiLine = !!~flags.indexOf('m');

  let texts = highlight(regexpParse.tree, theme);

  texts.unshift(
    getHighlightText({
      str: '/',
      color: theme.highlightColor.delimiter,
      theme,
    }),
  );
  texts.unshift(
    getHighlightText({
      str: 'RegExp: ',
      theme,
    }),
  );
  texts.push(
    getHighlightText({
      str: '/',
      color: theme.highlightColor.delimiter,
      theme,
    }),
  );
  if (flags) {
    texts.push(
      getHighlightText({
        str: flags,
        color: theme.highlightColor.flags,
        theme,
      }),
    );
  }
  const charSize = getCharSize({
    fontSize: theme.nodeFontSize,
    fontBold: 'bold',
    templateText: theme.global.templateText,
  });
  const startX = theme.paperMargin;
  const startY = charSize.height / 2 + theme.paperMargin;

  let width = 0;
  let height = 0;
  width = texts.reduce((x, t) => {
    t.x = x;
    t.y = startY;
    const w = t.text.length * charSize.width;
    return x + w;
  }, startX);
  width += theme.paperMargin;
  height = charSize.height + theme.paperMargin * 2;
  // @ts-ignore
  texts = paper.add(texts);

  paper.setSize(width, charSize.height + theme.paperMargin * 2);

  const ret = plot({
    tree: regexpParse.tree,
    x: 0,
    y: 0,
    theme,
  });

  height = Math.max(ret.height + 3 * theme.paperMargin + charSize.height, height);
  width = Math.max(ret.width + 2 * theme.paperMargin, width);
  paper.setSize(width, height);

  bg.attr('width', width);
  bg.attr('height', height);

  translate(ret.items, theme.paperMargin, theme.paperMargin * 2 + charSize.height - ret.y);
  // @ts-ignore
  paper.add(ret.items);

  return paper;
}
