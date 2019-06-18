import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Excel } from './../models/excel.model';
import { AddExcel, RemoveExcel } from './../actions/excel.actions';

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

}





