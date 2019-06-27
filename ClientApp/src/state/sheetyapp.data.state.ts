import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators'
import { SheetyAppDataModel } from './../models/sheetyapp.data.model';
import { AddData, DeleteData, GetData, UpdateData } from './../actions/data.actions';
declare let underscore: any;
declare let window: any;

export class SheetyAppDataStateModel{
    data: SheetyAppDataModel[];
}

@State<SheetyAppDataStateModel>({
    name: 'data',
    defaults: {
        data: []
    }
})

export class SheetyAppDataState {

    @Selector()
    static getData(state: SheetyAppDataStateModel){
        console.log('getting sheet apps: ', state.data.length);
        return underscore.sortBy( state.data, 'createdAt').reverse();
    }


    @Action(GetData)
    async getData( 
       ctx: StateContext<SheetyAppDataStateModel>
    ) {
        const state = ctx.getState();
        // @ts-ignore
        // let sheetyApps = await SheetyAppModel.fetchOwnList({});
        // if (sheetyApps){
        //     sheetyApps = sheetyApps.map( m=> m.attrs );
        // }
        ctx.setState({
            ...state,
            data: []
        });
    }
    


    @Action(AddData)
    async addData( 
        { getState, patchState }: StateContext<SheetyAppDataStateModel>, 
        { payload }: AddData
    ) {

        const state = getState();
        
        let newState = [];

        // @ts-ignore
        // let newSheetyApp = new SheetyAppModel(payload);
        // const resp = await newSheetyApp.save();
        // let newState = resp.attrs;
        // newState._id = resp._id;
        patchState({
            data: [ 
            ...state.data, newState
            ]
        });
    }

    @Action(UpdateData)
    update( ctx:  StateContext<SheetyAppDataStateModel>, { payload }: UpdateData) {

        ctx.setState(
            patch({
                // @ts-ignore
              data: updateItem<SheetyAppDataModel>(model => model.id === payload.id, payload)
            })
        );
    }

    @Action(DeleteData)
    async delete( ctx:  StateContext<SheetyAppDataStateModel>, { payload }: DeleteData) {

        // @ts-ignore
        // let newSheetyApp = new SheetyAppModel(payload);
        // let resp;
        // try{
        //     resp = await newSheetyApp.destroy();
        // } catch(e){
        //     console.log("delete resp error: ", resp);
        //     // if it fails to delete then Gaia and Radiks are out of sync, simply recreate and destroy
        //     await window.userSession.putFile( (`SheetyAppModel/` + newSheetyApp._id ), '');
        //     await newSheetyApp.destroy();
        // } 
        
        ctx.setState(
            patch({
                data: removeItem<SheetyAppDataModel>(model => model === payload)
            })
        );
     
    }

}





