const form = document.querySelector("form");
const keywordInput = document.querySelector('input[name="keywords"]');
const locationInput = document.querySelector('input[name="location"]');
const partTimeCheckbox = document.querySelector('input[name="part-time"]');
const fullTimeCheckbox = document.querySelector('input[name="full-time"]');

const resultsContainer = document.querySelector(".results");

// Fetch job data from the file
fetch("job-data.json")
  .then((response) => response.json())
  .then((jobs) => {
    displayJobs(jobs);
  });

form.addEventListener("submit", (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get keywords and location
  const keywords = keywordInput.value.trim();
  const location = locationInput.value.trim();

  // Fetch filtered data
  fetch("job-data.json")
    .then((response) => response.json())
    .then((jobs) => {
      let filteredJobs;

      // If keyword and location values are empty display all jobs
      if (keywords === "" && location === "") {
        filteredJobs = jobs;
      } else if (keywords === "") {
        // Filter by location
        filteredJobs = jobs.filter((job) => {
          return job.location.toLowerCase().includes(location.toLowerCase());
        });
      } else if (location === "") {
        // Filter by company and job title
        filteredJobs = jobs.filter((job) => {
          return (
            job.title.toLowerCase().includes(keywords.toLowerCase()) ||
            job.company.toLowerCase().includes(keywords.toLowerCase())
          );
        });
      } else {
        // Filter if both fields have data
        filteredJobs = jobs.filter((job) => {
          return (
            (job.title.toLowerCase().includes(keywords.toLowerCase()) &&
              job.location.toLowerCase().includes(location.toLowerCase())) ||
            job.company.toLowerCase().includes(keywords.toLowerCase())
          );
        });
      }

      // If both checkboxes are checked, display all jobs
      if (partTimeCheckbox.checked && fullTimeCheckbox.checked) {
        displayJobs(filteredJobs);
      } else if (partTimeCheckbox.checked) {
        const partTimeJobs = filteredJobs.filter(
          (job) => job.type === "Part-Time"
        );
        displayJobs(partTimeJobs);
      } else if (fullTimeCheckbox.checked) {
        const fullTimeJobs = filteredJobs.filter(
          (job) => job.type === "Full-Time"
        );
        displayJobs(fullTimeJobs);
      }
    });
});

// Display the jobs on the page
function displayJobs(jobs) {
  resultsContainer.innerHTML = "";
  if (jobs.length === 0) {
    const noJobsMessage = document.createElement("p");
    noJobsMessage.textContent = "No jobs matching your search.";
    noJobsMessage.classList.add("no-jobs-message");
    resultsContainer.appendChild(noJobsMessage);
  }
  // Iterate over the jobs and create an HTML element for each job
  jobs.forEach((job) => {
    const jobElement = document.createElement("div");
    jobElement.classList.add("job");

    const titleElement = document.createElement("h3");
    titleElement.textContent = job.title;
    jobElement.appendChild(titleElement);

    const companyElement = document.createElement("p");
    companyElement.textContent = job.company;
    jobElement.appendChild(companyElement);

    const locationElement = document.createElement("p");
    locationElement.textContent = `Location: ${job.location}`;
    jobElement.appendChild(locationElement);

    const typeElement = document.createElement("p");
    typeElement.textContent = job.type;
    jobElement.appendChild(typeElement);

    const applyButton = document.createElement("a");
    applyButton.href = job.apply_url;
    applyButton.textContent = "Apply Now";
    jobElement.appendChild(applyButton);

    resultsContainer.appendChild(jobElement);
  });
}
