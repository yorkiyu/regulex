import React, { useEffect } from 'react';
import regulex from '@regulex';

export default function App() {
  console.log(regulex);
  const { parse, visualize, Raphael } = regulex;
  useEffect(() => {
    const regexp = /var\s+([a-zA-Z_]\w*);/ ;
    const regexpParse = regulex.parse(regexp.source);
    const paper = Raphael('raphael', 0, 0);
    visualize(regexpParse, 'g', paper);
  }, []);
  return <div id="raphael"></div>;
}
