import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators'
import { GetSheetyapp, AddSheetyapp, UpdateSheetyapp, DeleteSheetyapp } from './sheetyapp.actions';
import { SheetyappModel } from './sheetyapp.model';
declare let underscore: any;
declare let window: any;

export class SheetyappStateModel {
  public sheetyapps: any[];
}

@State<SheetyappStateModel>({
  name: 'sheetyapps',
  defaults : {
    sheetyapps : []
  }
})



export class SheetyappState {

  @Selector()
  static selectSheetyapps(state: SheetyappStateModel ){
      return underscore.sortBy( state.sheetyapps, 'createdAt').reverse();
  }
  
  @Action(GetSheetyapp)
    async get( 
       ctx: StateContext<SheetyappStateModel>
    ) {
        const state = ctx.getState();
        // @ts-ignore
        let sheetyapp = await SheetyappModel.fetchOwnList({});
        if (sheetyapp){
            sheetyapp = sheetyapp.map( m=> m.attrs );
        }
        ctx.setState({
            ...state,
            sheetyapps: sheetyapp
        });
    }
    


    @Action(AddSheetyapp)
    async add( 
        { getState, patchState }: StateContext<SheetyappStateModel>, 
        { payload }: AddSheetyapp
    ) {
        const state = getState();
        // @ts-ignore
        let newSheetyapp = new SheetyappModel(payload);
        const resp = await newSheetyapp.save();
        let newState = resp.attrs;
        newState._id = resp._id;
        patchState({
            sheetyapps: [...state.sheetyapps, newState]
        });
    }

    @Action(UpdateSheetyapp)
    update( ctx:  StateContext<SheetyappStateModel>, { payload }: UpdateSheetyapp) {
        ctx.setState(
            patch({
                // @ts-ignore
              sheetyapps: updateItem<SheetyappModel>(model => model.id === payload.id, payload)
            })
        );
    }

    @Action(DeleteSheetyapp)
    async delete( ctx:  StateContext<SheetyappStateModel>, { payload }: DeleteSheetyapp) {

        // @ts-ignore
        let newSheetyapp = new SheetyappModel(payload);
        let resp;
        try{
            resp = await newSheetyapp.destroy();
        } catch(e){
            console.log("delete resp error: ", resp);
            // if it fails to delete then Gaia and Radiks are out of sync, simply recreate and destroy
            await window.userSession.putFile( (`SheetyappModel/` + newSheetyapp._id ), '');
            await newSheetyapp.destroy();
        } 
        
        ctx.setState(
            patch({
                sheetyapps: removeItem<SheetyappModel>(model => model === payload)
            })
        );
     
    }
  

}