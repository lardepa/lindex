# L'index

## Déploiement

L'application est compilée par la CI de Github appelée Github Actions.
Pour que le déploiement puisse opérer il faut veiller à créer 5 variables secrètes dans la configuration du dépôt Github: https://github.com/lardepa/lindex/settings/secrets/actions

- AIRTABLE_API_KEY: clef d'accès à l'API Airtable
- AIRTABLE_BASE: identifiant de la base Airtable
- FTP_URL: url du serveur FTP où est configuré le domaine
- FTP_USERNAME: username du compte FTP
- FTP_PASSWORD: password du compte FTP
