# 📱 Atividade Final - React Native

**Aberto:** 27/08/2025  
**Vencimento:** 09/10/2025  
**Entrega:** Enviar link do repositório do GitHub

---

## ✅ Projeto: Ticket de Refeição

### 📌 Objetivo
Criar um aplicativo mobile em **React Native** que simule o controle e uso de **tickets de refeição escolares**.  
O app deve permitir que **alunos** recebam tickets dentro de regras específicas e que um **administrador (ADM)** gerencie os dados dos alunos e dos tickets.

---

## 🖥️ Requisitos de Telas

### 1. Tela de Login
- Campo para aluno entrar com matrícula ou código.  
- Campo para administrador fazer login com senha.  
- Validação simples (sem necessidade de servidor, pode ser feita com JSON ou AsyncStorage).  

---

### 2. Tela de Recebimento de Ticket
- Mostrar botão **"Receber Ticket"** apenas nos 5 minutos antes do intervalo.  
- Aluno só pode receber **1 ticket por dia**.  
- Simular se o aluno está dentro da "região permitida" (ex: botão que representa estar na escola).  
- Após receber, o status muda para **"Ticket disponível"**.  

---

### 3. Tela da Validação do Ticket
- Atendente pode **verificar** se o aluno tem ticket válido.  
- Ao usar, o ticket deve ser marcado como **usado**.  
- Exibir nome/matrícula do aluno e status do ticket.  

---

### 4. Tela de ADM
- Cadastrar alunos (nome, matrícula, etc).  
- Visualizar quais alunos já pegaram ticket no dia.  
- (Opcional) Histórico de uso dos tickets (por data).  
- Botão para **resetar tickets** no fim do dia.  

---

### 5. Tela de Intervalo
- Mostrar se o intervalo está ativo.  
- Mostrar tempo restante para o intervalo começar ou acabar.  
- Usar `Date` para comparação com horário atual.  

---

### 6. Tela de Localização
- Verificar localização com **expo-location**.  
- Só permite pegar ticket se o aluno estiver dentro da coordenada definida (ex: simulação da escola).  

---

## 🔁 Requisitos Funcionais
- Aluno só pode pegar **1 ticket por dia**.  
- Botão aparece apenas **nos 5 minutos antes do intervalo**.  
- Ticket precisa ser validado na cantina.  
- Após o uso, ticket não pode ser reutilizado.  
- ADM pode resetar tickets no final do dia (ou reset automático em horário específico).  
- App deve simular uso diário por pelo menos **5 dias**.  

---

## 💾 Persistência de Dados
- Usar **AsyncStorage** para salvar:  
  - Dados dos alunos  
  - Tickets recebidos/usados  
  - Status de login  
  - (Opcional) Histórico de uso  
- Simular "banco de dados" com JSON (objeto local ou salvo no AsyncStorage).  

---

## 🧠 Requisitos Técnicos
- App construído em **React Native** (com ou sem Expo).  
- Navegação entre telas com **react-navigation**.  
- Estados globais com **Redux** ou **Context API**.  
- Persistência local com **AsyncStorage**.  
- Lógica de horário usando `Date`.  

---

## 📆 Cronograma Sugerido (4 Semanas)

| Semana | Entregas |
|--------|----------|
| 1 | Planejamento, protótipos (papel/Figma), telas estáticas |
| 2 | Tela de login, autenticação, navegação |
| 3 | Lógica de horário, restrição de ticket, simulação de localização |
| 4 | Finalizar ADM, testes, validações, histórico e ajustes finais |

---

## ⚙️ Setup Rápido

### 1. Instalar dependências
```powershell
npm install @react-native-async-storage/async-storage
npm install
npx expo install expo-location
