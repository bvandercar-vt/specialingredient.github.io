interface Element {
  getElementsByClassName<T extends Element>(classNames: string): HTMLCollectionOf<T>
}

interface Document {
  getElementsByClassName<T extends Element>(classNames: string): HTMLCollectionOf<T>
}
