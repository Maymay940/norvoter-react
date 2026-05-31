const isGitHubPages = window.location.hostname.includes('github.io');
const BASE_PATH = isGitHubPages ? '/norvoter-react' : '';

export const getAssetPath = (path: string) => {
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (BASE_PATH && cleanPath.startsWith(`${BASE_PATH.slice(1)}/`)) {
    return `/${cleanPath}`;
  }

  return `${BASE_PATH}/${cleanPath}`;
};
