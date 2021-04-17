import React, { useEffect, useState } from 'react';
// @ts-ignore
import regulex from '@regulex';

export default function App() {
  const { parse, visualize, Raphael, saveSvg } = regulex;
  const [paper, setPaper] = useState(null);
  const regexp = /var\s+([a-zA-Z_]\w*);/ ;
  useEffect(() => {
    const regexpParse = parse(regexp.source);
    const paper = Raphael('raphael', 0, 0);
    setPaper(paper);
    visualize(regexpParse, 'g', paper);
  }, []);
  return <>
    <div id="raphael"></div>
    <button
      onClick={() => {
        saveSvg.saveSvgAsPng(paper?.canvas, regexp.source);
      }}
    >下载图片</button>
  </>;
}
