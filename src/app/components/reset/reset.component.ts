import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password.validator';
import ValidateForm from 'src/app/helpers/validateforms';
import { ResetPassword } from 'src/app/models/reset-password.model';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();

  constructor(private fb: FormBuilder,
    private router: Router,
    private toast: NgToastService,
    private activateRoute : ActivatedRoute, private resetService: ResetPasswordService) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    },{
      validator: ConfirmPasswordValidator("password","confirmPassword")
    });

    this.activateRoute.queryParams.subscribe(val =>{
      this.emailToReset = val['email'];
      let uriToken = val['code']

      this.emailToken = uriToken.replace(/ /g, '+');
      console.log(this.emailToReset);
      console.log(this.emailToken);
    })

  }
  reset(){
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;

      this.resetService.resetPassword(this.resetPasswordObj)
      .subscribe({
        next:(res)=>{
          this.toast.success({
            detail: 'SUCCES',
            summary: res.message,
            duration: 3000,
          });
          this.router.navigate(['/'])
        },
        error:(res)=>{
          this.toast.error({
            detail: 'ERROR',
            summary: res.message,
            duration: 5000
          })
        }
      })
    }else{
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }

}
