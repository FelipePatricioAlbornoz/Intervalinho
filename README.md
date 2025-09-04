# Atividade Final - React Native: Controle de Tickets de Refeição

📅 **Aberto:** 27/08/2025  
📅 **Vencimento:** 02/10/2025  

🔗 **Enviar link do repositório do GitHub**

---

## 📌 Objetivo do Projeto

Criar um aplicativo mobile em **React Native** que simule o controle e uso de tickets de refeição escolares. O app permitirá que alunos recebam tickets seguindo regras específicas e que um administrador (ADM) gerencie os dados dos alunos e dos tickets.

---

## 🖥️ Requisitos de Telas

### 1. Tela de Login
- Aluno entra com matrícula ou código.
- Administrador entra com senha.
- Validação simples (pode ser feita com JSON ou AsyncStorage).

### 2. Tela de Recebimento de Ticket
- Botão "Receber Ticket" aparece apenas nos 5 minutos antes do intervalo.
- Aluno só pode receber **1 ticket por dia**.
- Simulação de "região permitida" (ex.: botão representando estar na escola).
- Após receber o ticket, status muda para "Ticket disponível".

### 3. Tela da Validação do Ticket
- Permite ao atendente verificar se o aluno tem ticket válido.
- Uso do ticket marca como "usado".
- Exibe nome/matrícula do aluno e status do ticket.

### 4. Tela de ADM
- Cadastro de alunos (nome, matrícula, etc.).
- Visualização de quais alunos já pegaram o ticket no dia.
- (Opcional) Histórico de uso dos tickets por data.
- Botão para resetar tickets no fim do dia.

### 5. Tela de Intervalo
- Mostra se o intervalo está ativo.
- Exibe tempo restante para início ou fim do intervalo.
- Comparação de horários usando `Date`.

### 6. Tela de Localização
- Verifica a localização do aluno usando `expo-location`.
- Só permite pegar ticket se estiver dentro da coordenada definida.

---

## 🔁 Requisitos Funcionais
- Aluno só pode pegar **1 ticket por dia**.
- Botão de pegar ticket só aparece nos **5 minutos antes do intervalo**.
- Ticket precisa ser validado na cantina.
- Após o uso, ticket não pode ser reutilizado.
- ADM pode resetar tickets de todos os alunos no final do dia (manual ou automático).
- App deve simular uso diário por **pelo menos 5 dias**.

---

## 💾 Persistência de Dados
- Usar **AsyncStorage** para salvar:
  - Dados dos alunos
  - Tickets recebidos/usados
  - Status de login
  - (Opcional) Histórico de uso
- Simulação de "banco de dados" com estrutura JSON (objeto local ou salvo no AsyncStorage).

---

## 🧠 Requisitos Técnicos
- Desenvolvido em **React Native** (com ou sem Expo)
- Navegação entre telas com **react-navigation**
- Gerenciamento de estados globais com **Redux** ou **Context API**
- Persistência local com **AsyncStorage**
- Lógica de verificação de horário usando `Date`

---

## 📆 Cronograma Sugerido (4 Semanas)

| Semana | Entregas Esperadas |
|--------|------------------|
| 1      | Planejamento do app, protótipos de telas (papel ou Figma), criação das telas estáticas |
| 2      | Implementar tela de login, fluxo de autenticação, navegação entre telas |
| 3      | Adicionar lógica de horário, restrição de ticket, simulação de localização |
| 4      | Finalizar ADM, testes, validações, histórico e ajustes finais |

---

## ✅ Recursos Adicionais
- Lista de Requisitos do Projeto - Ticket de Refeição.pdf
