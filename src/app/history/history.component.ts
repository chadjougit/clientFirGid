import { Component, OnInit, transition, ViewContainerRef } from '@angular/core';
import { IdentityService } from '../services/identity.service';
import { AuthHttp } from 'angular2-jwt';
import { Store } from '@ngrx/store';
import { State, UpdateAmount, UpdateHistory, AddNewTransaction } from '../reducers/reducers';

import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import * as moment from 'moment';

export interface Transaction {
    Id: number;
    Amount: number;
    SenderUsername: string;
    RecipientUsername: number;
}

interface newtransaction {
    Id: number;
    Amount: number;
    SenderUsername: string;
    RecipientUsername: string;
    Date: Date;
}

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
    transaction = null;

    userData: any;

    userDataCopied: any;

    simpleArray4userData: any;

    constructor(public authHttp: AuthHttp, private router: Router, public identity: IdentityService, private store: Store<State>) {
        this.userData = this.store.select("UserDataReducer");

        // testing moment.js
        //  console.log('today is', moment());
    }

    ngOnInit() {
        this.GetTransactionsFromReducer();
    }

    /**
    * sending transaction by id to ngrx
    */

    SendTransactionId(id: number) {
        let transactionsToSend = this.userDataCopied.transactions;

        this.store.dispatch(new AddNewTransaction(transactionsToSend.map(trans => { trans.Amount = trans.Amount * 1; return trans }).find(trans => trans.Id == id)));

        this.router.navigate(["Transaction"]);
    }

    GetTransactionsFromReducer() {
        this.userData.subscribe(
            data => {
  

                /*
                var testtt = data.transactions;
                var testtt2 = Object.assign({},data.transactions);
                var reSpecial = this.wassign(data);
                let object2 = Object.freeze(Object.assign({}, data));
                let object3 = Object.freeze(Object.assign({}, data.transaction));
                var newObject = Object.assign(Object.create(data), data);
                */


                // Simple clone making changes in ngrx/store.
                // it's a little dumb, but this helps for deep clone. All stuff above not working.
                
                //TODO: check for another realization.
                this.userDataCopied = JSON.parse(JSON.stringify(data));

                this.simpleArray4userData = [];

                if (this.userDataCopied.transactions != null) {
                    for (let entry of this.userDataCopied.transactions) {
                        let newtrans = { Id: entry.Id, Amount: entry.Amount, SenderUsername: entry.SenderUsername, RecipientUsername: entry.RecipientUsername, Date: new Date(Date.parse(entry.Date)) };

                        this.simpleArray4userData.push(newtrans);
                    }

                    //
                    this.simpleArray4userData = this.simpleArray4userData.sort(function (a, b) {
                        return (Date.parse(b.Date) - Date.parse(a.Date)) || 0;
                    });
                }
            })
    }
}