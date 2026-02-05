import type { Match } from '@/types';

// Pool of diverse names
const femaleNames = [
  'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
  'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery', 'Ella', 'Scarlett', 'Grace', 'Chloe', 'Victoria',
  'Riley', 'Aria', 'Lily', 'Aurora', 'Zoey', 'Nora', 'Camila', 'Hannah', 'Lillian', 'Addison',
  'Luna', 'Savannah', 'Brooklyn', 'Leah', 'Zoe', 'Stella', 'Hazel', 'Ellie', 'Paisley', 'Audrey',
  'Skylar', 'Violet', 'Claire', 'Bella', 'Lucy', 'Anna', 'Samantha', 'Caroline', 'Genesis', 'Aaliyah',
  'Kennedy', 'Kinsley', 'Allison', 'Maya', 'Sarah', 'Madelyn', 'Adeline', 'Alexa', 'Ariana', 'Elena',
  'Gabriella', 'Naomi', 'Alice', 'Sadie', 'Hailey', 'Eva', 'Emilia', 'Autumn', 'Quinn', 'Nevaeh',
  'Piper', 'Ruby', 'Serenity', 'Willow', 'Everly', 'Cora', 'Kaylee', 'Lydia', 'Aubrey', 'Arianna'
];

const maleNames = [
  'Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Theodore',
  'Jack', 'Levi', 'Alexander', 'Mason', 'Ethan', 'Jacob', 'Michael', 'Daniel', 'Logan', 'Sebastian',
  'Matthew', 'Samuel', 'David', 'Joseph', 'Carter', 'Owen', 'Wyatt', 'John', 'Luke', 'Gabriel',
  'Anthony', 'Isaac', 'Dylan', 'Leo', 'Lincoln', 'Jaxon', 'Asher', 'Christopher', 'Josiah', 'Andrew',
  'Thomas', 'Joshua', 'Ezra', 'Hudson', 'Charles', 'Caleb', 'Isaiah', 'Ryan', 'Nathan', 'Adrian',
  'Christian', 'Maverick', 'Colton', 'Elias', 'Aaron', 'Eli', 'Landon', 'Jonathan', 'Nolan', 'Hunter',
  'Cameron', 'Connor', 'Santiago', 'Jeremiah', 'Ezekiel', 'Angel', 'Roman', 'Easton', 'Miles', 'Robert',
  'Jameson', 'Nicholas', 'Greyson', 'Cooper', 'Ian', 'Carson', 'Axel', 'Jaxson', 'Dominic', 'Leonardo'
];

const nonbinaryNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Sage',
  'River', 'Skyler', 'Dakota', 'Reese', 'Parker', 'Finley', 'Rowan', 'Charlie', 'Emery', 'Phoenix',
  'Hayden', 'Elliot', 'Blake', 'Cameron', 'Drew', 'Kai', 'Jesse', 'Remy', 'Shiloh', 'Eden',
  'Marley', 'Oakley', 'Peyton', 'Tatum', 'Harley', 'Justice', 'Kendall', 'London', 'Arden', 'Frankie'
];

// Pool of interests
const allInterests = [
  'Music', 'Travel', 'Photography', 'Hiking', 'Cooking', 'Reading', 'Yoga', 'Gaming', 'Art', 'Movies',
  'Fitness', 'Dancing', 'Coffee', 'Wine', 'Tech', 'Fashion', 'Nature', 'Beach', 'Camping', 'Skiing',
  'Surfing', 'Running', 'Cycling', 'Swimming', 'Tennis', 'Basketball', 'Soccer', 'Volleyball', 'Golf', 'Rock Climbing',
  'Meditation', 'Writing', 'Poetry', 'Painting', 'Sculpture', 'Ceramics', 'Gardening', 'Baking', 'Mixology', 'Foodie',
  'Concerts', 'Festivals', 'Theatre', 'Comedy', 'Podcasts', 'Anime', 'K-pop', 'Jazz', 'Classical', 'EDM',
  'Hip-hop', 'Indie', 'Rock', 'Country', 'R&B', 'Vinyl', 'Dogs', 'Cats', 'Pets', 'Volunteering',
  'Sustainability', 'Startups', 'Investing', 'Crypto', 'AI', 'Design', 'UX', 'Coding', 'Science', 'Space',
  'History', 'Philosophy', 'Psychology', 'Languages', 'Board Games', 'Chess', 'Puzzles', 'Trivia', 'Karaoke', 'Bowling'
];

