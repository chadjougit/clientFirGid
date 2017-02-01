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
import { State } from '../reducers/reducers';
import 'rxjs/add/operator/take'

import { Message, GrowlModule } from 'primeng/primeng';
import { SubmitButton } from '../shared/SubmitButton';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TransactionComponent implements OnInit {
    msgs: Message[] = [];
    msgs2: Message[] = [];

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
        this.showWarn()
        this.GetAllUsers();

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
    /**
     *метод на основе ngbootstrap для заполняемой строки
     */

    showWarn() {
        this.msgs2 = [];
        this.msgs2.push({ severity: 'warn', summary: 'Warn Message', detail: 'There are unsaved changes' });
    }

    show2() {
        this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'PrimeNG rocks' });
    }

    hide2() {
        this.msgs = [];
    }

    show() {
        this.msgs.push({ severity: 'warn', summary: 'Info Message', detail: 'PrimeNG rocks' });
    }

    hide() {
        this.msgs = [];
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
     *Метод для вызова списка пользователей с сервера. Возможно стоит его вызывать с интервалом
     */
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

    SendTransactionToUser(username: string, summ: number) {
        this.userData.take(1).subscribe(content => {
            //потом поправить!!!!!
            if (content.amount - this.userData.amount < 0) {
                console.log("маааало");
                alert("need more");
            }

            else if (this.userData.amount < 0)
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

    ngOnInit() {
        this.userData.take(1).subscribe(content => {
            console.log(content);

            this.complexForm.controls['recipient'].setValue(content.newTranscation.RecipientUsername);

            this.complexForm.controls['Amount'].setValue(content.newTranscation.Amount);
        });
    }
}