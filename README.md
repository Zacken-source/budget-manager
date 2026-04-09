# Budget Manager

Application fullstack de gestion budgétaire personnelle.

**Stack :** React 18 · Vite · Tailwind CSS · Node.js · Express · MariaDB · JWT

## Fonctionnalités

- Authentification sécurisée (JWT + bcrypt)
- Ajout, modification et suppression de transactions
- Catégories système et catégories personnalisées
- Filtres par type et par période
- Dashboard avec solde, revenus et dépenses
- Graphiques : évolution mensuelle et répartition par catégorie
- Export CSV

## Lancement local

### Prérequis
- Node.js >= 18
- MariaDB >= 10.6

### Backend

```bash
cd backend
cp .env.example .env    # remplis les variables
mysql -u root -p < src/config/schema.sql
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

L'app est accessible sur [http://localhost:5173](http://localhost:5173)

## Tests

```bash
cd backend && npm test
```

## Structure du projet

```
budget-manager/
├── backend/
│   └── src/
│       ├── config/       # DB pool et schema SQL
│       ├── controllers/  # Logique métier
│       ├── middleware/   # Auth JWT et gestion d'erreurs
│       └── routes/       # Définition des endpoints
└── frontend/
    └── src/
        ├── api/          # Appels HTTP centralisés
        ├── components/   # Composants réutilisables
        ├── context/      # AuthContext
        ├── hooks/        # useTransactions
        └── pages/        # Login, Register, Dashboard
```

## Endpoints API

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | /api/auth/register | — | Inscription |
| POST | /api/auth/login | — | Connexion |
| GET | /api/auth/me | ✓ | Profil connecté |
| GET | /api/transactions | ✓ | Liste avec filtres |
| POST | /api/transactions | ✓ | Créer |
| PUT | /api/transactions/:id | ✓ | Modifier |
| DELETE | /api/transactions/:id | ✓ | Supprimer |
| GET | /api/transactions/stats | ✓ | Statistiques |
| GET | /api/transactions/export | ✓ | Export CSV |
| GET | /api/categories | ✓ | Liste catégories |
| POST | /api/categories | ✓ | Créer catégorie |