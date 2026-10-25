let collaborators = [];
let userStories = [];
let boardStories = [];
let storyIdCounter = 1;

/**
 * Fonction pour ajouter un nouveau collaborateur à l'équipe
 * TODO:
 * - Récupérer la valeur du champ input avec l'id 'collaboratorName'
 * - Vérifier que le nom n'est pas vide et n'existe pas déjà dans le tableau 'collaborators'
 * - Ajouter le collaborateur au tableau 'collaborators'
 * - Vider le champ input
 * - Appeler updateCollaboratorsList() pour afficher la liste
 * - Appeler updateAssigneeSelect() pour mettre à jour le select d'assignation
 */
function addCollaborator() {
  const collaboratorInput = document.getElementById("collaboratorName");
  let inputValue = collaboratorInput.value;
  if (!inputValue) {
    alert("Ecrire le nom de collaborator!!");
    return;
  } else if (collaborators.includes(inputValue)) {
    alert("le nom est deja existe");
    return;
  }
  collaborators.push(inputValue);
  collaboratorInput.value = "";
  updateCollaboratorsList();
  updateAssigneeSelect();
}

/**
 * Fonction pour afficher la liste des collaborateurs dans l'interface
 * TODO:
 * - Récupérer l'élément DOM avec l'id 'collaboratorsList'
 * - Générer du HTML pour chaque collaborateur (badges avec leur nom)
 * - Utiliser un style inline: background #667eea, color white, padding 8px 15px, border-radius 20px
 * - Injecter le HTML dans l'élément avec innerHTML
 */
function updateCollaboratorsList() {
  const listeCollaborators = document.getElementById("collaboratorsList");
  listeCollaborators.innerHTML = "";
  collaborators.forEach(function (item) {
    let button = document.createElement("button");
    button.innerHTML = item;
    listeCollaborators.appendChild(button);
  });
}

/**
 * Fonction pour mettre à jour la liste déroulante des assignés
 * TODO:
 * - Récupérer l'élément select avec l'id 'storyAssignee'
 * - Générer les options: une option "Non assigné" + une option par collaborateur
 * - Mettre à jour le select avec innerHTML
 */
function updateAssigneeSelect() {
  const assigneeStory = document.getElementById("storyAssignee");
  assigneeStory.innerHTML = "";
  collaborators.forEach(function (element) {
    let option = document.createElement("option");
    option.innerHTML = `${element}`;
    assigneeStory.appendChild(option);
  });
}

/**
 * Fonction pour créer une nouvelle User Story
 * TODO:
 * - Récupérer les valeurs des champs: storyTitle, storyDescription, storySprint, storyAssignee
 * - Vérifier que le titre et la description ne sont pas vides
 * - Créer un objet story avec: id (utiliser storyIdCounter++), title, description, sprint (parseInt), assignee, status: 'backlog'
 * - Ajouter la story au tableau 'userStories'
 * - Vider les champs titre et description
 * - Appeler renderSprintBacklog() pour actualiser l'affichage
 */
function addUserStory() {
  const titreDeStory = document.getElementById("storyTitle");
  const descriptionStory = document.getElementById("storyDescription");
  const sprintStory = document.getElementById("storySprint");
  const assigneeStory = document.getElementById("storyAssignee");
  if (!titreDeStory.value || !descriptionStory.value) {
    alert("Ecrire le titre et la description");
    return;
  }
  let collaborateurObjet = {
    id: storyIdCounter,
    title: titreDeStory.value,
    description: descriptionStory.value,
    sprint: sprintStory.value,
    assignee: assigneeStory.value,
    status: "backlog",
  };
  storyIdCounter++;

  titreDeStory.value = "";
  descriptionStory.value = "";
  userStories.push(collaborateurObjet);
  renderSprintBacklog();
}

/**
 * Fonction pour afficher le Sprint Backlog avec toutes les stories par sprint
 * TODO:
 * - Récupérer le conteneur avec l'id 'sprintBacklog'
 * - Pour chaque sprint (1, 2, 3):
 *   - Filtrer les stories du sprint avec status 'backlog'
 *   - Générer le HTML: conteneur sprint avec header (titre + bouton Start)
 *   - Pour chaque story: afficher titre, description, assigné
 *   - Si aucune story: afficher "Aucune story dans ce sprint"
 * - Injecter tout le HTML généré dans le conteneur
 */
function renderSprintBacklog() {
  const backlogSprint = document.getElementById("sprintBacklog");
  // console.log(userStories);
  backlogSprint.innerHTML = "";
  for (let i = 1; i <= 3; i++) {
    const sprintStory = userStories.filter(function (element) {
      return element.sprint == i && element.status == "backlog";
    });

    let sprintContainer = document.createElement("div");
    sprintContainer.className = "sprint-Container";
    backlogSprint.appendChild(sprintContainer);

    let sprintHeader = document.createElement("div");
    sprintHeader.className = "sprint-Header";
    sprintContainer.appendChild(sprintHeader);

    let header = document.createElement("h3");
    header.innerHTML = `Sprint ${i}`;
    sprintHeader.appendChild(header);

    let button = document.createElement("button");
    button.className = "start-sprint-btn";
    button.textContent = "Démarrer Sprint";
    button.onclick = function () {
      startSprint(i);
    };
    sprintHeader.appendChild(button);

    let sprintStories = document.createElement("div");
    sprintStories.className = "sprint-Stories";
    sprintContainer.appendChild(sprintStories);

    if (sprintStory.length === 0) {
      let message = document.createElement("p");
      message.innerHTML = "Acune story dans ce sprint ";
      sprintStories.appendChild(message);
    } else {
      sprintStory.forEach(function (story) {
        let storyItem = document.createElement("div");
        storyItem.className = "story-item";
        sprintStories.appendChild(storyItem);

        let strong = document.createElement("strong");
        strong.innerHTML = `${story.title}`;
        storyItem.appendChild(strong);

        let p = document.createElement("p");
        p.innerHTML = `${story.description}`;
        storyItem.appendChild(p);
        let small = document.createElement("small");
        small.innerHTML = `Assigné à : ${story.assignee}`;
        storyItem.appendChild(small);
      });
    }
  }
}

