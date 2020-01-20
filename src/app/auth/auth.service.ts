import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from '../posts/post.model';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';
import { type } from 'os';
import {AuthData} from './auth.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password};
    this.http.post<{user: AuthData, token: string, message: string}>('http://localhost:3000/api/user/signup', authData)
    .subscribe((responseData) => {
      console.log(responseData);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password};
    this.http.post<{user: AuthData, token: string, message: string}>('http://localhost:3000/api/user/login', authData)
    .subscribe((responseData) => {
      const token = responseData.token;
      this.token  = token;
      if(token) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
      }
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }
}
