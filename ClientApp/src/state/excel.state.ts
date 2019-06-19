import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators'
import { Excel } from './../models/excel.model';
import { AddExcel, RemoveExcel, UpdateExcel} from './../actions/excel.actions';

export class ExcelStateModel{
    excelFiles: Excel[];
}

@State<ExcelStateModel>({
    name: 'excelFiles',
    defaults: {
        excelFiles: []
    }
})

export class ExcelState {
    
    @Selector()
    static getExcelFiles(state: ExcelStateModel){
        return state.excelFiles;
    }

    @Action(AddExcel)
    add( 
        { getState, patchState }: StateContext<ExcelStateModel>, 
        { payload }: AddExcel
    ) {
        const state = getState();
        patchState({
            excelFiles: [...state.excelFiles, payload]
        })
    }

    @Action(RemoveExcel)
    remove( 
        { getState, patchState }: StateContext<ExcelStateModel>, 
        { payload }: RemoveExcel
    ) {
        patchState({
            excelFiles: getState().excelFiles.filter(a=>a.name != payload)
        })
    }

    @Action(UpdateExcel)
    update( ctx:  StateContext<ExcelStateModel>, { payload }: UpdateExcel) {

        ctx.setState(
            patch({
              excelFiles: updateItem<Excel>(excel => excel.id === payload.excel.id, payload.excel)
            })
        );
    }

}





