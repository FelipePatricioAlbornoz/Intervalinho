# 🛡️ Sistema Centralizado de Tratamento de Erros

## Visão Geral

Um sistema robusto e centralizado para tratamento de erros em toda a aplicação Intervalinho. Oferece logging consistente, mensagens amigáveis ao usuário e ferramentas de debugging.

## 📁 Estrutura

### Serviço Principal: `assets/services/errorHandler.js`

Núcleo do sistema com funções para:
- **Logging**: Registra erros em log interno
- **Categorização**: Identifica tipo de erro automaticamente
- **Mensagens**: Fornece mensagens amigáveis em português
- **Debug**: Ferramentas para análise de erros

### Componente: `assets/components/ErrorBoundary.jsx`

- Captura erros não tratados em componentes React
- Previne que a app inteira quebre
- Exibe interface amigável com opção de retry
- Mostra informações de debug em ambiente de desenvolvimento

## 🎯 Tipos de Erro

```javascript
ERROR_TYPES = {
  VALIDATION: 'VALIDATION_ERROR',      // Dados inválidos
  PERMISSION: 'PERMISSION_ERROR',      // Permissões negadas
  STORAGE: 'STORAGE_ERROR',            // AsyncStorage falhou
  LOCATION: 'LOCATION_ERROR',          // Geolocalização falhou
  NETWORK: 'NETWORK_ERROR',            // Problema de conexão
  AUTH: 'AUTH_ERROR',                  // Autenticação falhou
  UNKNOWN: 'UNKNOWN_ERROR',            // Erro desconhecido
  TIMEOUT: 'TIMEOUT_ERROR',            // Operação demorou muito
}
```

## 📊 Níveis de Severidade

```javascript
ERROR_LEVELS = {
  INFO: 'INFO',              // 🔵 Informação
  WARNING: 'WARNING',        // 🟡 Aviso