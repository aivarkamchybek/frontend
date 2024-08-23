import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user-service/user.service';
import { User } from '../Interfaces/User';

import { Router } from '@angular/router';


@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css']
})
export class SingUpComponent {
  signupForm: FormGroup;
  usernameExists: boolean = false;
  emailExists: boolean = false;

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  checkUsernameExists() {
    const username = this.signupForm.get('username')?.value;
    this.userService.isUsernameExist(username).subscribe(exists => {
      this.usernameExists = exists;
      this.signupForm.get('username')?.setErrors(exists ? { usernameExists: true } : null);
    });
  }

  checkEmailExists():void {
    const email = this.signupForm.get('email')?.value;
    this.userService.isEmailExist(email).subscribe(exists => {
      this.emailExists = exists;
      this.signupForm.get('email')?.setErrors(exists ? { emailExists: true } : null);
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid && !this.usernameExists && !this.emailExists) {
      const user: User = this.signupForm.value;
      this.userService.createUser(user).subscribe(
        response => { 
          const token = response.access_token;
          localStorage.setItem('token', token); 
          this.router.navigate(['/quote-list']);
        },
        error => {
          console.error('Error creating user', error);
        }
      );
    }
  }

  passwordMatchValidator(formGroup: FormGroup){
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
