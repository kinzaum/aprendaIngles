const output = document.getElementById('output');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const readBtn = document.getElementById('read-btn');
const nextBtn = document.getElementById('next-btn');
const targetSentence = document.getElementById('target-sentence');

let currentTextIndex = 0;
let currentWordIndex = 0;
let words = [];
let wordElements = [];
let practiceData = [];

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

function loadText(index) {
    targetSentence.innerText = practiceData[index].content;
    words = targetSentence.innerText.split(' ');
    targetSentence.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
    wordElements = document.querySelectorAll('.word');

    currentWordIndex = 0;
    wordElements[0].classList.add('current');
    nextBtn.style.display = 'none';
    output.innerText = "Click READY TO READ and read ...";
}

startBtn.addEventListener('click', () => {
    recognition.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
    recognition.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
});

readBtn.addEventListener('click', () => {
    // Get the full text from the current sentence index
    const fullSentence = practiceData[currentTextIndex].content;
    
    if (fullSentence) {
        // Stop any currently playing audio so it doesn't overlap
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(fullSentence);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    }
});

nextBtn.addEventListener('click', () => {
    currentTextIndex++;
    if (currentTextIndex < practiceData.length) {
        loadText(currentTextIndex);
    } else {
        currentTextIndex = 0;
        loadText(currentTextIndex);
    }
});

recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
        } else {
            interimTranscript += event.results[i][0].transcript;
        }
    }

    output.innerText = "Eu ouvi: " + (finalTranscript + interimTranscript);

    const spokenText = (finalTranscript + interimTranscript).trim().toLowerCase();
    const spokenWords = spokenText.split(/\s+/);
    const lastSpoken = spokenWords[spokenWords.length - 1];
    const target = words[currentWordIndex].toLowerCase().replace(/[.,!?]/g, '');

    if (lastSpoken === target) {
        wordElements[currentWordIndex].classList.remove('current', 'wrong');
        wordElements[currentWordIndex].classList.add('correct');
        currentWordIndex++;
        if (currentWordIndex < wordElements.length) {
            wordElements[currentWordIndex].classList.add('current');
        } else {
            output.innerText = "Completed!";
            nextBtn.style.display = 'inline-block';
            stopBtn.click();
        }
    } else if (event.results[event.results.length - 1].isFinal) {
        wordElements[currentWordIndex].classList.add('wrong');
    }
};

recognition.onerror = (event) => {
    console.error("Speech error", event.error);
    startBtn.disabled = false;
    stopBtn.disabled = true;
};

// Data definition
practiceData.push(
    { content: "How do I get to the nearest train station?" },
    { content: "Could you please repeat that more slowly?" },
    { content: "I am looking for a job in marketing." },
    { content: "What time does the movie start tonight?" },
    { content: "It is important to drink plenty of water every day." },
    { content: "Learning a new language takes time and patience." },
    { content: "I usually wake up at seven o'clock in the morning." },
    { content: "She enjoys reading books in her free time." },
    { content: "We are planning to visit Japan next summer." },
    { content: "Please turn off the lights when you leave the room." },
    { content: "The weather is very pleasant today, isn't it?" },
    { content: "I have been living in this city for five years." },
    { content: "Could you help me carry these heavy bags?" },
    { content: "He is interested in learning how to play the guitar." },
    { content: "There are many beautiful parks in this neighborhood." },
    { content: "What is your favorite type of food to cook?" },
    { content: "I prefer drinking coffee rather than tea." },
    { content: "The library is closed on Sundays." },
    { content: "It rained heavily throughout the entire night." },
    { content: "You should see a doctor if you feel unwell." },
    { content: "They went to the beach to watch the sunset." },
    { content: "Success comes to those who work hard consistently." },
    { content: "I forgot to bring my umbrella today." },
    { content: "Technology has changed the way we communicate." },
    { content: "Could you pass me the salt, please?" },
    { content: "She decided to study abroad to improve her skills." },
    { content: "Finding a balance between work and life is essential." },
    { content: "I am really looking forward to the weekend." },
    { content: "Have you ever traveled to another country?" },
    { content: "He speaks English and Spanish fluently." },
    { content: "Let's meet at the coffee shop around noon." },
    { content: "Education is the key to a brighter future." },
    { content: "The train was delayed due to bad weather." },
    { content: "Make sure to double-check your work before submitting it." },
    { content: "I need to buy some groceries for dinner." },
    { content: "What are your plans for the upcoming holiday?" },
    { content: "Exercise helps to reduce stress and improve health." },
    { content: "He works as a software engineer at a large company." },
    { content: "Please keep your voice down in the library." },
    { content: "I would like to reserve a table for two." },
    { content: "Can you recommend a good place to have lunch?" },
    { content: "The internet is a vast source of information." },
    { content: "She is very good at solving complex problems." },
    { content: "I'll be there in about ten minutes." },
    { content: "Try to stay positive even when things are difficult." },
    { content: "What kind of music do you like to listen to?" },
    { content: "The meeting has been rescheduled for tomorrow." },
    { content: "I hope you have a wonderful day." },
    { content: "Reading news articles helps expand your vocabulary." },
    { content: "Always strive to do your best in everything." }
);

// Initial load
loadText(currentTextIndex);
