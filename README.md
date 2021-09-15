# EHA-FRONT
Eha-front  est la partie frontend de l'application Achatpédia basé sur le framework Angular.


## Logiciels requis

### Node.js   **14.17+**

-  Angular nécessite une version LTS active ou LTS de maintenance de Node.js.  
- Pour plus d'informations sur les exigences de version spécifiques, consultez la clé des moteurs dans le fichier package.json. 
   
### gestionnaire de paquets npm **6.14.13+** 
 
- Les applications Angular, Angular CLI et Angular dépendent des packages npm pour de nombreuses fonctionnalités et fonctions. Pour télécharger et installer des packages npm, vous avez besoin d'un gestionnaire de packages npm. 
- Ce guide utilise l'interface de ligne de commande du client npm, qui est installée avec Node.js par défaut. 

- Pour vérifier que le client npm est installé, exécutez  `npm -v`  dans une fenêtre de terminal.

## Installation

### 1- Clonons le repository !
```
git clone https://si-devops-gitlab.edf.fr/eha-web-achat/eha-front.git ./appli/projects/ANGULAREHA
```
### 2- Changer le dossier
```
cd /appli/projects/ANGULAREHA
```

### 3- installer les dépendances
```
npm install 
```


## Lancer l'application localement
Lancer l'application avec la commande suivante: 
```
ng serve [--ssl true] [--port 4200]...
```
- Exemple:  
`ng serve --ssl true --host dsp0929522.atlas.edf.fr --disable-host-check true 
--port 5000`

## Build
- Build basique avec la commande : `ng build`
- Pour configurer le output de build avec ces lignes de commande : 

**Option1**
```
ng build -op dist/example 
```
**Option2**
```
ng build --output-path=dist/example
```
