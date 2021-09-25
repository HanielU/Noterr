import { writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";
import { loremIpsum as lorem } from "lorem-ipsum";

export function debounce(fn, timeout = 200) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, timeout);
	};
}

export function debounce_v2(fn, delay) {
	let timer;
	return function () {
		const ctx = this; //context
		const args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(ctx, args);
		}, delay);
	};
}

const client = typeof window !== "undefined";

// Custom store to make life easier
export function localStorageStore(key, initial) {
	const { set: setStore, ...readableStore } = writable(initial, () => {
		if (!client) return;

		getAndSetFromLocalStorage();

		const updateFromStorageEvents = (event) => {
			if (event.key === key) getAndSetFromLocalStorage();
		};
		window.addEventListener("storage", updateFromStorageEvents);
		return () => window.removeEventListener("storage", updateFromStorageEvents);
	});

	// Set both the localStorage and this Svelte store
	const set = (value) => {
		setStore(value);
		localStorage.setItem(key, JSON.stringify(value));
	};

	// Synchronize the Svelte store and local storage
	const getAndSetFromLocalStorage = () => {
		const localValue = localStorage.getItem(key);

		if (localValue === null) set(initial);
		else {
			try {
				setStore(JSON.parse(localValue));
			} catch {
				set(initial);
			}
		}
	};

	return { ...readableStore, set };
}

export class Category {
	constructor(name, contenteditable, notes = [], activeNote) {
		this.id = uuidv4();
		this.name = name;
		this.contenteditable = contenteditable;
		this.notes = notes;
		this.activeNote = activeNote;
		this.notesCount = this.notes.length;
	}
}

export class Note {
	/**
	 * Blueprint for the note object
	 *
	 * @param {string} title - the title of the note
	 * @param {string} content - the content of the note
	 */
	constructor(title, content) {
		this.id = uuidv4();
		this.tag = undefined;
		this.title = title;
		this.content = content;
		this.lastUpdate = "Never";
		this.words =
			this.content.trim() === "" ? 0 : this.content.trim().split(" ").length;
	}
}

let defaultNote = new Note("General Default", lorem({ count: 4 }));
defaultNote.tag = "General";
export let defaultCat = new Category(
	"General",
	false,
	[defaultNote],
	defaultNote.id
);
