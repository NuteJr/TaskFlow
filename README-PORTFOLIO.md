# TaskFlow Portfolio 🚀

**Application full-stack de gestion de projet** - Conçue pour impressionner les recruteurs.

## ⚡ Démarrage rapide (2 minutes)

### Windows
```bash
# Double-cliquer sur
start-portfolio.bat
```

### Mac/Linux
```bash
chmod +x start-portfolio.sh
./start-portfolio.sh
```

### Manuel
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

## 🌐 Accès

- **Application** : http://localhost:3000
- **API** : http://localhost:3001/api
- **Login** : `demo@taskflow.app` / `demo123`

## ✨ Features Portfolio

### 🎯 Temps Réel (WebSocket)
- Ouvrir **2 navigateurs** côte à côte
- Déplacer une tâche dans l'un
- Voir la mise à jour **instantanée** dans l'autre
- Notifications toast quand quelqu'un modifie

### 📊 Dashboard Analytics
- Graphiques en temps réel
- Stats de complétion
- Tâches par priorité
- Activity feed

### 🎨 UI Premium
- **Drag & drop** fluide (@dnd-kit)
- **Animations** (Framer Motion)
- **Dark/Light** mode
- **Keyboard shortcuts** (? pour voir)
- **Cmd+K** pour recherche globale

### 🏗️ Architecture Pro
- **NestJS** - Backend modulaire
- **Next.js 14** - Frontend moderne
- **Prisma + SQLite** - Database zero-config
- **Socket.io** - Real-time
- **Zustand** - State management

## 🎓 Pour les entretiens

### Demo rapide (2 min)
1. Montrer le **login** avec animations
2. Montrer le **dashboard** avec charts
3. Ouvrir **2 fenêtres** pour temps réel
4. Déplacer une tâche → voir la synchro
5. Montrer **keyboard shortcuts** (touche ?)

### Points techniques à souligner
- ✅ **Full-stack** complet (frontend + backend + DB)
- ✅ **Temps réel** sans refresh (WebSocket)
- ✅ **Code propre** (modules, TypeScript)
- ✅ **UX soignée** (animations, feedback)
- ✅ **Zero config** (SQLite embarqué)

### Questions auxquelles je suis prêt
- Comment fonctionne le temps réel ? → WebSocket + Socket.io
- Pourquoi SQLite ? → Zero config, parfait pour démo
- Architecture ? → NestJS modules + Next.js components
- State management ? → Zustand (léger, performant)

## 📸 Screenshots

### Login Screen
![Login](screenshots/login.png)

### Dashboard Analytics
![Dashboard](screenshots/dashboard.png)

### Kanban Board
![Board](screenshots/board.png)

## 🎯 Stack Technique

| Couche | Tech | Pourquoi |
|--------|------|----------|
| Backend | NestJS | Architecture pro, modulaire |
| Frontend | Next.js 14 | App Router, performances |
| Database | SQLite | Zero config, portable |
| ORM | Prisma | Type-safe, migrations |
| Real-time | Socket.io | WebSocket simple |
| UI | Framer Motion | Animations fluides |
| DnD | @dnd-kit | Drag & drop accessible |
| Charts | Chart.js | Graphiques interactifs |

## 🚀 Déploiement

### Gratuit (démo)
- **Railway.app** - Backend + DB
- **Vercel** - Frontend

### Production
- **VPS** (OVH/DigitalOcean) ~5€/mois
- **SQLite** → PostgreSQL si besoin

## 📝 Fichiers importants

```
taskflow-sqlite/
├── backend/
│   ├── src/
│   │   ├── websocket/      # Temps réel
│   │   ├── activity/       # Analytics
│   │   └── tasks/          # CRUD tâches
│   └── prisma/
│       └── schema.prisma   # Database
├── frontend/
│   ├── components/
│   │   ├── Dashboard.tsx   # Analytics
│   │   └── KanbanBoard.tsx # DnD board
│   └── hooks/
│       └── useSocket.ts    # WebSocket hook
└── PORTFOLIO.md            # Doc recruteurs
```

## 💡 Tips pour recruteurs

Ce projet démontre :
- **Autonomie** - Je peux créer un produit complet seul
- **Architecture** - Code propre et scalable
- **Modernité** - Stack 2024 (Next.js 14, App Router)
- **UX** - Attention aux détails et animations
- **Temps réel** - Compétences avancées WebSocket

**Parfait pour** : Startups, scale-ups, produits tech

---

🎓 **Créé avec passion** pour montrer mes compétences full-stack.

Questions ? N'hésitez pas à me contacter !
