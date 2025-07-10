import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage } from '../chat-service/web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryChatService {
  private readonly apiUrl = environment.apiUrl + '/chat';

  constructor(private http: HttpClient) { }

  /**
   * Recupera o histórico de mensagens entre dois usuários
   * @param userId - ID do usuário logado
   * @param userId2 - ID do outro usuário
   * @param page - Número da página de resultados (padrão: 0)
   * @param size - Tamanho da página (padrão: 20)
   */
  getHistoryChat(userId: string, userId2: string, page: number = 0, size: number = 20): Observable<ChatMessage[]> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('userId2', userId2)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ChatMessage[]>(`${this.apiUrl}/history`, { params });
  }

  /**
   * Limpa o histórico de mensagens entre dois usuários
   * @param userId - ID do usuário logado
   * @param userId2 - ID do outro usuário
   */
  clearChatHistory(userId: string, userId2: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('userId2', userId2);

    return this.http.delete<any>(`${this.apiUrl}/clear`, { params, responseType: 'text' as 'json' });
  }
}
