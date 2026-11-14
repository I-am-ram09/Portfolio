// Resolves files in /public so the site also works when deployed under a sub-path.
export const asset = (p) => `${import.meta.env.BASE_URL}${p}`