/**
 * Fonction appelée lors du clic sur "Démarrer Sprint"
 * TODO:
 * - Filtrer toutes les stories du sprint demandé avec status 'backlog'
 * - Pour chaque story trouvée:
 *   - Changer son status à 'todo'
 *   - Ajouter la story au tableau 'boardStories'
 * - Retirer ces stories du tableau 'userStories'
 * - Appeler renderSprintBacklog() et renderBoard() pour mettre à jour l'affichage
 */
function startSprint(sprintNum) {
  const story = userStories.filter(function (item) {
    return item.status == "backlog" && item.sprint == sprintNum;
  });
  // console.log(story);

  const newUserStories = userStories.filter(function (item) {
    return item.status != "backlog" || item.sprint != sprintNum;
  });
  // console.log(newUserStories);

  userStories = newUserStories;
  //console.log(userStories);

  story.forEach(function (element) {
    element.status = "todo";
    boardStories.push(element);
  });
  //console.log(story);

  renderSprintBacklog();
  renderBoard();
}

/**
 * Fonction pour afficher toutes les cartes sur le SCRUM Board
 * TODO:
 * - Pour chaque colonne ('todo', 'in-progress', 'testing', 'done'):
 *   - Récupérer le conteneur de la colonne
 *   - Filtrer les stories avec le status correspondant depuis 'boardStories'
 *   - Si aucune story: afficher "Aucune carte"
 *   - Sinon générer une carte pour chaque story avec:
 *     - Titre, description, badge assigné
 *     - Boutons "Suivant" (sauf pour done), "Précédent" (sauf pour todo), "Supprimer"
 *   - Injecter le HTML dans le conteneur
 */
function renderBoard() {
  const column = document.querySelectorAll(".column-content");

  column.forEach(function (item) {
    item.innerHTML = "";
    const toDoLI = boardStories.filter(function (element) {
      return element.status === item.id;
    });
    if (toDoLI.length == 0) {
      let message = document.createElement("p");
      message.innerHTML = "Aucune carte";
      item.appendChild(message);
    } else {
      toDoLI.forEach(function (stor) {
        let story = document.createElement("div");
        story.className = "story";
        item.appendChild(story);

        let strong = document.createElement("strong");
        strong.innerHTML = `${stor.title}`;
        story.appendChild(strong);

        let p = document.createElement("p");
        p.innerHTML = `${stor.description}`;
        story.appendChild(p);

        let small = document.createElement("small");
        small.innerHTML = `Assigné à : ${stor.assignee}`;
        story.appendChild(small);

        if (stor.status != "done") {
          let button = document.createElement("button");
          button.innerHTML = "Suivant";
          story.appendChild(button);
          button.onclick = function () {
         let nextStatus = getNextStatus(stor.status);
            moveCard(stor.id ,nextStatus);
          };
        }
        if (stor.status != "todo") {
          let button = document.createElement("button");
          button.innerHTML = "Précédent";
          story.appendChild(button);
          button.onclick = function () { 
         let prevStatus = getPrevStatus(stor.status);
            moveCard(stor.id ,prevStatus);
          };
        }
        let button = document.createElement("button");
        button.innerHTML = "Supprimer";
        story.appendChild(button);
         button.onclick = function () {
           deleteCard(stor.id) ;
          };
      });
    }
  });
}

/**
 * Fonction utilitaire pour obtenir le status suivant dans le workflow
 * TODO:
 * - Créer un objet avec les transitions: todo→in-progress, in-progress→testing, testing→done
 * - Retourner le status suivant selon le status actuel
 */
function getNextStatus(current) {
  const transitions = {
    "todo" : "in-progress",
    "in-progress": "testing",
    "testing":"done"

  }
  return transitions[current]
}

/**
 * Fonction utilitaire pour obtenir le status précédent dans le workflow
 * TODO:
 * - Créer un objet avec les transitions: in-progress→todo, testing→in-progress, done→testing
 * - Retourner le status précédent selon le status actuel
 */
function getPrevStatus(current) {
  const transitions = {
    "in-progress" : "todo",
    "testing" : "in-progress",
    "done" : "testing"
  }
  return transitions[current]
}

/**
 * Fonction pour déplacer une carte d'une colonne à une autre
 * TODO
 * - Trouver la story dans 'boardStories' avec l'id donné
 * - Modifier son status avec newStatus
 * - Appeler renderBoard() pour actualiser l'affichage
 */
function moveCard(id, newStatus) {
 const story = boardStories.find(function (element) {
    return element.id === id;
 })
  story.status = newStatus;
  renderBoard();
}
/**
 * Fonction pour supprimer une carte du board
 * TODO:
 * - Filtrer 'boardStories' pour retirer la story avec l'id donné
 * - Appeler renderBoard() pour actualiser l'affichage
 */
function deleteCard(id) {
  const newStories = boardStories.filter(function (element) {
     return element.id !== id;
  })
  boardStories = newStories;
  renderBoard();
}
 

renderSprintBacklog();
renderBoard();
