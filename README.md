# **Génération automatique de lettres**

## **Description**

Ce projet est une application web qui permet de générer automatiquement des lettres en fonction des informations fournies par l'utilisateur. Vous pouvez créer, modifier et enregistrer des lettres pour diverses occasions.

## **Fonctionnalités**

- Génération automatique de lettres basées sur des informations fournies par l'utilisateur.
- Modification du contenu généré avec des suggestions de l'IA.
- Enregistrement et gestion des lettres créées.
- Suppression de lettres enregistrées.

## **Prérequis**

- Node.js (version 14 ou supérieure)
- MongoDB (local ou en cloud)
- Clé API OpenAI

## **Installation**

1. Téléchargez sur votre machine locale :

   ```bash
   git clone https://github.com/votre-nom-d-utilisateur/nom-du-projet.git
   ```

2. Naviguez vers le répertoire du projet :

   ```bash
   cd nom-du-projet
   ```

3. Installez les dépendances nécessaires :

   ```bash
   npm install
   ```

4. Configurez les variables d'environnement en créant un fichier `.env` à la racine du projet et en y ajoutant votre clé API OpenAI :

   ```env
   OPENAI_API_KEY=your-openai-api-key
   ```

5. Assurez-vous que MongoDB est en cours d'exécution sur votre machine ou utilisez une instance MongoDB cloud. 

## **Utilisation**

1. Démarrez le serveur :

   ```bash
   node server.js
   ```

2. Démarrez le serveur :

   ```bash
   cd client
   npm start
   ```
