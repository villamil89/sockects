import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Client, over, Subscription } from 'stompjs';

enum SocketState {
  ATTEMPTING, CONNECTED
}

@Injectable({
  providedIn: 'root'
})
export class SocketClientService {

  private client: Client;
  private state: BehaviorSubject<SocketState>;

  constructor() {
    this.client = over(new WebSocket(environment.notification_socket));

    this.state = new BehaviorSubject<SocketState>(SocketState.ATTEMPTING);

    this.client.connect({}, () => {
      this.state.next(SocketState.CONNECTED);
    });
  }

  connect(): Observable<Client> {
    return new Observable<Client>(observer => {
      console.log("socket")
      this.state.pipe(filter(state => state === SocketState.CONNECTED)).subscribe(() => {
        observer.next(this.client);
      });
    });
  }

  onMessage(topic: string): Observable<any> {
    return this.connect().pipe(first(), switchMap(inst => {
      return new Observable<any>(observer => {
        const subscription: Subscription = inst.subscribe(topic, message => {
          observer.next(message.body);
        });
        return () => inst.unsubscribe(subscription.id);
      });
    }));
  }

  ngOnDestroy() {
    this.connect().pipe(first()).subscribe(inst => inst.disconnect(null));
  }
}