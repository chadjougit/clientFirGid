import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IdentityService } from '../services/identity.service';
import { CustomValidators } from 'ng2-validation';
import { TypeaheadModule } from 'ng2-bootstrap/typeahead';

import { TypeaheadMatch } from 'ng2-bootstrap';
import 'rxjs/add/observable/of';
import { Store } from '@ngrx/store';
import { State, UpdateHistory, UpdateAmount } from '../reducers/reducers';
import 'rxjs/add/operator/take'

import { Message, GrowlModule } from 'primeng/primeng';
import { SubmitButton } from '../shared/SubmitButton';
import { Log, Level } from 'ng2-logger/ng2-logger';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TransactionComponent implements OnInit {
    primengMsgs: Message[] = [];

    complexForm: FormGroup;
    public stateCtrl: FormControl = new FormControl();

    public myForm: FormGroup = new FormGroup({
        state: this.stateCtrl
    });

    public dataSource: Observable<any>;
    public asyncSelected: string = '';
    public asyncAmount: string = '';

    public typeaheadLoading: boolean = false;
    public typeaheadNoResults: boolean = false;

    // userData: Observable<any>;
    userData: any;

    SubmitButton = new SubmitButton("Submit");

    constructor(fb: FormBuilder, public identity: IdentityService, private store: Store<State>) {
       const log = Log.create('transactions');
       log.color = "red"; 
       log.er('transactions error log'); // console.log
        this.GetAllUsers();
         log.d('object') // console.log
    log.er('object') // console.error
    log.i('object') // console.info
    log.w('object') // console.warn

        this.dataSource = Observable.create((observer: any) => {
            // Runs on every search
            observer.next(this.asyncSelected);
        }).mergeMap((token: string) => this.getusersAsObservable(token));

        this.userData = this.store.select("UserDataReducer");

        this.complexForm = fb.group({
            'recipient': ["", [Validators.required, CustomValidators.email]],
            'Amount': ["100", [Validators.required, CustomValidators.number]],
        })
    }

    users: any;

    show() {
        this.primengMsgs.push({ severity: 'success', summary: 'Success Message', detail: 'sucess transaction' });
    }

    hide() {
        this.primengMsgs = [];
    }

    public getusersAsObservable(token: string): Observable<any> {
        let query = new RegExp(token, 'ig');

        return Observable.of(
            this.users.filter((state: any) => {
                return query.test(state);
            })
        );
    }

    public changeTypeaheadLoading(e: boolean): void {
        this.typeaheadLoading = e;
    }

    public changeTypeaheadNoResults(e: boolean): void {
        this.typeaheadNoResults = e;
    }

    public typeaheadOnSelect(e: TypeaheadMatch): void {
        console.log('Selected value: ', e.value);
        console.log(this.asyncSelected);
        console.log(this.asyncAmount);
    }

    /**
     *Method that gets all users from server. 
     */
    //TODO: perhaps need to use an interval
    GetAllUsers() {
        this.identity.GetAllUsers()
            .subscribe(
            (res: any) => {
                this.users = res;
                console.log(res);
            },
            (error: any) => {
                // Error on get request.
                let errMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

                console.log(errMsg);
            });
    }

    click$: Observable<any> = new Subject().map((value: any) => {
        this.SendTransactionToUser(value.recipient, value.Amount);
    });

    subscription: any = this.click$.subscribe(
        x => console.log('onNext: %s', JSON.stringify(x)),
        e => console.log('onError: %s', e),
        () => console.log('onCompleted'));


     /**
     *send transaction to user by his username 
     */
    SendTransactionToUser(username: string, summ: number) {
        this.userData.take(1).subscribe(content => {
            if (content.amount - this.userData.amount <= 0) {
                console.log("маааало");
                alert("need more");
            }

            else if (this.userData.amount <= 0)
            { alert("wrong summ!"); }

            else {
                console.log("ноооорм");
                this.SubmitButton.deactivate();
                this.identity.SendTransactionToUser(username, summ)
                    .subscribe(
                    (res: any) => {
                        // IdentityResult.
                        if (res.succeeded) {
                            this.SubmitButton.activate()
                            console.log(res.succeeded);

                        } else {
                            console.log(res.errors);
                        }
                        this.SubmitButton.activate()
                         this.show();
                            this.identity.GetCurrentUserData().subscribe((data) => {
                                console.log("GetCurrentUserData " + data);

                                let parsedata = JSON.parse(data);


                                //добавляем полученные данные в стор
                                this.store.dispatch(new UpdateHistory(parsedata.UserTransactions));
                                this.store.dispatch(new UpdateAmount(parsedata.UserPw));
                            });
                    },
                    (error: any) => {
                        // Error on post request.
                        let errMsg = (error.message) ? error.message :
                            error.status ? `${error.status} - ${error.statusText}` : 'Server error';

                        console.log(errMsg);
                        this.SubmitButton.activate()    
                    });
            }
        });
    }


Test(){

 this.identity.Test("vlad@mail.com")
                    .subscribe(
                    (res: any) => {
                        console.log(res);
})};



    ngOnInit() {
        this.userData.take(1).subscribe(content => {
            console.log(content);

            this.complexForm.controls['recipient'].setValue(content.newTranscation.RecipientUsername);

            this.complexForm.controls['Amount'].setValue(content.newTranscation.Amount);
        });
    }
}