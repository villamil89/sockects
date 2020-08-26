import { Component } from '@angular/core';
import { SocketClientService } from './service/socketClient.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private scs: SocketClientService
  ) {
    this.scs.onMessage('/topic/public/').subscribe(data => {
      alert("socket")
      debugger
    });
  }
}
