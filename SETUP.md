# 🚀 Setup Complet TaskFlow Portfolio

Guide étape par étape pour configurer et lancer TaskFlow.

## ⚡ Quick Start (5 minutes)

### Windows
```powershell
# 1. Double-cliquer sur
start-portfolio.bat

# 2. Attendre l'installation
# 3. Ouvrir http://localhost:3000
```

### Mac/Linux
```bash
# 1. Rendre exécutable
chmod +x start-portfolio.sh

# 2. Lancer
./start-portfolio.sh

# 3. Ouvrir http://localhost:3000
```

---

## 📋 Installation manuelle détaillée

### 1. Prérequis

- **Node.js** 18+ ([télécharger](https://nodejs.org))
- **npm** 9+ (inclus avec Node.js)
- **Git** ([télécharger](https://git-scm.com))

Vérifier l'installation :
```bash
node --version  # v18+ 
npm --version   # v9+
```

### 2. Cloner le projet

```bash
git clone <repo-url>
cd taskflow-sqlite
```

### 3. Configuration Backend

```bash
# Aller dans le backend
cd backend

# Installer les dépendances
npm install

# Générer le client Prisma (ORM)
npx prisma generate

# Créer la base de données SQLite
npx prisma migrate dev --name init

# Remplir avec des données de démo
npx prisma db seed

# Démarrer le serveur (Terminal 1)
npm run start:dev
```

Le backend démarre sur http://localhost:3001

**Vérification :**
```bash
curl http://localhost:3001/api/health
# ou ouvrir dans le navigateur
```

### 4. Configuration Frontend

```bash
# Nouveau terminal, aller dans frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur (Terminal 2)
npm run dev
```

Le frontend démarre sur http://localhost:3000

### 5. Accéder à l'application

Ouvrir le navigateur : **http://localhost:3000**

**Identifiants de démo :**
- Email : `demo@taskflow.app`
- Password : `demo123`

---

## 🐳 Docker (Optionnel)

Si vous préférez utiliser Docker :

```bash
# Démarrer tout avec Docker
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

---

## 🧪 Lancer les tests

### Tests unitaires Backend
```bash
cd backend
npm run test:cov
```

### Tests E2E Backend
```bash
cd backend
npm run test:e2e
```

### Tests Frontend
```bash
cd frontend
npm test
```

---

## 📚 Documentation API

Une fois le backend lancé :

**Swagger UI** : http://localhost:3001/api/docs

Endpoints disponibles :
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `GET /api/workspaces` - Liste workspaces
- `GET /api/projects` - Liste projets
- `GET /api/tasks` - Liste tâches
- `POST /api/tasks` - Créer tâche
- `PATCH /api/tasks/:id` - Modifier tâche

---

## 🐛 Troubleshooting

### Erreur : "Cannot find module '@prisma/client'"
```bash
cd backend
npx prisma generate
```

### Erreur : "Port 3000 is already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Erreur : "Database is locked"
```bash
# Supprimer et recréer la DB
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
npx prisma db seed
```

### Erreur : "npm install fail"
```bash
# Nettoyer le cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Vérifier que tout fonctionne

### 1. Backend
```bash
curl http://localhost:3001/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@taskflow.app","password":"demo123"}'
```

Réponse attendue :
```json
{
  "user": { "email": "demo@taskflow.app", ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Frontend
Ouvrir http://localhost:3000 et vérifier :
- ✅ Page de login s'affiche
- ✅ Connexion fonctionne
- ✅ Dashboard avec charts
- ✅ Kanban board avec drag & drop

### 3. Temps réel
1. Ouvrir http://localhost:3000 dans Chrome
2. Ouvrir http://localhost:3000 dans Firefox
3. Connecter avec le même compte
4. Déplacer une tâche dans Chrome
5. Vérifier qu'elle bouge aussi dans Firefox !

---

## 📁 Structure du projet

```
taskflow-sqlite/
├── 📁 backend/               # API NestJS
│   ├── 📁 src/
│   │   ├── 📁 auth/         # Authentification JWT
│   │   ├── 📁 websocket/    # Temps réel (Socket.io)
│   │   ├── 📁 activity/     # Analytics
│   │   ├── 📁 tasks/        # CRUD tâches
│   │   └── 📁 prisma/       # Database service
│   ├── 📁 prisma/
│   │   ├── schema.prisma    # Schéma SQLite
│   │   └── seed.ts          # Données démo
│   ├── 📁 test/             # Tests E2E
│   └── package.json
│
├── 📁 frontend/              # Next.js 14
│   ├── 📁 app/              # Pages & layout
│   ├── 📁 components/       # Composants React
│   │   ├── Dashboard.tsx    # Analytics
│   │   └── KanbanBoard.tsx  # Drag & drop
│   ├── 📁 hooks/            # Hooks personnalisés
│   ├── 📁 stores/           # Zustand stores
│   └── package.json
│
├── 📄 docker-compose.yml     # Docker production
├── 📄 docker-compose.dev.yml # Docker développement
├── 📄 start-portfolio.bat    # Script Windows
├── 📄 start-portfolio.sh     # Script Mac/Linux
└── 📄 SETUP.md              # Ce fichier
```

---

## 🎓 Commandes utiles

### Backend
```bash
cd backend

# Développement
npm run start:dev      # Hot reload
npm run build          # Build production
npm run start:prod     # Lancer production

# Database
npx prisma studio      # GUI database
npx prisma migrate dev # Nouvelle migration
npx prisma db seed     # Reset données

# Tests
npm run test           # Unit tests
npm run test:e2e       # Tests E2E
npm run test:cov       # Avec coverage
```

### Frontend
```bash
cd frontend

# Développement
npm run dev            # Hot reload
npm run build          # Build production
npm run start          # Lancer production
```

### Docker
```bash
# Production
docker-compose up -d
docker-compose logs -f
docker-compose down

# Développement
docker-compose -f docker-compose.dev.yml up -d

# Nettoyage
docker system prune -a
```

---

## ✨ Features à démontrer

1. **Temps réel**
   - Ouvrir 2 navigateurs
   - Déplacer une tâche
   - Voir la synchro instantanée

2. **Dashboard**
   - Graphiques animés
   - Stats en temps réel
   - Activity feed

3. **Kanban**
   - Drag & drop fluide
   - Animations Framer Motion
   - Création rapide de tâches

4. **UX**
   - Appuyer sur `?` pour shortcuts
   - `Cmd+K` pour recherche
   - Dark/Light mode

---

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifier les prérequis (Node.js 18+)
2. Supprimer `node_modules` et réinstaller
3. Vérifier que les ports 3000 et 3001 sont libres
4. Consulter les logs dans les terminaux
5. Ouvrir une issue sur GitHub

**Bon développement !** 🚀
