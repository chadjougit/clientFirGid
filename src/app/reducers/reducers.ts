import { ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { transition } from '@angular/core';

export const ActionTypes = {
    UpdateAmount: '[UserData] UpdateAmount',
    UpdateHistory: '[UserData] UpdateHistory',
    AddNewTransaction: '[UserData] AddNewTransaction',
    UpdateWebsocketId: '[UserData] UpdateWebsocketId',
    ToDefault: '[UserData] ToDefault'
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

export class ToDefault implements Action {
    public type = ActionTypes.ToDefault;

    constructor(public payload: any = "empty") { }
}

export type Actions
    = UpdateAmount
    | UpdateHistory
    | AddNewTransaction
    | UpdateWebsocketId
    | ToDefault

interface transaction {
    Id: number;
    Amount: number;
    SenderUsername: string;
    RecipientUsername: string;
    Date: string;
}

export interface State {
    Amount: number;
    transactions: transaction[];
    newTranscation: transaction;
    websocketId: string;
}

const initialState: State = {
    Amount: null,
    transactions: null,
    websocketId: null,
    newTranscation: { Id: 0, Amount: 0, SenderUsername: "", RecipientUsername: "", Date: "date" }
};

export function UserDataReducer(state: State = initialState, action: Actions) {
    switch (action.type) {
        case ActionTypes.UpdateAmount: {
            var Amount2 = action.payload;

            return Object.assign({}, state, { Amount: Amount2 });
        }

        case ActionTypes.UpdateHistory: {
            return Object.assign({}, state, { transactions: action.payload });
        }

        case ActionTypes.AddNewTransaction: {
            //к примеру, в transaction не должно придти отрицательное число
            action.payload.Amount = action.payload.Amount * -1;
            return Object.assign({}, state, { newTranscation: action.payload });
        }

        case ActionTypes.UpdateWebsocketId: {
            return Object.assign({}, state, { websocketId: action.payload });
        }

        case ActionTypes.ToDefault: {
            return Object.assign({}, state = initialState);
        }

        default:
            return state;
    }
}