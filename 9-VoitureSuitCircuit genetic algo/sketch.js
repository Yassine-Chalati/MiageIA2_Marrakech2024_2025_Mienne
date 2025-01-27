

const TOTAL = 100;
const MUTATION_RATE = 0.1;
const LIFESPAN = 25;
const SIGHT = 50;

let generationCount = 0;
let savedBrain = null;
let resetBrain = null;
let loadBrain = false;
let generationNumber = 0;
let savedBrains = [];

// Murs du circuit
let walls = [];
// rayon courant qui part de la voiture
let ray;

// Les voitures
let population = [];
let savedParticles = [];

let start, end;
let angleVision;

let speedSlider;
let angleVisionSlider;
let haddenLayersNumberSlider;
let NeuralNetworkNumberSlider;

let inside = [];
let outside = [];
let checkpoints = [];
const maxFitness = 500;
let changeMap = false;

/* construit un nouveau circuit */
function buildTrack() {
  checkpoints = [];
  inside = [];
  outside = [];

  let noiseMax = 4;
  const total = 60;
  const pathWidth = 60;
  let startX = random(1000);
  let startY = random(1000);
  for (let i = 0; i < total; i++) {
    let a = map(i, 0, total, 0, TWO_PI);
    let xoff = map(cos(a), -1, 1, 0, noiseMax) + startX;
    let yoff = map(sin(a), -1, 1, 0, noiseMax) + startY;
    let xr = map(noise(xoff, yoff), 0, 1, 100, width * 0.5);
    let yr = map(noise(xoff, yoff), 0, 1, 100, height * 0.5);
    let x1 = width / 2 + (xr - pathWidth) * cos(a);
    let y1 = height / 2 + (yr - pathWidth) * sin(a);
    let x2 = width / 2 + (xr + pathWidth) * cos(a);
    let y2 = height / 2 + (yr + pathWidth) * sin(a);
    checkpoints.push(new Boundary(x1, y1, x2, y2));
    inside.push(createVector(x1, y1));
    outside.push(createVector(x2, y2));
  }
  walls = [];
  for (let i = 0; i < checkpoints.length; i++) {
    let a1 = inside[i];
    let b1 = inside[(i + 1) % checkpoints.length];
    walls.push(new Boundary(a1.x, a1.y, b1.x, b1.y));
    let a2 = outside[i];
    let b2 = outside[(i + 1) % checkpoints.length];
    walls.push(new Boundary(a2.x, a2.y, b2.x, b2.y));
  }

  start = checkpoints[0].midpoint();
  end = checkpoints[checkpoints.length - 1].midpoint();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // tensor flow will worj on the cpu
  tf.setBackend('cpu');

  buildTrack();
  // let a = inside[inside.length - 1];
  // let b = outside[outside.length - 1];
  // walls.push(new Boundary(a.x, a.y, b.x, b.y));

  // On crée les véhicules....
  

  speedSlider = creerSpeedSlider(20, 60, "speed", 1, 10, 1, 1);
  angleVisionSlider = creerSlider(20, 100, "vision angle", 1, 180, 45, 1);
  NeuralNetworkNumberSlider = creerSliderNN(20, 140, "Neural Network number", 1, 200, 20, 1, "nn");
  haddenLayersNumberSlider = creerSliderNN(20, 180, "hadden layers number", 1, 200, 3, 1, "hl");

  for (let i = 0; i < TOTAL; i++) {
    population[i] = new Particle(null, angleVisionSlider.value(), NeuralNetworkNumberSlider.value(), haddenLayersNumberSlider.value());
  }
  resetBrain = new Brain(population[0].brain.copy(), population[0].angleVisions, population[0].nn, population[0].hl);
  creerButtonResetModel(20, 260, "reset model");

  creerButtonSaveModel(20, 220, "save model");
}

