const storyNodes = [
    {
        id: 1,
        text: "You stand at the edge of a dense, fog-covered forest. The path splits in two. A cold wind blows from the North.",
        options: [
            { text: "Take the left path into the shadows", nextId: 2 },
            { text: "Take the right path towards the faint light", nextId: 3 }
        ],
        image: "images/scene1.jpg"
    },
    {
        id: 2,
        text: "The trees are thick here. You hear a rustling in the bushes. Suddenly, you spot a glint of metal on the ground.",
        options: [
            { text: "Pick up the Silver Dagger", getItem: "Silver Dagger", nextId: 8 },
            { text: "Ignore it and move deeper", nextId: 5 }
        ],
        image: "images/scene2.jpg"
    },
    {
        id: 3,
        text: "The light leads you to an old abandoned cabin. The door is slightly ajar. You feel eyes watching you from the trees.",
        options: [
            { text: "Enter the cabin", nextId: 6 },
            { text: "Walk around the back", nextId: 7 }
        ],
        image: "images/scene3.jpg"
    },
    {
        id: 4,
        text: "A wild wolf jumps out! You are unprepared and have to flee back to the start. (Bad Ending)",
        options: [
            { text: "Restart", nextId: 1 }
        ],
        image: "images/scene4.jpg"
    },
    {
        id: 5,
        text: "The darkness swallows you. Without a weapon or light, you stumble into a deep ravine. (Ending: Lost Forever)",
        options: [{ text: "Restart", nextId: 1 }],
        image: "images/scene5.jpg"
    },
    {
        id: 6,
        text: "Inside the cabin, you find a chest of gold and a map home. You have survived! (Good Ending)",
        options: [
            { text: "Play Again", nextId: 1 }
        ],
        image: "images/scene6.jpg"
    },
    {
        id: 7,
        text: "Behind the cabin, you find a hidden cellar door covered in vines. It looks locked from the inside.",
        options: [
            { text: "Bang on the door", nextId: 9 },
            { text: "Go back to the front", nextId: 3 }
        ],
        image: "images/scene7.jpg"
    },
    {
        id: 8,
        text: "With the Silver Dagger in hand, you feel braver. A massive wolf blocks your path, growling fiercely.",
        options: [
            { text: "Fight the wolf with the Dagger", requiredItem: "Silver Dagger", nextId: 10 },
            { text: "Try to climb a tree", nextId: 5 }
        ],
        image: "images/scene8.jpg"
    },
    {
        id: 9,
        text: "The cellar door opens! A hermit lives here. He offers you a warm soup and a safe path out of the forest. (Secret Ending: The Hermit's Friend)",
        options: [{ text: "Play Again", nextId: 1 }],
        image: "images/scene9.jpg"
    },
    {
        id: 10,
        text: "You successfully defend yourself! The wolf retreats. Behind it, you find a hidden path leading to a beautiful meadow. (True Ending: Hero of the Woods)",
        options: [{ text: "Play Again", nextId: 1 }],
        image: "images/scene10.jpg"
    }
];

let currentState = {
    inventory: [] 
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    checkSaveData();
});

// Navigation Logic [cite: 28]
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.classList.remove('active-section');
        section.classList.add('hidden-section');
    });

    // Show target section
    const target = document.getElementById(sectionId);
    target.classList.remove('hidden-section');
    target.classList.add('active-section');
}

function playBackgroundMusic() {
    const music = document.getElementById('bg-music');
    if (music) {
        music.volume = 0.5; // Set volume to 50% so it's not too loud
        music.play().catch(error => {
            console.log("Autoplay prevented. Music will start after the first click.");
        });
    }
}

// Game Logic [cite: 60]
function startGame() {
    playBackgroundMusic(); // <--- Add this line
    localStorage.removeItem('mysteryPathSave');
    showStoryNode(1);
    showSection('game');
}

function loadGame() {
    playBackgroundMusic(); // <--- Add this line
    const saveData = localStorage.getItem('mysteryPathSave');
    if (saveData) {
        const { currentNodeId } = JSON.parse(saveData);
        showStoryNode(currentNodeId);
        showSection('game');
    }
}

let typingTimer = null;