// Pool of bios
const bios = [
  "Adventure seeker with a passion for trying new things. Let's explore together!",
  "Coffee addict and bookworm. Looking for someone to share lazy Sunday mornings.",
  "Aspiring chef who loves experimenting in the kitchen. Will cook for you!",
  "Outdoor enthusiast who believes the best views come after the hardest climbs.",
  "Music lover who's always chasing the next great concert experience.",
  "Fitness junkie by day, Netflix binger by night. Balance is key!",
  "Creative soul with a love for art and meaningful conversations.",
  "Dog parent looking for someone who gets that my pup is family.",
  "Tech nerd who can explain blockchain but still can't fold a fitted sheet.",
  "Travel bug with stamps from 20+ countries. Where should we go next?",
  "Yoga practitioner seeking someone with good vibes and a kind heart.",
  "Foodie who believes the way to the heart is through the stomach.",
  "Photographer always looking for the perfect light and the perfect match.",
  "Dancing through life and looking for a partner who can keep up!",
  "Nature lover who'd rather be in the mountains than in the city.",
  "Beach bum at heart. Sun, sand, and good company is all I need.",
  "Film buff with strong opinions about cinema. Let's debate!",
  "Weekend warrior always planning the next adventure.",
  "Plant parent with a growing collection. Yes, I talk to them.",
  "Podcast addict always looking for new recommendations.",
  "Runner training for my next marathon. Looking for motivation!",
  "Artist who sees beauty in the everyday moments.",
  "Musician who believes life needs a great soundtrack.",
  "Gamer looking for a co-op partner for life.",
  "Entrepreneur with big dreams and an even bigger heart.",
  "Bookworm who's read everything and wants to discuss it all.",
  "Wine enthusiast who can pair a bottle with any occasion.",
  "Meditation practitioner on a journey of self-discovery.",
  "Comedy lover who thinks laughter is the best medicine.",
  "History buff who loves visiting museums and historical sites.",
  "Science geek fascinated by how the universe works.",
  "Language learner currently working on my fifth language.",
  "Sustainability advocate trying to make the world a better place.",
  "Cat person who respects personal space but loves good company.",
  "Volunteer who believes in giving back to the community.",
  "Early bird who loves sunrise hikes and morning workouts.",
  "Night owl who thrives after midnight. Best conversations happen late.",
  "Minimalist who values experiences over things.",
  "Fashion lover who believes style is a form of self-expression.",
  "Cyclist who knows all the best routes in the city.",
  "Swimmer who feels most at home in the water.",
  "Skier counting down the days until winter.",
  "Surfer chasing the perfect wave.",
  "Climber who loves the thrill of reaching the summit.",
  "Baker who shows love through homemade treats.",
  "Mixologist crafting the perfect cocktail for every mood.",
  "Theatre kid at heart who loves a good musical.",
  "Festival goer always looking for the next great lineup.",
  "Anime fan who's seen all the classics and looking for recommendations.",
  "K-pop enthusiast who knows all the choreography."
];

// Last active options
const lastActiveOptions = [
  'Just now', '2 min ago', '5 min ago', '10 min ago', '15 min ago', '20 min ago', '30 min ago',
  '1 hour ago', '2 hours ago', '3 hours ago', '5 hours ago',
  '1 day ago', '2 days ago'
];

// Avatar URL patterns (using Unsplash with different photo IDs)
const femaleAvatarIds = [
  'rDEOVtE7vOs', 'mEZ3PoFGs_k', 'WNoLnJo7tS8', 'NhLwSKGJfYc', 'IF9TK5Uy-KI',
  '6W4F62sN_yI', 'p0hDztR8-CA', 'v3OlBE6-fhU', 'rriAI0nhcbc', 'B4TjXnI0Y2c',
  'QXevDflbl8A', 'UZ3WkA7Kz1E', 'JyVcAIUAcPM', 'J1OScm_uHUQ', 'KcKP6M6r0xA',
  'iEEBWgY_6lA', 'sibVwORYqs0', '7YVZYZeITc8', 'q1zbOnMIB4w', 'T9Bg_WLOHq0'
];

