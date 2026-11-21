import { API_BASE, apiError, json } from './api';
import type { VendorIconId } from '../../../shared/vendor-icon.mjs';

export interface FollowupProfile {
  id: string;
  name: string;
  tierLabel: string;
  model: string;
  vendorIcon: VendorIconId;
  creditCost: number;
  supportsVision: boolean;
  isDefault: boolean;
}

type FollowupCredits = {
  dailyCreditLimit: number;
  dailyCreditsUsed: number;
  dailyCreditsRemaining: number;
};

type FollowupModel = {
  profileId: string | null;
  vendorIcon: VendorIconId | null;
  creditCost: number;
};

export interface FollowupMessage extends FollowupModel {
  id: number;
  question: string;
  content: string;
  status: 'streaming' | 'completed' | 'failed' | 'cancelled';
  error: string | null;
  imagesSkipped: boolean;
  contextRevision: string;
  model: string | null;
  profileName: string | null;
  durationMs: number | null;
  creditsCharged: number;
}

export interface FollowupHistory extends FollowupCredits {
  messages: FollowupMessage[];
  count: number;
  nextBefore: number | null;
  availableProfiles: FollowupProfile[];
  activeMessageId: number | null;
  contextRevision: string;
  readOnly: boolean;
}

type FollowupEvent =
  | { type: 'delta'; id: number; text: string }
  | ({ type: 'meta' | 'done' | 'error'; message: FollowupMessage } & FollowupCredits & FollowupModel);

export async function streamFollowup(
  path: string,
  body: ({ question: string } | { retryMessageId: number }) & { profileId?: string },
  signal: AbortSignal,
  receive: (event: FollowupEvent) => void,
) {
  const response = await fetch(API_BASE + path + '/stream', {
    ...json(body), signal, credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
  });
  if (!response.ok) throw apiError(response, await response.json().catch(() => null));
  if (!response.body) throw new Error('无法打开追问连接，请重试');

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  let finished = false;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      let boundary: RegExpExecArray | null;
      while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
        const block = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary[0].length);
        const type = /^event: (meta|delta|done|error)$/m.exec(block)?.[1];
        const data = /^data: (.+)$/m.exec(block)?.[1];
        if (!type || !data) continue;
        receive({ ...JSON.parse(data), type });
        if (type === 'done' || type === 'error') finished = true;
      }
    }
    if (!finished) throw new Error('连接已断开，正在同步回复状态');
  } finally {
    reader.releaseLock();
  }
}
