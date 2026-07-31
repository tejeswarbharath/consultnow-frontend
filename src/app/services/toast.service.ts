import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  show(toast: Omit<ToastMessage, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = {
      id,
      duration: toast.duration || 3500,
      ...toast
    };

    const currentToasts = this.toastsSubject.getValue();
    this.toastsSubject.next([...currentToasts, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, newToast.duration);
  }

  success(message: string, title: string = 'Success') {
    this.show({ type: 'success', title, message });
  }

  error(message: string, title: string = 'Error') {
    this.show({ type: 'error', title, message });
  }

  info(message: string, title: string = 'Notice') {
    this.show({ type: 'info', title, message });
  }

  warning(message: string, title: string = 'Warning') {
    this.show({ type: 'warning', title, message });
  }

  remove(id: string) {
    const currentToasts = this.toastsSubject.getValue();
    this.toastsSubject.next(currentToasts.filter(t => t.id !== id));
  }
}
