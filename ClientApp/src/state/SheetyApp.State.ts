import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators'
import { SheetyAppModel } from './../models/sheetyapp.model';
import { AddSheetyApp, RemoveSheetyApp, UpdateSheetyApp, GetAllSheetyApps, DeleteSheetyApp } from '../actions/sheetyapps.actions';
declare let underscore: any;
declare let window: any;

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
        console.log('getting sheet apps: ', state.sheetyApps.length);
        return underscore.sortBy( state.sheetyApps, 'createdAt').reverse();
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

    @Action(DeleteSheetyApp)
    async delete( ctx:  StateContext<SheetyAppStateModel>, { payload }: DeleteSheetyApp) {

        // @ts-ignore
        let newSheetyApp = new SheetyAppModel(payload);
        let resp;
        try{
            resp = await newSheetyApp.destroy();
        } catch(e){
            console.log("delete resp error: ", resp);
            // if it fails to delete then Gaia and Radiks are out of sync, simply recreate and destroy
            await window.userSession.putFile( (`SheetyAppModel/` + newSheetyApp._id ), '');
            await newSheetyApp.destroy();
        } 
        
        ctx.setState(
            patch({
                sheetyApps: removeItem<SheetyAppModel>(model => model === payload)
            })
        );
     
    }

}





