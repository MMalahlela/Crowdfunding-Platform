let projects = [];

// Load projects from localStorage on page load
window.onload = function () {
  const storedProjects = localStorage.getItem("crowdfundProjects");
  if (storedProjects) {
    projects = JSON.parse(storedProjects);
    renderProjects();
  }
};

// Save to localStorage whenever data changes
function saveProjects() {
  localStorage.setItem("crowdfundProjects", JSON.stringify(projects));
}

function createProject() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const goal = parseFloat(document.getElementById('goal').value);

  if (!title || !description || isNaN(goal)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const project = {
    title,
    description,
    goal,
    raised: 0,
    updates: []
  };

  projects.push(project);
  saveProjects();
  renderProjects();

  // Clear input fields
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('goal').value = '';
}

function renderProjects() {
  const container = document.getElementById('projects');
  container.innerHTML = "";

  projects.forEach((project, index) => {
    const percent = (project.raised / project.goal) * 100;

    const projectDiv = document.createElement("div");
    projectDiv.className = "project";
    projectDiv.innerHTML = `
      <h3>📈 ${project.title}</h3>
      <p>${project.description}</p>
      <p><strong>Goal:</strong> R${project.goal.toFixed(2)} | <strong>Raised:</strong> R${project.raised.toFixed(2)}</p>
      <div class="progress-bar">
        <div class="progress-bar-fill" style="width:${Math.min(percent, 100)}%">${Math.min(percent, 100).toFixed(1)}%</div>
      </div>
      <input type="number" placeholder="R Amount to contribute" id="donate-${index}">
      <button onclick="donate(${index})">Contribute with PayPal (ZAR)</button>
      <textarea id="update-${index}" placeholder="Post an update..."></textarea>
      <button onclick="postUpdate(${index})">Add Update</button>
      <div><strong>Updates:</strong><ul>${project.updates.map(u => `<li>${u}</li>`).join('')}</ul></div>
    `;

    container.appendChild(projectDiv);
  });
}

function donate(index) {
  const amountField = document.getElementById(`donate-${index}`);
  const amount = parseFloat(amountField.value);

  if (isNaN(amount) || amount <= 0) {
    alert("Enter a valid amount in Rands.");
    return;
  }

  projects[index].raised += amount;
  saveProjects();
  alert(`Thank you for your R${amount.toFixed(2)} contribution via PayPal!`);
  renderProjects();
}

function postUpdate(index) {
  const updateField = document.getElementById(`update-${index}`);
  const update = updateField.value;

  if (!update.trim()) {
    alert("Please enter an update message.");
    return;
  }

  projects[index].updates.push(update.trim());
  updateField.value = "";
  saveProjects();
  renderProjects();
}
