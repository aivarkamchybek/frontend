import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user-service/user.service';
import { LoginRequest } from '../Interfaces/User';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLogin = true;

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      EmailOrUsername: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  toggleTab(isLogin: boolean) {
    this.isLogin = isLogin;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData: LoginRequest = this.loginForm.value;
      this.userService.login(loginData).subscribe(
        response => {
        
          const token = response.access_token;
          localStorage.setItem('token', token);

         
          alert('Login successful!');

        
          this.router.navigate(['/quote-list']);
        },
        error => {
          
          console.error('Login failed', error);
          alert('Login failed. Please check your credentials and try again.');
        }
      );
    }
  }

}
