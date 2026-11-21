export const vendorNames: Readonly<Record<VendorIconId, string>>;
export type VendorIconId = 'openai' | 'anthropic' | 'google' | 'deepseek' | 'qwen' | 'kimi' | 'zhipu'
  | 'xai' | 'meta' | 'minimax' | 'xiaomi' | 'mistral' | 'default';
export function resolveVendorIcon(vendorIcon?: string, modelName?: string, baseUrl?: string): VendorIconId;
