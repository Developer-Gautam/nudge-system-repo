const questions = [
  {
    id: 1,
    question: "What is your favorite programming language?",
    options: [
      { id: 'a', text: 'JavaScript' },
      { id: 'b', text: 'Python' },
      { id: 'c', text: 'Java' },
      { id: 'd', text: 'C++' }
    ]
  },
  {
    id: 2,
    question: "How do you prefer to spend your weekends?",
    options: [
      { id: 'a', text: 'Coding and learning new technologies' },
      { id: 'b', text: 'Outdoor activities and sports' },
      { id: 'c', text: 'Reading books and watching movies' },
      { id: 'd', text: 'Socializing with friends and family' }
    ]
  },
  {
    id: 3,
    question: "What's your dream vacation destination?",
    options: [
      { id: 'a', text: 'Tech hub cities (San Francisco, Tokyo)' },
      { id: 'b', text: 'Tropical beaches and islands' },
      { id: 'c', text: 'Historical cities and museums' },
      { id: 'd', text: 'Mountain retreats and nature' }
    ]
  },
  {
    id: 4,
    question: "What's your favorite type of music?",
    options: [
      { id: 'a', text: 'Electronic and EDM' },
      { id: 'b', text: 'Rock and Alternative' },
      { id: 'c', text: 'Classical and Jazz' },
      { id: 'd', text: 'Pop and Hip-hop' }
    ]
  },
  {
    id: 5,
    question: "How do you handle stress?",
    options: [
      { id: 'a', text: 'Solve problems systematically' },
      { id: 'b', text: 'Exercise and physical activity' },
      { id: 'c', text: 'Meditation and relaxation' },
      { id: 'd', text: 'Talk to friends and seek support' }
    ]
  },
  {
    id: 6,
    question: "What's your biggest goal for this year?",
    options: [
      { id: 'a', text: 'Learn new programming skills' },
      { id: 'b', text: 'Improve physical fitness' },
      { id: 'c', text: 'Read more books' },
      { id: 'd', text: 'Build stronger relationships' }
    ]
  },
  {
    id: 7,
    question: "What's your favorite way to exercise?",
    options: [
      { id: 'a', text: 'Gym workouts and strength training' },
      { id: 'b', text: 'Running and cardio' },
      { id: 'c', text: 'Yoga and flexibility' },
      { id: 'd', text: 'Team sports and games' }
    ]
  },
  {
    id: 8,
    question: "How do you prefer to learn new things?",
    options: [
      { id: 'a', text: 'Hands-on practice and experimentation' },
      { id: 'b', text: 'Video tutorials and courses' },
      { id: 'c', text: 'Reading documentation and books' },
      { id: 'd', text: 'Group discussions and collaboration' }
    ]
  },
  {
    id: 9,
    question: "What's your ideal work environment?",
    options: [
      { id: 'a', text: 'Quiet, focused space with minimal distractions' },
      { id: 'b', text: 'Collaborative open office with team interaction' },
      { id: 'c', text: 'Creative space with music and flexibility' },
      { id: 'd', text: 'Remote work with flexible hours' }
    ]
  },
  {
    id: 10,
    question: "What motivates you the most?",
    options: [
      { id: 'a', text: 'Solving complex problems and challenges' },
      { id: 'b', text: 'Achieving goals and recognition' },
      { id: 'c', text: 'Helping others and making a difference' },
      { id: 'd', text: 'Personal growth and self-improvement' }
    ]
  }
];

module.exports = questions;
