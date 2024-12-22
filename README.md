Une application permettant aux enseignants de générer des cours interactifs, des fiches de révision et des QCM à l'aide de l'IA, avec la possibilité de télécharger le tout en format PDF ou JSON.
## Getting Started

### Installer les dépendances

```bash
npm install
```
### lancer le serveur de developpment 
```bash
# after
npm run dev
```
### N'oubliez pas de remplacer votre clé :
Créer un fichier .env et ajouter la valeur "CHATGPT_API_KEY" avec la bonne clé
```bash
CHATGPT_API_KEY="votre_clé"
NEXT_PUBLIC_BASE_URL="url du site"
```
Ouverez [http://localhost:3000](http://localhost:3000) sur votre navigateur préféré.

A savoir que les cours sont bien crée mais stocké dans un fichier data à la racine du projet car le fichier public n'est accésible qu'en lecture seul. Faut de temps une BDD n'a pas pu être mise en place afin de gérer ça

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
