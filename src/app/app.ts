import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { HlmButtonImports } from '@spartan-ng/helm/button';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HlmButtonImports],
  template: `
    <main class="min-h-screen p-8 bg-slate-50 flex flex-col gap-4 font-sans">
      <h1 class="text-2xl font-bold text-slate-800">Stack Configurado Exitosamente</h1>
      
      <div>
        <button hlmBtn variant="default" (click)="todosQuery.refetch()">
          Recargar Datos
        </button>
      </div>

      @if (todosQuery.isPending()) {
        <p class="text-slate-500">Cargando...</p>
      }

      @if (todosQuery.isError()) {
        <p class="text-red-500">Error al consultar los datos.</p>
      }

      @if (todosQuery.data(); as todos) {
        <ul class="space-y-2 max-w-md">
          @for (todo of todos.slice(0, 4); track todo.id) {
            <li class="p-3 bg-white rounded border border-slate-200 shadow-sm text-sm">
              {{ todo.title }}
            </li>
          }
        </ul>
      }
    </main>
  `
})
export class App {
  private http = inject(HttpClient);

  todosQuery = injectQuery(() => ({
    queryKey: ['todos'],
    queryFn: () => lastValueFrom(this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos'))
  }));
}