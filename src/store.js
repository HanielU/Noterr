import { writable } from "svelte/store";
import { defaultCat, localStorageStore } from "./utils";

export const username = localStorageStore("username", {
	value: null,
	editing: false,
}); //change to "null" when done with development

export const activeCategory = localStorageStore("activeCategory", {
	name: defaultCat.name,
	id: defaultCat.id,
});
export const categories = localStorageStore("categories", [defaultCat]);

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
