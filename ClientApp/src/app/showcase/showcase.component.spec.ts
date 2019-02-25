import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppInsightsModule, AppInsightsService } from '@cdmc/ng-logging';
import { ShowcaseComponent } from './showcase.component';
import { SharedModule } from '../shared/shared.module';

describe('ShowcaseComponent', () => {
    let component: ShowcaseComponent;
    let fixture: ComponentFixture<ShowcaseComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ShowcaseComponent],
            imports: [SharedModule, AppInsightsModule.forRoot(
                { instrumentationKey: '87be7657-f2b6-4fa8-b0ae-ebe8ab1d5529'}
                )]

        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ShowcaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should display a title', async(() => {
        const titleText = fixture.nativeElement.querySelector('mat-card-title').textContent;
        expect(titleText).toEqual('Showcase');
    }));

    it('should display color class on the button', async(() => {
        const btnClass = fixture.nativeElement.querySelectorAll('div.button-row >button')[1].getAttribute("color");
        expect(btnClass).toEqual('primary');
    }));
});
