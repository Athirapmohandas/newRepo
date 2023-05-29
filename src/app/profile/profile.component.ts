import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { MsalBroadcastService,  } from '@azure/msal-angular';
import { filter, Subject, takeUntil } from 'rxjs';
import { MsalService , } from '@azure/msal-angular';
import { AccountInfo,AuthenticationResult } from '@azure/msal-browser';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile!: ProfileType;
  private readonly _destroying$ = new Subject<void>();
  constructor(
    private http: HttpClient, 
  ) { }

  ngOnInit() {
    this.getProfile();
   
  }
  
  getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile => {
        this.profile = profile;
      });
  }
  

}
