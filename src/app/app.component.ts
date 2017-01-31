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
import { State, UpdateHistory, UpdateAmount } from './reducers/reducers';
import { HHelpers } from './services/HHelpers';
import { Connection } from './websocket/Connection';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


//global changes!

export class AppComponent {
  title = 'app works!';
  complexForm: FormGroup;
  
  userData: any;
  connection: any;
  parsedata: any;

  

  constructor(fb: FormBuilder, public authenticationService: AuthenticationService, private router: Router, 
  public authHttp: AuthHttp, public Signin: SigninService, public identity: IdentityService, private store: Store<State>, public HHelpers: HHelpers, private differs: KeyValueDiffers) {

 
   

    this.connection = new Connection("ws://localhost:5000/test");
    this.connection.enableLogging = true;

    this.connection.connectionMethods.onConnected = () => {

      console.log("You are now connected! Connection ID: " + this.connection.connectionId);

      console.log("let's invoke getcurrentuserdata");
      this.identity.GetCurrentUserData(this.connection.connectionId).subscribe((data) => {
        console.log("GetCurrentUserData " + data);

        this.parsedata = JSON.parse(data);


        //добавляем полученные данные в стор
        this.store.dispatch(new UpdateHistory(this.parsedata.UserTransactions));
        this.store.dispatch(new UpdateAmount(this.parsedata.UserPw));
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

      if (socketId == "booooong! MANY COOOOME") {

        console.log("let's invoke getcurrentuserdata");
        this.identity.GetCurrentUserData(this.connection.connectionId).subscribe((data) => {
          console.log("GetCurrentUserData " + data);

          this.parsedata = JSON.parse(data);

          this.store.dispatch(new UpdateHistory(this.parsedata.UserTransactions));
          this.store.dispatch(new UpdateAmount(this.parsedata.UserTransactions));
          console.log(this.parsedata);
        });
      }
      console.log(socketId);
      console.log(message);
      console.log(messageText);
      //
    };

    HHelpers.bSubject.subscribe((value) => {
      console.log("Subscription got", value);

      if (value == true) {
        this.connection.start().subscribe((connectionvalue) => {
          console.log("subscriiiber " + connectionvalue);
        });
      }
      else {
        console.log("nooo!")
        if (this.connection != undefined)
        { this.connection.stop(); }
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
      'login': ["admin@gmail.com", Validators.required],
      'password': ["Admin01*", Validators.required],
    })
  }

  loginSubmitCLick$: Observable<any> = new Subject().map((value: any) => {
    console.log('loginSubmitCLick pressed');
    //console.log(value);
    this.login();
  });

  subscription: any = this.loginSubmitCLick$.subscribe(
    x => console.log('onNext: %s', JSON.stringify(x)),
    e => console.log('onError: %s', e),
    () => console.log('onCompleted'));

  login() {
    this.Signin.signin(this.complexForm.value.login, this.complexForm.value.password)

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
    return this.HHelpers.tokenNotExpired();
  }
}



