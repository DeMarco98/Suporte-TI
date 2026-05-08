# Cadastro de Clientes

Sistema web para cadastro de clientes, equipamentos, agenda, usuarios, permissoes, logs e ordens de servico.

## Rodar localmente

Como o projeto usa ES Modules, rode com um servidor local simples ou pelo GitHub Pages.

Exemplo:

```powershell
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Estrutura

```text
.
├── index.html
├── styles.css
├── app.js
├── firebase-config.js
└── js/
    ├── auth.js
    ├── clients.js
    ├── serviceOrders.js
    ├── agenda.js
    ├── firebase.js
    └── ui.js
```

- `app.js`: ponto de entrada ES Module.
- `js/ui.js`: orquestra eventos, renderizacao e integra os modulos.
- `js/auth.js`: constantes e helpers de login/sessao.
- `js/clients.js`: modelos, helpers e servicos `createClient`, `updateClient`, `deleteClient`, `listClients`.
- `js/serviceOrders.js`: regras e servicos `createServiceOrder`, `updateServiceOrder`, `listServiceOrders`.
- `js/agenda.js`: helpers e servicos `createAgendaItem`, `listAgendaItems`.
- `js/logs.js`: servicos `createLog`, `listLogs`.
- `js/firebase.js`: helpers de configuracao/autenticacao Firebase e mapeamento de colecoes.

## Configurar Firebase

1. Crie um projeto no Firebase.
2. Ative o Firestore Database.
3. Copie as credenciais web do app Firebase.
4. Preencha o arquivo `firebase-config.js`.
5. Troque `enabled: false` para `enabled: true`.

Enquanto `enabled` estiver `false`, o sistema usa apenas os dados locais do navegador.

## Proteger com Firebase Authentication

1. No Firebase, acesse `Build > Authentication`.
2. Clique em `Get started`.
3. Em `Sign-in method`, habilite `Email/Password`.
4. Em `Users`, crie o usuario:

   - E-mail: `eduarddo.black@gmail.com`
   - Senha: a mesma senha do administrador do sistema

O login `administrador` do sistema esta mapeado para `eduarddo.black@gmail.com` no arquivo `firebase-config.js`.

Para usuarios criados no sistema, crie tambem um usuario no Firebase Authentication usando:

`login@sistema.local`

Exemplo: se o login no sistema for `joao`, crie no Firebase Authentication o e-mail `joao@sistema.local`.

## Regras iniciais do Firestore

Depois de criar o usuario do Authentication, troque as regras do Firestore para:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Banco de dados

Com Firebase ativo, o sistema sincroniza os dados em colecoes separadas:

```text
users
clients
serviceOrders
agenda
logs
authorizationRequests
equipmentCategories
equipmentBrandModels
serviceOrderEquipmentTypes
externalRepairLocations
emailTypes
companyInfo/main
counters
```

O Firestore e a fonte principal dos dados. O navegador escuta as colecoes com atualizacao em tempo real e usa o `localStorage` apenas como cache secundario para contingencia/offline. Existe uma migracao temporaria que copia dados antigos de `appState/main` para as novas colecoes na primeira sincronizacao.

## Login e permissoes

Nao existe senha hardcoded no codigo. O login depende do Firebase Authentication.

O primeiro usuario administrador e criado/identificado pelo e-mail configurado em `firebase-config.js`:

```js
bootstrapAdminEmail: "eduarddo.black@gmail.com"
```

Ao logar com esse usuario pela primeira vez, o sistema cria o perfil em `users` com `role: "admin"` e `fullControl: true`. Depois disso, roles e permissoes ficam salvas no Firestore.
