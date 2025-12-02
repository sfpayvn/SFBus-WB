export const withFeatureHeaders = (moduleKey: string, functionKey?: string | null) => ({
  'X-Feature-Module': moduleKey,
  ...(functionKey ? { 'X-Feature-Function': functionKey } : {}),
});
