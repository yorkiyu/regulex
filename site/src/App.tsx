import React, { useEffect, useState } from 'react';
import vregexp from '@v-regexp';

export default function App() {
  const { parse, visualize, download } = vregexp;
  const regexp = /^var\s+([a-zA-Z_]{2,5}\w*);.{0,3}(a|b|[\u4e00-\u9fa5]+)$/;
  const [paper, setPaper] = useState(null);

  useEffect(() => {
    const regexpParse = parse(regexp.source);
    const p = visualize({
      regexpParse,
      flags: 'gmi',
      containerId: 'raphael',
    });
    setPaper(p);
  }, []);

  return (
    <>
      <div id="raphael" />
      <button
        type="button"
        onClick={() => {
          download.png(paper, regexp.source);
        }}
      >
        下载图片
      </button>
    </>
  );
}
