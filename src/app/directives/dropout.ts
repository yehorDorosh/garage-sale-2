import {
  Directive,
  inject,
  ElementRef,
  Renderer2,
  signal,
  effect,
  input,
} from '@angular/core';

@Directive({
  selector: '[appDropout]',
})
export class Dropout {
  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  private visible = signal(false);
  appDropout = input('');

  private wrapper!: HTMLElement;
  private label!: HTMLElement;
  private clickListener: () => void;

  constructor() {
    const host = this.el.nativeElement;
    // Добавляем слушатель клика на хост
    this.clickListener = this.renderer.listen(host, 'click', (e: Event) => {
      const target = e.target as HTMLElement;

      if (target?.classList.contains('trigger')) {
        this.visible.update((v) => !v);
      }
    });

    // Эффект для показа/скрытия
    effect(() => {
      if (this.visible()) {
        this.renderer.setStyle(this.wrapper, 'max-height', '200px');
        this.renderer.setStyle(this.wrapper, 'opacity', '1');
      } else {
        this.renderer.setStyle(this.wrapper, 'max-height', '1px');
        this.renderer.setStyle(this.wrapper, 'opacity', '0');
      }
    });
  }

  ngOnInit() {
    const host = this.el.nativeElement;
    this.renderer.addClass(host, 'cursor-pointer');

    // Создаем обертку и перемещаем внутрь всё содержимое
    this.wrapper = this.renderer.createElement('div');
    this.label = this.renderer.createElement('span');
    this.renderer.addClass(this.label, 'trigger');
    this.renderer.addClass(this.label, 'underline');

    this.renderer.setStyle(
      this.wrapper,
      'transition',
      'max-height 0.5s ease-out, opacity 0.5s ease-out'
    );
    this.renderer.setStyle(this.wrapper, 'overflow', 'hidden');
    this.renderer.setProperty(this.label, 'textContent', this.appDropout());

    while (host.firstChild) {
      this.wrapper.appendChild(host.firstChild);
    }

    this.renderer.appendChild(host, this.label);
    this.renderer.appendChild(host, this.wrapper);

    // Изначально скрыто
    this.renderer.setStyle(this.wrapper, 'max-height', '0');
    this.renderer.setStyle(this.wrapper, 'opacity', '0');
  }

  ngOnDestroy() {
    if (this.clickListener) {
      this.clickListener();
    }
  }
}
