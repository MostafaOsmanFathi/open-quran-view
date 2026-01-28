import { DynamicDataLoader } from './index';
import { AssetFetcher, Riwaya } from './types';

const mockFetcher: AssetFetcher = {
  fetchJSON: async () => [],
  fetchText: async () => '',
  getAssetUrl: (path) => path
};

function testFontUrl() {
  const riwayas: Riwaya[] = ['hafs', 'warsh', 'qaloon'];
  
  riwayas.forEach(riwaya => {
    const loader = new DynamicDataLoader(mockFetcher, riwaya);
    const url = loader.getFontUrl();
    console.log(`${riwaya}: ${url}`);
    
    if (riwaya === 'warsh' && !url.includes('v10')) {
      throw new Error(`Warsh font should be v10, got: ${url}`);
    }
    if (riwaya !== 'warsh' && !url.includes('v18')) {
      throw new Error(`${riwaya} font should be v18, got: ${url}`);
    }
  });
  
  console.log("✅ Font URL verification passed!");
}

testFontUrl();
