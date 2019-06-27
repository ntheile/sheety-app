import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { Store, Select, Selector, ofActionCompleted, ofAction } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';
import { Get{{pascalCase name}}, Add{{pascalCase name}}, Update{{pascalCase name}}, Delete{{pascalCase name}} } from './{{dashCase name}}.actions';
import { {{pascalCase name}}Model } from './{{dashCase name}}.model';
import { {{pascalCase name}}State } from './{{dashCase name}}.state';
import { SpinnerState } from './../../../state/spinner.state';
import { ToggleShow, ToggleHide } from './../../../actions/spinner.actions';
declare let window: any;

@Component({
  selector: 'app-{{camelCase name}}',
  templateUrl: './{{camelCase name}}.component.html',
  styleUrls: ['./{{camelCase name}}.component.scss'],
  animations: [
  ]
})
export class {{pascalCase name}}Component implements OnInit {
  
  @Select({{pascalCase name}}State.select) {{camelCase name}}s$: Observable<{{pascalCase name}}Model>;
  @Select(SpinnerState) loading: Observable<boolean>;

  current{{pascalCase name}};

  constructor(
    private store: Store,
    private cd: ChangeDetectorRef
  ) { 
        
  }

  ngOnInit() {
    this.get{{pascalCase name}}();
  }

  async get{{pascalCase name}}(){
    this.Loading();
    await this.store.dispatch(
      await new Get{{pascalCase name}}()
    ).toPromise(); 
    this.NotLoading();
  }

  async add{{pascalCase name}}(payload){

    this.Loading();
    
    if (!payload){
        this.current{{pascalCase name}} = { 
            createdBy: 'name.id'
        };
    } else{
        this.current{{pascalCase name}} = payload; 
    }
    
    await this.store.dispatch( await new Add{{pascalCase name}}(this.current{{pascalCase name}})).toPromise();
    this.NotLoading();
  }

  
  async delete{{pascalCase name}}( payload ){
    this.Loading();
    await this.store.dispatch( new Delete{{pascalCase name}}(payload) ).toPromise();
    this.NotLoading();
  }

  async query(){
    this.store.select(state => state.{{camelCase name}}.{{camelCase name}}).subscribe( ( data ) => {
      // console.log(data.filter(a=>a._id == '' ));
    });
  }

  Loading() {
    this.store.dispatch(new ToggleShow("spinner"));
  }

  NotLoading() {
    this.store.dispatch(new ToggleHide("spinner"));
  }

}
