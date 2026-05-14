# Cadastro de Clientes

Sistema web para cadastro de clientes, equipamentos, agenda, usuarios, permissoes, logs, informacoes internas da empresa e ordens de servico.

## Rodar localmente

Rode com um servidor local simples ou pelo GitHub Pages.

Exemplo:

```powershell
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Estrutura atual

```text
.
|-- index.html
|-- styles.css
|-- firebase-config.js
|-- firebase.json
|-- js/
|   `-- ui.js
`-- functions/
    |-- index.js
    |-- package.json
    `-- package-lock.json
```

- `index.html`: tela principal e estrutura do sistema.
- `styles.css`: visual do sistema, temas, responsividade e componentes.
- `firebase-config.js`: configuracao do Firebase do projeto.
- `js/ui.js`: interface, regras do sistema e sincronizacao com Firestore.
- `functions/`: Cloud Functions usadas para tarefas administrativas, como alterar senha e excluir usuario no Firebase Authentication.
- `firebase.json`: configuracao de deploy das Cloud Functions.

## Configurar Firebase

1. Crie um projeto no Firebase.
2. Ative o Firestore Database.
3. Ative o Firebase Authentication com Email/Password.
4. Copie as credenciais web do app Firebase.
5. Preencha o arquivo `firebase-config.js`.
6. Troque `enabled: false` para `enabled: true`.

Enquanto `enabled` estiver `false`, o sistema usa apenas os dados locais do navegador.

## Usuario administrador

O primeiro usuario administrador e identificado pelo e-mail configurado em `firebase-config.js`:

```js
bootstrapAdminEmail: "eduarddo.black@gmail.com"
```

Ao logar com esse usuario pela primeira vez, o sistema cria o perfil em `users` com `role: "admin"` e `fullControl: true`. Depois disso, roles e permissoes ficam salvas no Firestore.

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

O Firestore e a fonte principal dos dados. O navegador escuta as colecoes com atualizacao em tempo real e usa o `localStorage` apenas como cache secundario para contingencia/offline.

## Cloud Functions

As funcoes em `functions/` sao usadas para alterar senha e excluir usuarios no Firebase Authentication. Para publicar somente essas funcoes:

```powershell
firebase deploy --only functions
```
