import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, effect, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { gsap } from 'gsap';

@Component({
  selector: 'app-cadastrar-tarefas',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './cadastrar-tarefas.html',
  styleUrls: ['./cadastrar-tarefas.css'] // corrigido
})
export class CadastrarTarefas implements AfterViewInit {

  //Atributos
  categorias = signal<any[]>([]);
  mensagem = signal<string>('');
  private http = inject(HttpClient);

  //Formulário
  formCadastro = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(8)]),
    data: new FormControl('', [Validators.required]),
    prioridade: new FormControl('', [Validators.required]),
    categoriaId: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.http.get(environment.apiCategorias)
      .subscribe((response) => {
        this.categorias.set(response as any[]);
      });
  }

  ngAfterViewInit() {
    // Animação do formulário ao carregar
    gsap.from("form", {
      duration: 1,
      opacity: 0,
      y: -50,
      ease: "power2.out"
    });

    // Animação dos inputs e selects
    gsap.from("form .mb-3", {
      duration: 0.8,
      opacity: 0,
      y: 20,
      stagger: 0.2,
      ease: "power2.out"
    });

    // Reagir à mudança da mensagem usando effect()
    effect(() => {
      if (this.mensagem()) {
        gsap.fromTo(".alert",
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      }
    });
  }

  cadastrarTarefa() {
    this.http.post(environment.apiTarefas, this.formCadastro.value, {
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        this.formCadastro.reset();
        this.mensagem.set(response);

        // Animação do botão de submit
        gsap.fromTo("input[type=submit]",
          { scale: 1 },
          { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" }
        );
      },
      error: (e) => {
        this.mensagem.set(e.error);

        gsap.fromTo(".alert",
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      }
    });
  }
}
