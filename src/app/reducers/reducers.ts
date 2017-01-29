import { ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { transition } from '@angular/core';


export const ActionTypes = {
    UpdateAmount: '[UserData] UpdateAmount',
    UpdateHistory: '[UserData] UpdateHistory',
    AddNewTransaction: '[UserData] AddNewTransaction',
    UpdateWebsocketId: '[UserData] UpdateWebsocketId',
    Def: '[UserData] Def'

};

export class UpdateAmount implements Action {
    public type = ActionTypes.UpdateAmount;

    constructor(public payload: number) { }
}

export class UpdateHistory implements Action {
    public type = ActionTypes.UpdateHistory;

    constructor(public payload?: transaction[]) { }
}

export class AddNewTransaction implements Action {
    public type = ActionTypes.AddNewTransaction;

    constructor(public payload?: transaction) { }
}

export class UpdateWebsocketId implements Action {
    public type = ActionTypes.UpdateWebsocketId;

    constructor(public payload: string) { }
}

export class Def implements Action {
    public type = ActionTypes.UpdateWebsocketId;

    constructor(public payload: any) { }
}

export type Actions
    = UpdateAmount
    | UpdateHistory
    | AddNewTransaction
    | UpdateWebsocketId
    | Def


interface transaction {
    Id: number;
    amount: number;
    SenderUsername: string;
    RecipientUsername: string;
    Date: string;

}

export interface State {

    amount: number;
    transactions: transaction[];
    newTranscation: transaction;
    websocketId: string;

}

const initialState: State = {

    amount: null,
    transactions: null,
    websocketId: null,
    newTranscation: { Id: 0, amount: 0, SenderUsername: "teesst@mail.com", RecipientUsername: "teeeeesting@mail.com", Date: "date" }

};

export function UserDataReducer(state: State = initialState, action: Actions) {
    switch (action.type) {
        case ActionTypes.UpdateAmount: {
            var amount2 = action.payload;

            return Object.assign({}, state, { amount: amount2 });

        }

        case ActionTypes.UpdateHistory: {
            return Object.assign({}, state, { transactions: action.payload });
        }

        case ActionTypes.AddNewTransaction: {
          
            //к примеру, в transaction не должно придти отрицательное число
            action.payload.Amount = action.payload.Amount * -1;
            return Object.assign({}, state, { newTranscation: action.payload  });
        }

        case ActionTypes.UpdateWebsocketId: {
            return Object.assign({}, state, { websocketId: action.payload });
        }



        default:
            return state;
    }
}