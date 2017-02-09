import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import { Config } from '../config';
import { AuthHttp } from 'angular2-jwt';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class Helpers {
    //public collection$: Observable<any>;
    public _collectionObserver: any;
    public _collection: Array<string>;
    public collection$ = new Observable(observer => {
        this._collectionObserver = observer;
    }).share();

    /**
    * Emit "true" when we set token in localStorage, "false" when we remove
    */
    public tokenSubject = new BehaviorSubject(false);

    constructor() {
        this.tokenSubject.next(this.tokenNotExpired());
    }

    /**
     * Gets the token from the storage.
     *
     * @param name Token's name
     * @return The Token
     */

    tokenNotExpired(): boolean {
        let token: string = this.getToken('id_token');

        return token != null && (this.getExp() > new Date().valueOf());
    }

    public getToken(name: string): string {
        return localStorage.getItem(name);
    }

    /**
     * Stores the token.
     *
     * @param name Token's name
     * @param value The token
     */
    public setToken(name: string, value: string) {
        localStorage.setItem(name, value);
        //this._collectionObserver.next("true");
        console.log(this.tokenSubject.value + "tokenSubject!!");
        if (!this.tokenSubject.value)
        { this.tokenSubject.next(true); }
    }

    /**
     * Removes the token from the storage.
     *
     * @param name Token's name
     */
    public removeToken(name: string): void {
        localStorage.removeItem(name);
        //  this._collectionObserver.next(false);
        if (this.tokenSubject.value)
            this.tokenSubject.next(false);
    }

    /**
     * Stores token expiration.
     *
     * @param exp Token expiration in milliseconds
     */
    public setExp(exp: number) {
        localStorage.setItem("exp", exp.toString());
    }

    /**
     * Gets token expiration.
     *
     * @return Token expiration in milliseconds
     */
    public getExp(): number {
        return parseInt(localStorage.getItem("exp"));
    }

    /**
     * Removes token expiration from the storage.
     *
     * @return Token expiration in milliseconds
     */
    public removeExp(): void {
        localStorage.removeItem("exp");
    }
}