import type { SSRCacheKey } from './types';

export const PORT = 3000;
export const FILE_REGEXP =
    /\.(js|css|png|jpe?g|gif|svgz?|webp|ico|tif?f|bmp|otf|ttf|eot|woff2?|flac|mp[34]|aif?f|wav|webm|og[gv]|avi|mov|flv|mkv|mka|mks|3gp|mpg|mpeg|vmw|flc|asf|rm|iso|docx?|xlsx?|pptx?|pdf|txt|md|json|xml|csv|tsv|yml|yaml|ini|sh|bat|cmd|exe|dll|so|class|jar|psd|ai|indd|eps|raw|map)(\.?|$)/i;

export const HOST = 'http://localhost:4173/';
export const PAGE_LIST: SSRCacheKey[] = [
    { refreshDelay: 10 * 1_000, value: HOST },
    { value: `${HOST}about` },
    { isDisabledCache: true, value: `${HOST}test1` },
    { isDisabledRefresh: true, lifetime: 5 * 1_000, value: `${HOST}test2` },
];

export const DEFAULT_PAGE_SELECTOR = '#root';
export const PUPPETEER_OPTIONS = { args: ['--no-sandbox'] };

export const DEFAULT_LIFETIME_CACHE = 1_000 * 60;
export const DEFAULT_LIFETIME_UNKNOWN_PAGE = 1_000 * 60 * 60;
export const WAIT_FOR_SELECTOR_TIMEOUT = 1_000 * 30;
export const REFRESH_BROWSER_TIMEOUT = 1_000 * 20;

export const DEFAULT_LOOP_DELAY = 1_000 * 30;
export const DEFAULT_RETRY_DELAY = 1_000 * 5;
export const DEFAULT_START_DELAY = 1_000 * 30;
export const DEFAULT_RETRY_COUNT = 1;
