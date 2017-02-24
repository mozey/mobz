import {TestBed, inject} from '@angular/core/testing';
import {WimtService} from './wimt.service';

describe('WimtService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WimtService]
        });
    });

    it('should ...', inject([WimtService], (service: WimtService) => {
        expect(service).toBeTruthy();
    }));
});
