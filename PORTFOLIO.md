# 🚀 TaskFlow - Portfolio Edition

Une application de gestion de projet **full-stack** moderne, conçue pour impressionner les recruteurs.

## ✨ Features qui impressionnent

### 🎯 Temps réel (WebSocket)
- **Collaboration instantanée** : Voir les mouvements des autres utilisateurs en temps réel
- **Indicateurs de présence** : Qui est en ligne
- **Notifications live** : Toast quand quelqu'un modifie une tâche
- **Zero refresh** : Toutes les updates sont instantanées

### 📊 Dashboard Analytics
- **Graphiques interactifs** (Chart.js)
- **Métriques clés** : Taux de completion, tâches par priorité
- **Activité récente** : Feed temps réel
- **Recherche globale** (Cmd+K) avec autocomplete

### 🎨 UI/UX Premium
- **Animations fluides** (Framer Motion)
- **Drag & Drop** (@dnd-kit) - Kanban fluide
- **Dark/Light mode** toggle
- **Keyboard shortcuts** (?, Cmd+K, Cmd+1/2)
- **Responsive design**

### ⚡ Performance & Tech Stack
- **SQLite** - Base de données fichier (zero config)
- **NestJS** - Architecture modulaire backend
- **Next.js 14** - App Router, Server Components
- **Prisma ORM** - Type-safe database queries
- **Zustand** - State management léger
- **Socket.io** - Real-time bi-directionnel

## 🏗️ Architecture propre

```
taskflow-sqlite/
├── Backend (NestJS)
│   ├── Modules séparés (Auth, Workspaces, Projects, Tasks)
│   ├── WebSocket Gateway pour temps réel
│   ├── Activity tracking & Analytics
│   └── Prisma ORM + SQLite
│
└── Frontend (Next.js)
    ├── Dashboard avec charts
    ├── Kanban board DnD
    ├── Real-time hooks
    ├── Global state (Zustand)
    └── Animations (Framer Motion)
```

## 🎯 Pour les recruteurs

### Ce qui démontre mes compétences :

| Compétence | Démonstration |
|------------|---------------|
| **Full-stack** | Backend API + Frontend + DB en un seul projet |
| **Real-time** | WebSocket avec Socket.io |
| **Architecture** | Clean code, modules séparés |
| **UI/UX** | Animations, micro-interactions |
| **Performance** | SQLite rapide, optimistic updates |
| **TypeScript** | Code type-safe de bout en bout |
| **Modern Stack** | NestJS, Next.js 14, Prisma |

### Features "wow" :
- ✅ **Cmd+K** pour search (comme Linear/Notion)
- ✅ **Drag & drop fluide** avec animations
- ✅ **Temps réel** entre navigateurs
- ✅ **Graphiques animés** sur le dashboard
- ✅ **Keyboard shortcuts** partout
- ✅ **Theme toggle** instantané

## 🚀 Lancer en local

```bash
cd taskflow-sqlite
npm install
npm run setup
npm run dev
```

**Accès :**
- Frontend: http://localhost:3000
- API: http://localhost:3001/api
- Login: `demo@taskflow.app` / `demo123`

## 📸 Screenshots pour portfolio

### 1. Login Screen
Modern dark design avec animations

### 2. Dashboard Analytics
- Charts interactifs
- Stats en temps réel
- Activity feed

### 3. Kanban Board
- Drag & drop fluide
- Temps réel
- Animations

### 4. Temps réel
Ouvrir 2 navigateurs et voir les modifications instantanées

## 💡 Idées de démo pour entretien

1. **Montrer le temps réel**
   - Ouvrir l'app dans 2 fenêtres
   - Déplacer une tâche dans une fenêtre
   - Voir la mise à jour instantanée dans l'autre

2. **Montrer les performances**
   - Les données persistent en SQLite
   - Pas de latence sur les requêtes
   - Optimistic updates (UI réactif avant réponse API)

3. **Montrer l'architecture**
   - Code propre et modulaire
   - Séparation claire des responsabilités
   - TypeScript strict

4. **Montrer l'UX**
   - Keyboard shortcuts
   - Animations fluides
   - Feedback visuel (toasts, hover states)

## 🔧 Stack technique détaillé

### Backend
- **NestJS 10** - Framework Node.js moderne
- **Prisma 5** - ORM type-safe
- **SQLite** - Base de données embarquée
- **Socket.io** - WebSocket pour temps réel
- **JWT** - Authentification stateless
- **bcryptjs** - Hashing sécurisé

### Frontend
- **Next.js 14** - React framework (App Router)
- **TypeScript 5** - Type safety
- **Framer Motion** - Animations
- **@dnd-kit** - Drag & drop accessible
- **Chart.js** - Graphiques
- **Zustand** - State management
- **Socket.io-client** - Real-time
- **react-hot-toast** - Notifications
- **Lucide React** - Icons

### DevOps
- **npm workspaces** - Monorepo
- **Hot reload** - Backend & Frontend
- **Database migrations** - Prisma migrate

## 🎓 Concepts démontrés

### Backend
- ✅ REST API design
- ✅ Authentication JWT
- ✅ Authorization (Guards)
- ✅ Database relations
- ✅ Real-time events
- ✅ Modular architecture

### Frontend
- ✅ Component architecture
- ✅ State management
- ✅ Real-time integration
- ✅ Responsive design
- ✅ Accessibility
- ✅ Performance optimization

### Full-stack
- ✅ End-to-end type safety
- ✅ API integration
- ✅ Error handling
- ✅ Loading states
- ✅ Optimistic updates

## 📞 Contact

Créé avec ❤️ pour montrer mes compétences full-stack.

- Architecture moderne
- Code propre et maintenable
- Focus UX/UI
- Performance optimisée

**Parfait pour :** Démo technique, portfolio, preuve de compétences
