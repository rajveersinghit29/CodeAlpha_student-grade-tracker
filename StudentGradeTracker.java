import java.util.ArrayList;
import java.util.Scanner;

// Student class to hold individual data
class Student {
    private String name;
    private double grade;

    public Student(String name, double grade) {
        this.name = name;
        this.grade = grade;
    }

    public String getName() { return name; }
    public double getGrade() { return grade; }
}

public class StudentGradeTracker {
    private ArrayList<Student> students;
    private Scanner scanner;

    public StudentGradeTracker() {
        students = new ArrayList<>();
        scanner = new Scanner(System.in);
    }

    // Method to input and store student data
    public void addStudent() {
        System.out.print("Enter student name: ");
        String name = scanner.nextLine();
        
        System.out.print("Enter student grade (0-100): ");
        double grade = scanner.nextDouble();
        scanner.nextLine(); // Consume newline

        students.add(new Student(name, grade));
        System.out.println("✅ Student added successfully!\n");
    }

    // Calculate Average Score
    public double calculateAverage() {
        if (students.isEmpty()) return 0.0;
        double sum = 0;
        for (Student s : students) {
            sum += s.getGrade();
        }
        return sum / students.size();
    }

    // Find Highest Score
    public double findHighestScore() {
        if (students.isEmpty()) return 0.0;
        double max = students.get(0).getGrade();
        for (Student s : students) {
            if (s.getGrade() > max) {
                max = s.getGrade();
            }
        }
        return max;
    }

    // Find Lowest Score
    public double findLowestScore() {
        if (students.isEmpty()) return 0.0;
        double min = students.get(0).getGrade();
        for (Student s : students) {
            if (s.getGrade() < min) {
                min = s.getGrade();
            }
        }
        return min;
    }

    // Generate Summary Report
    public void displaySummaryReport() {
        if (students.isEmpty()) {
            System.out.println("⚠️ No student data available to summarize.\n");
            return;
        }

        System.out.println("=====================================");
        System.out.println("📊 STUDENT GRADE SUMMARY REPORT 📊");
        System.out.println("=====================================");
        
        System.out.println(String.format("%-20s %s", "Student Name", "Grade"));
        System.out.println("-------------------------------------");
        for (Student s : students) {
            System.out.println(String.format("%-20s %.2f", s.getName(), s.getGrade()));
        }
        
        System.out.println("-------------------------------------");
        System.out.printf("Average Score: %.2f\n", calculateAverage());
        System.out.printf("Highest Score: %.2f\n", findHighestScore());
        System.out.printf("Lowest Score:  %.2f\n", findLowestScore());
        System.out.println("=====================================\n");
    }

    // Main interaction loop
    public void start() {
        boolean running = true;
        while (running) {
            System.out.println("1. Add Student Grade");
            System.out.println("2. Display Summary Report");
            System.out.println("3. Exit");
            System.out.print("Select an option: ");
            
            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

            switch (choice) {
                case 1:
                    addStudent();
                    break;
                case 2:
                    displaySummaryReport();
                    break;
                case 3:
                    running = false;
                    System.out.println("Exiting Grade Tracker. Goodbye!");
                    break;
                default:
                    System.out.println("❌ Invalid choice. Please try again.\n");
            }
        }
    }

    public static void main(String[] args) {
        StudentGradeTracker tracker = new StudentGradeTracker();
        tracker.start();
    }
}
