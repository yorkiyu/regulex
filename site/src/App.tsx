import React, { useEffect, useState } from 'react';
import regulex from '@regulex';

export default function App() {
  const { parse, visualize, download } = regulex;
  const regexp = /var\s+([a-zA-Z_]\w*);/ ;
  const [paper, setPaper] = useState(null);
  useEffect(() => {
    const regexpParse = parse(regexp.source);
    const p = visualize({
      regexpParse,
      flags: 'g',
      containerId: 'raphael',
    });
    setPaper(p);
  }, []);
  return <>
    <div id="raphael"></div>
    <button
      onClick={() => {
        download.png(paper, regexp.source);
      }}
    >下载图片</button>
  </>;
}
