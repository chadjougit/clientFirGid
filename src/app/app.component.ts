import { isBoolean } from 'util';
import { BehaviorSubject } from 'rxjs/Rx';
import { Component, DoCheck, OnChanges, SimpleChanges, KeyValueDiffers } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { SigninService } from './services/signin.service';
import { IdentityService } from './services/identity.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { State, UpdateHistory, UpdateAmount, ToDefault } from './reducers/reducers';
import { Helpers } from './services/Helpers';
import { Connection } from './websocket/Connection';
import { SubmitButton } from './shared/SubmitButton';

import { Message, GrowlModule } from 'primeng/primeng';

import { Log, Level } from 'ng2-logger/ng2-logger';
import { CustomValidators } from 'ng2-validation';

//ALPHA 1.04
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})



export class AppComponent {

    complexForm: FormGroup;
    primengMsgs: Message[] = [];

    userData: any;
    connection: any;
    parsedata: any;
    SubmitButton = new SubmitButton("Submit");

    constructor(fb: FormBuilder, public authenticationService: AuthenticationService, private router: Router,
        public authHttp: AuthHttp, public Signin: SigninService, public identity: IdentityService, private store: Store<State>, public Helpers: Helpers, private differs: KeyValueDiffers) {

 //Log.setProductionMode();
  const log = Log.create('books'); 
 
  log.er('test error log'); // console.log


        this.connection = new Connection("ws://localhost:5000/test");
        this.connection.enableLogging = true;

        this.connection.connectionMethods.onConnected = () => {

            console.log("You are now connected! Connection ID: " + this.connection.connectionId);

            console.log("let's invoke getcurrentuserdata");
            this.identity.GetCurrentUserData(this.connection.connectionId).subscribe((data) => {
                console.log("GetCurrentUserData " + data);



               //TODO: this "data" with double quotes. It's produce an error while parsing. Need to fix
               //quickfix 
               //data = data.replace(/^"(.*)"$/, '$1'); 
               //
                let parsedata = JSON.parse(data);
              //this.parsedata = data;


                //добавляем полученные данные в стор
             this.store.dispatch(new UpdateHistory(parsedata.UserTransactions));
                                this.store.dispatch(new UpdateAmount(parsedata.UserPw));
                console.log(this.parsedata);
            });
        }

        this.connection.connectionMethods.onDisconnected = () => {
            //optional
            console.log("Disconnected!");
            //здесь что-то на случай того, если у нас будет выключен connect
        }

        this.connection.clientMethods["receiveMessage"] = (socketId, message) => {
            var messageText = socketId + " said: " + message;


            //TODO:поменять мэссэдж
            if (socketId == "new transaction alert") {

                console.log("let's invoke getcurrentuserdata");
                this.identity.GetCurrentUserData(this.connection.connectionId).subscribe((data) => {
                    console.log("GetCurrentUserData " + data);

                    let parsedata = JSON.parse(data);

                    this.store.dispatch(new UpdateHistory(parsedata.UserTransactions));
                    this.store.dispatch(new UpdateAmount(parsedata.UserPw));
                    this.show("success", "success!", "new transaction was recivied")

                    console.log(this.parsedata);
                });
            }
            console.log(socketId);
            console.log(message);
            console.log(messageText);
            //
        };

        Helpers.tokenSubject.subscribe((value) => {
            console.log("Subscription got", value);
             log.er('Subscription got'); // console.log

            if (value == true) {
                this.connection.start().subscribe((connectionvalue) => {
                    console.log("subscriiiber " + connectionvalue);
                });
            }
            else {
                console.log("nooo!")
                if (this.connection != undefined)
                { this.connection.stop(); }
                this.store.dispatch(new ToDefault());
            }
        });

        this.userData = store.select("UserDataReducer");

        this.userData.subscribe(
            data => {
                // Set the products Array
                this.userData.amount = data.amount;
                this.userData.websocketId = data.websocketId;
            })

        // Optional strategy for refresh token through a scheduler.
        this.authenticationService.startupTokenRefresh();


        this.complexForm = fb.group({
            'login': ["", [Validators.required, CustomValidators.email]],
            'password': ["", [Validators.required, Validators.minLength(6)]],
        })
    }
 

    loginSubmitCLick() {}  

    loginSubmitCLick$: Observable<any> = new Subject().map((value: any) => {
        console.log('loginSubmitCLick pressed');
       // this.login();
    });

    subscription: any = this.loginSubmitCLick$.subscribe(
        x => console.log('onNext: %s', JSON.stringify(x)),
        e => console.log('onError: %s', e),
        () => console.log('onCompleted'));

    login(value) {
        this.SubmitButton.deactivate();
        // this.Signin.signin(this.complexForm.value.login, this.complexForm.value.password)

        //this.authenticationService.signin(this.complexForm.value.login, this.complexForm.value.password).subscribe(
            this.authenticationService.signin(value.login, value.password).subscribe(
            x => { this.SubmitButton.activate(); this.authenticationService.scheduleRefresh(); },
            e => {this.SubmitButton.activate();
            this.show("error", "error", "username or password is invalid");
        }
            );




        //очищаем логин и пароль на форме после входа, чтоб не было видно при выходе
        this.complexForm.controls['login'].setValue("");
        this.complexForm.controls['password'].setValue("");
    }

    Logout() {
        this.authenticationService.signout();
        this.router.navigate(["Home"]);
    }


    //проперти, которое показывает зашли мы или нет. используется в html, очень удобно
    get signedIn(): boolean {
        return this.Helpers.tokenNotExpired();
    }

    show(severity: string, summary: string, detail: string) {
        this.primengMsgs = [];
        this.primengMsgs.push({ severity: severity, summary: summary, detail: detail });
      //   this.primengMsgs.push({severity:'warn', summary:'Warn Message', detail:'There are unsaved changes'});
         //   this.primengMsgs.push({severity:'info', summary:'Message 1', detail:'PrimeNG rocks'});
    }

    hide() {
        this.primengMsgs = [];
    }

}



