// coritario_forum_script.js

document.addEventListener('DOMContentLoaded', function () {
    const issueForm = document.getElementById('issue-form');
    const postList = document.getElementById('post-list');

    // Function to retrieve issues from localStorage
    function getIssues() {
        return JSON.parse(localStorage.getItem('issues')) || [];
    }

    // Function to save issues to localStorage
    function saveIssues(issues) {
        localStorage.setItem('issues', JSON.stringify(issues));
    }

    // Function to display issues
    function displayIssues() {
        const issues = getIssues();

        postList.innerHTML = ''; // Clear previous issues

        issues.forEach((issue, index) => {
            const statusClass = issue.solved ? 'solved' : 'unsolved'; // Determine status class
            const newIssue = `
                <div class="post-item ${statusClass}" data-index="${index}">
                    <h3>${issue.title}</h3>
                    <div class="info">
                        <h5>${issue.date}</h5>
                        <h5>|</h5>
                        <h5>${issue.tags}</h5>
                    </div>
                    <p>${issue.description}</p>
                    <div class="buttons">
                        <button class="delete-btn">Delete</button>
                        ${!issue.solved ? `<button class="status-btn">Solved</button>` : ''}
                    </div>
                </div>
            `;

            postList.insertAdjacentHTML('beforeend', newIssue);
        });

        // Add event listeners for delete buttons and status buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const confirmDelete = confirm("Are you sure you want to delete this issue?");
                if (confirmDelete) {
                    deleteIssue(index);
                }
            });
        });

        const statusButtons = document.querySelectorAll('.status-btn');
        statusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const parentPost = this.closest('.post-item');
                const index = parseInt(parentPost.dataset.index);
                toggleStatus(index);
            });
        });
    }

    // Function to delete an issue
    function deleteIssue(index) {
        const issues = getIssues();
        issues.splice(index, 1); // Remove issue at specified index
        saveIssues(issues); // Save updated issues to localStorage

        // Re-display updated issues
        displayIssues();
    }

    // Function to toggle the status of an issue
    function toggleStatus(index) {
        const issues = getIssues();
        issues[index].solved = !issues[index].solved; // Toggle the solved property
        saveIssues(issues); // Save updated issues to localStorage

        // Re-display updated issues
        displayIssues();
    }

    // Display existing issues on page load
    displayIssues();

    // Event listener for issue form submission
    issueForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form values
        const title = document.getElementById('issue-title').value;
        const tags = document.getElementById('issue-tags').value; // Get selected tag
        const description = document.getElementById('issue-description').value;

        // Generate current date and time
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        // Create new issue object
        const newIssue = {
            title: title,
            date: date,
            tags: tags,
            description: description,
            solved: false // Default status is unsolved
        };

        // Get existing issues, add new issue, and save
        const issues = getIssues();
        issues.push(newIssue);
        saveIssues(issues);

        // Display new issue
        displayIssues();

        // Clear form inputs
        issueForm.reset();
    });
});
