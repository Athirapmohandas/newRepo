import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, } from '@azure/msal-angular';
import { EventMessage, EventType, AuthenticationResult } from '@azure/msal-browser';
import { filter ,Subject, takeUntil } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { MsalService , } from '@azure/msal-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService,private http:HttpClient) { }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
        this.setLoginDisplay();
      });
      this.msalBroadcastService.msalSubject$
		.pipe(
			filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS),
			takeUntil(this._destroying$)
		)
		.subscribe((result: EventMessage) => {   
			// Do something with event payload here
		});
      this.setLoginDisplay();
      // this.callApi()

  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    
  }
  public callApi(): void {
    
    const account = this.authService.instance.getActiveAccount();
    console.log(account);
    
    if (account) {
      console.log("hi");

      this.authService.instance.acquireTokenSilent({
        scopes: ['User.Read','openid','profile','email'],
        account: account,
      }).then((response:AuthenticationResult) => {
        const token = response.accessToken;
        console.log(token);
        
        // Call your API with the access token
        this.http.get('https://org6a05b444.crm4.dynamics.com/api/data/v9.1/craca_connectionprofiles', {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
        }).subscribe((data) => {
          console.log("hi");
          
        });
      }, (error:any) => {
        // Handle token acquisition error
      });
    } else {
      // No active account found, handle accordingly
    }
}

}
