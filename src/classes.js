import { v4 as uuidv4 } from "uuid";

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
	constructor(title, content) {
		this.id = uuidv4();
		this.tag = undefined;
		this.title = title;
		this.content = content;
		this.lastUpdate = "Never";
		this.words =
			this.content.trim() === ""
				? 0
				: this.content.trim().split(" ").length;
	}

	/**
	 * Sets tag of note manually since it's impossible to set from the class constructor
	 */
	setTag(categoryName) {
		this.tag = categoryName;
	}

	setLastUpdate(lastUpdate) {
		this.lastupdate = lastUpdate;
	}
}
