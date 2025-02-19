import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  constructor() {
    this.init();
  }

  async init() {
    // Perform any initialization logic if needed
  }

  async get(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async set(key: string, value: string): Promise<void> {
    await localStorage.setItem(key, value);
  }

  async remove(key: string): Promise<void> {
    await localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    await localStorage.clear();
  }
}
