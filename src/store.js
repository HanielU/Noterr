import { writable } from "svelte/store";
import { loremIpsum as lorem } from "lorem-ipsum";
import { Note, Category } from "./classes";

export const username = writable(localStorage.getItem("username"));

/**
 * Represents the active category
 * Needs to be a writable store for reactivity to take place
 */
export const activeCategory = writable(
	localStorage.getItem("activeCategory") || "General"
);

let defaultNote = new Note("General Default", lorem({ count: 4 }));
defaultNote.setTag("General");
let defaultCat = new Category("General", false, [defaultNote], defaultNote.id);

/**
 * Represents the entirity of the data handled in this application
 */
export const categories = writable(
	JSON.parse(localStorage.getItem("categories")) || [defaultCat]
);

export const expanded = writable({
	partExpansion: false,
	fullExpansion: false,
});
