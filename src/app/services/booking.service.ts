import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAvailability(expertId: string): Observable<Date[]> {
    return this.http.get<Date[]>(`${this.apiUrl}/bookings/availability/${expertId}`);
  }

  requestFreeService(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings/free-request`, payload);
  }
}
