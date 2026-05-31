const isGitHubPages = window.location.hostname.includes('github.io');
const BASE_PATH = isGitHubPages ? '/norvoter-react' : '';

export const getAssetPath = (path: string) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_PATH}/${cleanPath}`;
};