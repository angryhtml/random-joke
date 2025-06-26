var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
const button = document.querySelector('button');
const jokeParagraph = document.querySelector('#generated-joke');
const shareButton = document.querySelector('#share-button');
const addNewJoke = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        jokeParagraph.classList.add('fade-out');
        yield new Promise(resolve => setTimeout(resolve, 500));
        const jokeText = yield getJoke();
        jokeParagraph.textContent = jokeText;
        jokeParagraph.classList.remove('fade-out');
        if (jokeText) {
            shareButton.style.display = 'inline-block';
        }
    }
    catch (e) {
        jokeParagraph.textContent = 'Oops! Something went wrong.';
        jokeParagraph.classList.remove('fade-out');
        shareButton.style.display = 'none';
        if (e instanceof Error) {
            console.error('Error:', e.message);
        }
        else {
            console.error('Unknown error:', e);
        }
    }
});
const getJoke = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios.get('https://v2.jokeapi.dev/joke/Programming');
        if (res.data.type === "single") {
            return res.data.joke;
        }
        else if (res.data.type === "twopart") {
            return `${res.data.setup} 🤔\n${res.data.delivery}`;
        }
        else {
            return "Failed to get the joke 😢";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            console.error('Error:', e.message);
        }
        else {
            console.error('Unknown error:', e);
        }
        return "Oops! Something went wrong 😢";
    }
});
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast)
        return;
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
