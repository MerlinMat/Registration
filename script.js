document.addEventListener('DOMContentLoaded', function() {
    const studentForm = document.getElementById('studentForm');
    const nameInput = document.getElementById('name');
    const idInput = document.getElementById('id');
    const emailInput = document.getElementById('email');
    const contactInput = document.getElementById('contact');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const studentsTableBody = document.getElementById('studentsTableBody');
    
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let editIndex = null;


    // Display all students
    displayStudents();

    // Submission of the form
    studentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const student = {
            name: nameInput.value.trim(),
            id: idInput.value.trim(),
            email: emailInput.value.trim(),
            contact: contactInput.value.trim()
        };

        if (editIndex !== null) {
            // Update existing student
            students[editIndex] = student;
            editIndex = null;
            submitBtn.textContent = 'Register';
            cancelBtn.classList.add('hidden');
        } else {
            // Add new student
            students.push(student);
        }

        // Save to local storage
        localStorage.setItem('students', JSON.stringify(students));
        
        // Reset form and display students
        studentForm.reset();
        displayStudents();
    });

    // Cancel edit
    cancelBtn.addEventListener('click', function() {
        studentForm.reset();
        editIndex = null;
        submitBtn.textContent = 'Register';
        cancelBtn.classList.add('hidden');
    });

    // Display all students in the table
    function displayStudents() {
        studentsTableBody.innerHTML = '';
        
        if (students.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" class="px-6 py-4 text-center text-gray-500">No students registered yet</td>`;
            studentsTableBody.appendChild(row);
            return;
        }

        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${student.name}</td>
                <td class="px-6 py-4 whitespace-nowrap">${student.id}</td>
                <td class="px-6 py-4 whitespace-nowrap">${student.email}</td>
                <td class="px-6 py-4 whitespace-nowrap">${student.contact}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex gap-2">
                        <button class="edit-btn px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" data-index="${index}">Edit</button>
                        <button class="delete-btn px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" data-index="${index}">Delete</button>
                    </div>
                </td>
            `;
            
            studentsTableBody.appendChild(row);
        });

        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editStudent);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteStudent);
        });
    }

    // Edit student
    function editStudent(e) {
        const index = e.target.getAttribute('data-index');
        const student = students[index];
        
        nameInput.value = student.name;
        idInput.value = student.id;
        emailInput.value = student.email;
        contactInput.value = student.contact;
        
        editIndex = index;
        submitBtn.textContent = 'Update';
        cancelBtn.classList.remove('hidden');
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }

    // Delete student
    function deleteStudent(e) {
        if (confirm('Are you sure you want to delete this student?')) {
            const index = e.target.getAttribute('data-index');
            students.splice(index, 1);
            localStorage.setItem('students', JSON.stringify(students));
            displayStudents();
        }
    }

    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });

        // Name validation (only letters and spaces)
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameInput.value.trim()) {
            document.getElementById('nameError').textContent = 'Name is required';
            isValid = false;
        } else if (!nameRegex.test(nameInput.value.trim())) {
            document.getElementById('nameError').textContent = 'Name can only contain letters and spaces';
            isValid = false;
        }

        // ID validation (only numbers)
        const idRegex = /^\d+$/;
        if (!idInput.value.trim()) {
            document.getElementById('idError').textContent = 'Student ID is required';
            isValid = false;
        } else if (!idRegex.test(idInput.value.trim())) {
            document.getElementById('idError').textContent = 'Student ID can only contain numbers';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            document.getElementById('emailError').textContent = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            isValid = false;
        }

        // Contact validation (only numbers)
        const contactRegex = /^\d+$/;
        if (!contactInput.value.trim()) {
            document.getElementById('contactError').textContent = 'Contact number is required';
            isValid = false;
        } else if (!contactRegex.test(contactInput.value.trim())) {
            document.getElementById('contactError').textContent = 'Contact number can only contain numbers';
            isValid = false;
        }

        return isValid;
    }
});

  