# 🚀 TaskFlow Portfolio Edition

**Application de gestion de projet full-stack** moderne, temps réel et hautement performante. Conçue pour impressionner les recruteurs et démontrer des compétences techniques avancées.

![TaskFlow Preview](https://img.shields.io/badge/TaskFlow-v1.0.0-blue)
![NestJS](https://img.shields.io/badge/NestJS-10.0-red)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![SQLite](https://img.shields.io/badge/SQLite-3-green)
![WebSocket](https://img.shields.io/badge/WebSocket-Socket.io-orange)

---

## ✨ Features Impressionnantes

### 🎯 Temps Réel Multi-utilisateurs
- **WebSocket** avec Socket.io
- **Collaboration instantanée** : 2+ utilisateurs voient les changements en direct
- **Indicateurs de présence** : Qui est en ligne
- **Notifications live** : Toast quand quelqu'un modifie une tâche

### 📊 Dashboard Analytics
- **Graphiques interactifs** (Chart.js)
- **Métriques temps réel** : Taux de complétion, tâches par priorité
- **Activity feed** : Historique des actions
- **Recherche globale** (Cmd+K) avec autocomplete

### 🎨 UI/UX Premium
- **Animations fluides** (Framer Motion)
- **Drag & Drop** (@dnd-kit) - Kanban fluide et accessible
- **Dark/Light mode** toggle
- **Keyboard shortcuts** (`?` pour voir tous les raccourcis)
- **Responsive design** - Mobile & Desktop

### 🏗️ Architecture Professionnelle
- **Backend** : NestJS 10 - Architecture modulaire, TypeScript strict
- **Frontend** : Next.js 14 - App Router, Server Components
- **Database** : SQLite - Zero config, migrations Prisma
- **ORM** : Prisma - Type-safe, autogénéré
- **State** : Zustand - Léger et performant
- **Tests** : Jest + Supertest (unit & e2e)

### 🐳 DevOps
- **Docker** : Multi-stage build, production-ready
- **Docker Compose** : Développement & production
- **CI/CD** : GitHub Actions (tests + build)
- **Documentation API** : Swagger/OpenAPI

---

## 🚀 Démarrage Rapide (2 minutes)

### Option 1 : Script Automatique (Recommandé)

**Windows :**
```powershell
Double-cliquer sur : start-portfolio.bat
```

**Mac/Linux :**
```bash
chmod +x start-portfolio.sh
./start-portfolio.sh
```

### Option 2 : Manuel

```bash
# 1. Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev

# 2. Frontend (nouveau terminal)
cd frontend
npm install
npm run dev
```

### Option 3 : Docker

```bash
docker-compose up -d
```

---

## 🌐 Accès

| Service | URL | Description |
|---------|-----|-------------|
| **Application** | http://localhost:3000 | Interface utilisateur |
| **API** | http://localhost:3001/api | Backend REST |
| **Documentation** | http://localhost:3001/api/docs | Swagger UI |
| **WebSocket** | ws://localhost:3001 | Temps réel |

**Identifiants de démo :**
- Email : `demo@taskflow.app`
- Password : `demo123`

---

## 🎓 Demo Parfaite pour Recruteurs

### 1. Temps Réel (30 secondes)
```
1. Ouvrir Chrome → http://localhost:3000
2. Ouvrir Firefox → http://localhost:3000
3. Se connecter avec le même compte dans les 2
4. Déplacer une tâche dans Chrome
5. Observer la synchro instantanée dans Firefox !
```

### 2. Dashboard Analytics (20 secondes)
```
1. Montrer le Dashboard après login
2. Pointer les graphiques Chart.js
3. Montrer l'Activity feed
4. Faire Cmd+K pour la recherche globale
```

### 3. Kanban Board (30 secondes)
```
1. Aller sur "Kanban Board"
2. Drag & drop une tâche (animations fluides)
3. Créer une nouvelle tâche (Enter pour valider)
4. Montrer les priorités colorées
```

### 4. Keyboard Shortcuts (10 secondes)
```
Appuyer sur "?" → Montrer tous les raccourcis
```

---

## 📁 Structure du Projet

```
taskflow-sqlite/
├── 📁 backend/                    # API NestJS
│   ├── 📁 src/
│   │   ├── 📁 auth/              # JWT Auth + Tests
│   │   ├── 📁 websocket/         # Socket.io Gateway
│   │   ├── 📁 activity/          # Analytics service
│   │   ├── 📁 tasks/             # CRUD + DTOs
│   │   ├── 📁 workspaces/        # Workspace management
│   │   ├── 📁 projects/          # Project management
│   │   └── 📁 prisma/            # Database service
│   ├── 📁 test/                  # E2E Tests
│   ├── 📁 prisma/
│   │   ├── schema.prisma         # SQLite Schema
│   │   └── seed.ts               # Données démo
│   ├── Dockerfile                # Multi-stage build
│   └── package.json
│
├── 📁 frontend/                   # Next.js 14
│   ├── 📁 app/                   # App Router
│   ├── 📁 components/
│   │   ├── Dashboard.tsx         # Analytics + Charts
│   │   └── KanbanBoard.tsx       # DnD Board
│   ├── 📁 hooks/
│   │   └── useSocket.ts          # WebSocket hook
│   ├── 📁 stores/                # Zustand stores
│   ├── Dockerfile
│   └── package.json
│
├── 📁 .github/workflows/
│   └── ci.yml                    # CI/CD Pipeline
│
├── 📄 docker-compose.yml         # Production
├── 📄 docker-compose.dev.yml     # Développement
├── 📄 start-portfolio.bat        # Windows launcher
├── 📄 start-portfolio.sh         # Mac/Linux launcher
├── 📄 SETUP.md                   # Guide détaillé
├── 📄 DEPLOY.md                  # Guide déploiement
└── 📄 PORTFOLIO.md               # Guide recruteurs
```

---

## 🛠️ Stack Technique

### Backend
| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **NestJS** | 10.x | Framework API modulaire |
| **TypeScript** | 5.x | Type safety |
| **Prisma** | 5.x | ORM SQLite |
| **SQLite** | 3.x | Database fichier |
| **Socket.io** | 4.x | WebSocket temps réel |
| **JWT** | 9.x | Authentification |
| **bcryptjs** | 2.x | Hashing sécurisé |
| **Swagger** | 7.x | Documentation API |
| **Jest** | 29.x | Tests unitaires |
| **Supertest** | 6.x | Tests E2E |

### Frontend
| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **Next.js** | 14.x | React framework |
| **TypeScript** | 5.x | Type safety |
| **Framer Motion** | 10.x | Animations |
| **@dnd-kit** | 6.x | Drag & drop |
| **Chart.js** | 4.x | Graphiques |
| **Zustand** | 4.x | State management |
| **Socket.io-client** | 4.x | WebSocket client |
| **react-hot-toast** | 2.x | Notifications |
| **Lucide React** | 0.3.x | Icons |

### DevOps
| Technologie | Utilisation |
|-------------|-------------|
| **Docker** | Containerisation |
| **Docker Compose** | Orchestration |
| **GitHub Actions** | CI/CD |
| **Nginx** | Reverse proxy (prod) |

---

## 🧪 Tests

### Backend Tests
```bash
cd backend

# Unit tests avec coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Tous les tests
npm run test
```

**Coverage :**
- ✅ Auth Service (100%)
- ✅ Tasks Controller
- ✅ E2E Scenarios

---

## 🐳 Docker

### Production
```bash
docker-compose up -d
```

### Développement (Hot reload)
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Build manuel
```bash
# Backend
docker build -t taskflow-backend ./backend

# Frontend
docker build -t taskflow-frontend ./frontend
```

---

## ☁️ Déploiement

### Railway.app (Gratuit)
```bash
1. Connecter repo GitHub
2. Railway détecte automatiquement les Dockerfiles
3. Ajouter JWT_SECRET dans Variables
4. Deploy !
```

### Render.com (Gratuit)
```bash
1. New Web Service
2. Connecter repo
3. Environment: Docker
4. Deploy
```

### VPS (Production)
```bash
# Sur le serveur
git clone <repo>
cd taskflow-sqlite
docker-compose up -d
```

Voir [DEPLOY.md](./DEPLOY.md) pour le guide complet.

---

## 📸 Screenshots

### Login Screen
Interface moderne avec animations Framer Motion.

### Dashboard Analytics
- Graphiques en temps réel
- Stats de complétion
- Activity feed

### Kanban Board
- Drag & drop fluide
- Temps réel
- Animations

---

## 🎯 Pour les Recruteurs

Ce projet démontre :

✅ **Full-stack complet** - Frontend + Backend + Database  
✅ **Architecture propre** - NestJS modules, Clean Code  
✅ **Temps réel** - WebSocket, pas polling  
✅ **UI/UX soignée** - Animations, micro-interactions  
✅ **TypeScript strict** - Type safety end-to-end  
✅ **Tests** - Unit + E2E avec Jest  
✅ **DevOps** - Docker, CI/CD  
✅ **Documentation** - Swagger, README complets  

**Parfait pour :** Startups, Scale-ups, Produits tech

---

## 📝 Documentation

- [SETUP.md](./SETUP.md) - Installation détaillée
- [DEPLOY.md](./DEPLOY.md) - Guide déploiement
- [PORTFOLIO.md](./PORTFOLIO.md) - Guide recruteurs
- **Swagger** - http://localhost:3001/api/docs

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📧 Contact

Créé avec ❤️ pour montrer mes compétences full-stack.

**Questions ?** N'hésitez pas à me contacter !

---

## 📄 Licence

MIT License - voir [LICENSE](./LICENSE) pour les détails.

---

<p align="center">
  <strong>🚀 TaskFlow - Productivity without complexity</strong>
</p>
