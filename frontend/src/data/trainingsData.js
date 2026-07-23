export const initialTrainings = [
  {
    id: 1,
    title: "Αμυντική μετάβαση",
    date: "2026-07-25",
    time: "18:30",
    intensity: "Υψηλή",
    availablePlayers: 20,
    selectedPlayerIds: [],
    objective:
      "Άμεση αντίδραση μετά την απώλεια της μπάλας και οργανωμένη επιστροφή.",
    notes:
      "Έμφαση στην επικοινωνία μεταξύ μέσων και αμυντικών.",
    exercises: [
      {
        id: 101,
        name: "Δυναμική προθέρμανση",
        category: "Προθέρμανση",
        duration: 15,
      },
      {
        id: 102,
        name: "Rondo 5v2",
        category: "Τεχνική",
        duration: 12,
      },
      {
        id: 103,
        name: "Transition game 6v6",
        category: "Τακτική",
        duration: 25,
      },
      {
        id: 104,
        name: "Παιχνίδι 10v10",
        category: "Αγωνιστικό παιχνίδι",
        duration: 30,
      },
      {
        id: 105,
        name: "Αποθεραπεία",
        category: "Αποθεραπεία",
        duration: 8,
      },
    ],
  },
  {
    id: 2,
    title: "Τελειώματα και επιθετική ανάπτυξη",
    date: "2026-07-28",
    time: "19:00",
    intensity: "Μέτρια",
    availablePlayers: 18,
    selectedPlayerIds: [],
    objective:
      "Βελτίωση τελικής πάσας, κίνησης στην περιοχή και αποτελεσματικότητας.",
    notes:
      "Χωρισμός επιθετικών και αμυντικών στο κύριο μέρος.",
    exercises: [
      {
        id: 201,
        name: "Ενεργοποίηση με μπάλα",
        category: "Προθέρμανση",
        duration: 15,
      },
      {
        id: 202,
        name: "Passing combinations",
        category: "Τεχνική",
        duration: 20,
      },
      {
        id: 203,
        name: "Τελειώματα από τα άκρα",
        category: "Τελειώματα",
        duration: 25,
      },
      {
        id: 204,
        name: "8v8 με στόχο γρήγορη επίθεση",
        category: "Αγωνιστικό παιχνίδι",
        duration: 30,
      },
    ],
  },
];

export const emptyExercise = {
  name: "",
  category: "Προθέρμανση",
  duration: "10",
};

export const emptyTraining = {
  title: "",
  date: "",
  time: "",
  intensity: "Μέτρια",
  objective: "",
  notes: "",
  exercises: [],
  selectedPlayerIds: [],
};