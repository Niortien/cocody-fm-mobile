# Configuration de Facebook Live

Ce guide explique comment configurer le lien Facebook Live pour afficher les émissions en direct vidéo dans l'application.

## Configuration dans la base de données

L'application récupère l'URL de la vidéo Facebook Live depuis la table `radio_info` de Supabase.

### Étape 1 : Obtenir l'URL de votre page Facebook Live

1. Allez sur votre page Facebook
2. Démarrez une diffusion en direct ou accédez à une diffusion programmée
3. Copiez l'URL de votre page Facebook (par exemple : `https://www.facebook.com/VotrePage`)

### Étape 2 : Mettre à jour la base de données

Connectez-vous à votre projet Supabase et exécutez cette requête SQL :

```sql
UPDATE radio_info
SET value = 'https://www.facebook.com/VotrePage/live'
WHERE key = 'facebook_live_url';
```

Remplacez `VotrePage` par le nom de votre page Facebook.

### Formats d'URL supportés

L'application supporte différents formats d'URL Facebook :

- URL de page : `https://www.facebook.com/VotrePage`
- URL de vidéo spécifique : `https://www.facebook.com/VotrePage/videos/123456789`
- URL de live : `https://www.facebook.com/VotrePage/live`

## Fonctionnalités

Une fois configuré, les utilisateurs pourront :

- Basculer entre le mode audio et vidéo
- Regarder les émissions en direct via Facebook Live
- Passer en mode plein écran
- Voir les informations sur l'émission en cours

## Notes importantes

- La diffusion vidéo consomme plus de données que l'audio
- Une connexion Wi-Fi est recommandée pour une meilleure expérience
- Le lecteur vidéo utilise WebView pour intégrer Facebook Live
- Les utilisateurs peuvent interagir avec la vidéo comme sur Facebook

## Désactivation de la vidéo

Si vous ne souhaitez pas afficher la vidéo en direct, laissez simplement le champ `facebook_live_url` vide dans la base de données. Le bouton "Vidéo Live" sera automatiquement désactivé.
