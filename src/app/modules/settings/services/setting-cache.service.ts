import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Setting } from '../model/setting.model';
import { StorageService } from '@rsApp/shared/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SettingCacheService {
  private storageKey = 'app_settings_cache';
  private cache = new Map<string, Setting>();
  private readyResolve!: () => void;
  private readyPromise: Promise<void>;

  constructor(private storageService: StorageService) {
    this.readyPromise = new Promise((r) => (this.readyResolve = r));
    this.hydrateFromStorage().finally(() => this.readyResolve());
  }

  /**
   * Returns a promise that resolves once the in-memory cache is hydrated from storage.
   */
  whenReady(): Promise<void> {
    return this.readyPromise;
  }

  private async hydrateFromStorage(): Promise<void> {
    try {
      const raw = await this.storageService.get(this.storageKey);
      if (!raw) return;
      const arr = JSON.parse(raw) as Setting[];
      for (const s of arr) this.cache.set(s.name, s);
    } catch (e) {
      console.error('Failed to hydrate settings cache', e);
    }
  }

  private persistToStorage(): void {
    try {
      const arr = Array.from(this.cache.values());
      // fire-and-forget async persistence
      this.storageService.set(this.storageKey, JSON.stringify(arr)).catch((e) => {
        console.error('Failed to persist settings cache', e);
      });
    } catch (e) {
      console.error('Failed to persist settings cache', e);
    }
  }

  createOrUpdate(setting: Setting): Observable<Setting> {
    const existing = this.cache.get(setting.name);
    const merged = existing ? { ...existing, ...setting } : { ...setting };
    this.cache.set(merged.name, merged);
    this.persistToStorage();
    return of(merged);
  }

  createOrUpdates(items: Setting[]): Observable<Setting[]> {
    for (const it of items) {
      const existing = this.cache.get(it.name);
      const merged = existing ? { ...existing, ...it } : { ...it };
      this.cache.set(merged.name, merged);
    }
    this.persistToStorage();
    return of(Array.from(this.cache.values()));
  }

  getSettingByName(name: string): Observable<Setting | undefined> {
    return of(this.cache.get(name));
  }

  getSettingByGroupName(groupName: string): Observable<Setting[]> {
    const results: Setting[] = [];
    for (const s of this.cache.values()) {
      if (s.groupName === groupName) results.push(s);
    }
    return of(results);
  }

  getAll(): Observable<Setting[]> {
    return of(Array.from(this.cache.values()));
  }

  clearCache(): void {
    this.cache.clear();
    try {
      this.storageService.remove(this.storageKey).catch((e) => {
        console.error('Failed to clear settings cache', e);
      });
    } catch (e) {
      console.error('Failed to clear settings cache', e);
    }
  }
}
