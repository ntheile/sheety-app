import { Component, OnInit, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  loading: Observable<boolean>;
  @Input() target: string;
  @Input() color: string = "red";

  constructor(private store: Store) { }

  ngOnInit() {
    //this should work too but throws error
    //this.loading = this.store.select(this.target);
    
    // note: can't use @Select(state => state[this.target]) 
    //       as it has no access to this.target
    this.loading = this.store.select(state => state[this.target]);
  }
}
