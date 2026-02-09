# 🚀 Déploiement TaskFlow

Guide complet pour déployer TaskFlow en production avec Docker.

## 📋 Prérequis

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 🐳 Docker - Méthode recommandée

### 1. Production (Build optimisé)

```bash
# Cloner le projet
git clone <repo-url>
cd taskflow-sqlite

# Lancer avec Docker Compose
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

**Accès :**
- 🌐 Application : http://localhost:3000
- 🔌 API : http://localhost:3001/api
- 📚 Documentation : http://localhost:3001/api/docs

### 2. Développement (Hot reload)

```bash
# Mode développement avec hot reload
docker-compose -f docker-compose.dev.yml up -d

# Les modifications sont automatiquement rechargées
```

### 3. Rebuild après modifications

```bash
# Rebuild complet
docker-compose down
docker-compose up -d --build

# Ou seulement un service
docker-compose up -d --build backend
```

## ☁️ Déploiement Cloud

### Railway.app (Recommandé - Gratuit)

1. Créer un compte sur [Railway](https://railway.app)
2. Créer un nouveau projet
3. Connecter votre repo GitHub
4. Railway détecte automatiquement le `Dockerfile`
5. Ajouter les variables d'environnement :
   ```
   JWT_SECRET=votre-secret-complexe
   NODE_ENV=production
   ```
6. Déployer !

### Render.com (Gratuit)

1. Créer un compte sur [Render](https://render.com)
2. New → Web Service
3. Connecter le repo
4. Configuration :
   - **Environment** : Docker
   - **Dockerfile Path** : `./backend/Dockerfile`
   - **Port** : 3001
5. Ajouter les env vars
6. Deploy

### VPS (OVH, DigitalOcean, Hetzner)

```bash
# Sur votre serveur
ssh user@votre-serveur

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Cloner et déployer
git clone <repo-url>
cd taskflow-sqlite

# Créer le fichier .env
cat > .env << EOF
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF

# Lancer
docker-compose up -d

# Vérifier
docker-compose ps
docker-compose logs -f
```

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
# Required
JWT_SECRET=your-super-secret-key-min-32-chars

# Optional (default values)
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Générer un JWT_SECRET sécurisé :**
```bash
openssl rand -base64 32
```

### Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Interface utilisateur |
| Backend | 3001 | API REST + WebSocket |

Modifier dans `docker-compose.yml` si besoin :
```yaml
ports:
  - '8080:3000'  # Frontend sur port 8080
  - '8081:3001'  # Backend sur port 8081
```

## 📊 Monitoring

### Logs

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend

# Dernières 100 lignes
docker-compose logs --tail=100 backend
```

### Health Check

```bash
# Vérifier le statut
docker-compose ps

# Test API
curl http://localhost:3001/api/health

# Test WebSocket
# Utiliser un client WebSocket sur ws://localhost:3001
```

### Mise à jour

```bash
# Pull des dernières modifications
git pull

# Rebuild et redémarrer
docker-compose down
docker-compose up -d --build

# Nettoyer les images anciennes
docker image prune -f
```

## 🔒 Sécurité

### Production Checklist

- [ ] JWT_SECRET complexe et unique
- [ ] HTTPS activé (via reverse proxy)
- [ ] Ports non-nécessaires fermés
- [ ] Container non-root
- [ ] Logs monitoring activé
- [ ] Backup database configuré

### Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/taskflow
server {
    listen 80;
    server_name taskflow.example.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d taskflow.example.com
```

## 💾 Backup

### Database SQLite

```bash
# Backup
cp backend/prisma/prod.db backups/prod-$(date +%Y%m%d).db

# Restore
cp backups/prod-20240101.db backend/prisma/prod.db
docker-compose restart backend
```

### Auto-backup script

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/taskflow"
mkdir -p $BACKUP_DIR
cp prisma/prod.db $BACKUP_DIR/prod-$(date +%Y%m%d-%H%M%S).db
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
```

## 🐛 Troubleshooting

### Problème : Container ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Vérifier les erreurs de build
docker-compose build --no-cache
```

### Problème : Permission denied

```bash
# Fix permissions
sudo chown -R $USER:$USER .
```

### Problème : Port déjà utilisé

```bash
# Trouver le processus
sudo lsof -i :3000

# Ou changer le port dans docker-compose.yml
```

### Reset complet

```bash
# Supprimer tout
docker-compose down -v
docker system prune -a

# Rebuild from scratch
docker-compose up -d --build
```

## 📈 Scaling

### Multi-instance (Load Balancer)

```yaml
# docker-compose.scale.yml
version: '3.8'

services:
  backend:
    deploy:
      replicas: 3
    # ... reste identique
```

```bash
docker-compose -f docker-compose.yml -f docker-compose.scale.yml up -d
```

## 🎯 Commandes utiles

```bash
# Statistiques
docker stats

# Espace disque
docker system df

# Nettoyage
docker system prune -a --volumes

# Shell dans le container
docker-compose exec backend sh

# Exécuter une commande
docker-compose exec backend npx prisma migrate status
```

---

**Besoin d'aide ?** Consulter les logs avec `docker-compose logs -f` 🚀
