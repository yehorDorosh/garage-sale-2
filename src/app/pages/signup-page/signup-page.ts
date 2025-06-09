import { Component } from '@angular/core';
import { MainTemp } from "../../components/layout/page-template/main-temp/main-temp";
import { SignupForm } from "../../components/auth/signup-form/signup-form";

@Component({
  selector: 'app-signup-page',
  imports: [MainTemp, SignupForm],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.scss'
})
export class SignupPage {

}
