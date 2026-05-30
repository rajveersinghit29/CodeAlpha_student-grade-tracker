# 📊 GradeSync — Student Grade Tracker

A premium, internship-tier Student Grade Tracker web application built with a **Stitch-generated UI** and Java backend logic converted to JavaScript.

![GradeSync](https://img.shields.io/badge/GradeSync-Student%20Tracker-1a365d?style=for-the-badge&logo=google-scholar&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📈 **Performance Dashboard** | Real-time metric cards — Class Average, Highest Score, Lowest Score, Pass Rate |
| ➕ **Add Students** | Desktop form & mobile bottom-sheet modal with validation |
| 🔍 **Real-time Search** | Filter students instantly by name |
| 🗑️ **Delete with Confirmation** | Remove students with a safety confirmation dialog |
| 📊 **Grade Distribution Chart** | Visual bar chart showing A/B/C/D/F breakdown |
| 🏷️ **Auto Letter Grades** | Automatic A–F grade classification with color-coded chips |
| ✅ **Pass/Fail Status** | Color-coded Pass/Fail badges |
| 💾 **LocalStorage Persistence** | Data survives page refresh |
| 🔔 **Toast Notifications** | Success, error, warning, and info alerts |
| 📱 **Fully Responsive** | Mobile-first design with bottom navigation |
| 🎨 **Stitch Design System** | Built on Google Stitch-generated GradeSync UI |

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **UI Framework:** Tailwind CSS (via CDN)
- **Design System:** Google Stitch — GradeSync theme
- **Icons:** Material Symbols Outlined
- **Typography:** Google Fonts — Inter
- **Backend Logic:** Java (original) → JavaScript (web conversion)

---

## 🚀 Getting Started

### Option 1: Open Directly
Simply open `index.html` in any modern browser — no build step required!

```bash
open index.html
```

### Option 2: Run the Java Console Version
```bash
javac StudentGradeTracker.java
java StudentGradeTracker
```

---

## 📁 Project Structure

```
student-tracker/
├── index.html                  # Main dashboard (Stitch design system)
├── styles.css                  # Animations, charts, toasts, micro-interactions
├── app.js                      # Full business logic (Java → JS conversion)
├── StudentGradeTracker.java    # Original Java console application
└── README.md                   # This file
```

---

## 🔄 Java → JavaScript Conversion

The JavaScript code faithfully mirrors every Java method:

| Java Method | JavaScript Method |
|---|---|
| `addStudent()` | `tracker.addStudent(name, grade)` |
| `calculateAverage()` | `tracker.calculateAverage()` |
| `findHighestScore()` | `tracker.findHighestScore()` |
| `findLowestScore()` | `tracker.findLowestScore()` |
| `displaySummaryReport()` | `app.render()` (updates DOM) |
| `ArrayList<Student>` | `this.students = []` |

---

## 🔮 Spring Boot Upgrade Path

The architecture is designed for easy conversion to a REST API:

```java
@RestController
@RequestMapping("/api/students")
public class StudentController {
    
    @PostMapping              // → addStudent(name, grade)
    @GetMapping               // → getAllStudents()
    @DeleteMapping("/{id}")   // → removeStudent(id)
    @GetMapping("/stats")     // → calculateAverage(), findHighest(), findLowest()
}
```

---

## 📸 Screenshots

> Open `index.html` in your browser to see the live dashboard!

---

## 👨‍💻 Author

**Rajveer Singh**  
GitHub: [@rajveersinghit29](https://github.com/rajveersinghit29)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built with ❤️ for CodeAlpha Internship
