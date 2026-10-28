// Local FALLBACK dataset (not live API data). Titles/authors/years are real
// publications; prices and stock are generated demo values; ratings are null
// because no real rating data exists here.
import { addDemoCommerce } from '../utils/pricing.js';

const RAW = [
  ['Pride and Prejudice', 'Jane Austen', 'Romance', 1813],
  ['Emma', 'Jane Austen', 'Romance', 1815],
  ['Jane Eyre', 'Charlotte Brontë', 'Fiction', 1847],
  ['Frankenstein', 'Mary Shelley', 'Science Fiction', 1818],
  ['The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 1937],
  ['A Wizard of Earthsea', 'Ursula K. Le Guin', 'Fantasy', 1968],
  ['Dune', 'Frank Herbert', 'Science Fiction', 1965],
  ['Foundation', 'Isaac Asimov', 'Science Fiction', 1951],
  ['The Left Hand of Darkness', 'Ursula K. Le Guin', 'Science Fiction', 1969],
  ['The Adventures of Sherlock Holmes', 'Arthur Conan Doyle', 'Mystery', 1892],
  ['And Then There Were None', 'Agatha Christie', 'Mystery', 1939],
  ['The Murder of Roger Ackroyd', 'Agatha Christie', 'Mystery', 1926],
  ['A Brief History of Time', 'Stephen Hawking', 'Science', 1988],
  ['Cosmos', 'Carl Sagan', 'Science', 1980],
  ['The Selfish Gene', 'Richard Dawkins', 'Science', 1976],
  ['Sapiens', 'Yuval Noah Harari', 'History', 2011],
  ['Guns, Germs, and Steel', 'Jared Diamond', 'History', 1997],
  ['The Diary of a Young Girl', 'Anne Frank', 'Biography', 1947],
  ['Long Walk to Freedom', 'Nelson Mandela', 'Biography', 1994],
  ['I Know Why the Caged Bird Sings', 'Maya Angelou', 'Biography', 1969],
  ['Leaves of Grass', 'Walt Whitman', 'Poetry', 1855],
  ['The Waste Land', 'T. S. Eliot', 'Poetry', 1922],
  ["Alice's Adventures in Wonderland", 'Lewis Carroll', 'Children', 1865],
  ['The Little Prince', 'Antoine de Saint-Exupéry', 'Children', 1943],
  ['Things Fall Apart', 'Chinua Achebe', 'Fiction', 1958],
  ['One Hundred Years of Solitude', 'Gabriel García Márquez', 'Fiction', 1967],
];

export const FALLBACK_BOOKS = RAW.map(([title, author, category, year], i) =>
  addDemoCommerce({
    id: `demo-${i + 1}`, title, authors: [author], description: '',
    coverImage: null, thumbnail: null, categories: [category], publisher: '',
    publishedYear: year, pageCount: null, isbn: '', language: '',
    averageRating: null, ratingsCount: 0, previewLink: '', infoLink: '', source: 'fallback',
  }),
);
