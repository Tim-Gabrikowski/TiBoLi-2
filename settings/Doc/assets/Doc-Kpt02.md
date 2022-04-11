## Bücherverwaltung

### Inhalt:

1. [Beispielbuch](#beispielbuch)
2. [Alle Bücher bekommen](#alle-bücher-ausgeben)
3. [Ein Buch bekommen](#ein-buch-ausgeben)
4. [Ein neues Buch anlegen](#neues-buch-anlegen)
5. [Ein bestehendes Buch bearbeiten](#buch-bearbeiten)
6. [Ein Buch löschen](#ein-buch-löschen)
7. [Nach Büchern oder Autoren suchen](#ein-buch-suchen)

### Beispielbuch

Ein Buch besteht aus einer ID, einem Titel und einem Autor. Theoretisch hat jedes Buch noch eine Spalte, in der angegeben ist, das es gelöscht ist und wann es gelöscht wurde. Das ist, weil ich bei den Büchern nur einen Soft-Delete mache.
Ein Beispielbuch sieht so aus.

```json
{
	"id": 1, // ID des Buches (UQ, PK, AI)
	"title": "Artemis", //Titel
	"author": "Andy Weir", //Autor
	"deleted": 0, //1 = gelöscht
	"deletedDate": null // Datum
}
```

### Alle Bücher ausgeben

Alle ungelöschten Bücher kann man unter `/books` bekommen.
Wenn man einen `GET` request an `/books` macht, bekommt man ein Array mit allen ungelöschten Büchern zurrück.

Ein Beispiel:

`GET /books` liefert:

```json
[
	{
		"id": 1,
		"title": "Buch 1",
		"author": "Autor 1",
		"deleted": 0,
		"deletedDate": null
	},
	{
		"id": 2,
		"title": "Buch 2",
		"author": "Autor 2",
		"deleted": 0,
		"deletedDate": null
	}
]
```

### Ein Buch ausgeben

Wenn man jetzt nur ein bestimmtes Buch haben möchte, dann muss man einen `GET` request an `/books/[id]` nachen. `id` wird hier durch die ID des Buches ausgetauscht.

Beispiel:

`GET /books/1` liefert:

```json
[
	{
		"id": 1,
		"title": "Buch 1",
		"author": "Autor 1",
		"deleted": 0,
		"deletedDate": null
	}
]
```

`GET /books/2` liefert:

```json
[
	{
		"id": 2,
		"title": "Buch 2",
		"author": "Autor 2",
		"deleted": 0,
		"deletedDate": null
	}
]
```

### Neues Buch anlegen

Um ein neues Buch anzulegen muss man einen `PUT` request an `/books` machen. Er beinhaltet in seinem Body dann die Daten, also Titel und Autor, des Buches.

Beispiel:

`PUT /books` mit dem Body:

```json
{
	"title": "Buch 3",
	"author": "Autor 3"
}
```

gibt ein MySQL objekt zurrück. In diesem Objekt stehen die Angaben über die query. Wichtig könnte nur das Feld `insertId` sein, weil jenes die ID des neu angelegten Buches beinhaltet.
Beispiel:

```json
{
	"fieldCount": 0,
	"affectedRows": 1,
	"insertId": 3, // ID des neuen Buches
	"serverStatus": 2,
	"warningCount": 0,
	"message": "",
	"protocol41": true,
	"changedRows": 0
}
```

### Buch bearbeiten

Möchte man ein Buch bearbeiten, so muss man wie beim Anlegen neuer Bücher einen `PUT` request auf `/books` machen. Die BEsonderheit ist, dass in dem Body diesmal die ID des zu bearbeitenden Buches angegeben ist.

`PUT /books` mit dem Body

```json
{
	"id": 3,
	"title": "Buch 3 - Neuauflage",
	"author": "Autor 3"
}
```

ändert den Autor und den Titel des Buches mit der `id` zu den neuen werten.
Als Antwort kommt wieder ein MySQL objekt zurrück.

```json
{
	"fieldCount": 0,
	"affectedRows": 1,
	"insertId": 0,
	"serverStatus": 2,
	"warningCount": 0,
	"message": "(Rows matched: 1  Changed: 1  Warnings: 0",
	"protocol41": true,
	"changedRows": 1
}
```

### Ein Buch löschen

Manchmal ist es nötig, ein Buch zu löschen. Um dies zu tun müssen wir einen `DELETE` request auf `/books/[id]` machen. Der Parameter `id` ist hier die ID des Buches, das wir löschen wollen. Das System wird das Buch löschen und wieder ein MySQl Objekt antworten, das uns aber nicht weiter interessieren braucht.

Beispiel:
`DELETE /books/3` löscht das Buch mit der id 3 und antwortet:

```json
{
	"fieldCount": 0,
	"affectedRows": 1,
	"insertId": 0,
	"serverStatus": 2,
	"warningCount": 0,
	"message": "(Rows matched: 1  Changed: 0  Warnings: 0",
	"protocol41": true,
	"changedRows": 1
}
```

### Ein Buch suchen

Das System hat einen Endpunkt um nach Büchern zu suchen. Hierbei wird ein Buch endweder nach Titel oder nach Autor gesucht. Zur Suche wird die sog. [Levenshtein-Distanz](https://de.wikipedia.org/wiki/Levenshtein-Distanz) genutzt um nach Büchern mit ähnlichen Titeln / Autoren zu suchen, um Tippfehler in der Suche zu umgehen.
Um eine Suche nach Titeln zu unternehmen machen wir einen `GET` request an `/books/search/title/[searchterm]` wobei `searcherm` der Suchausdruck ist.

Beispiel:
`GET /books/search/title/Buch%201` liefert alle Bücher mit einen ähnlichen Title wie `Buch 1` Das `%20` repräsentiert ein Leerzeichen in URLs.
Als antwort erhalten wir zum Beispiel:

```json
[
	{
		"id": 165,
		"title": "Buch 1664",
		"author": "Autor 1",
		"deleted": 0,
		"deletedDate": null
	},
	{
		"id": 152,
		"title": "Buch 193411",
		"author": "Autor 11",
		"deleted": 0,
		"deletedDate": null
	}
]
```

Um eine Suche nach Autoren zu unternehmen machen wir einen `GET` request an `/books/search/author/[searchterm]` wobei `searcherm` wieder der Suchausdruck ist.

Beispiel:
`GET /books/search/author/Autor%202` liefert alle Bücher mit einen ähnlichen Autor wie `Autor 2` Das `%20` repräsentiert ein Leerzeichen in URLs.
Als antwort erhalten wir zum Beispiel:

```json
[
	{
		"id": 2,
		"title": "Buch 20221",
		"author": "Autor 2",
		"deleted": 0,
		"deletedDate": null
	},
	{
		"id": 15,
		"title": "Buch 11212",
		"author": "Autor 12",
		"deleted": 0,
		"deletedDate": null
	},
	{
		"id": 19,
		"title": "Buch 1366",
		"author": "Autor 20",
		"deleted": 0,
		"deletedDate": null
	}
]
```
