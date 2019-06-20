import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators'
import { SheetyAppModel } from './../models/SheetyAppModel';
import { AddSheetyApp, RemoveSheetyApp, UpdateSheetyApp, GetAllSheetyApps } from '../actions/SheetyApps.Actions';


export class SheetyAppStateModel{
    sheetyApps: SheetyAppModel[];
}

@State<SheetyAppStateModel>({
    name: 'sheetyApps',
    defaults: {
        sheetyApps: []
    }
})

export class SheetyAppState {

    @Selector()
    static getSheetyApps(state: SheetyAppStateModel){
        return state.sheetyApps;
    }


    @Action(GetAllSheetyApps)
    async getAll( 
       ctx: StateContext<SheetyAppStateModel>
    ) {
        const state = ctx.getState();
        // @ts-ignore
        let sheetyApps = await SheetyAppModel.fetchOwnList({});
        if (sheetyApps){
            sheetyApps = sheetyApps.map( m=> m.attrs );
        }
        ctx.setState({
            ...state,
            sheetyApps: sheetyApps
        });
    }
    


    @Action(AddSheetyApp)
    async add( 
        { getState, patchState }: StateContext<SheetyAppStateModel>, 
        { payload }: AddSheetyApp
    ) {

        const state = getState();
        
        // @ts-ignore
        let newSheetyApp = new SheetyAppModel(payload);
        const resp = await newSheetyApp.save();
        let newState = resp.attrs;
        newState._id = resp._id;
        patchState({
            sheetyApps: [...state.sheetyApps, newState]
        });
    }

    @Action(RemoveSheetyApp)
    remove( 
        { getState, patchState }: StateContext<SheetyAppStateModel>, 
        { payload }: RemoveSheetyApp
    ) {
        patchState({
            // @ts-ignore
            sheetyApps: getState().sheetyApps.filter(model=>model.name != payload)
        })
    }

    @Action(UpdateSheetyApp)
    update( ctx:  StateContext<SheetyAppStateModel>, { payload }: UpdateSheetyApp) {

        ctx.setState(
            patch({
                // @ts-ignore
              sheetyApps: updateItem<SheetyAppModel>(model => model.id === payload.id, payload)
            })
        );
    }

}





