## Exemplarverwaltung

Weil es natürlich vorkommen kann, dass von einem Buch mehrere Exemplare in der Bibliothek vorhanden sind und um es übersichtlicher zu organisieren, wird nicht für jedes physische Buch in der Bibliothek ein Buch im System angelegt, sondern es werden mehrere Exemplare zu dem gespeicherten Buch hinzugefügt. Um diese Exemplare zu verwalten gibt es einen weiteren "Arm" in der API.

### Inhalt:

1. [Beispielexemplar](#ein-beispielexemplar)
2. [Alle Exemplare ausgeben](#alle-exemplare-ausgeben)
3. [Ein Exemplar ausgeben](#ein-exemplar-ausgeben)
4. [Neue Exemplare anlegen](#exemplare-anlegen)
5. [Status eines Exemplares ändern](#den-status-des-exemplares-ändern)

### Ein Beispielexemplar

Ein Exemplar, wie es gespeichert wird, besteht aus einer `ExemplarId`, einer `mNumber (Mediennummer)`, der `bookId`, die zu dem Buch zeigt, zu dem das Exemplar gehört und der `lifecycle` Variable.

```json
{
	"copyId": 1, // PK, AI, UQ
	"mNumber": 123456789, // Mediennummer
	"bookId": 1, // FK -> 'books'.'id'
	"lifecycle": 5 // lifecycle Variable
}
```

Die Lifecycle variable giebt an, was mit dem Exemplar ist, quasi eine Statusanzeige. Folgende Werte werden aktuell genutzt.

| lifecycle |                        Erklärung                         |
| :-------: | :------------------------------------------------------: |
|     1     | Das Exemplar ist okay. Es ist im Regal, oder ausgeliehen |
|     5     |       Das Exemplar wurde aus dem Bestand entfernt        |

### Alle Exemplare ausgeben

Um alle Exemplare auszugeben müssen wir einen `GET` request an `/copies` machen. Als Antwort kommt ein Array mit allen Exemplaren zurrück.

Beispiel:

`GET /copies` liefert:

```json
[
	{
		"copyId": 1,
		"mNumber": 123456789,
		"bookId": 1,
		"lifecycle": 1
	},
	{
		"copyId": 2,
		"mNumber": 111111112,
		"bookId": 2,
		"lifecycle": 1
	},
	{
		"copyId": 3,
		"mNumber": 111111113,
		"bookId": 6,
		"lifecycle": 5
	},
	{
		"copyId": 4,
		"mNumber": 111111114,
		"bookId": 18,
		"lifecycle": 1
	}
]
```

### Ein Exemplar ausgeben

Um nach nur einem Exemplar zu suchen, muss man einen `GET` request an `/copies/[mNumber]` machen. `mNumber` ist die Mediennummer des Exemplars.

`GET /copies/111111112` liefert als Antwort das Buch mit der Mediennummer `111111112` als Array.

```json
{
	"mNumber": 111111112,
	"bookId": 2,
	"lifecycle": 5,
	"_LINK": {
		"book": {
			"id": 2,
			"title": "Titel 2",
			"author": "Autor 2"
		}
	}
}
```

Einem fällt gleich auf, dass dies kein reguläres Exemplar ist, das als Antwort kommt. Das liegt daran, dass das System nett ist und einem für ein Exemplar auch gleich das passende Buch raussicht. Unter dem Objekt `_LINK` gibt es das Objekt `book`, welches das Buch ist, zu dem das Exemplar gehört.

### Exemplare anlegen

Um eins oder mehrere Exemplare anzulegen muss man ein `POST` request auf `/copies` machen. In dem Body der Anfrage steht dann die BuchId (`bookId`), zu der ein Exemplar hinzugefügt werden soll und die Anzahl (`amount`), wie viele Exemplare.

Beispiel:

`POST /copies` mit dem Body

```json
{
	"bookId": 2,
	"amount": 2
}
```

legt zwei neue Exemplare zu dem Buch mit der ID 2 an. Diese Exemplare werden dann als Array geantwortet.

```json
[
	{
		"mNumber": 111111229,
		"bookId": 2,
		"lifecycle": 1
	},
	{
		"mNumber": 111111230,
		"bookId": 2,
		"lifecycle": 1
	}
]
```

### Den Status des Exemplares ändern

Wenn man ein Exemplar zum Beispiel aus dem System nimmt, dann müss man die `lifecycle` Variable des Exemplares verändern. Dies macht man mit einem `PUT` request auf `/copies`. In dem Body sendet man sowohl die `mNumber` als auch den neuen `lifecycle` des Exemplares mit.

Beispiel:

`PUT /copies` mit dem Body:

```json
{
	"mNumber": 111111117,
	"lifecycle": 5
}
```

setzt den Lifecycle des Exemplars mit der Mediennummer `111111117` auf `5`
Als Antwort kommt ein MySQL Objekt, das nicht weiter zu beachten ist.
