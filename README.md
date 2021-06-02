# Reseaux social d'entreprise 

Pour ce projet je suis passer full stack !!! 
Les contraite sont d'utiliser VueJs et Mysql pour la base de donnée.
J'ai utiliser node pour le serveur avec sequelize pour la communication avec la base de données, pour le design j'ai utilisé Vuetify.

Je vous fait une liste des différente fonctionnalité implémenter dans mon réseaux social 

La volonté derrière le développement de ce réseau social, est de permettre aux utilisateurs de maitriser leurs données ainsi que leur flux d’information, 
ainsi que d’encourager l’échange entre les différents utilisateurs du réseau social. Par le biais de plusieurs fonctions développer en ce sens, qui vous sera présentés à travers ce document !

Possibilité pour l’utilisateur de choisir jusqu’à trois centres d’intérêt, pour permettre un filtrage de SON fil d’actualité
La liste des différentes catégorie de centres d’intérêt :
- Monde professionnel concerne tout ce qui se rapporte au travail. 
- Développement personnel concerne tout ce qui se rapporte aux bien-être et développement de compétence humaine. 
- Détente concerne tout ce qui se rapporte à l’humour et qui ne rentre dans aucune autre catégorie. 
- Artistique concerne tout ce qui se rapporte aux arts (dessin, musique, etc).
- Technologie concerne tout ce qui se rapporte à la technique matérielle et/ou logicielle. 
- Bon plan concerne tout ce qui se rapporte au partage de réduction et autres offre commercial. 
- Histoire concerne tout ce qui se rapporte à l’histoire passée de notre monde. 
- Découvertes concerne tout ce qui se rapporte aux découvertes scientifiques ou médicales. 
- Animaux concerne tout ce qui se rapporte aux mondes animaliers

Possibilité pour l’utilisateur d’envoyer des GIF ou image
Lors de l’envoie d’un message l’utilisateur à la possibilité d’envoyer soit une image soit un gif animée et même rechercher un gif particulier en passant par L’API Gifphy

Gain de réputation en fonction du niveau d’activité
Afin d’insiter l’utilisateur à utiliser le réseau social j’ai mis en place un système de niveau qui augmente au fil des actions de l’utilisateur ainsi dans sa version «bêta» le système contient 5 niveaux différents listés ci-contre.
Pour chaque niveaux une couleur lui est rattachée pour faciliter la reconnaissance visuelle des niveaux.

Le gain «d’expèrience» est baser sur ce modèle:
- Envoie de post  =>  5 exp
- Commenter un post  =>  3 exp
- Like d’un message => 2exp pour l’utilisateur ainsi que pour l’auteur du post

Commenter et liker un message
L’utilisateur à la possibilité de coimmenter ou de liker un post qui lui à plus 
avec du texte ou un gif 

Tableau de bord de l’utilisateur
Un tableau de bord est disponible pour l’utilisateur qui lui permet de modifier ca photo de profil , sa biographie ainsi que de supprimer son profil ce qui supprimmera tous c’est message aussi 

Un système de filtres est disponible pour permettre à l’utilisateur de filtré les fils d’actualité 