function draw() {
  const cycles = speedSlider.value();

  background(0);

  // Par défaut le meilleur candidat est le premier de la population
  let bestP = population[0];

  // Nombre de cyles par frame ("époques par frame")
  for (let n = 0; n < cycles; n++) {
    if(loadBrain === true) {

      if(NeuralNetworkNumberSlider.value() != savedBrain.nn) {
          NeuralNetworkNumberSlider.value(savedBrain.nn);
          NeuralNetworkNumberSlider.elt.dispatchEvent(new Event('input'));
        }

        if(haddenLayersNumberSlider.value() != savedBrain.hl) {
          haddenLayersNumberSlider.value(savedBrain.hl);
          haddenLayersNumberSlider.elt.dispatchEvent(new Event('input'));
        }

        if(angleVisionSlider.value() != savedBrain.visionAngle) {
          angleVisionSlider.value(savedBrain.visionAngle);
          angleVisionSlider.elt.dispatchEvent(new Event('input'));
        }

      for (let particle of population) {
        // particle.brain = savedBrain.model.copy();
        // particle.angleVision(savedBrain.visionAngle);
        // particle.nn = savedBrain.nn;
        // particle.hl = savedBrain.hl;

        // if(NeuralNetworkNumberSlider.value() != savedBrain.nn) {
        //   NeuralNetworkNumberSlider.value(savedBrain.nn);
        //   // NeuralNetworkNumberSlider.elt.dispatchEvent(new Event('input'));
        // }

        // if(haddenLayersNumberSlider.value() != savedBrain.hl) {
        //   haddenLayersNumberSlider.value(savedBrain.hl);
        //   // haddenLayersNumberSlider.elt.dispatchEvent(new Event('input'));
        // }

        // if(angleVisionSlider.value() != savedBrain.visionAngle) {
        //   angleVisionSlider.value(savedBrain.visionAngle);
        //   // angleVisionSlider.elt.dispatchEvent(new Event('input'));
        // }

        particle = new Particle(savedBrain.model.copy(), savedBrain.visionAngle, savedBrain.nn, savedBrain.hl);
      }
      loadBrain = false;

    }

    // Pour chaque voiture
    for (let particle of population) {
      // if(loadBrain === true) {
      //   // particle.brain = savedBrain.model.copy();
      //   // particle.angleVision(savedBrain.visionAngle);
      //   // particle.nn = savedBrain.nn;
      //   // particle.hl = savedBrain.hl;

      //   // if(NeuralNetworkNumberSlider.value() != savedBrain.nn) {
      //   //   NeuralNetworkNumberSlider.value(savedBrain.nn);
      //   //   // NeuralNetworkNumberSlider.elt.dispatchEvent(new Event('input'));
      //   // }

      //   // if(haddenLayersNumberSlider.value() != savedBrain.hl) {
      //   //   haddenLayersNumberSlider.value(savedBrain.hl);
      //   //   // haddenLayersNumberSlider.elt.dispatchEvent(new Event('input'));
      //   // }

      //   // if(angleVisionSlider.value() != savedBrain.visionAngle) {
      //   //   angleVisionSlider.value(savedBrain.visionAngle);
      //   //   //angleVisionSlider.elt.dispatchEvent(new Event('input'));
      //   // }

      //   particle = new Particle(savedBrain.model.copy(), savedBrain.visionAngle, savedBrain.nn, savedBrain.hl);

      if(particle.nn != NeuralNetworkNumberSlider.value()
      || particle.hl != haddenLayersNumberSlider.value()
      || particle.angleVisions != angleVisionSlider.value()) {
        particle.nn = NeuralNetworkNumberSlider.value();
        particle.hl = haddenLayersNumberSlider.value();
        particle.angleVision(angleVisionSlider.value());
      }

      //   loadBrain = false;
      // }
      // On applique le comportement
      particle.look(walls);
      // on regarde si on a passé un checkpoint
      particle.check(checkpoints);
      // on vérifie qu'on est pas sorti du circuit
      particle.bounds();

      // classique.... on met à jour accelerations, vitesses et positions
      particle.update();
      // et on dessine
      particle.show();

      // Une fois les voitures déplacées
      // On récupère la meilleure, celle qui a passé le plus de checkpoints
      if (particle.fitness > bestP.fitness) {
        bestP = particle;
      }
    }

    // On supprime les voitures mortes ou celles qui ont fini le circuit
    for (let i = population.length - 1; i >= 0; i--) {
      const particle = population[i];
      if (particle.dead || particle.finished) {
        savedParticles.push(population.splice(i, 1)[0]);
      }

      // On regarde si on a atteint la fin du circuit, si oui
      // on regenere le circuit
      if (!changeMap && particle.fitness > maxFitness) {
        changeMap = true;
      }
    }

    // Si on a fini le circuit, avec au moins un véhicule
    // on passe à la génération suivante, et on garde la génération actuelle comme point de départ
    if (population.length !== 0 && changeMap) {
      for (let i = population.length - 1; i >= 0; i--) {
        savedParticles.push(population.splice(i, 1)[0]);
      }

      // On reconstruit le circuit
      buildTrack();
      // On complète la génération avec des voitures issues de la génération précédente
      // en appliquant des mutations
      nextGeneration();
      generationCount++;
      changeMap = false;
    }

    // Si jamais on a plus de voitures, on passe à la génération suivante
    // MB: ça me semble inutile, car on a déjà un test pour passer à la génération suivante
    if (population.length == 0) {
      buildTrack();
      nextGeneration();
      generationCount++;
    }
  }

  for (let cp of checkpoints) {
    //strokeWeight(2);
    //cp.show();
  }
  // on dessine les murs
  for (let wall of walls) {
    wall.show();
  }

  // On dessine les voitures
  for (let particle of population) {
    particle.show();
  }

  // On met la voiture la meilleure en surbrillance
  bestP.highlight();

  // on affiche le numéro de la génération
  fill(255);
  textSize(24);
  noStroke();
  text('generation ' + generationCount, 10, 50);

  // ellipse(start.x, start.y, 10);
  // ellipse(end.x, end.y, 10);
}

