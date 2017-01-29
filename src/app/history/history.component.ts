import { Component, OnInit, transition } from '@angular/core';
import { IdentityService } from '../services/identity.service';
import { AuthHttp } from 'angular2-jwt';
import { Store } from '@ngrx/store';
import { State, UpdateAmount, UpdateHistory, AddNewTransaction } from '../reducers/reducers';

import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


export interface Transaction {
    Id: number;
    Amount: number;
    SenderUsername: string;
    RecipientUsername: number;

}

interface newtransaction {
    Id: number;
    amount: number;
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
    userDataCopied2: any;

    constructor(public authHttp: AuthHttp, private router: Router, public identity: IdentityService, private store: Store<State>) {

 this.userData = this.store.select("UserDataReducer");
this.GetTransactionsFromReducer(); 

     }

    lastUpdated = new Date();

    ngOnInit() {

// this.GetTransactions(); 
//this.GetTransactionsFromReducer(); 

    }



    //

    GetTime() {

        this.identity.GetTime()
            .subscribe(
            (res: string) => {


                console.log(res);
                var b: Date = new Date(res);
                console.log(b);

                /*
                this.transaction = res[0];
                console.log(res[2]);
                console.log(res);
                */

            },
            (error: any) => {

                // Error on post request.
                let errMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

                console.log(errMsg);
                console.log("совсемnotsuccsess");

            });

    }


    //


    SendTransactionId(id: number) {


        console.log(id);

        //let testvalue = this.transaction.find(trans => trans.Id == id).map(messages => {return messages});

        //let testvalue = this.transaction.map(trans => {trans.Amount = trans.Amount * -1; return trans});

        let transactionsToSend = this.userData.transactions;

        this.store.dispatch(new AddNewTransaction(transactionsToSend.map(trans => { trans.Amount = trans.Amount * 1; return trans }).find(trans => trans.Id == id)));
         
         this.router.navigate(["Transaction"]);


    }







    GetTransactionsFromReducer() {

       
          
      

        this.userData.subscribe(
            data => {
                // Set the products Array
                //this.userData.transactions = data.transactions;
                

/*
var testtt = data.transactions;
var testtt2 = Object.assign({},data.transactions); 
var reSpecial = this.wassign(data);
let object2 = Object.freeze(Object.assign({}, data));
let object3 = Object.freeze(Object.assign({}, data.transaction));
var newObject = Object.assign(Object.create(data), data);
const clone = JSON.parse(JSON.stringify(data));


              this.userDataCopied =  Object.assign({},data); 
                 
                 

             //  this.userDataCopied = null;


                this.userDataCopied.amount = 150; 

              //  this.userDataCopied.transactions.map(somedata => { somedata.Date = "test"; return somedata }) 

               for (let entry of  this.userDataCopied.transactions) {
                   
                   entry.Amount = 0;
                   entry.Date = "test2";
    
}
*/


           


this.userDataCopied = JSON.parse(JSON.stringify(data));
	
/*
interface newtransaction {
    Id: number;
    amount: number;
    SenderUsername: string;
    RecipientUsername: string;
    Date: string;

}
*/


var Numbers:newtransaction[] = [];
    for (let entry of  this.userDataCopied.transactions) {
                   
            let newtran: newtransaction = {Id: entry.Id, amount : entry.amount,  SenderUsername: entry.SenderUsername, RecipientUsername: entry.RecipientUsername,  Date: new Date(Date.parse(entry.Date)) };  
    
    Numbers.push(newtran);
}

var Dates:string[] = [];
    for (let entry of  this.userDataCopied.transactions) {
                   
           // let newtran: newtransaction = {Id: entry.Id, amount : entry.amount,  SenderUsername: entry.SenderUsername, RecipientUsername: entry.RecipientUsername,  Date: new Date(Date.parse(entry.Date)) };  
    
            let newtran2 = entry.Date
    Dates.push(newtran2);
}

Dates = Dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

this.userDataCopied2 = JSON.parse(JSON.stringify(this.userDataCopied.transactions));

this.userDataCopied2 = this.userDataCopied2.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
this.userDataCopied2 = this.userDataCopied2.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
//this.userDataCopied2 =  this.userDataCopied.transactions.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

/*
               this.userDataCopied.transactions.map(somedata => { somedata.Date = new Date(Date.parse(somedata.Date)); return somedata }) 
this.userDataCopied.transactions.sort((task1, task2) => {task2.Date   - task1.Date});
*/





               console.log("test");
         
                //this.userData = data;
            })



    }




/*
    GetTransactions() {

        this.identity.GetTransactions()
            .subscribe(
            (res: string) => {


                console.log(JSON.parse(res));
                this.transaction = JSON.parse(res);
                this.transaction = this.transaction.sort(function (a, b) {
                    return b.Id - a.Id})

                this.store.dispatch(new UpdateHistory(this.transaction));
            
            },
            (error: any) => {

                // Error on post request.
                let errMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

                console.log(errMsg);
                console.log("совсемnotsuccsess");

            });

    }
*/
}
