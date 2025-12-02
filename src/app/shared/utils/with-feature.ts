import { HttpHeaders } from '@angular/common/http';
export function withFeatureHeaders(moduleKey: string, functionKey?: string | null, base?: HttpHeaders): HttpHeaders {
  let h = base ?? new HttpHeaders();
  h = h.set('X-Feature-Module', moduleKey);
  if (functionKey) h = h.set('X-Feature-Function', functionKey);
  return h;
}