function showStoryNode(nodeId) {
    const node = storyNodes.find(n => n.id === nodeId);
    const typeSound = document.getElementById('typing-sound');

    // Clear the previous timer immediately when a new node starts
    if (typingTimer) {
        clearTimeout(typingTimer);
    }
    if (typeSound) {
        typeSound.pause();
        typeSound.currentTime = 0;
    }
    
    if (node.image) {
        document.body.style.backgroundImage = `url('${node.image}')`;
    }

    const storyText = document.getElementById('story-text');
    const choicesContainer = document.getElementById('choices-container');

    // Use the updated typewriter function
    typeWriterEffect(node.text, 'story-text');

    choicesContainer.innerHTML = '';
    node.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.classList.add('choice-btn');
        button.onclick = () => { 
            playClick();           
            selectOption(option);  
        };
        choicesContainer.appendChild(button);
    });

    saveProgress(nodeId);
}

const typeAudioPool = [];
for (let k = 0; k < 5; k++) {
    // Make sure the filename matches exactly what is in your folder
    typeAudioPool.push(new Audio('typing-click.mp3'));
}
let poolIndex = 0;

// --- REPLACE YOUR TYPEWRITEREFFECT WITH THIS ---
function typeWriterEffect(text, elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = ""; 
    let i = 0;
    const speed = 60;

    function type() {
        if (i < text.length) {
            // 1. Play sound from the pool
            const sound = typeAudioPool[poolIndex];
            sound.volume = 0.5; // Ensure it's audible
            sound.currentTime = 0;
            sound.play().catch(e => {
                // If this triggers, the browser is blocking autoplay
                console.log("Audio waiting for first user click...");
            });

            // 2. Cycle to the next sound in the pool
            poolIndex = (poolIndex + 1) % typeAudioPool.length;

            // 3. Add text
            element.innerHTML += text.charAt(i);
            i++;
            
            typingTimer = setTimeout(type, speed);
        }
    }
    type();
}

function playClick() {

    const audio = document.getElementById('click-sound');

    if(audio) audio.play();

}

    // Clear previous buttons
    choicesContainer.innerHTML = '';

    // Create new buttons dynamically 
node.options.forEach(option => {
    const button = document.createElement('button');
    button.innerText = option.text;
    button.classList.add('choice-btn');

    // --- CHANGE THIS PART ---
    button.onclick = () => { 
        playClick();           // 1. Play the sound first
        selectOption(option);  // 2. Then move to the next story node
    };
    // ------------------------

    choicesContainer.appendChild(button);
});
    

    // Save Progress 
    saveProgress(nodeId);



function selectOption(option) {
    // Check if choice requires an item
    if (option.requiredItem && !currentState.inventory.includes(option.requiredItem)) {
        alert(`You need the ${option.requiredItem} to do this!`);
        return;
    }

    // Add item to inventory if choice gives one
    if (option.getItem) {
        currentState.inventory.push(option.getItem);
        alert(`You picked up: ${option.getItem}`);
    }

    const nextNodeId = option.nextId;
    if (nextNodeId <= 0) return startGame();
    showStoryNode(nextNodeId);
}

// LocalStorage Persistence [cite: 24, 61]
function saveProgress(nodeId) {
    localStorage.setItem('mysteryPathSave', JSON.stringify({ currentNodeId: nodeId }));
    checkSaveData();
}

function loadGame() {
    // START THE MUSIC HERE
    playBackgroundMusic(); 

    const saveData = localStorage.getItem('mysteryPathSave');
    if (saveData) {
        const { currentNodeId } = JSON.parse(saveData);
        showStoryNode(currentNodeId);
        showSection('game');
    } else {
        alert("No saved game found!");
    }
}

function checkSaveData() {
    const saveBtn = document.getElementById('resume-btn');
    if (localStorage.getItem('mysteryPathSave')) {
        saveBtn.style.display = 'inline-block';
    } else {
        saveBtn.style.display = 'none';
    }
}



// Check on load
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}
function handleGameNav() {
    const saveData = localStorage.getItem('mysteryPathSave');
    
    if (saveData) {
        // If there is a save, resume where they left off
        const { currentNodeId } = JSON.parse(saveData);
        showStoryNode(currentNodeId);
    } else {
        // If no save exists, start from the beginning
        showStoryNode(1);
    }
    
    // Switch the visual section to the game screen
    showSection('game');
}