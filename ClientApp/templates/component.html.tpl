<div style="margin: 16px 16px 16px 16px">
    <div class="sticky-header">
        <app-loading target="spinner" color="blue"></app-loading>
        <button mat-raised-button color="primary" (click)="add{{pascalCase name}}()" style="width: 320px; border-radius: 20px;">
            Create {{pascalCase name}}
            <i class="material-icons">add</i>
        </button>
    </div>

    <div fxLayout="row wrap" fxLayoutAlign="center center" style="margin-bottom: 16px">
    </div>

    <div fxLayout="row wrap" fxLayoutAlign="center center" style="height: 100%">
        <mat-card class="example-card zoomOnHover" *ngFor="let item of {{camelCase name}}s$ | async">
            <mat-card-header>
                <mat-card-title [innerHTML]="item._id" ></mat-card-title>
            </mat-card-header>
            <mat-card-content>
<pre [innerHTML]="item | json">

</pre>
            </mat-card-content>
            <mat-card-actions>
                <button mat-button (click)="delete{{pascalCase name}}(item)">Delete</button>
            </mat-card-actions>
        </mat-card>
    </div>
</div>