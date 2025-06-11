import {
  Component,
  input,
  inject,
  ElementRef,
  OnInit,
  Renderer2,
  viewChild,
  forwardRef,
} from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [FormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
})

/**
 * <app-input
    type="email"
    label="Email:"
    id="email"
    placeholder="user@email.com"
    autocomplete="email"
    ngModel
    [ngModelOptions]="{name: 'email'}"
    required
    email
    #email="ngModel"
  />
 */
export class Input implements OnInit, ControlValueAccessor {
  private rerender = inject(Renderer2);

  label = input<string | null>(null);
  id = input.required<string>();
  type = input.required<'text' | 'email' | 'password' | 'number' | 'tel'>();

  private hostElem = inject(ElementRef);
  private inputElem = viewChild.required<ElementRef<HTMLInputElement>>('input');

  ngOnInit() {
    const cmpInputs = (this.constructor as any).ɵcmp.inputs as {
      [key: string]: [string, number, any];
    };

    const attrs = this.hostElem.nativeElement.attributes as {
      [key: number]: { name: string; value: string };
      length: number;
    };

    for (let i = 0; i < attrs.length; i++) {
      if (attrs[i].name in cmpInputs || attrs[i].name === 'length') {
        continue;
      }
      this.rerender.setAttribute(
        this.inputElem().nativeElement,
        attrs[i].name,
        attrs[i].value
      );
    }
  }

  // ControlValueAccessor

  value: string = '';

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
  }
}
