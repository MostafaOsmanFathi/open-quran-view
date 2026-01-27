import React, { useEffect, useState } from 'react';
import { Canvas, Text, Group } from '@shopify/react-native-skia';
import { DynamicDataLoader, LayoutRow, Recitation } from '../../core/index';

export interface QuranViewProps {
  page: number;
  recitation?: Recitation;
  loader: DynamicDataLoader;
  width: number;
  height: number;
}

export const QuranView: React.FC<QuranViewProps> = ({
  page,
  recitation = 'Hafs',
  loader,
  width,
  height
}: QuranViewProps) => {
  const [layout, setLayout] = useState<LayoutRow[]>([]);
  const [fonts, setFonts] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      const layoutData = await loader.getLayoutForPage(page);
      if (!isMounted) return;
      setLayout(layoutData);
      
      // Font loading logic would go here
      // For now, we assume fonts derived from loader.getFontUrl are provided/cached
      
      setLoading(false);
    };
    load();
    return () => { isMounted = false; };
  }, [page, recitation, loader]);

  if (loading) return null;

  return (
    <Canvas style={{ width, height }}>
      {(() => {
        const lines: Record<number, LayoutRow[]> = {};
        layout.forEach((row: LayoutRow) => {
          if (!lines[row.line]) lines[row.line] = [];
          lines[row.line].push(row);
        });

        const rowHeight = height / 15;
        
        return Object.entries(lines).map(([lineNo, rowGlyphs]: [string, LayoutRow[]]) => {
          const ln = parseInt(lineNo);
          return (
            <Group key={ln}>
              {rowGlyphs.map((glyph: LayoutRow, i: number) => {
                const font = fonts[glyph.word] || null;
                const xPos = width - (i * 20) - 40; // Rough RTL layout centering placeholder
                const yPos = ln * rowHeight;
                
                return (
                  <Text
                    key={`${ln}-${i}`}
                    text={String.fromCharCode(61696 + (glyph.glyph as number))}
                    x={xPos}
                    y={yPos}
                    font={font}
                    color="black"
                  />
                );
              })}
            </Group>
          );
        });
      })()}
    </Canvas>
  );
};
