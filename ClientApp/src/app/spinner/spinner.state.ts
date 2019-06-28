import { State, Action, StateContext } from '@ngxs/store';
import { ToggleShow, ToggleHide } from './spinner.actions';

@State<boolean>({ 
  name: 'spinner', 
  defaults: true
})
export class SpinnerState {
  target = 'spinner';

  @Action(ToggleShow)
  toggleShow(store: StateContext<boolean>, action: ToggleShow) {
    if (action.target != this.target) return;
    store.setState(true);
  } 

  @Action(ToggleHide)
  toggleHide(store: StateContext<boolean>, action: ToggleHide) {
    if (action.target != this.target) return;
    store.setState(false);
  } 
}

@State<boolean>({ 
  name: 'spinner2', 
  defaults: true
})
export class SpinnerState2 extends SpinnerState {
  target = 'spinner2';
}