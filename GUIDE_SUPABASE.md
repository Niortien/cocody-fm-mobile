# Guide d'administration via Supabase

Puisque l'onglet administration a été retiré de l'application, vous pouvez gérer tout le contenu directement via l'interface Supabase.

## Accéder à votre base de données

1. Connectez-vous à [https://supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Dans le menu latéral, cliquez sur **Table Editor**

## Gérer les émissions (shows)

1. Dans Table Editor, sélectionnez la table **`shows`**
2. Vous verrez toutes vos émissions avec leurs informations

### Ajouter une nouvelle émission
- Cliquez sur **Insert** → **Insert row**
- Remplissez les champs :
  - **title** : Nom de l'émission
  - **host** : Nom de l'animateur
  - **day_of_week** : Jour (0=dimanche, 1=lundi, 2=mardi, 3=mercredi, 4=jeudi, 5=vendredi, 6=samedi)
  - **start_time** : Heure de début (format : "14:00")
  - **end_time** : Heure de fin (format : "16:00")
  - **description** : Description de l'émission
- Cliquez sur **Save**

### Modifier une émission
- Cliquez sur la ligne de l'émission
- Modifiez les champs souhaités
- Cliquez sur **Save**

### Supprimer une émission
- Cliquez sur les trois points ⋮ à droite de la ligne
- Sélectionnez **Delete row**
- Confirmez la suppression

## Gérer les partenaires (partners)

1. Dans Table Editor, sélectionnez la table **`partners`**

### Ajouter un partenaire
- Cliquez sur **Insert** → **Insert row**
- Remplissez les champs :
  - **name** : Nom du partenaire
  - **description** : Description
  - **logo_url** : URL du logo (ex: https://example.com/logo.png)
  - **website_url** : Site web du partenaire
  - **display_order** : Ordre d'affichage (1, 2, 3...)
- Cliquez sur **Save**

### Modifier un partenaire
- Cliquez sur la ligne du partenaire
- Modifiez les informations
- Cliquez sur **Save**

### Supprimer un partenaire
- Cliquez sur les trois points ⋮
- Sélectionnez **Delete row**

## Gérer les paramètres de la radio (radio_settings)

1. Dans Table Editor, sélectionnez la table **`radio_settings`**
2. Il n'y a qu'une seule ligne avec tous les paramètres

### Modifier les paramètres
- Cliquez sur la ligne unique
- Modifiez les champs :
  - **station_name** : Nom de la radio
  - **stream_url** : URL du flux audio
  - **facebook_page_url** : URL de la page Facebook
  - **about_text** : Texte de présentation
  - **contact_email** : Email de contact
  - **contact_phone** : Téléphone
- Cliquez sur **Save**

## Conseils

- **Sauvegardez régulièrement** : Supabase sauvegarde automatiquement, mais faites attention avant de supprimer des données
- **Format des heures** : Utilisez toujours le format 24h (ex: "14:30", pas "2:30 PM")
- **URLs des images** : Assurez-vous que les URLs des logos sont accessibles publiquement
- **Ordre d'affichage** : Pour les partenaires, utilisez des nombres pour contrôler l'ordre (1, 2, 3...)

## Besoin d'aide ?

Si vous avez des questions sur l'utilisation de Supabase, consultez la documentation officielle : [https://supabase.com/docs](https://supabase.com/docs)
