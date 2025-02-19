import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { BehaviorSubject, Observable } from "rxjs";
import { StorageService } from "./storage.service";
import { CookieService } from "./cookie.service";

@Injectable({
    providedIn: "root",
})
export class CredentialService {

    private currentUserSubject!: BehaviorSubject<any>;
    public currentUser!: Observable<any>;

    private userResidualSubject!: BehaviorSubject<any>;
    public userResidual!: Observable<any>;

    constructor(
        private storageService: StorageService,
        private cookieService: CookieService,
    ) {
        this.currentUserSubject = new BehaviorSubject<any>(this.cookieService.get('user'));
        this.currentUser = this.currentUserSubject.asObservable();
        this.userResidualSubject = new BehaviorSubject<any>(this.cookieService.get('userResidual'));
        this.userResidual = this.userResidualSubject.asObservable();
    }

    async setToken(token: string): Promise<void> {
        await this.storageService.set('token', token);
    }

    async removeToken(): Promise<void> {
        await this.storageService.remove('token');
    }

    async getToken(): Promise<string | null> {
        return await this.storageService.get('token');
    }


    async setCurrentUser(user: any) {
        await this.cookieService.set('user', user, 7); // Cookie expires in 7 days
        this.currentUserSubject.next(user);
    }

    getCurrentUser(): Observable<any> {
        return this.currentUser;
    }

    async removeCurrentUser() {
        await this.cookieService.remove('user');
        this.currentUserSubject.next(null);
    }

    async setUserResidual(user: any) {
        await this.cookieService.set('userResidual', user, 7); // Cookie expires in 7 days
        this.userResidualSubject.next(user);
    }

    getUserResidual(): Observable<any> {
        return this.userResidual;
    }

    async removeUserResidual() {
        await this.cookieService.remove('userResidual');
        this.userResidualSubject.next(null);
    }
}