function creerSlider(x, y, textLabel, min, max, value, step, propriete) {
  // On cree un slider pour changer la vitesse max des vehicules
  // on ajoute un label pour le slider
  let label = createP(textLabel + " : ");
  // couleur blanche
  label.style('color', 'white');
  // on le positionne avant le slider
  let labelX = x;
  let labelY = y;
  label.position(labelX, labelY);
  let slider = createSlider(min, max, value, step);
  slider.position(labelX + 190, labelY + 18);
  // On affiche la valeur du slider à droite du slider
  let sliderValue = createP(slider.value());
  // couleur blanche
  sliderValue.style('color', 'white');
  sliderValue.position(labelX + 340, labelY+2);
  // on ajoute un écouteur sur le slider
  slider.input(() => {
    generationCount = 0; 
    // on met à jour la valeur du label
    sliderValue.html(slider.value());
    // on met à jour la vitesse max des véhicules
  });

  return slider;
}

function creerSliderNN(x, y, textLabel, min, max, value, step, propriete) {
  // On cree un slider pour changer la vitesse max des vehicules
  // on ajoute un label pour le slider
  let label = createP(textLabel + " : ");
  // couleur blanche
  label.style('color', 'white');
  // on le positionne avant le slider
  let labelX = x;
  let labelY = y;
  label.position(labelX, labelY);
  let slider = createSlider(min, max, value, step);
  slider.position(labelX + 190, labelY + 18);
  // On affiche la valeur du slider à droite du slider
  let sliderValue = createP(slider.value());
  // couleur blanche
  sliderValue.style('color', 'white');
  sliderValue.position(labelX + 340, labelY+2);
  // on ajoute un écouteur sur le slider
  slider.input(() => {
    // on met à jour la valeur du label
    sliderValue.html(slider.value());
    // on met à jour la vitesse max des véhicules
  });

  return slider;
}

function creerSpeedSlider(x, y, textLabel, min, max, value, step) {
  // On cree un slider pour changer la vitesse max des vehicules
  // on ajoute un label pour le slider
  let label = createP(textLabel + " : ");
  // couleur blanche
  label.style('color', 'white');
  // on le positionne avant le slider
  let labelX = x;
  let labelY = y;
  label.position(labelX, labelY);
  let slider = createSlider(min, max, value, step);
  slider.position(labelX + 190, labelY + 18);
  // On affiche la valeur du slider à droite du slider
  let sliderValue = createP(slider.value());
  // couleur blanche
  sliderValue.style('color', 'white');
  sliderValue.position(labelX + 340, labelY+2);
  // on ajoute un écouteur sur le slider
  return slider;
}

function creerButtonSaveModel(x, y, textLabel) {
  savedBrain = population[0].brain.copy();
  let button = createButton(textLabel);
  button.position(x, y);

  button.mousePressed(saveBrain);
}

let xb = 20, yb = 300;

function saveBrain() {
  savedBrain = new Brain(population[0].brain.copy(), population[0].angleVisions, population[0].nn, population[0].hl, generationCount);
  console.log("angle vision: " + savedBrain.visionAngle);
  console.log("model: " + savedBrain.model);
  console.log("number neural network of hidden layers: " + savedBrain.nn);
  console.log("number of hadden layers: " + savedBrain.hl);
  savedBrains.push(savedBrain);
  creerButtonLoadModel(xb, yb, "load model " + savedBrains.length, savedBrains.length - 1);
  yb += 40;
}


function loaddModel() {

  loadBrain = true;
}

function creerButtonLoadModel(x, y, textLabel, index) {
  let button2 = createButton(textLabel);
  button2.position(x, y);

  button2.mousePressed(() => {
    loadBrain = true;
    savedBrain = savedBrains[index];
    generationCount = savedBrain.generationNumber;
  });
}

function creerButtonResetModel(x, y, textLabel, index) {
  let button2 = createButton(textLabel);
  button2.position(x, y);

  button2.mousePressed(() => {
    generationCount = 0;
    loadBrain = true;
    savedBrain = resetBrain;
  });
}



