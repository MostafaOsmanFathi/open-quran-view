import { AssetFetcher } from './types';

export class WebAssetFetcher implements AssetFetcher {
  private baseUri: string;

  constructor(baseUri: string = '/') {
    this.baseUri = baseUri;
  }

  async fetchJSON<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUri}${path}`);
    if (!response.ok) throw new Error(`Failed to fetch JSON: ${path}`);
    return await response.json() as T;
  }

  async fetchText(path: string): Promise<string> {
    const response = await fetch(`${this.baseUri}${path}`);
    if (!response.ok) throw new Error(`Failed to fetch text: ${path}`);
    return await response.text();
  }

  getAssetUrl(path: string): string {
    return `${this.baseUri}${path}`;
  }
}
