import { Component } from '@angular/core';
import { Input } from '../../ui/form/inputs/input/input';

@Component({
  selector: 'app-signup-form',
  imports: [Input],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.scss',
})
export class SignupForm {
  onInput(e: Event) {
    console.log((e as InputEvent).data);
  }
}
