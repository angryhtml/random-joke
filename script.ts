declare const axios: any;
const button = document.querySelector('button') as HTMLButtonElement;
const jokeParagraph = document.querySelector('#generated-joke') as HTMLParagraphElement;
const shareButton = document.querySelector('#share-button') as HTMLButtonElement;


const addNewJoke = async () => {
    try {
        jokeParagraph.classList.add('fade-out');
        await new Promise(resolve => setTimeout(resolve, 500));
        const jokeText = await getJoke();
        jokeParagraph.textContent = jokeText;
        jokeParagraph.classList.remove('fade-out');

        if (jokeText) {
            shareButton.style.display = 'inline-block';
        }

    } catch (e) {
        jokeParagraph.textContent = 'Oops! Something went wrong.';
        jokeParagraph.classList.remove('fade-out');
        shareButton.style.display = 'none';
        if (e instanceof Error) {
            console.error('Error:', e.message);
        } else {
            console.error('Unknown error:', e);
        }
    }
};

const getJoke = async (): Promise<string> => {
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
        if (e instanceof Error) {
            console.error('Error:', e.message);
        } else {
            console.error('Unknown error:', e);
        }
        return "Oops! Something went wrong 😢";
    }
}

function showToast(message: string): void {
    const toast = document.getElementById('toast') as HTMLDivElement | null;
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

button.addEventListener('click', addNewJoke);

shareButton.addEventListener('click', () => {
    const jokeText = jokeParagraph.textContent;

    if (!jokeText) {
        showToast('Please generate a joke first!');
        return;
    }

    const jokeForUrl = jokeText.replace(/\n/g, '\\n');
    const encodedJoke = encodeURIComponent(jokeForUrl);
    const shareUrl = `${window.location.origin}${window.location.pathname}?joke=${encodedJoke}`;

    navigator.clipboard.writeText(shareUrl)
        .then(() => {
            showToast('Joke link copied to clipboard! 📋');
        })
        .catch(() => {
            showToast('Failed to copy the link 😢');
        });
});

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const jokeFromUrl = params.get('joke');

    if (jokeFromUrl) {
        const decodedJoke = decodeURIComponent(jokeFromUrl).replace(/\\n/g, '\n');
        jokeParagraph.textContent = decodedJoke;
        shareButton.style.display = 'inline-block';
    }
});
