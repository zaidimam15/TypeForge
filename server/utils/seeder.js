require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Passage = require('../models/Passage');
const User = require('../models/User');

const passages = [
  // EASY - English
  { title: 'Simple Words 1', content: 'the cat sat on the mat and ate a rat that was fat the dog ran fast and had a blast', category: 'english', difficulty: 'easy' },
  { title: 'Simple Words 2', content: 'she went to the shop to buy some milk and bread then she came back home and made some food', category: 'english', difficulty: 'easy' },
  { title: 'Simple Words 3', content: 'the boy and girl played in the park they had fun and ran around and laughed all day long', category: 'english', difficulty: 'easy' },
  { title: 'Simple Words 4', content: 'my dog loves to play fetch in the yard he brings the ball back every time I throw it far', category: 'english', difficulty: 'easy' },
  { title: 'Simple Words 5', content: 'we went to the beach on a sunny day the water was cool and the sand was warm', category: 'english', difficulty: 'easy' },

  // MEDIUM - English
  { title: 'Technology', content: 'The internet has transformed the way people communicate and share information across the world. Social media platforms have made it easier than ever to connect with friends and family regardless of distance.', category: 'english', difficulty: 'medium' },
  { title: 'Nature', content: 'The ancient forests of the Pacific Northwest are home to some of the tallest trees on earth. These magnificent giants have stood for thousands of years, witnessing the passage of countless seasons.', category: 'english', difficulty: 'medium' },
  { title: 'Science', content: 'Scientists have discovered that the human brain is remarkably adaptable, capable of forming new neural connections throughout a person\'s entire life. This phenomenon, known as neuroplasticity, challenges earlier assumptions about brain development.', category: 'science', difficulty: 'medium' },
  { title: 'Business', content: 'Successful entrepreneurs understand that building a business requires patience, persistence, and a willingness to learn from failure. The most innovative companies in the world were built by people who refused to give up on their vision.', category: 'business', difficulty: 'medium' },
  { title: 'History', content: 'The Renaissance was a period of cultural and intellectual rebirth that began in Italy during the 14th century. Artists, scholars, and scientists rediscovered the works of ancient Greece and Rome, sparking a revolution in human thought.', category: 'general', difficulty: 'medium' },

  // HARD
  { title: 'Advanced Technology', content: 'Quantum computing represents a paradigm shift in computational methodology, leveraging quantum mechanical phenomena such as superposition and entanglement to process information exponentially faster than classical binary computers.', category: 'technology', difficulty: 'hard' },
  { title: 'Philosophy', content: 'Epistemological inquiry into the nature of consciousness remains one of philosophy\'s most perplexing challenges. The phenomenological approach, pioneered by Husserl, attempts to describe the structures of experience as they present themselves to consciousness.', category: 'general', difficulty: 'hard' },
  { title: 'Advanced Science', content: 'The thermodynamic principles governing entropy and enthalpy in complex biological systems demonstrate remarkable efficiency; mitochondrial ATP synthesis through chemiosmotic gradients achieves approximately 38 molecules per glucose molecule oxidized.', category: 'science', difficulty: 'hard' },
  { title: 'Medical Terminology', content: 'Immunoglobulin synthesis in lymphocytes involves recombination of variable, diversity, and joining gene segments, producing antibodies with extraordinary specificity against pathogenic antigens through clonal selection mechanisms.', category: 'science', difficulty: 'hard' },

  // EXPERT - Programming
  { title: 'JavaScript Functions', content: 'const asyncFetch = async (url) => { try { const response = await fetch(url); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); return await response.json(); } catch (error) { console.error("Fetch failed:", error); throw error; } };', category: 'javascript', difficulty: 'expert' },
  { title: 'React Hooks', content: 'const useDebounce = (value, delay) => { const [debouncedValue, setDebouncedValue] = useState(value); useEffect(() => { const handler = setTimeout(() => { setDebouncedValue(value); }, delay); return () => clearTimeout(handler); }, [value, delay]); return debouncedValue; };', category: 'react', difficulty: 'expert' },
  { title: 'Python Class', content: 'class BinarySearchTree: def __init__(self): self.root = None def insert(self, value): if not self.root: self.root = Node(value) else: self._insert_recursive(self.root, value) def _insert_recursive(self, node, value): if value < node.value: if node.left is None: node.left = Node(value) else: self._insert_recursive(node.left, value)', category: 'python', difficulty: 'expert' },
  { title: 'Algorithms', content: 'function quickSort(arr, low = 0, high = arr.length - 1) { if (low < high) { const pivotIndex = partition(arr, low, high); quickSort(arr, low, pivotIndex - 1); quickSort(arr, pivotIndex + 1, high); } return arr; }', category: 'programming', difficulty: 'expert' },
  { title: 'Async JavaScript', content: 'const processQueue = async (tasks, concurrency = 3) => { const results = []; const executing = []; for (const task of tasks) { const p = Promise.resolve().then(() => task()); results.push(p); if (concurrency <= tasks.length) { const e = p.then(() => executing.splice(executing.indexOf(e), 1)); executing.push(e); if (executing.length >= concurrency) await Promise.race(executing); } } return Promise.all(results); };', category: 'javascript', difficulty: 'expert' },

  // QUOTES
  { title: 'Churchill Quote', content: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', category: 'quotes', difficulty: 'medium', author: 'Winston Churchill' },
  { title: 'Einstein Quote', content: 'Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.', category: 'quotes', difficulty: 'medium', author: 'Albert Einstein' },
  { title: 'Thoreau Quote', content: 'Go confidently in the direction of your dreams! Live the life you have imagined.', category: 'quotes', difficulty: 'easy', author: 'Henry David Thoreau' },
  { title: 'Mandela Quote', content: 'It always seems impossible until it is done. Education is the most powerful weapon which you can use to change the world.', category: 'quotes', difficulty: 'medium', author: 'Nelson Mandela' },
  { title: 'Twain Quote', content: 'The secret of getting ahead is getting started. The best time to plant a tree was twenty years ago. The second best time is now.', category: 'quotes', difficulty: 'medium', author: 'Mark Twain' },

  // MOTIVATIONAL
  { title: 'Persistence', content: 'Every master was once a disaster. The difference between those who succeed and those who fail is that successful people keep going when things get hard. They understand that the path to mastery is paved with consistent effort and deliberate practice.', category: 'motivational', difficulty: 'medium' },
  { title: 'Growth Mindset', content: 'Your current abilities are just the starting point, not the end point. With dedication and the right strategies, almost anyone can improve at anything they put their mind to. Embrace the challenges, for they are your greatest teachers.', category: 'motivational', difficulty: 'medium' },

  // LITERATURE
  { title: 'Dickens', content: 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.', category: 'literature', difficulty: 'medium', author: 'Charles Dickens', source: 'A Tale of Two Cities' },
  { title: 'Orwell', content: 'It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions.', category: 'literature', difficulty: 'medium', author: 'George Orwell', source: '1984' },
  { title: 'Fitzgerald', content: 'In my younger and more vulnerable years my father gave me some advice that I have been turning over in my mind ever since. Whenever you feel like criticizing anyone, he told me, just remember that all the people in this world haven\'t had the advantages that you\'ve had.', category: 'literature', difficulty: 'hard', author: 'F. Scott Fitzgerald', source: 'The Great Gatsby' },

  // WEB DEVELOPMENT
  { title: 'CSS Grid', content: 'CSS Grid Layout is a powerful two-dimensional layout system that allows developers to create complex responsive designs with clean, semantic markup. Unlike older layout methods, Grid handles both columns and rows simultaneously.', category: 'web', difficulty: 'medium' },
  { title: 'HTML Semantics', content: 'Semantic HTML elements clearly describe their meaning to both the browser and the developer. Elements such as header, main, footer, article, and section provide meaningful structure to web documents and improve accessibility.', category: 'web', difficulty: 'medium' },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing passages
    await Passage.deleteMany({});
    console.log('🗑️  Cleared existing passages');

    // Insert passages
    await Passage.insertMany(passages);
    console.log(`✅ Seeded ${passages.length} passages`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'TypeForge Admin',
        username: 'admin',
        email: 'admin@typeforge.dev',
        password: 'Admin@123456',
        role: 'admin',
      });
      console.log('✅ Created admin user: admin@typeforge.dev / Admin@123456');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