const maleAvatarIds = [
  'iFgRcqHznqg', 'ZHvM3XIOHoE', 'C8Ta0gwPbQg', 'd2MSDujJl2g', 'MTZTGvDsHFY',
  'oqN9GkOXvr0', '7omHUGhhmZ0', '1-aWOc_7jXs', 'WMD64tMfc4k', 'nKC772R_qog',
  'DItYlc26zVI', '6anudmpILw4', 'Kt5hRENuotI', '3TLl_97HNJo', 'pAs4IM6OGWI',
  'cLxVx1p7w5o', 'mUqXBKrWSWI', 'QCF2ykBsC2I', 'X6Uj51n5CE8', 'oeI_oCgIJRY'
];

const nonbinaryAvatarIds = [
  'sxQz2VfoFBE', 'Zz5LQe-VSMY', '4kMFMpdYMKA', 'pTrhfmj2jDA', 'YPGqRc_0j7g',
  'QsGtSoNLbxw', 'mjRwhvqEC0U', 'cANUo1_f6jY', 'WxM465oM4j4', 'lBhhnhndpE0'
];

// Helper to get random items from array
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper to get random item
const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

// Helper to get random number in range
const getRandomNumber = (min: number, max: number): number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

// Generate 300 mock profiles
const generateMockProfiles = (): (Match & { gender: string })[] => {
  const profiles: (Match & { gender: string })[] = [];
  
  // Generate ~120 female profiles (40%)
  for (let i = 0; i < 120; i++) {
    const name = getRandomItem(femaleNames);
    const avatarId = getRandomItem(femaleAvatarIds);
    profiles.push({
      id: `mock-female-${i + 1}`,
      name,
      age: getRandomNumber(18, 45),
      avatar: `https://images.unsplash.com/photo-${avatarId}?w=400&h=400&fit=crop&crop=face`,
      compatibility: getRandomNumber(50, 99),
      interests: getRandomItems(allInterests, getRandomNumber(3, 5)),
      lastActive: getRandomItem(lastActiveOptions),
      bio: getRandomItem(bios),
      gender: 'female'
    });
  }
  
  // Generate ~120 male profiles (40%)
  for (let i = 0; i < 120; i++) {
    const name = getRandomItem(maleNames);
    const avatarId = getRandomItem(maleAvatarIds);
    profiles.push({
      id: `mock-male-${i + 1}`,
      name,
      age: getRandomNumber(18, 45),
      avatar: `https://images.unsplash.com/photo-${avatarId}?w=400&h=400&fit=crop&crop=face`,
      compatibility: getRandomNumber(50, 99),
      interests: getRandomItems(allInterests, getRandomNumber(3, 5)),
      lastActive: getRandomItem(lastActiveOptions),
      bio: getRandomItem(bios),
      gender: 'male'
    });
  }
  
  // Generate ~60 nonbinary profiles (20%)
  for (let i = 0; i < 60; i++) {
    const name = getRandomItem(nonbinaryNames);
    const avatarId = getRandomItem(nonbinaryAvatarIds);
    profiles.push({
      id: `mock-nonbinary-${i + 1}`,
      name,
      age: getRandomNumber(18, 45),
      avatar: `https://images.unsplash.com/photo-${avatarId}?w=400&h=400&fit=crop&crop=face`,
      compatibility: getRandomNumber(50, 99),
      interests: getRandomItems(allInterests, getRandomNumber(3, 5)),
      lastActive: getRandomItem(lastActiveOptions),
      bio: getRandomItem(bios),
      gender: 'nonbinary'
    });
  }
  
  // Shuffle the profiles so they're not grouped by gender
  return profiles.sort(() => 0.5 - Math.random());
};

export const mockProfiles = generateMockProfiles();
