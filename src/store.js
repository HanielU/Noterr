import { writable } from "svelte/store";
import { loremIpsum as lorem } from "lorem-ipsum";
import { Note, Category, localStorageStore } from "./utils";

export const username = localStorageStore("username", null);
export const activeCategory = localStorageStore("activeCategory", "General");

let defaultNote = new Note("General Default", lorem({ count: 4 }));
defaultNote.setTag("General");
let defaultCat = new Category("General", false, [defaultNote], defaultNote.id);

export const categories = localStorageStore("categories", [defaultCat]);

export const expanded = writable({
	partExpansion: false,
	fullExpansion: false,
});
