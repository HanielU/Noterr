import { writable } from "svelte/store";
import { loremIpsum as lorem } from "lorem-ipsum";
import { Note, Category, localStorageStore } from "./utils";

let defaultNote = new Note("General Default", lorem({ count: 4 }));
defaultNote.tag = "General";
let defaultCat = new Category("General", false, [defaultNote], defaultNote.id);

export const username = localStorageStore("username", null); //change to "null" when done with development

export const activeCategory = localStorageStore("activeCategory", {
	name: defaultCat.name,
	id: defaultCat.id,
});
export const categories = localStorageStore("categories", [defaultCat]);

export const menuVisible = writable(false);

export const currentAction = writable({
	requesting: {
		value: null,
		bool: null,
	},
	done: {
		value: null,
		bool: null,
	},
});

export const expanded = writable({
	partExpansion: false,
	fullExpansion: false,
});
