const hostname = window.location.hostname;
const isGitHubPages = hostname === 'maymay940.github.io' || hostname.includes('github.io');

export const USE_MOCK = isGitHubPages;

console.log('env конфигурация');
console.log('Hostname:', hostname);
console.log('isGitHubPages:', isGitHubPages);
console.log('USE_MOCK:', USE_MOCK);