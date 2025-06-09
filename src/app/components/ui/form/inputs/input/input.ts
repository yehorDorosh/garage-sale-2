import {
  Component,
  input,
  inject,
  ElementRef,
  OnInit,
  Renderer2,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input implements OnInit {
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
}
