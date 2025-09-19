import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { gsap } from 'gsap';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-consultar-tarefas',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Navbar
  ],
  templateUrl: './consultar-tarefas.html',
  styleUrls: ['./consultar-tarefas.css']
})
export class ConsultarTarefas implements AfterViewInit {

  // Signals
  tarefas = signal<any[]>([]);

  // Injeção de dependência
  private http = inject(HttpClient);

  // Formulário de consulta
  formConsulta = new FormGroup({
    dataMin : new FormControl('', [Validators.required]),
    dataMax : new FormControl('', [Validators.required])
  });

  // Referência aos botões da tabela
  @ViewChildren('btnAcao') botoes!: QueryList<ElementRef>;

  ngAfterViewInit() {
    // Anima título e descrição
    gsap.from('h4, p', { opacity: 0, y: -20, duration: 0.8, stagger: 0.2 });

    // Anima inputs e botão do formulário
    const inputs = document.querySelectorAll('input, button');
    gsap.from(inputs, { opacity: 0, y: 30, duration: 0.6, stagger: 0.15, delay: 0.5 });

    // Aplica animações nos botões da tabela
    this.botoes.changes.subscribe(() => this.adicionarAnimacoesBotoes());
    this.adicionarAnimacoesBotoes();
  }

  adicionarAnimacoesBotoes() {
    this.botoes.forEach((btn: ElementRef) => {
      const el = btn.nativeElement;

      // Hover
      el.addEventListener('mouseenter', () => gsap.to(el, { scale: 1.1, duration: 0.2 }));
      el.addEventListener('mouseleave', () => gsap.to(el, { scale: 1, duration: 0.2 }));

      // Clique
      el.addEventListener('mousedown', () => gsap.to(el, { scale: 0.95, duration: 0.1 }));
      el.addEventListener('mouseup', () => gsap.to(el, { scale: 1.1, duration: 0.1 }));
    });
  }

  // Consulta tarefas por período
  consultarTarefas() {
    const dataMin = this.formConsulta.value.dataMin;
    const dataMax = this.formConsulta.value.dataMax;

    this.http.get(`${environment.apiTarefas}/${dataMin}/${dataMax}`)
      .subscribe({
        next: (response) => {
          this.tarefas.set(response as any[]);
          // Anima tabela
          gsap.from('tbody tr', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 });
        },
        error: (e) => {
          console.log(e.error);
        }
      });
  }

  // Excluir tarefa
  excluirTarefa(id: string) {
    if(confirm('Deseja realmente excluir a tarefa selecionada?')) {
      this.http.delete(`${environment.apiTarefas}/${id}`, { responseType: 'text' })
        .subscribe({
          next: (response) => {
            alert(response);
            this.consultarTarefas();
          },
          error: (e) => {
            console.log(e.error);
          }
        });
    }
  }
}
