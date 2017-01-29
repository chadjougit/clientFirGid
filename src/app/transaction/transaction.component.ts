import { Component, OnInit } from '@angular/core';
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



@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {


 complexForm : FormGroup;
  public stateCtrl:FormControl = new FormControl();
 
  public myForm:FormGroup = new FormGroup({
  state: this.stateCtrl
  });
 
  
  public groupSelected:string = '';
  public selected:string = '';
  public dataSource:Observable<any>;
  public asyncSelected:string = '';
 public asyncAmount:string = '';


  public typeaheadLoading:boolean = false;
  public typeaheadNoResults:boolean = false;
  
   userData: Observable<any>;

  constructor(fb: FormBuilder, public identity: IdentityService, private store: Store<State>) { 
 this.GetAllUsers();

this.dataSource = Observable.create((observer:any) => {
      // Runs on every search
      observer.next(this.asyncSelected);
    }).mergeMap((token:string) => this.getusersAsObservable(token));

this.userData = this.store.select("UserDataReducer");


  this.complexForm = fb.group({
      // To add a validator, we must first convert the string value into an array. 
      //The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
      'recipient' : ["",  [Validators.required, CustomValidators.email]],
      // We can use more than one validator per field.
      // If we want to use more than one validator we have to wrap our array of validators with a Validators.compose function. Here we are using a required, minimum length and maximum length validator.
      'Amount': ["100", [Validators.required, CustomValidators.number]],
    })


   

  }

  

  users: any;
/**
 *метод на основе ngbootstrap для заполняемой строки
 */
    public getusersAsObservable(token:string):Observable<any> {
    let query = new RegExp(token, 'ig');
 
    return Observable.of(
      this.users.filter((state:any) => {
        return query.test(state);
      })
    );
    }

  public changeTypeaheadLoading(e:boolean):void {
    this.typeaheadLoading = e;
  }
 
  public changeTypeaheadNoResults(e:boolean):void {
    this.typeaheadNoResults = e;
  }
  
  public typeaheadOnSelect(e:TypeaheadMatch):void {
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

   click$: Observable<any> = new Subject().map( (value: any) => {

      const val = value;
     console.log(val);
       console.log('heeeey');
         this.FindByName(value.recipient, value.Amount);
     
  });
  
 subscription: any = this.click$.subscribe(
  x => console.log('onNext: %s', JSON.stringify(x)),
  e => console.log('onError: %s', e),
  () => console.log('onCompleted'));
  

testTake(){this.userData.take(1).subscribe(content => {

  console.log(content);

   this.complexForm.controls['Amount'].setValue(content.newTranscation.Amount);
      
    });}




    FindByName(username: string, summ: number) {

this.userData.take(1).subscribe(content => {



//потом поправить!!!!!
//if (content.amount - summ <0)
if (false)
{ //console.log("маааало");
//alert("need more");
}
/*
else if (summ < 0)
{alert("wrong summ!");}
*/
else
{console.log("ноооорм");

  this.identity.FindByName(username, summ)
            .subscribe(
            (res: any) => {

                // IdentityResult.
                if (res.succeeded) {


 console.log(res.succeeded);
                    // Refreshes the users.
                   // this.getAll();

                } else {

                    console.log(res.errors);

                }

            },
            (error: any) => {

                // Error on post request.
                let errMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

                console.log(errMsg);

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
