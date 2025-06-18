const button = document.querySelector('button');
const jokeParagraph = document.querySelector('#generated-joke');


const addNewJoke = async () => {
    try {
        jokeParagraph.classList.add('fade-out');
        await new Promise(resolve => setTimeout(resolve, 500));
        const jokeText = await getJoke();
        jokeParagraph.textContent = jokeText;
        jokeParagraph.classList.remove('fade-out');
    } catch (e) {
        jokeParagraph.textContent = 'Oops! Something went wrong.';
        jokeParagraph.classList.remove('fade-out');
        console.error('Error:', e.message);
    }
};

const getJoke = async () => {
    try {
        const res = await axios.get('https://v2.jokeapi.dev/joke/Programming');
        if (res.data.type === "single") {
            return res.data.joke;
        } else if (res.data.type === "twopart") {
            return `${res.data.setup} 🤔\n${res.data.delivery}`;
        } else {
            return "Failed to get the joke 😢";
        }
    }
    catch (e) {
        console.error('Error:', e.message);
    }
}

button.addEventListener('click', addNewJoke);
