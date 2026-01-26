const books = [
  {
    id: 1,
    title: "L'Alchimiste",
    author: "Paulo Coelho",
    description: "Un voyage initiatique vers la sagesse",
    price: 18.90,
    originalPrice: 22.90,
    cover: "https://via.placeholder.com/200x300?text=L%27Alchimiste",
    category: "Roman",
    rating: 4.5,
    reviews: 2341,
    isBestseller: true,
    preview: [
      "Chapitre 1: Le Rêve Récurrent\nSantiago était un jeune berger qui rêvait depuis longtemps de voyager au-delà des montagnes qui entouraient son petit village. Chaque nuit, il fermait les yeux et imaginait les possibilités qui l'attendaient...",
      "Chapitre 2: La Rencontre\nUn jour, il rencontra un vieux roi qui lui raconta une histoire sur une légendaire pyramide en Égypte. Ce roi possédait une sagesse ancienne et mystérieuse...",
      "Chapitre 3: Le Voyage Commence\nSantiago décida de partir à la recherche de son trésor personnel. Il vendit ses moutons et commença un voyage qui changerait sa vie à jamais..."
    ]
  },
  {
    id: 2,
    title: "Dune",
    author: "Frank Herbert",
    description: "Une épopée de science-fiction intergalactique",
    price: 24.90,
    originalPrice: 24.90,
    cover: "https://via.placeholder.com/200x300?text=Dune",
    category: "Science-Fiction",
    rating: 5,
    reviews: 1567,
    isBestseller: true,
    preview: [
      "Livre I: La Maison Atréides\nSur la planète Caladan, la famille Atréides prépare son départ. Le Duc Leto doit gouverner la planète Arrakis, le désert où germe l'épice précieuse...",
      "Livre II: L'Arrivée sur Arrakis\nPaul et sa mère Lady Jessica arrivent sur Arrakis avec la conviction que c'est leur nouvelle maison. Mais le danger les attend à chaque coin de rue...",
      "Livre III: L'Épreuve du Désert\nFuyant les attaques, Paul et Jessica se retrouvent seuls dans l'immensité du désert. Les Fremen les trouveront-ils? Et qui est vraiment Paul?"
    ]
  },
  {
    id: 3,
    title: "Le Seigneur des Anneaux",
    author: "J.R.R. Tolkien",
    description: "Une épopée fantastique incontournable",
    price: 32.90,
    originalPrice: 39.90,
    cover: "https://via.placeholder.com/200x300?text=LOTR",
    category: "Fantasy",
    rating: 5,
    reviews: 6789,
    isBestseller: true,
    preview: [
      "Le Prologue\nIl y a bien longtemps dans une contrée de l'Ouest... Dans le Comté paisible, le Hobbit Bilbo Sacquet possède un anneau d'or mystérieux...",
      "Livre 1: La Communauté de l'Anneau\nFredon Sacquet découvre que cet anneau est bien plus dangereux qu'il ne l'imaginait. Il doit quitter le Comté avec l'anneau maudit...",
      "Livre 2: Les Deux Tours\nLa Communauté se sépare. Frodon et Sam se dirigent vers la Montagne du Destin, tandis que les autres combattent pour les terres du Seigneur des Anneaux..."
    ]
  },
  {
    id: 4,
    title: "Orgueil & Préjugés",
    author: "Jane Austen",
    description: "Un roman d'amour et de mariage",
    price: 15.50,
    originalPrice: 15.50,
    cover: "https://via.placeholder.com/200x300?text=Orgueil",
    category: "Classique",
    rating: 4.5,
    reviews: 1200,
    isBestseller: false,
    preview: [
      "Chapitre 1: Une Certitude Universelle\nC'est une vérité universellement reconnue qu'un homme célibataire en possession d'une belle fortune doit être en quête d'une épouse...",
      "Chapitre 2: La Visite de Bingley\nM. Bingley arrive dans le voisinage, riche et charmant. Les familles de la région s'animent à l'idée qu'il soit un bon parti pour l'une de leurs filles...",
      "Chapitre 3: Le Bal\nLe bal arrive enfin. Bingley danse avec Jane Bennet, tandis que M. Darcy semble distant et hautain. Élisabeth ne peut s'empêcher de le trouver insuffisant..."
    ]
  },
  {
    id: 5,
    title: "Harry Potter",
    author: "J.K. Rowling",
    description: "L'histoire d'un jeune sorcier",
    price: 15.99,
    originalPrice: 15.99,
    cover: "https://via.placeholder.com/200x300?text=Harry+Potter",
    category: "Fantasy",
    rating: 4.8,
    reviews: 5432,
    isBestseller: false,
    preview: [
      "Chapitre 1: La Lettre d'Acceptation\nLorsque la lettre de Poudlard arrive, Harry Potter ne peut y croire. Il pense être un enfant ordinaire, mais il découvre qu'il est un sorcier...",
      "Chapitre 2: La Rentrée à Poudlard\nAu Chemin de Traverse, Harry rencontre des sorciers extraordinaires. À bord du Poudlard Express, il se lie d'amitié avec Ron et Hermione...",
      "Chapitre 3: Le Festin de Début d'Année\nLa Cérémonie de la Répartition commence. Harry est placé à Gryffondor, la maison des courageux. Les secrets de Poudlard commencent à se révéler..."
    ]
  },
  {
    id: 6,
    title: "The Prince",
    author: "N. Machiavel",
    description: "Un traité politique fondamental",
    price: 15.50,
    originalPrice: 15.50,
    cover: "https://via.placeholder.com/200x300?text=The+Prince",
    category: "Classique",
    rating: 4.5,
    reviews: 1200,
    isBestseller: false,
    preview: [
      "Préface\nLe Prince est un traité politique écrit par Nicolas Machiavel au début du 16e siècle. C'est un ouvrage fondamental de la pensée politique moderne...",
      "Chapitre 1: Les différentes sortes de principautés\nIl existe deux sortes de principautés: les héréditaires et les nouvelles. Les héréditaires sont celles où la famille règne depuis longtemps...",
      "Chapitre 2: Comment se conquièrent les nouveaux princépautés\nCeux qui conquièrent une nouvelle principauté doivent y apporter de nouvelles lois et méthodes pour la maintenir..."
    ]
  },
  {
    id: 7,
    title: "Stupore e Tremori",
    author: "Amélie Nothomb",
    description: "Un roman d'introspection",
    price: 13.90,
    originalPrice: 13.90,
    cover: "https://via.placeholder.com/200x300?text=Stupore",
    category: "Roman",
    rating: 4,
    reviews: 987,
    isBestseller: false,
    preview: [
      "Chapitre 1: L'Arrivée au Japon\nJ'arrive à Tokyo avec un rêve: travailler pour une grande corporation japonaise. Je suis naïve, pleine d'espoir et d'idéalisme...",
      "Chapitre 2: Mon Premier Jour de Travail\nLe jour de mon arrivée, je découvre que mon rôle n'est pas celui que j'imaginais. On m'assigne des tâches humiliantes et répétitives...",
      "Chapitre 3: Les Non-dits\nDans la culture japonaise, les non-dits sont plus importants que les paroles. Je dois apprendre à naviguer dans ce monde silencieux et mystérieux..."
    ]
  },
  {
    id: 8,
    title: "Gone Girl",
    author: "Gillian Flynn",
    description: "Un thriller psychologique captivant",
    price: 21.90,
    originalPrice: 21.90,
    cover: "https://via.placeholder.com/200x300?text=Gone+Girl",
    category: "Thriller",
    rating: 4.5,
    reviews: 892,
    isBestseller: false,
    preview: [
      "Partie 1: Boy Loses Girl\nNick Dunne rentre chez lui le jour de son anniversaire de mariage pour découvrir que sa femme a disparu. La maison est en désordre, il n'y a aucun signe de lutte...",
      "Partie 2: The Hole\nLa police pense que Nick est impliqué. Amy avait des raisons d'être mécontente. Les pièces du puzzle commencent à se mettre en place...",
      "Partie 3: The Dick and Jane Game\nAmy est vivante et prépare une vengeance élaborée. Elle a planifié sa disparition dans les moindres détails pour piéger Nick..."
    ]
  },
  {
    id: 9,
    title: "1984",
    author: "George Orwell",
    description: "Un roman dystopique",
    price: 12.99,
    originalPrice: 12.99,
    cover: "https://via.placeholder.com/200x300?text=1984",
    category: "Classique",
    rating: 4.7,
    reviews: 3421,
    isBestseller: false,
    preview: [
      "Partie 1: Une Société Totalitaire\nWinston Smith vit dans une société totalitaire où le gouvernement contrôle chaque aspect de la vie. Les écrans surveillent les citoyens jour et nuit...",
      "Partie 2: Le Ministère de la Vérité\nWinston travaille au Ministère de la Vérité où il falsifie les archives historiques. Il commence à se rebeller intérieurement...",
      "Partie 3: La Rébellion\nWinston rencontre Julia et ensemble, ils tentent de se rebeller contre le système totalitaire. Mais le Big Brother voit tout..."
    ]
  },
  {
    id: 10,
    title: "Le Comte de Monte-Cristo",
    author: "Alexandre Dumas",
    description: "Une histoire de vengeance et de rédemption",
    price: 18.50,
    originalPrice: 18.50,
    cover: "https://via.placeholder.com/200x300?text=Monte+Cristo",
    category: "Classique",
    rating: 4.8,
    reviews: 2890,
    isBestseller: false,
    preview: [
      "Chapitre 1: L'Emprisonnement\nEdmond Dantès, jeune marin promis à un avenir brillant, est arrêté à tort et emprisonné au château d'If. Il reste là 14 ans, brisé et oublié...",
      "Chapitre 2: L'Évasion et la Trésor\nGrâce à l'aide d'un autre prisonnier, Edmond découvre un trésor caché sur l'île de Monte-Cristo. Il s'échappe et devient l'un des hommes les plus riches du monde...",
      "Chapitre 3: La Vengeance\nSous le faux nom du Comte de Monte-Cristo, Edmond entreprend un plan élaboré de vengeance contre ceux qui l'ont trahi. Mais peut-on vraiment se venger sans perdre son âme..."
    ]
  }
];

export default books;