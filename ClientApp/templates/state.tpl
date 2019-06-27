import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators'
import { Get{{pascalCase name}}, Add{{pascalCase name}}, Update{{pascalCase name}}, Delete{{pascalCase name}} } from './{{dashCase name}}.actions';
import { {{pascalCase name}}Model } from './{{dashCase name}}.model';
declare let underscore: any;
declare let window: any;

/* Remember to import your state into the app.module
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [
    NgxsModule.forRoot([
      {{pascalCase name}}State
    ])
  ]
})
export class AppModule {}
*/

export class {{pascalCase name}}StateModel {
  {{camelCase name}}s: {{pascalCase name}}Model[];
}

@State<{{pascalCase name}}StateModel>({
  name: '{{camelCase name}}s',
  defaults : {
    {{camelCase name}}s : []
  }
})


export class {{pascalCase name}}State {

  @Selector()
  static select(state: {{pascalCase name}}StateModel ){
      return underscore.sortBy( state.{{camelCase name}}s, 'createdAt').reverse();
  }
  
  @Action(Get{{pascalCase name}})
    async get( 
       ctx: StateContext<{{pascalCase name}}StateModel>
    ) {
        const state = ctx.getState();
        // @ts-ignore
        let {{camelCase name}} = await {{pascalCase name}}Model.fetchOwnList({});
        if ({{camelCase name}}){
            {{camelCase name}} = {{camelCase name}}.map( m=> m.attrs );
        }
        ctx.setState({
            ...state,
            {{camelCase name}}s: {{camelCase name}}
        });
    }
    


    @Action(Add{{pascalCase name}})
    async add( 
        { getState, patchState }: StateContext<{{pascalCase name}}StateModel>, 
        { payload }: Add{{pascalCase name}}
    ) {
        const state = getState();
        // @ts-ignore
        let new{{pascalCase name}} = new {{pascalCase name}}Model(payload);
        const resp = await new{{pascalCase name}}.save();
        let newState = resp.attrs;
        newState._id = resp._id;
        patchState({
            {{camelCase name}}s: [...state.{{camelCase name}}s, newState]
        });
    }

    @Action(Update{{pascalCase name}})
    update( ctx:  StateContext<{{pascalCase name}}StateModel>, { payload }: Update{{pascalCase name}}) {
        ctx.setState(
            patch({
                // @ts-ignore
              {{camelCase name}}s: updateItem<{{pascalCase name}}Model>(model => model.id === payload.id, payload)
            })
        );
    }

    @Action(Delete{{pascalCase name}})
    async delete( ctx:  StateContext<{{pascalCase name}}StateModel>, { payload }: Delete{{pascalCase name}}) {

        // @ts-ignore
        let new{{pascalCase name}} = new {{pascalCase name}}Model(payload);
        let resp;
        try{
            resp = await new{{pascalCase name}}.destroy();
        } catch(e){
            console.log("delete resp error: ", resp);
            // if it fails to delete then Gaia and Radiks are out of sync, simply recreate and destroy
            await window.userSession.putFile( (`{{pascalCase name}}Model/` + new{{pascalCase name}}._id ), '');
            await new{{pascalCase name}}.destroy();
        } 
        
        ctx.setState(
            patch({
                {{camelCase name}}s: removeItem<{{pascalCase name}}Model>(model => model === payload)
            })
        );
     
    }
  

}